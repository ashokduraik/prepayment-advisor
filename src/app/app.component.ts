import { Router } from '@angular/router';
import { Component } from '@angular/core';

import * as Highcharts from 'highcharts';
import { Storage } from '@ionic/storage-angular';
import darkTheme from 'highcharts/themes/high-contrast-dark';
import lightTheme from 'highcharts/themes/high-contrast-light';
import { Platform } from '@ionic/angular';
import HC_drilldown from 'highcharts/modules/drilldown';
HC_drilldown(Highcharts);

import { LoanUtils } from './services/loan.utils';
import { AppStorage } from './services/app.storage';
import { AppService } from './services/app.services';
import { AppCurrencyPipe } from './services/app.pipe';
// import sampleData from '../../data/sample.json';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  appPages = [
    {
      title: 'Add Loan',
      url: 'loan-basic',
      icon: 'add-circle',
    },
    {
      title: 'Play Area',
      url: 'play-area',
      icon: 'play-circle',
    },
    {
      title: 'EMI Calculator',
      url: 'emi-calculator',
      icon: 'calculator',
      // }, {
      //   title: 'Fixed Chit Fund',
      //   url: 'fixed-chit-fund',
      //   icon: 'wallet'
    },
  ];
  profile: any;
  darkMode = false;
  loggedIn = false;
  isAndroid = false;

  constructor(
    private platform: Platform,
    private router: Router,
    private storage: Storage,
    private appStorage: AppStorage,
    private appService: AppService
  ) {
    this.isAndroid = this.platform.is('android');
    this.initializeApp();
    Highcharts.setOptions({
      credits: { enabled: false },
    });
  }

  async ngOnInit() {
    await this.storage.create();
    // await this.appStorage.saveLoans(sampleData.loans); // to setup sample data;

    this.setProfileData();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.appService.showBannerAds();
    });
  }

  goToUrl(url) {
    this.router.navigateByUrl(url, {
      skipLocationChange: url === 'loan-basic',
    });
  }

  async setProfileData() {
    this.profile = (await this.appStorage.getProfile()) || {};
    this.darkMode = this.profile.darkMode;
    this.toggleDarkMode();
    AppCurrencyPipe.setCurrency(this.profile.currency);
    LoanUtils.setFinancialYearEnd(this.profile.currency);
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark', this.darkMode);
    // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    // if (prefersDark.matches === true) darkTheme(Highcharts);
    if (this.darkMode === true) {
      darkTheme(Highcharts);
      Highcharts['_modules']['Extensions/Themes/HighContrastDark.js'].apply();
      Highcharts.setOptions(
        Highcharts['_modules']['Extensions/Themes/HighContrastDark.js'].options
      );
    } else {
      lightTheme(Highcharts);
      Highcharts['_modules']['Extensions/Themes/HighContrastLight.js'].apply();
      Highcharts.setOptions(
        Highcharts['_modules']['Extensions/Themes/HighContrastLight.js'].options
      );
    }
  }

  async updateProfile() {
    this.toggleDarkMode();
    this.appService.emitEvent({
      message: 'Event from Component A',
      mode: this.darkMode,
    });
    this.profile = await this.appStorage.getProfile();
    this.profile.darkMode = this.darkMode;
    await this.appStorage.saveProfile(this.profile);
  }
}
