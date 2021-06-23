import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
import { MenuController, Platform, ToastController } from '@ionic/angular';

import { AppStorage } from './services/app.storage';

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
  }];

  loggedIn = false;
  profile: any;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private storage: Storage,
    private swUpdate: SwUpdate,
    private appStorage: AppStorage,
    private toastCtrl: ToastController,
  ) {
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
    this.platform.ready().then(() => {
      //this.statusBar.styleDefault();
      //this.splashScreen.hide();
    });
  }

  async setProfileData() {
    this.profile = await this.appStorage.getProfile() || {};
  }

  async modeChanged() {
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
