import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Chart, DoughnutController, ArcElement } from 'chart.js';
Chart.register(DoughnutController, ArcElement);

import { LoanUtils } from '../../services/loan.utils';
import { AppStorage } from '../../services/app.storage';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements AfterViewInit {
  loan: any;
  defaultHref = 'home';
  doughnutChart: any;
  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;

  constructor(
    private router: Router,
    private storage: AppStorage,
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
  }

  ngAfterViewInit() {
    this.doughnutChartMethod();
  }



  doughnutChartMethod() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['BJP', 'Congress', 'AAP', 'CPM', 'SP'],
        datasets: [{
          label: '# of Votes',
          data: [50, 29, 15, 10, 7],
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)'
          ],
          hoverBackgroundColor: [
            '#FFCE56',
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#FF6384'
          ]
        }]
      }
    });
  }
}
