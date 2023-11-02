import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import * as Highcharts from 'highcharts';
import { Storage } from '@ionic/storage-angular';
import darkTheme from 'highcharts/themes/high-contrast-dark';
import lightTheme from 'highcharts/themes/high-contrast-light';
import { MenuController, Platform, ToastController } from '@ionic/angular';
//import { LottieSplashScreen } from '@ionic-native/lottie-splash-screen/ngx';

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
  appPages = [{
    title: 'Add Loan',
    url: 'loan-basic',
    icon: 'add-circle'
  }, {
    title: 'Play Area',
    url: 'play-area',
    icon: 'play-circle'
  }, {
    title: 'EMI Calculator',
    url: 'emi-calculator',
    icon: 'calculator'
    // }, {
    //   title: 'Fixed Chit Fund',
    //   url: 'fixed-chit-fund',
    //   icon: 'wallet'
  }];
  profile: any;
  loggedIn = false;
  isAndroid = false;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private storage: Storage,
    private appStorage: AppStorage,
    private appService: AppService,
    private toastCtrl: ToastController,
    //  private lottieSplashScreen: LottieSplashScreen
  ) {
    this.isAndroid = this.platform.is('android');
    this.initializeApp();
    Highcharts.setOptions({
      credits: { enabled: false }
    });
  }

  async ngOnInit() {
    await this.storage.create();
    // await this.appStorage.saveLoans(sampleData.loans); // to setup sample data;

    this.setProfileData();
    // this.checkLoginStatus();
    // this.listenForLoginEvents();
  }

  initializeApp() {
    //this.lottieSplashScreen.show('www/assets/splash.json', false);

    this.platform.ready().then(() => {
      //this.statusBar.styleDefault();
      // setTimeout(_ => {
      //   this.lottieSplashScreen.hide();
      // }, 2000)
      this.appService.showBannerAds();
    });
  }

  goToUrl(url) {
    this.router.navigateByUrl(url, {
      skipLocationChange: url === 'loan-basic'
    });
  }

  async setProfileData() {
    this.profile = await this.appStorage.getProfile() || {};
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches === true) darkTheme(Highcharts);
    else lightTheme(Highcharts);
    AppCurrencyPipe.setCurrency(this.profile.currency);
    LoanUtils.setFinancialYearEnd(this.profile.currency);
  }
}
