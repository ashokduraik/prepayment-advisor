import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoanUtils } from '../../services/loan.utils';
import { AppStorage } from '../../services/app.storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  loans: any = [];
  constructor(
    public router: Router,
    private storage: AppStorage,
  ) { }

  async ionViewWillEnter() {
    this.loans = await this.storage.getLoans() || [];

    this.loans.forEach(loan => {
      LoanUtils.fillInstalments(loan);
    });

    await this.storage.saveLoans(this.loans);

    this.loans.forEach(loan => {
      LoanUtils.calculateLoanDetails(loan);
    });
    console.log("this.loans - home", this.loans);
  }

  newLoan() {
    this.router.navigateByUrl("loan-basic");
  }

  playArea() {
    this.router.navigateByUrl("play-area");
  }

  loanOther(loan) {
    if (!loan || !loan._id) return;
    this.router.navigateByUrl("loan-details/" + loan._id);
  }
}
