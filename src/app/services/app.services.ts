import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';

// import { AdMobPlus, BannerAd, InterstitialAd } from '@admob-plus/capacitor';

import { AppUtils } from './app.utils';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  lastInterstitialAdsTime = null;
  constructor(
    public alertController: AlertController,
    private toastController: ToastController
  ) {}

  private eventSubject = new Subject<any>();

  emitEvent(data: any): void {
    this.eventSubject.next(data);
  }

  getEvent(): Observable<any> {
    return this.eventSubject.asObservable();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
    });
    toast.present();
  }

  async showBannerAds() {
    try {
      // await AdMobPlus.start();
      // const banner = new BannerAd({
      //   adUnitId: environment.bannerAdId,
      // });
      // await banner.show();
      // AdMobPlus.addListener('banner.impression', async () => {
      //   await banner.hide()
      // });
    } catch (e) {
      AppUtils.errorLog(e);
    }
  }

  async showInterstitialAds() {
    try {
      // if (this.lastInterstitialAdsTime && moment().diff(this.lastInterstitialAdsTime, 'minutes') < 5) {
      //   return;
      // }
      // await AdMobPlus.start();
      // const interstitial = new InterstitialAd({
      //   adUnitId: environment.interstitialAdId,
      // });
      // await interstitial.load();
      // await interstitial.show();
      //this.lastInterstitialAdsTime = new Date();
    } catch (e) {
      AppUtils.errorLog(e);
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();

    return await alert.onDidDismiss();
  }
}
