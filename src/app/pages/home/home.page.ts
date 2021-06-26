import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
    });

    await this.storage.saveLoans(this.loans);

    this.loans.forEach(loan => {
      LoanUtils.calculateLoanDetails(loan);
    });
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
