import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { Platform } from '@ionic/angular';

import { LoanUtils } from '../../services/loan.utils';
import { AppStorage } from '../../services/app.storage';
import { AppService } from '../../services/app.services';
import { AppCurrencyPipe } from '../../services/app.pipe';
import { ChartUtils } from 'src/app/services/chart.utils';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  profile = null;
  loans: any = [];
  backButtonSubscription;
  Highcharts: typeof Highcharts = Highcharts;
  loanChartOpns: Highcharts.Options = null;
  repaidChartOpns: Highcharts.Options = null;
  instaChartOpns: Highcharts.Options = null;
  summary = {
    outstanding: 0,
  }

  constructor(
    public router: Router,
    private platform: Platform,
    private storage: AppStorage,
    private appService: AppService,
    private currencyPipe: AppCurrencyPipe,
  ) { }

  async ionViewWillEnter() {
    this.initializeHome();
  }

  async initializeHome() {
    this.loans = await this.storage.getLoans() || [];
    this.loans.forEach(loan => {
      LoanUtils.fillInstalments(loan);
    });

    await this.storage.saveLoans(this.loans);
    let totalLoanAmount = 0, outstanding = 0, principalPaid = 0, interestPaid = 0;
    let lastInstallments = null;

    this.loans.forEach(loan => {
      LoanUtils.calculateLoanDetails(loan);
      totalLoanAmount += loan.amount;
      outstanding += loan.balanceAmount;
      principalPaid += loan.principalPaid;
      interestPaid += loan.interestPaid;

      if (!lastInstallments) {
        lastInstallments = this.getLastInstallemts(loan.instalments).map(e => {
          return {
            emiDate: e.emiDate,
            interestPaid: e.interestPaid,
            principalPaid: e.principalPaid,
          }
        });
        return;
      }

      const insts = this.getLastInstallemts(loan.instalments);
      for (let i = 0; i < insts.length; i++) {
        lastInstallments[i].interestPaid += insts[i].interestPaid;
        lastInstallments[i].principalPaid += insts[i].principalPaid;
      }
    });

    this.summary.outstanding = outstanding;
    const loanData = [{
      name: 'Principal<br> Paid',
      y: principalPaid * 100 / totalLoanAmount,
      amount: principalPaid,
      color: '#2dd36f',
    }, {
      name: 'Balanace',
      y: outstanding * 100 / totalLoanAmount,
      amount: outstanding,
      color: '#eb445a',
    }]
    this.loanChartOpns = ChartUtils.getPieChartOptions(this.currencyPipe, `Total Loan<br>${this.currencyPipe.transform(totalLoanAmount, 'noDecimal')}`, loanData);

    const paidData = [{
      name: 'Interest<br> Paid',
      y: interestPaid * 100 / (principalPaid + interestPaid),
      amount: interestPaid,
      color: '#eb445a'
    }, {
      name: 'Principal<br> Paid',
      y: principalPaid * 100 / (principalPaid + interestPaid),
      amount: principalPaid,
      color: '#2dd36f',
    }];
    this.repaidChartOpns = ChartUtils.getPieChartOptions(this.currencyPipe, `Total Paid<br>${this.currencyPipe.transform(principalPaid + interestPaid, 'noDecimal')}`, paidData);

    this.instaChartOpns = ChartUtils.getPaymentHistoryChart(this.currencyPipe, lastInstallments);
  }

  getLastInstallemts(arr) {
    return (Object.assign([], arr)).reverse().slice(0, 4);
  }

  ngOnInit() {

  }

  // ngAfterViewInit() {
  //   this.backButtonSubscription = this.platform.backButton.subscribe(() => {
  //     navigator['app'].exitApp();
  //   });
  // }

  // ngOnDestroy() {
  //   this.backButtonSubscription.unsubscribe();
  // }

  newLoan() {
    this.router.navigateByUrl("loan-basic", {
      skipLocationChange: true
    });
  }

  playArea() {
    this.router.navigateByUrl("play-area");
  }

  loanOther(loan) {
    if (!loan || !loan._id) return;
    this.router.navigateByUrl("loan-details/" + loan._id);
  }


}
