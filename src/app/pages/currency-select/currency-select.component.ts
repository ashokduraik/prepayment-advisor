import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ModalController } from '@ionic/angular';

import { Currency } from '../../services/currency-map';
import { LoanUtils } from 'src/app/services/loan.utils';
import { AppStorage } from '../../services/app.storage';
import { AppCurrencyPipe } from '../../services/app.pipe';

@Component({
  selector: 'app-currency-select',
  templateUrl: './currency-select.component.html',
  styleUrls: ['./currency-select.component.scss'],
})
export class CurrencySelectComponent implements OnInit {
  currency = null;
  currencies: any = [];
  allCurrencies = null;
  searchCurrency = '';
  @Input() profile: any;
  comeFromMenu = false;
  filterPromise: any;
  saveInProgress = false;

  constructor(
    public router: Router,
    private storage: AppStorage,
    public modalController: ModalController,
  ) { }

  async ngOnInit() {
    this.currencies = this.getCurrency();

    if (!this.profile) {
      this.comeFromMenu = true;
      this.profile = await this.storage.getProfile() || {};
      this.currency = this.profile.currency;
    }
  }

  getCurrency() {
    if (this.allCurrencies) return Object.assign([], this.allCurrencies);

    const currencies: any = [];
    Object.keys(Currency).forEach(key => {
      currencies.push({
        value: key,
        label: `${Currency[key].name} (${Currency[key].symbol})`
      })
    });

    this.allCurrencies = Object.assign([], currencies);
    return currencies;
  }

  filterCurrency() {
    if (this.filterPromise) {
      clearTimeout(this.filterPromise);
      this.filterPromise = null;
    }

    let currencies = this.getCurrency();
    if (!this.searchCurrency) {
      this.currencies = currencies;
      return;
    }

    this.currencies = currencies.filter(c => {
      return !!(c.label.toString().match(new RegExp(this.searchCurrency, "i")));
    });

    this.filterPromise = setTimeout(_ => {
      this.filterCurrency();
    }, 1000);
  }

  async updateProfile() {
    if (this.saveInProgress) return;
    this.saveInProgress = true;
    this.profile.currency = this.currency;
    await this.storage.saveProfile(this.profile);
    AppCurrencyPipe.setCurrency(this.profile.currency);
    LoanUtils.setFinancialYearEnd(this.profile.currency);

    if (!this.comeFromMenu) {
      this.modalController.dismiss();
    } else {
      this.router.navigateByUrl("home");
    }
    this.saveInProgress = false;
  }
}