import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoanUtils } from '../../services/loan.utils';
import { AppStorage } from '../../services/app.storage';
import { AppService } from '../../services/app.services';

@Component({
  selector: 'app-calculation-logic',
  templateUrl: './calculation-logic.page.html',
  styleUrls: ['./calculation-logic.page.scss'],
})
export class CalculationLogicPage implements OnInit {
  emi: any;
  loan: any;
  emiIndex = null;
  defaultHref = 'home';

  constructor(
    private router: Router,
    private storage: AppStorage,
    private appService: AppService,
    private activatedRoute: ActivatedRoute,
  ) { }

  async ngOnInit() {
    const _id = this.activatedRoute.snapshot.paramMap.get('loanid');
    const emiid = this.activatedRoute.snapshot.paramMap.get('emiid');
    this.defaultHref = _id ? 'loan-details/' + _id : 'home';

    if (!_id || !emiid) {
      this.router.navigateByUrl(this.defaultHref);
      return;
    }

    this.loan = await this.storage.getLoan(_id);
    if (!this.loan) {
      this.router.navigateByUrl(this.defaultHref);
      return;
    }

    this.emi = this.loan.instalments.find((emi, i) => {
      if (emi._id !== emiid) return false;
      this.emiIndex = i;
      return true;
    });
    if (!this.emi) {
      this.router.navigateByUrl(this.defaultHref);
      return;
    }

    LoanUtils.calculateLoanDetails(this.loan);
    this.appService.showInterstitialAds();
  }

}
