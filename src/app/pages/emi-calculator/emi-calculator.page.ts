import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, LoadingController } from '@ionic/angular';
import moment from 'moment';

import { LoanUtils } from '../../services/loan.utils';
import { AppService } from '../../services/app.services';

@Component({
  selector: 'app-emi-calculator',
  templateUrl: './emi-calculator.page.html',
  styleUrls: ['./emi-calculator.page.scss'],
})
export class EmiCalculatorPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  emi = 7000;
  term = null;
  termInYear = null;
  amount = 500000;
  interest = null;
  totalAmount = null;
  calcPromise = null;
  interestRate = 8;
  toConsider = '';
  defaultHref = 'home';
  calculationDone = false;
  interestPercentage = null;
  loanProjection = null;
  constructor(
    private appService: AppService,
    public loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.doCalc();
    this.appService.showInterstitialAds();
  }

  triggerFn(fn) {
    if (this.calcPromise) {
      clearTimeout(this.calcPromise);
      this.calcPromise = null;
    }

    this.calcPromise = setTimeout(_ => {
      fn.call(this);
    }, 500);
  }

  onValChange() {
    if (!this.amount || !this.interestRate) return;
    const interest = (this.interestRate / (100 * 12)) * this.amount;
    const minEmi = interest * 1.05;

    if (minEmi > this.emi) {
      this.emi = Math.round(minEmi);
    }
    this.doCalc();
  }

  doCalc(isYearChanged?: Boolean) {
    this.calculationDone = false;
    this.loanProjection = null;
    if (!this.amount || !this.interestRate || (!this.emi && !this.term)) {
      return;
    }
    if (this.toConsider === 'TERM' && !this.term) return;
    if (this.toConsider !== 'TERM' && !this.emi) return;

    if (this.emi && this.term) {
      if (this.toConsider == 'TERM') {
        this.emi = null;
      } else {
        this.term = null;
      }
    }

    if (!this.emi) {
      this.emi = LoanUtils.getEMIAmount(
        this.amount,
        this.term,
        this.interestRate
      );
      this.emi = Math.round(this.emi);
      const temp = LoanUtils.getBalanceTermAndInterest(
        this.amount,
        this.emi,
        this.interestRate
      );
      this.interest = temp.interestPayable;
    } else if (!this.term) {
      const temp = LoanUtils.getBalanceTermAndInterest(
        this.amount,
        this.emi,
        this.interestRate
      );
      this.term = temp.balanceTerm;
      this.interest = temp.interestPayable;
    }

    this.totalAmount = this.interest + this.amount;
    this.interestPercentage = ((this.interest / this.totalAmount) * 100).toFixed(2);
    this.calculationDone = true;

    if (!isYearChanged) {
      this.termInYear = null;
      if (this.term) this.termInYear = parseFloat((this.term / 12).toFixed(2));
    }
  }

  termChanged(isYearChanged?: Boolean) {
    this.emi = null;
    this.toConsider = 'TERM';
    this.doCalc(isYearChanged);
  }

  emiChanged() {
    this.term = null;
    this.toConsider = 'EMI';
    this.doCalc();
  }

  yearChanged() {
    if (!this.termInYear)
      this.term = null;
    else
      this.term = Math.round(this.termInYear * 12);
    this.termChanged(true);
  }

  async projection() {
    if (!this.amount || !this.interestRate || !this.emi) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    this.doCalc();

    this.loanProjection = {
      emi: this.emi,
      amount: this.amount,
      interestRate: this.interestRate,
      amountType: 'FULL_TRANS',
      startDate: moment().add(1, 'month').startOf('month'),
      emiDay: 28,
    };

    LoanUtils.fillInstalments(this.loanProjection, true);
    let balanceAmount = this.loanProjection.balanceAmount || this.loanProjection.amount;
    this.loanProjection.instalments.forEach(emi => {
      emi.principalPaid = emi.amount - emi.interestPaid;
      emi.closingBalance = balanceAmount -= emi.principalPaid;
    });

    let y = document.getElementById('projection').offsetTop;
    this.content.scrollToPoint(0, y, 1500);

    setTimeout(_ => {
      loading.dismiss();
    })
  }
}
