import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import moment from 'moment';

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
  darkMode = false;
  chartUpdate = true;
  backButtonSubscription;
  Highcharts: typeof Highcharts = Highcharts;
  loanChartOpns: Highcharts.Options | null = null;
  repaidChartOpns: Highcharts.Options | null = null;
  instaChartOpns: any = null;
  summary = {
    loanCnt: 0,
    outstanding: 0,
  };
  updateFlag = false;

  constructor(
    public router: Router,
    private storage: AppStorage,
    private appService: AppService,
    private currencyPipe: AppCurrencyPipe
  ) {}

  async ionViewWillEnter() {
    this.initializeHome();
    this.appService.getEvent().subscribe((data: any) => {
      this.darkMode = data.mode;
      console.log('this.darkMode', this.darkMode);
      this.updateFlag = true;
    });
  }

  async initializeHome() {
    this.loans = (await this.storage.getLoans()) || [];
    this.loans.forEach((loan) => {
      LoanUtils.fillInstalments(loan);
    });

    this.summary.loanCnt = 0;
    this.summary.outstanding = 0;
    await this.storage.saveLoans(this.loans);
    let totalLoanAmount = 0,
      outstanding = 0,
      principalPaid = 0,
      interestPaid = 0;
    const lastInstallments: any = Array.from({ length: 5 }, (_, index) => {
      const currentDate = moment().subtract(index, 'months');
      return {
        interestPaid: 0,
        principalPaid: 0,
        drilldowns: [],
        emiDate: currentDate.startOf('month').add(1, 'day').toDate(),
      };
    });

    this.loans.forEach((loan) => {
      LoanUtils.calculateLoanDetails(loan);
      totalLoanAmount += loan.amount;
      outstanding += loan.balanceAmount;
      principalPaid += loan.principalPaid;
      interestPaid += loan.interestPaid;

      if (!loan.isCompleted) {
        this.summary.loanCnt++;
      }

      if (!loan.instalments.length) return;
      const insts = this.getLastInstallemts(loan.instalments);

      lastInstallments.forEach((insta) => {
        const month = moment(insta.emiDate);
        const matchedEmi = insts.find((e) => month.isSame(e.emiDate, 'month'));
        if (!matchedEmi) return;

        const principalPaid =
          matchedEmi.principalPaid + (matchedEmi.prepaymentTotal || 0);
        insta.principalPaid += principalPaid;
        insta.interestPaid += matchedEmi.interestPaid;
        insta.drilldowns.push({
          name: loan.name,
          principalPaid,
          interestPaid: matchedEmi.interestPaid,
        });
      });
    });

    this.loans.forEach((loan) => {
      if (!loan.ledger.length) return;

      lastInstallments.forEach((insta) => {
        const month = moment(insta.emiDate);
        let monthPaid = 0;
        let monthInterest = 0;
        let principalPaid = 0;

        loan.ledger.forEach((led) => {
          if (month.isSame(led.transactionDate, 'month')) {
            if (led.type === 'DEBIT') {
              monthPaid += led.amount;
            } else {
              monthInterest += led.amount;
            }
          }
        });

        insta.interestPaid += monthInterest;
        if (monthPaid > monthInterest) {
          principalPaid = monthPaid - monthInterest;
        }
        insta.principalPaid += principalPaid;

        if (principalPaid > 0 || monthInterest > 0) {
          insta.drilldowns.push({
            name: loan.name,
            principalPaid,
            interestPaid: monthInterest,
          });
        }
      });
    });

    this.summary.outstanding = outstanding;
    const loanData = [
      {
        name: 'Principal<br> Paid',
        y: (principalPaid * 100) / totalLoanAmount,
        amount: principalPaid,
        color: '#2dd36f',
      },
      {
        name: 'Balanace',
        y: (outstanding * 100) / totalLoanAmount,
        amount: outstanding,
        color: '#eb445a',
      },
    ];
    this.loanChartOpns = ChartUtils.getPieChartOptions(
      this.currencyPipe,
      `Total Loan<br>${this.currencyPipe.transform(
        totalLoanAmount,
        'noDecimal'
      )}`,
      loanData
    );

    const paidData = [
      {
        name: 'Interest<br> Paid',
        y: (interestPaid * 100) / (principalPaid + interestPaid),
        amount: interestPaid,
        color: '#eb445a',
      },
      {
        name: 'Principal<br> Paid',
        y: (principalPaid * 100) / (principalPaid + interestPaid),
        amount: principalPaid,
        color: '#2dd36f',
      },
    ];
    this.repaidChartOpns = ChartUtils.getPieChartOptions(
      this.currencyPipe,
      `Total Paid<br>${this.currencyPipe.transform(
        principalPaid + interestPaid,
        'noDecimal'
      )}`,
      paidData
    );

    let redrawEnabled = true;
    this.instaChartOpns = ChartUtils.getPaymentHistoryChart(
      this.currencyPipe,
      lastInstallments.reverse()
    );
    this.instaChartOpns.chart.events = {
      redraw: function () {
        if (!redrawEnabled) return;
        redrawEnabled = false;
        const values: any = [];
        this.series.forEach((s) => {
          values.push(s.dataMax);
        });
        let ymax = values.reduce((acc, val) => (acc > val ? acc : val), 0);
        ymax += ymax * 0.3;
        this.yAxis[0].setExtremes(0, ymax);
        redrawEnabled = true;
      },
    };
  }

  getLastInstallemts(arr) {
    return Object.assign([], arr).reverse().slice(0, 5);
  }

  ngOnInit() {}

  newLoan() {
    this.router.navigateByUrl('loan-basic', {
      skipLocationChange: true,
    });
  }

  playArea() {
    this.router.navigateByUrl('play-area');
  }

  loanOther(loan) {
    if (!loan || !loan._id) return;
    this.router.navigateByUrl('loan-details/' + loan._id);
  }
}
