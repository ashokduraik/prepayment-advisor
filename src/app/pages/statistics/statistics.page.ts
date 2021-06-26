import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

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
  @ViewChild('paidCanvas') private paidCanvas: ElementRef;
  @ViewChild('finalCanvas') private finalCanvas: ElementRef;
  @ViewChild('payableCanvas') private payableCanvas: ElementRef;

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
    if (this.loan) {
      this.showChart();
    }
    this.appService.showInterstitialAds();
  }

  showChart() {
    this.showPaidCanvas = false;
    this.showFinalCanvas = false;
    this.showPayableCanvas = false;
    let title = 'Paid amount till now is';

    const paidAmount = this.loan.principalPaid + this.loan.interestPaid;
    if (!this.loan.isCompleted && paidAmount > 0) {
      this.showPieChart(this.paidCanvas, title, paidAmount, this.loan.interestPaid);
      this.showPaidCanvas = true;
    }

    const payableAmount = this.loan.balanceAmount + this.loan.interestPayable;
    if (!this.loan.isCompleted && paidAmount > 0 && payableAmount > 0) {
      title = 'Payable amount is';
      this.showPieChart(this.payableCanvas, title, payableAmount, this.loan.interestPayable);
      this.showPayableCanvas = true;
    }

    title = 'Final amount (Principal + Interest) is';
    this.showPieChart(this.finalCanvas, title, paidAmount + payableAmount, this.loan.interestPayable + this.loan.interestPaid);
    this.showFinalCanvas = true;
  }

  showPieChart(canvas, title, amount, interest) {
    title += ' ' + this.currencyPipe.transform(amount, '');
    const interestPercentage = Number((interest / amount * 100).toFixed(2));
    const principalPercentage = Number((100 - interestPercentage).toFixed(2));

    new Chart(canvas.nativeElement, {
      type: 'pie',
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: title,
            font: {
              weight: 'bold',
              size: 17,
            }
          }
        },
      },
      data: {
        labels: [
          `Interest - ${this.currencyPipe.transform(interest, '')} (${interestPercentage}%)`,
          `Principal - ${this.currencyPipe.transform(amount - interest, '')} (${principalPercentage}%)`],
        datasets: [{
          backgroundColor: [
            "#e74c3c",
            "#2ecc71",
          ],
          data: [interestPercentage, principalPercentage]
        }]
      }
    });
  }
}
