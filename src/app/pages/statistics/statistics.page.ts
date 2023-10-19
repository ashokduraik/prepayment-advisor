import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Highcharts from 'highcharts';

import { LoanUtils } from '../../services/loan.utils';
import { AppStorage } from '../../services/app.storage';
import { AppService } from '../../services/app.services';
import { AppCurrencyPipe } from '../../services/app.pipe';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements AfterViewInit {
  loan: any;
  loopCont = 0;
  defaultHref = 'home';
  showPaidCanvas = false;
  showFinalCanvas = false;
  showPayableCanvas = false;
  Highcharts: typeof Highcharts = Highcharts;
  loanChartOpns: Highcharts.Options = null;

  constructor(
    private router: Router,
    private storage: AppStorage,
    private appService: AppService,
    private currencyPipe: AppCurrencyPipe,
    private activatedRoute: ActivatedRoute,
  ) { }

  async ngAfterViewInit() {
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
    if (this.loan) this.showChart();
    this.appService.showInterstitialAds();
  }

  showChart() {
    const categories = [];
    const total = [];
    const interest = [];
    const principal = [];

    this.loan.instalments.forEach(emi => {
      if (!emi.financialYear) return;

      categories.push(emi.financialYear);
      if (emi.fyProvisionalPrincipal > 0 && emi.fyProvisionalInterest > 0) {
        total.push(emi.fyProvisionalPrincipal + emi.fyProvisionalInterest);
        interest.push(emi.fyProvisionalInterest);
        principal.push(emi.fyProvisionalPrincipal);
      } else {
        total.push(emi.fyPrincipal + emi.fyInterest);
        interest.push(emi.fyInterest);
        principal.push(emi.fyPrincipal);
      }
    });

    const currencyPipe = this.currencyPipe;
    this.loanChartOpns = {
      chart: {
        type: 'column',
        zooming: {
          type: 'x',
          singleTouch: true,
        },
      },
      title: {
        text: 'Year wise Payment',
        align: 'center'
      },
      xAxis: {
        categories
      },
      yAxis: {
        // min: 0,
        title: {
          text: ''
        },
        labels: {
          formatter: function () {
            return currencyPipe.transform(Number(this.value), 'noDecimal');
          }
        },
      },
      tooltip: {
        pointFormatter: function () {
          return '<span style="color:' + this.series.color + '">' + this.series.name + '</span>: <b>' + currencyPipe.transform(this.y, 'noDecimal') + '</b><br />'
        },
        shared: true
      },
      plotOptions: {
        column: {
          stacking: 'normal',
        }
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Total Paid',
        data: total,
        type: undefined,
      }, {
        name: 'Interest Paid',
        data: interest,
        type: undefined,
        color: '#eb445a'
      }, {
        name: 'Principal Paid',
        data: principal,
        type: undefined,
        color: '#2dd36f',
      }]
    }
  }
}
