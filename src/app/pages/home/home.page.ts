import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { Platform } from '@ionic/angular';

import { LoanUtils } from '../../services/loan.utils';
import { AppStorage } from '../../services/app.storage';
import { AppService } from '../../services/app.services';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  profile = null;
  loans: any = [];
  backButtonSubscription;
  summary = {
    totalLoanAmount: 0,
    outstanding: 0,
  };
  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    series: [
      {
        type: "line",
        data: [1, 2, 3, 4, 5]
      }
    ]
  };

  constructor(
    public router: Router,
    private platform: Platform,
    private storage: AppStorage,
    private appService: AppService,
  ) { }

  async ionViewWillEnter() {
    this.initializeHome();
  }

  async initializeHome() {
    this.loans = await this.storage.getLoans() || [];

    this.loans.forEach(loan => {
      LoanUtils.fillInstalments(loan);
      this.summary.totalLoanAmount += loan.amount;
      this.summary.outstanding += loan.balanceAmount;
    });

    await this.storage.saveLoans(this.loans);

    this.loans.forEach(loan => {
      LoanUtils.calculateLoanDetails(loan);
    });
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
