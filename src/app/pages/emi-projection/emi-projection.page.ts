import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoanUtils } from '../../services/loan.utils';
import { AppStorage } from '../../services/app.storage';
import { AppService } from '../../services/app.services';

@Component({
  selector: 'app-emi-projection',
  templateUrl: './emi-projection.page.html',
  styleUrls: ['./emi-projection.page.scss'],
})
export class EmiProjectionPage {
  loan: any;
  defaultHref = 'home';

  constructor(
    private router: Router,
    private storage: AppStorage,
    private appService: AppService,
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
    this.loan.emiProjection = this.loan.emiProjection || [];
    let balanceAmount = this.loan.balanceAmount || this.loan.amount;

    this.loan.emiProjection.forEach(emi => {
      emi.principalPaid = emi.amount - emi.interestPaid;
      emi.closingBalance = balanceAmount -= emi.principalPaid;
    });

    this.appService.showInterstitialAds();
  }

}
