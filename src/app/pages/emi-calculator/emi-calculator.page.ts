import { Component, OnInit, Optional } from '@angular/core';

import { LoanUtils } from '../../services/loan.utils';

@Component({
  selector: 'app-emi-calculator',
  templateUrl: './emi-calculator.page.html',
  styleUrls: ['./emi-calculator.page.scss'],
})
export class EmiCalculatorPage implements OnInit {
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
  constructor() { }

  ngOnInit() {
    this.doCalc();
  }

  doCalc(isYearChanged?: Boolean) {
    this.calculationDone = false;
    if (!this.amount || !this.interestRate || (!this.emi && !this.term)) {
      return;
    }
    if (this.toConsider === 'TERM' && !this.term) return;
    if (this.toConsider !== 'TERM' && !this.emi) return;

    if (this.calcPromise) {
      clearTimeout(this.calcPromise);
      this.calcPromise = null;
    }

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

    this.calcPromise = setTimeout(_ => {
      this.doCalc();
    }, 1000);
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
      this.term = (this.termInYear * 12).toFixed(0);
    this.termChanged(true);
  }
}
