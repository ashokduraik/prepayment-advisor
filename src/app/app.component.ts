import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
import { MenuController, Platform, ToastController } from '@ionic/angular';
//import { LottieSplashScreen } from '@ionic-native/lottie-splash-screen/ngx';

import { LoanUtils } from './services/loan.utils';
import { AppStorage } from './services/app.storage';
import { AppService } from './services/app.services';
import { AppCurrencyPipe } from './services/app.pipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
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
  }, {
    title: 'Fixed Chit Fund',
    url: 'fixed-chit-fund',
    icon: 'wallet'
  }];

  darkMode = false;
  profile: any;
  loggedIn = false;
  isAndroid = false;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private storage: Storage,
    private swUpdate: SwUpdate,
    private appStorage: AppStorage,
    private appService: AppService,
    private toastCtrl: ToastController,
    //  private lottieSplashScreen: LottieSplashScreen
  ) {
    this.isAndroid = this.platform.is('android');
    this.initializeApp();
  }

  async ngOnInit() {
    await this.storage.create();
    this.setProfileData();
    // this.checkLoginStatus();
    // this.listenForLoginEvents();

    this.swUpdate.available.subscribe(async res => {
      const toast = await this.toastCtrl.create({
        message: 'Update available!',
        position: 'bottom',
        buttons: [
          {
            role: 'cancel',
            text: 'Reload'
          }
        ]
      });

      await toast.present();

      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
    });
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
    this.darkMode = this.profile.darkMode;
    AppCurrencyPipe.setCurrency(this.profile.currency);
    LoanUtils.setFinancialYearEnd(this.profile.currency);
  }

  async updateProfile() {
    this.profile = await this.appStorage.getProfile();
    this.profile.darkMode = this.darkMode;
    await this.appStorage.saveProfile(this.profile);
  }

  // checkLoginStatus() {
  //   return this.userData.isLoggedIn().then(loggedIn => {
  //     return this.updateLoggedInStatus(loggedIn);
  //   });
  // }

  // updateLoggedInStatus(loggedIn: boolean) {
  //   setTimeout(() => {
  //     this.loggedIn = loggedIn;
  //   }, 300);
  // }

  // listenForLoginEvents() {
  //   window.addEventListener('user:login', () => {
  //     this.updateLoggedInStatus(true);
  //   });

  //   window.addEventListener('user:signup', () => {
  //     this.updateLoggedInStatus(true);
  //   });

  //   window.addEventListener('user:logout', () => {
  //     this.updateLoggedInStatus(false);
  //   });
  // }

  // logout() {
  //   this.userData.logout().then(() => {
  //     return this.router.navigateByUrl('/app/tabs/schedule');
  //   });
  // }
}
