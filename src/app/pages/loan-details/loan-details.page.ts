import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ActionSheetController, AlertController, PopoverController } from '@ionic/angular';

import { LoanUtils } from '../../services/loan.utils';
import { AppStorage } from '../../services/app.storage';
import { PopoverPage } from '../loan-option-popover/loan-option-popover';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.page.html',
  styleUrls: ['./loan-details.page.scss'],
})
export class LoanDetailsPage {
  loan: any;
  instalments: any;
  defaultHref = 'home';

  constructor(
    private storage: AppStorage,
    private router: Router,
    private datePipe: DatePipe,
    public popoverCtrl: PopoverController,
    private activatedRoute: ActivatedRoute,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController
  ) { }

  async ionViewWillEnter() {
    const _id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!_id) {
      this.router.navigateByUrl("home");
      return;
    }

    this.loan = await this.storage.getLoan(_id);
    if (!this.loan) {
      this.router.navigateByUrl("home");
      return;
    }

    LoanUtils.calculateLoanDetails(this.loan);
    this.instalments = (Object.assign([], this.loan.instalments)).reverse();
  }

  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: PopoverPage,
      componentProps: {_id: this.loan._id},
      event
    });
    await popover.present();
  }

  playArea() {
    this.router.navigateByUrl(`play-area/${this.loan._id}`);
  }

  async onEmiClick(emi) {
    if (!emi || !emi._id) return;

    const actionSheet = await this.getActionSheet(emi);
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    if (!role) return;

    if (role === 'topup') {
      this.router.navigateByUrl(`loan-topup/${this.loan._id}/${emi._id}`);
    } else if (role === 'callogic') {
      this.router.navigateByUrl(`calculation-logic/${this.loan._id}/${emi._id}`);
    } else if (role === 'edit') {
      this.router.navigateByUrl(`emi-edit/${this.loan._id}/${emi._id}`);
    } else if (role === 'prepayment') {
      this.router.navigateByUrl(`prepayment/${this.loan._id}/${emi._id}`);
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
        cssClass: 'action-sheet-danger',
      }, {
        role: 'prepayment',
        text: 'Prepayment details',
        icon: 'cash-outline',
        cssClass: 'action-sheet-primary',
      }, {
        role: 'callogic',
        text: 'Calculation Logic',
        icon: 'calculator-outline',
        cssClass: 'action-sheet-primary',
      }, {
        text: 'Cancel',
        icon: 'close',
      }]
    });
  }
}
