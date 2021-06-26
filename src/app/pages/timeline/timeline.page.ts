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

    this.loan.instalments.forEach(emi => {
      const changes = [];
      const date = this.datePipe.transform(emi.emiDate, 'MMM YYYY');
      const amount = this.currencyPipe.transform(emi.amount, 'noDecimal');

      if (!lastEMI || !lastInterest) {
        timeLine.push({
          changes: `EMI started with ${amount} per month and ${emi.interestRate}% Rate of Interest`,
          date,
        });
        lastEMI = emi.amount;
        lastInterest = emi.interestRate
        return;
      }

      if (lastEMI != emi.amount) {
        const emiAmt = this.currencyPipe.transform(lastEMI, 'noDecimal');
        changes.push(`EMI is changed from ${emiAmt} to ${amount}`);
      }

      if (lastInterest != emi.interestRate) {
        changes.push(`Rate of Interest changed from ${lastInterest}% to ${emi.interestRate}`);
      }

      if (!changes.length) return;

      timeLine.push({
        changes: changes.join('and'),
        date,
      });

      lastEMI = emi.amount;
      lastInterest = emi.interestRate
    });

    this.timeLine = timeLine.reverse();
  }

}
