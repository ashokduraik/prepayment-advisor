import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ModalController } from '@ionic/angular';

import { LoanUtils } from '../../services/loan.utils';
import { AppStorage } from '../../services/app.storage';
import { AppService } from '../../services/app.services';
import { PlayAreaFilterPage } from '../play-area-filter/play-area-filter.page';

@Component({
  selector: 'app-play-area',
  templateUrl: './play-area.page.html',
  styleUrls: ['./play-area.page.scss'],
})
export class PlayAreaPage implements OnInit {
  loan: any;
  advice: any;
  defaultHref = 'home';
  filterNotGiven = false;
  // @ts-ignore
  outstanding: Outstanding;

  constructor(
    private storage: AppStorage,
    private appService: AppService,
    private activatedRoute: ActivatedRoute,
    public modalController: ModalController,
  ) { }

  async ionViewWillEnter() {
    const _id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!_id) {
      this.showFilter();
      return;
    }

    this.defaultHref = 'loan-details/' + _id;
    const loan = await this.storage.getLoan(_id);
    this.loan = loan;
    if (!loan) {
      this.showFilter();
      return;
    }

    LoanUtils.calculateLoanDetails(loan);
    this.outstanding = new Outstanding(
      loan.emi,
      loan.interestRate,
      loan.balanceAmount,
      loan.balanceTerm,
      loan.interestPayable,
    );
    this.prepaymentSelected();
  }

  ngOnInit() {
    this.appService.showInterstitialAds();
  }

  prepaymentSelected() {
    this.advice = this.advice || {};
    this.advice.type = 'prepayment';
    this.advice.prepayment = this.advice.prepayment || this.outstanding.emi * 2;
    this.generateAdvice();
  }

  generateAdvice() {
    this.advice.gereated = false;
    if (!this.advice.prepayment) return;

    this.advice.emiComp = this.getRoundedValue(this.advice.prepayment / this.outstanding.emi);
    const amount = this.outstanding.amount - this.advice.prepayment;
    this.advice.newEMI = LoanUtils.getEMIAmount(
      amount,
      this.outstanding.term,
      this.outstanding.interestRate
    );
    this.advice.reducedEMI = this.outstanding.emi - this.advice.newEMI;
    let temp = LoanUtils.getBalanceTermAndInterest(
      amount,
      this.advice.newEMI,
      this.outstanding.interestRate
    );
    this.advice.newInterestEmi = temp.interestPayable;
    this.advice.reducedInterestEmi = this.outstanding.interestPayable - this.advice.newInterestEmi;

    if (this.advice.reducedInterestEmi < 0) {
      this.advice.reducedInterestEmi = 0;
      this.advice.newInterestEmi = this.outstanding.interestPayable;
    }

    temp = LoanUtils.getBalanceTermAndInterest(
      amount,
      this.outstanding.emi,
      this.outstanding.interestRate
    );
    this.advice.newTerm = temp.balanceTerm;
    this.advice.reducedTerm = this.outstanding.term - this.advice.newTerm;
    this.advice.newInterestTerm = temp.interestPayable;
    this.advice.reducedInterestTerm = this.outstanding.interestPayable - this.advice.newInterestTerm;
    this.advice.diff = this.advice.reducedInterestTerm - this.advice.reducedInterestEmi;

    if (this.advice.reducedInterestTerm < 0) {
      this.advice.reducedInterestTerm = 0;
      this.advice.newInterestTerm = this.outstanding.interestPayable;
    }
    if (this.advice.diff < 0) this.advice.diff = this.advice.diff * -1;
    this.advice.gereated = true;
  }

  getRoundedValue(val) {
    return ((val).toFixed(2) * 100) / 100
  }

  emiSelected() {
    this.advice = this.advice || {};
    this.advice.type = 'emi';
    this.advice.emi = this.advice.emi || this.getRoundedValue(this.outstanding.emi * 1.1);
    this.generateEmiAdvice();
  }

  generateEmiAdvice() {
    this.advice.gereated = false;
    if (!this.advice.emi) return;

    if (this.advice.emi == this.outstanding.emi) {
      this.advice.noEmiChange = true;
      return;
    }

    this.advice.noEmiChange = false;
    this.advice.increaseEmi = this.advice.emi > this.outstanding.emi;
    if (this.advice.increaseEmi) {
      this.advice.increaseEmiPer = this.getRoundedValue(((this.advice.emi - this.outstanding.emi) / this.outstanding.emi) * 100);
    } else {
      this.advice.decreaseEmiPer = this.getRoundedValue(((this.outstanding.emi - this.advice.emi) / this.outstanding.emi) * 100);
    }

    let temp = LoanUtils.getBalanceTermAndInterest(
      this.outstanding.amount,
      this.advice.emi,
      this.outstanding.interestRate
    );

    this.advice.newTerm = temp.balanceTerm;
    this.advice.reducedTerm = this.outstanding.term - this.advice.newTerm;
    this.advice.newInterestTerm = temp.interestPayable;
    this.advice.reducedInterestTerm = this.outstanding.interestPayable - this.advice.newInterestTerm;
    if (this.advice.reducedTerm < 0) this.advice.reducedTerm = this.advice.reducedTerm * -1;
    if (this.advice.reducedInterestTerm < 0) this.advice.reducedInterestTerm = this.advice.reducedInterestTerm * -1;
    this.advice.gereated = true;
  }

  async showFilter() {
    this.outstanding = this.outstanding || new Outstanding(0, 0, 0, 0, 0);
    const outstanding = Object.assign({}, this.outstanding);
    const modal = await this.modalController.create({
      component: PlayAreaFilterPage,
      cssClass: 'my-custom-class',
      componentProps: {
        outstanding,
      }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (!data || !data.interestRate) {
      this.filterNotGiven = true;
      return;
    }

    this.filterNotGiven = false;
    Object.assign(this.outstanding, data);
    this.prepaymentSelected();
  }
}

class Outstanding {
  emi = 0;
  term = 0;
  amount = 0;
  interestRate = 0;
  interestPayable = 0;

  constructor(_emi, _interestRate, _amount, _term, _interestPayable) {
    this.amount = _amount;
    this.interestRate = _interestRate;
    this.term = _term;
    this.emi = _emi;
    this.interestPayable = _interestPayable;
  }
}
