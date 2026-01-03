import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Highcharts from 'highcharts/es-modules/masters/highcharts.src.js';

import { LoanUtils } from '../../services/loan.utils';
import { AppStorage } from '../../services/app.storage';
import { AppService } from '../../services/app.services';
import { AppCurrencyPipe } from '../../services/app.pipe';
import { ChartUtils } from 'src/app/services/chart.utils';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.page.html',
    styleUrls: ['./statistics.page.scss'],
    standalone: false
})
export class StatisticsPage implements AfterViewInit {
  loan: any;
  loopCont = 0;
  defaultHref = 'home';
  showPaidCanvas = false;
  showFinalCanvas = false;
  showPayableCanvas = false;
  Highcharts: typeof Highcharts = Highcharts;
  loanChartOpns: Highcharts.Options | null = null;
  instaChartOpns: Highcharts.Options | null = null;

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
    const categories: any = [];
    const interest: any = [];
    const principal: any = [];

    this.loan.instalments.forEach(emi => {
      if (!emi.financialYear) return;

      categories.push(emi.financialYear);
      if (emi.fyProvisionalPrincipal > 0 && emi.fyProvisionalInterest > 0) {
        interest.push(emi.fyProvisionalInterest);
        principal.push(emi.fyProvisionalPrincipal);
      } else {
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
      title: { text: '' },
      xAxis: { categories },
      yAxis: {
        title: { text: '' },
        labels: { enabled: false },
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          return ChartUtils.getTooltip(this, currencyPipe);
        },
        shared: true,
      },
      legend: ChartUtils.getLegendOption(),
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            formatter: function () {
              return currencyPipe.transform(this.y || 0, 'noDecimal');
            }
          }
        }
      },
      series: [{
        name: 'Interest Paid',
        data: interest,
        type: 'column',
        color: '#eb445a'
      }, {
        name: 'Principal Paid',
        data: principal,
        type: 'column',
        color: '#2dd36f',
      }]
    }

    this.instaChartOpns = ChartUtils.getPaymentHistoryChart(this.currencyPipe, this.loan.instalments);
  }
}
