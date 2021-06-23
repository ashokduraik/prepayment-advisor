import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController, PopoverController } from '@ionic/angular';
import { AppStorage } from '../../services/app.storage';
import { AppService } from '../../services/app.services';


@Component({
  template: `
    <ion-list>
      <ion-item button (click)="statistics()">
        <ion-icon name="pie-chart-outline"></ion-icon>
        <ion-label>Statistics</ion-label>
      </ion-item>
      <ion-item button (click)="deleteLoan()">
        <ion-icon color="danger" name="trash-outline"></ion-icon>
        <ion-label>Delete Loan</ion-label>
      </ion-item>
    </ion-list>
  `
})
export class PopoverPage implements OnInit {
  @Input("_id") _id;
  constructor(
    private storage: AppStorage,
    private router: Router,
    private service: AppService,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
  ) { }

  async ngOnInit() {
    
  }

  statistics() {
    if (!this._id) return;
    this.router.navigateByUrl(`statistics/${this._id}`);
    this.popoverCtrl.dismiss();
  }

  async deleteLoan() {
    if (!this._id) return;
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmation',
      message: 'Are you sure want to delete this loan details?',
      buttons: [{
        text: 'No',
        role: 'No',
      }, {
        text: 'Yes',
        role: 'Yes',
      }]
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    this.popoverCtrl.dismiss();
  
    if (role == 'Yes') {
      await this.storage.deleteLoan(this._id);
      this.service.showToast('Your Loan details is deleted successfully');
      this.router.navigateByUrl(`home`);
    }
  }

  close(url: string) {
    window.open(url, '_blank');
    this.popoverCtrl.dismiss();
  }
}
