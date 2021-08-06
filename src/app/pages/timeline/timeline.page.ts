import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { LoanUtils } from '../../services/loan.utils';
import { AppStorage } from '../../services/app.storage';
import { AppService } from '../../services/app.services';
import { AppCurrencyPipe } from '../../services/app.pipe';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.page.html',
  styleUrls: ['./timeline.page.scss'],
})
export class TimelinePage {
  loan: any;
  timeLine = [];
  defaultHref = 'home';
  noInstalment = false;

  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private storage: AppStorage,
    private appService: AppService,
    private currencyPipe: AppCurrencyPipe,
    private activatedRoute: ActivatedRoute,
  ) { }

  async ionViewWillEnter() {
    const _id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!_id) {
      this.router.navigateByUrl(this.defaultHref);
      return;
    }

    this.defaultHref = 'loan-details/' + _id;
    this.loan = await this.storage.getLoan(_id);
    if (!this.loan) {
      this.router.navigateByUrl(this.defaultHref);
      return;
    }

    LoanUtils.calculateLoanDetails(this.loan);
    this.appService.showInterstitialAds();
    let lastEMI = null;
    const timeLine = [];
    let lastInterest = null;
    this.loan.instalments = this.loan.instalments || [];
    let iStyle = `style="font-size: 17px; font-weight: 600;"`;

    if (!this.loan.instalments.length) {
      this.noInstalment = true;
      return;
    }

    this.loan.instalments.forEach((emi, i) => {
      const changes = [];
      const date = this.datePipe.transform(emi.emiDate, 'MMM YYYY');
      let amount = this.getAmount(emi.amount);

      if (!lastEMI || !lastInterest) {
        timeLine.push({
          changes: `EMI started with <span ${iStyle}>${amount}</span> per month and <span ${iStyle}>${emi.interestRate}%</span> Rate of Interest`,
          date,
        });
        lastEMI = emi.amount;
        lastInterest = emi.interestRate
        return;
      }

      if (i == this.loan.instalments.length - 1 && this.loan.isCompleted) {
        timeLine.push({
          changes: `Loan is completed`,
          date,
        });
        return;
      }

      if (emi.topupTotal > 0) {
        changes.push(`<span ${iStyle}>${this.getAmount(emi.topupTotal)}</span> is added to the loan`);
        if (emi.newEmiAmount) {
          emi.amount = emi.newEmiAmount;
        }
      }

      if (emi.previousMonthTopupPending && emi.previousMonthTopupPending.interest) {
        emi.amount -= emi.previousMonthTopupPending.interest;
      }

      if (emi.prepaymentTotal > 0) {
        changes.push(`<span ${iStyle}>${this.getAmount(emi.prepaymentTotal)}</span> is paid as prepayment`);
        if (emi.newEmiAmount) {
          emi.amount = emi.newEmiAmount;
        }
      }

      amount = this.getAmount(emi.amount);
      if (lastEMI != emi.amount) {
        const emiAmt = this.getAmount(lastEMI);
        changes.push(`EMI is changed from <span ${iStyle}>${emiAmt} to ${amount}</span>`);
      }

      if (lastInterest != emi.interestRate) {
        changes.push(`Rate of Interest changed from <span ${iStyle}>${lastInterest}% to ${emi.interestRate}</span>`);
      }

      if (!changes.length) return;

      const opening = LoanUtils.getBalanceTermAndInterest(emi.openingBalance, lastEMI, lastInterest);
      const closing = LoanUtils.getBalanceTermAndInterest(emi.closingBalance, emi.amount, emi.interestRate);


      timeLine.push({
        date,
        changes: changes.join(' and '),
        termChange: closing.balanceTerm - opening.balanceTerm,
        interestChange: closing.interestPayable - opening.interestPayable
      });

      lastEMI = emi.amount;
      lastInterest = emi.interestRate
    });

    this.timeLine = timeLine.reverse();
  }

  getAmount(amount) {
    return this.currencyPipe.transform(amount, 'noDecimal')
  }
}
