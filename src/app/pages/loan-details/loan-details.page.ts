import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ActionSheetController, AlertController } from '@ionic/angular';

import { LoanUtils } from '../../services/loan.utils';
import { AppStorage } from '../../services/app.storage';
import { AppService } from '../../services/app.services';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.page.html',
  styleUrls: ['./loan-details.page.scss'],
})
export class LoanDetailsPage implements OnInit {
  loan: any;
  instalments: any;
  defaultHref = '';

  constructor(
    private storage: AppStorage,
    private router: Router,
    private datePipe: DatePipe,
    private service: AppService,
    private activatedRoute: ActivatedRoute,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController
  ) { }

  ionViewDidEnter() {
    this.defaultHref = `home`;
  }

  async ngOnInit() {
    const _id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!_id) {
      this.router.navigateByUrl("home");
      return;
    }

    this.loan = await this.storage.getLoan(_id);
    LoanUtils.calculateLoanDetails(this.loan);
    console.log("loans", this.loan);
    if (!this.loan) {
      this.router.navigateByUrl("home");
      return;
    }

    this.instalments = (Object.assign([], this.loan.instalments)).reverse();
    console.log("this.instalments", this.instalments);
  }

  async deleteLoan() {
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
  
    if (role == 'Yes') {
      await this.storage.deleteLoan(this.loan);
      this.service.showToast('Your Loan details is deleted successfully');
      this.router.navigateByUrl(`home`, { skipLocationChange: true });
    }
  }

  async onEmiClick(emi) {
    if (!emi || !emi._id) return;

    const actionSheet = await this.getActionSheet(emi);
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    if (!role) return;

    if (role === 'topup') {
      this.router.navigateByUrl(`loan-topup/${this.loan._id}/${emi._id}`);
    }
  }

  async getActionSheet(emi) {
    return await this.actionSheetController.create({
      header: this.datePipe.transform(emi.emiDate, 'MMMM YYYY'),
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Edit',
        role: 'edit',
        icon: 'create-outline',
      }, {
        role: 'topup',
        text: 'Loan topup details',
        icon: 'bag-handle-outline',
        cssClass: 'ion-color-danger',
      }, {
        role: 'prepayment',
        text: 'Prepayment details',
        icon: 'cash-outline',
      }, {
        text: 'Cancel',
        icon: 'close',
      }]
    });
  }
}
