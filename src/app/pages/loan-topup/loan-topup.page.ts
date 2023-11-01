import moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoanUtils } from '../../services/loan.utils';
import { AppStorage } from '../../services/app.storage';
import { AppService } from '../../services/app.services';

@Component({
  selector: 'app-loan-topup',
  templateUrl: './loan-topup.page.html',
  styleUrls: ['./loan-topup.page.scss'],
})
export class LoanTopupPage implements OnInit {
  emi: any;
  loan: any;
  newEmi = 0;
  noEmi = false;
  topups: any = [];
  emiIndex = -1;
  submitted = false;
  loanDetails: any;
  newEmiAmount = null;
  approximateEmi = null;
  topupChanged = false;
  defaultHref = 'home';
  minDate = '2010-01-01';
  saveInProgress = false;
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
    this.topups = JSON.parse(JSON.stringify(this.emi.topups || []));
    this.newEmiAmount = this.emi.newEmiAmount;

    if (!this.topups.length) {
      this.topups.push({
        amount: '',
        topupDate: (new Date(this.emi.emiDate)).toISOString()
      });
    }
  }

  valueChanged() {
    if (this.valueChangedPromise) {
      clearTimeout(this.valueChangedPromise);
      this.valueChangedPromise = null;
    }

    const topups = this.topups.filter(t => t.amount && t.topupDate);
    const emiTopups = (this.emi.topups || []).filter(t => t.amount && t.topupDate);
    let topupChanged = this.isTopupChanged(topups, emiTopups);
    this.topupChanged = false;
    if (!topupChanged) return;

    let topupAmount = 0;
    this.topupChanged = true;
    topups.forEach(t => topupAmount += t.amount);
    const emiDetails = this.loanDetails.instalments.find(e => e._id === this.emi._id);
    const balanceTerm = this.loanDetails.balanceTerm + this.loan.instalments.length - emiDetails.term + 1;
    const emiAdd = LoanUtils.getEMIAmount(topupAmount, balanceTerm, this.emi.interestRate);
    this.approximateEmi = emiAdd + this.loan.instalments[this.emiIndex - 1].amount;

    this.valueChangedPromise = setTimeout(_ => {
      this.valueChanged();
    }, 1000);
  }

  isTopupChanged(topups, emiTopups) {
    if (!topups.length) return false;
    if (emiTopups.length != topups.length) {
      return true;
    }

    for (let i = 0; i < topups.length; i++) {
      if (topups[i].amount != emiTopups[i].amount) {
        return true;
      }
    }

    return false;
  }

  async save() {
    if (this.saveInProgress) return;
    this.submitted = true;
    const topups = this.topups.filter(t => t.amount && t.topupDate);
    if (topups.length && this.topupChanged && !this.noEmi && !this.newEmiAmount) return;

    this.saveInProgress = true;
    const lastMonthEmi = this.loan.instalments[this.emiIndex - 1].amount;

    if (!this.noEmi && this.newEmiAmount && topups.length) {
      this.loan.emi = this.newEmiAmount;
      this.emi.newEmiAmount = this.newEmiAmount;
      const topupDate = topups[0].topupDate;

      /** if topup were added before the emi day then new emi will be applied in the current month itself */
      if (this.emi.emiDay > moment(topupDate).get('date')) {
        this.emi.amount = this.newEmiAmount;
      } else {
        this.emi.amount = lastMonthEmi;
      }
    } else if (!topups.length) {
      this.emi.newEmiAmount = 0;
      this.loan.emi = lastMonthEmi;
      this.emi.amount = lastMonthEmi;
    }

    /** if any change in EMI, that has to be applied in the all next months  */
    for (let i = this.emiIndex + 1; i < this.loan.instalments.length; i++) {
      this.loan.instalments[i].amount = this.loan.emi;
      this.loan.instalments[i].topups = [];
    }

    this.emi.topups = topups;
    await this.storage.updateLoan(this.loan);
    this.service.showToast('Your Topup details is saved successfully');
    this.router.navigateByUrl(this.defaultHref);
    this.saveInProgress = false;
  }
}
