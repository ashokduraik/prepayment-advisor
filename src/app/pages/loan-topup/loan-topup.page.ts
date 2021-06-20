import * as moment from 'moment';
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
  noEmi = false;
  topups: any = [];
  newEmi = 0;
  emiIndex = null;
  submitted = false;
  loanDetails: any;
  newEmiAmount = null;
  approximateEmi = null;
  topupChanged = false;
  defaultHref = 'home';
  minDate = '2010-01-01';
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
      this.router.navigateByUrl(this.defaultHref, { skipLocationChange: true });
      return;
    }

    this.loan = await this.storage.getLoan(_id);
    if (!this.loan) {
      this.router.navigateByUrl(this.defaultHref, { skipLocationChange: true });
      return;
    }

    this.emi = this.loan.instalments.find((emi, i) => {
      if (emi._id !== emiid) return false;
      this.emiIndex = i;
      return true;
    });
    if (!this.emi) {
      this.router.navigateByUrl(this.defaultHref, { skipLocationChange: true });
      return;
    }

    this.loanDetails = JSON.parse(JSON.stringify(this.loan));
    LoanUtils.calculateLoanDetails(this.loanDetails);
    this.minDate = moment(this.emi.emiDate).startOf('month').format("YYYY-MM-DD");
    this.maxDate = moment(this.emi.emiDate).endOf('month').format("YYYY-MM-DD");
    this.topups = JSON.parse(JSON.stringify(this.emi.topups || []));
    this.topups.forEach(t => this.onDateChange(t));

    this.topups.push({
      amount: '',
      topupDate: (new Date(this.emi.emiDate)).toISOString()
    });
  }

  valueChanged() {
    const topups = this.topups.filter(t => t.amount && t.topupDate);
    const emiTopups = (this.emi.topups || []).filter(t => t.amount && t.topupDate);
    let topupChanged = this.isTopupChanged(topups, emiTopups);
    this.topupChanged = false;
    if (!topupChanged) return;

    let topupAmount = 0;
    this.topupChanged = true;
    topups.forEach(t => topupAmount += t.amount);
    const emiDetails = this.loanDetails.instalments.find(e => e._id === this.emi._id);
    const balanceTerm = this.loanDetails.balanceTerm + this.loan.instalments.length - emiDetails.term + 5;
    const emiAdd = LoanUtils.getEMIAmount(topupAmount, balanceTerm, this.emi.interestRate);
    this.approximateEmi = emiAdd + this.loan.instalments[this.emiIndex - 1].amount;
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

  onDateChange(topup) {
    topup.interest = 0;
    if (!topup.amount || !topup.topupDate) return;

    const mInterest = this.emi.interestRate / (12 * 100);
    const dInterest = mInterest / moment(this.emi.emiDate).daysInMonth();
    const noOfDay = moment(topup.topupDate).endOf('month').diff(topup.topupDate, 'days') + 1;
    topup.interest = topup.amount * noOfDay * dInterest;
  }

  async save() {
    this.submitted = true;
    const topups = this.topups.filter(t => t.amount && t.topupDate);
    if (topups.length && this.topupChanged && !this.noEmi && !this.newEmiAmount) return;
    let topupInterest = 0;

    topups.forEach(t => {
      topupInterest += t.interest;
    });

    if (this.topupChanged && !this.noEmi && this.newEmiAmount) {
      this.loan.emi = this.newEmiAmount;
      this.emi.amount = this.newEmiAmount + topupInterest;
    } else if (!topups.length) {
      this.loan.emi = this.loan.instalments[this.emiIndex - 1].amount;
      this.emi.amount = this.loan.emi;
    }

    for (let i = this.emiIndex + 1; i < this.loan.instalments.length; i++) {
      this.loan.instalments[i].amount = this.loan.emi;
      this.loan.instalments[i].topups = [];
    }

    this.emi.topups = topups;
    await this.storage.updateLoan(this.loan);
    this.service.showToast('Your Topup details is saved successfully');
    this.router.navigateByUrl(this.defaultHref);
  }
}
