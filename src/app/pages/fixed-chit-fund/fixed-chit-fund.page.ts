import { Component, OnInit } from '@angular/core';

import { LoanUtils } from '../../services/loan.utils';

@Component({
    selector: 'app-fixed-chit-fund',
    templateUrl: './fixed-chit-fund.page.html',
    styleUrls: ['./fixed-chit-fund.page.scss'],
    standalone: false
})
export class FixedChitFundPage implements OnInit {
  projections: any = [];
  chitFund: any = null;
  defaultHref = 'home';
  constructor() { }

  ngOnInit() {
    this.chitFund = {
      installment: 10000,
      noOfInstallment: 20,
      maturityAmount: 232000,
      loanAmount: 190000,
      interest: 2000,
    }

    this.doCalc();
  }

  doCalc() {
    this.projections = [];
    if (!this.chitFund.installment || !this.chitFund.noOfInstallment || !this.chitFund.maturityAmount || !this.chitFund.loanAmount || !this.chitFund.interest) {
      return;
    }

    let index = 1;
    const perYear = 12 / this.chitFund.noOfInstallment;
    const totalInst = this.chitFund.installment * this.chitFund.noOfInstallment;

    for (let i = 20; i > 0; i--) {
      if (i == 1) {
        const interest = totalInst - this.chitFund.maturityAmount;
        let interestPerct = ((interest / this.chitFund.maturityAmount) * perYear * 100).toFixed(2);

        this.projections.push({
          index,
          paid: totalInst,
          interest,
          interestPerct
        });
      } else {
        const paid = totalInst + (i * this.chitFund.interest);
        const interest = paid - this.chitFund.loanAmount;
        let interestPerct = ((interest / this.chitFund.loanAmount) * perYear * 100).toFixed(2);

        this.projections.push({
          index,
          paid,
          interest,
          interestPerct
        });
      }


      index++;
    }
  }
}
