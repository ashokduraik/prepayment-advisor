import { Component } from '@angular/core';
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

  async ngOnInit() {
    this.loans = await this.storage.getLoans() || [];

    this.loans.forEach(loan => {
      LoanUtils.fillInstalments(loan);
    });

    await this.storage.saveLoans(this.loans);

    this.loans.forEach(loan => {
      LoanUtils.calculateLoanDetails(loan);
    });
    console.log("this.loans", this.loans);
  }

  newLoan() {
    this.router.navigateByUrl("loan-basic");
  }

  loanOther(loan) {
    if (!loan || !loan._id) return;
    this.router.navigateByUrl("loan-details/" + loan._id);
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 20000);
  }
}
