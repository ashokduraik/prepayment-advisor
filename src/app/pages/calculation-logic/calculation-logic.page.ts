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
  nextMonth = null;
  previousMonth = null;
  defaultHref = 'home';
  noInstalment = false;

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

    if (!_id) {
      this.router.navigateByUrl(this.defaultHref);
      return;
    }

    this.loan = await this.storage.getLoan(_id);
    if (!this.loan) {
      this.router.navigateByUrl(this.defaultHref);
      return;
    }

    if (!this.loan.instalments || !this.loan.instalments.length) {
      this.noInstalment = true;
      return;
    }

    if (emiid) {
      this.emi = this.loan.instalments.find((emi, i) => {
        if (emi._id !== emiid) return false;
        this.emiIndex = i;
        return true;
      });
    } else {
      this.emiIndex = this.loan.instalments.length - 1;
      this.emi = this.loan.instalments[this.emiIndex];
    }

    if (!this.emi) {
      this.router.navigateByUrl(this.defaultHref);
      return;
    }

    this.setPreNext();
    LoanUtils.calculateLoanDetails(this.loan);
    this.appService.showInterstitialAds();
  }

  setPreNext() {
    this.nextMonth = this.getEMIDate(this.loan.instalments[this.emiIndex + 1]);
    this.previousMonth = this.getEMIDate(this.loan.instalments[this.emiIndex - 1]);
  }

  getEMIDate(emi) {
    return emi && emi.emiDate;
  }

  goToPrevious() {
    this.emi = this.loan.instalments[this.emiIndex - 1];
    this.emiIndex--;
    this.setPreNext();
  }

  goToNext() {
    this.emi = this.loan.instalments[this.emiIndex + 1];
    this.emiIndex++;
    this.setPreNext();
  }
}
