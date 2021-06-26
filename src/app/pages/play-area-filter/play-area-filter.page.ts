import { Component, OnInit, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { LoanUtils } from '../../services/loan.utils';

@Component({
  selector: 'app-play-area-filter',
  templateUrl: './play-area-filter.page.html',
  styleUrls: ['./play-area-filter.page.scss'],
})
export class PlayAreaFilterPage implements OnInit {
  minEmi = null;
  submitted = false;
  @Input() outstanding: any;

  constructor(
    public modalController: ModalController,
  ) { }

  ngOnInit() {
    Object.keys(this.outstanding).forEach(key => {
      if (this.outstanding[key] == 0) {
        this.outstanding[key] = '';
      }
    })
  }

  applyFilters() {
    this.submitted = true;
    if (!this.doValidation()) return;

    this.minEmi = null;
    const interest = (this.outstanding.interestRate / (100 * 12)) * this.outstanding.amount;
    this.minEmi = interest * 1.1;
    if (this.minEmi > this.outstanding.emi) return;

    const temp = LoanUtils.getBalanceTermAndInterest(
      this.outstanding.amount,
      this.outstanding.emi,
      this.outstanding.interestRate,
    );
    this.outstanding.term = temp.balanceTerm;
    this.outstanding.interestPayable = temp.interestPayable;
    this.dismiss(this.outstanding);
  }

  doValidation() {
    const keys = Object.keys(this.validation);
    for (let i = 0; i < keys.length; i++) {
      const val = this.outstanding[keys[i]];
      if (!val) return false;
      const { min, max } = this.validation[keys[i]];
      if (min != null && min > val) return false;
      if (max != null && max < val) return false;
    }

    return true;
  }

  validation = {
    emi: {
      min: 1,
      max: 999999
    },
    amount: {
      min: 1,
      max: 99999999
    },
    interestRate: {
      min: 0.1,
      max: 50
    }
  }

  dismiss(data?: any) {
    this.modalController.dismiss(data);
  }
}
