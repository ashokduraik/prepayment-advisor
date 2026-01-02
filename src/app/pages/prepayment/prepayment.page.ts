import moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoanUtils } from '../../services/loan.utils';
import { AppStorage } from '../../services/app.storage';
import { AppService } from '../../services/app.services';

@Component({
    selector: 'app-prepayment',
    templateUrl: './prepayment.page.html',
    styleUrls: ['./prepayment.page.scss'],
    standalone: false
})
export class PrepaymentPage implements OnInit {
  emi: any;
  loan: any;
  newEmi = 0;
  noEmi = false;
  emiIndex = -1;
  submitted = false;
  prepayments: any = [];
  loanDetails: any = null;
  newEmiAmount = null;
  defaultHref = 'home';
  approximateEmi: any = null;
  minDate = '2010-01-01';
  saveInProgress = false;
  prepaymentChanged = false;
  valueChangedPromise: any = null;
  maxDate = moment().endOf('month').format("YYYY-MM-DD");

  constructor(
    private router: Router,
    private service: AppService,
    private storage: AppStorage,
    private activatedRoute: ActivatedRoute,
  ) { }

  async ngOnInit() {
    const _id = this.activatedRoute.snapshot.paramMap.get('loanid');
    const emiid = this.activatedRoute.snapshot.paramMap.get('emiid');
    this.defaultHref = _id ? 'loan-details/' + _id : 'home';

    if (!_id || !emiid) {
      this.router.navigateByUrl(this.defaultHref);
      return;
    }

    this.loan = await this.storage.getLoan(_id);
    if (!this.loan) {
      this.router.navigateByUrl(this.defaultHref);
      return;
    }

    this.emi = this.loan.instalments.find((emi, i) => {
      if (emi._id !== emiid) return false;
      this.emiIndex = i;
      return true;
    });
    if (!this.emi) {
      this.router.navigateByUrl(this.defaultHref);
      return;
    }

    this.loanDetails = JSON.parse(JSON.stringify(this.loan));
    LoanUtils.calculateLoanDetails(this.loanDetails);
    this.minDate = moment(this.emi.emiDate).startOf('month').format("YYYY-MM-DD");
    this.maxDate = moment(this.emi.emiDate).endOf('month').format("YYYY-MM-DD");
    this.prepayments = JSON.parse(JSON.stringify(this.emi.prepayments || []));
    this.newEmiAmount = this.emi.newEmiAmount;

    this.prepayments.push({
      amount: '',
      prepaymentDate: (new Date(this.emi.emiDate)).toISOString()
    });
  }

  valueChanged() {
    if (this.valueChangedPromise) {
      clearTimeout(this.valueChangedPromise);
      this.valueChangedPromise = null;
    }

    const prepayments = this.prepayments.filter(t => t.amount && t.prepaymentDate);
    const emiPrepayments = (this.emi.prepayments || []).filter(t => t.amount && t.prepaymentDate);
    let prepaymentChanged = this.isPrepaymentChanged(prepayments, emiPrepayments);
    this.prepaymentChanged = false;
    if (!prepaymentChanged) return;

    let prepaymentAmount = 0;
    this.prepaymentChanged = true;
    prepayments.forEach(t => prepaymentAmount += t.amount);
    const emiDetails = this.loanDetails.instalments.find(e => e._id === this.emi._id);
    const balanceTerm = this.loanDetails.balanceTerm + this.loan.instalments.length - emiDetails.term + 1;
    const emiAdd = LoanUtils.getEMIAmount(prepaymentAmount, balanceTerm, this.emi.interestRate);
    this.approximateEmi = this.loan.instalments[this.emiIndex - 1].amount - emiAdd;

    this.valueChangedPromise = setTimeout(_ => {
      this.valueChanged();
    }, 1000);
  }

  isPrepaymentChanged(prepayments, emiPrepayments) {
    if (!prepayments.length) return false;
    if (emiPrepayments.length != prepayments.length) {
      return true;
    }

    for (let i = 0; i < prepayments.length; i++) {
      if (prepayments[i].amount != emiPrepayments[i].amount) {
        return true;
      }
    }

    return false;
  }

  async save() {
    if (this.saveInProgress) return;
    this.submitted = true;
    const prepayments = this.prepayments.filter(t => t.amount && t.prepaymentDate);
    if (prepayments.length && this.prepaymentChanged && !this.noEmi && !this.newEmiAmount) return;

    this.saveInProgress = true;
    const lastMonthEmi = this.loan.instalments[this.emiIndex - 1].amount;

    if (!this.noEmi && this.newEmiAmount && prepayments.length) {
      this.loan.emi = this.newEmiAmount;
      this.emi.newEmiAmount = this.newEmiAmount;
      const prepaymentDate = prepayments[0].prepaymentDate;

      /** if prepayments were added before the emi day then new emi will be applied in the current month itself */
      if (this.emi.emiDay > moment(prepaymentDate).get('date')) {
        this.emi.amount = this.newEmiAmount;
      } else {
        this.emi.amount = lastMonthEmi;
      }
    } else if (!prepayments.length) {
      this.emi.newEmiAmount = 0;
      this.loan.emi = lastMonthEmi;
      this.emi.amount = lastMonthEmi;
    }

    /** if any change in EMI, that has to be applied in the all next months  */
    for (let i = this.emiIndex + 1; i < this.loan.instalments.length; i++) {
      this.loan.instalments[i].amount = this.loan.emi;
      this.loan.instalments[i].prepayments = [];
    }

    this.emi.prepayments = prepayments;
    await this.storage.updateLoan(this.loan);
    this.service.showToast('Your prepayment details is saved successfully');
    this.router.navigateByUrl(this.defaultHref);
    this.saveInProgress = false;
  }

}
