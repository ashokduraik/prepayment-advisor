import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController, PopoverController } from '@ionic/angular';

import { LoanUtils } from '../../services/loan.utils';
import { AppStorage } from '../../services/app.storage';
import { AppService } from '../../services/app.services';

@Component({
    selector: 'app-loan-details-popover',
    templateUrl: './loan-details-popover.component.html',
    styleUrls: ['./loan-details-popover.component.scss'],
    standalone: false
})
export class LoanDetailsPopoverComponent implements OnInit {
  @Input("_id") _id;
  @Input("loanType") loanType;
  @Input("isCompleted") isCompleted;
  constructor(
    private storage: AppStorage,
    private router: Router,
    private service: AppService,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
  ) {
  }

  async ngOnInit() {
  }

  claculationLogic() {
    if (!this._id) return;
    this.router.navigateByUrl(`calculation-logic/${this._id}`);
    this.popoverCtrl.dismiss();
  }

  statistics() {
    if (!this._id) return;
    this.router.navigateByUrl(`statistics/${this._id}`);
    this.popoverCtrl.dismiss();
  }

  timeline() {
    if (!this._id) return;
    this.router.navigateByUrl(`timeline/${this._id}`);
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

  async recalCulateLoan() {
    const loan = await this.storage.getLoan(this._id);
    if (!loan) return;

    loan.instalments = [];
    LoanUtils.fillInstalments(loan);
    await this.storage.updateLoan(loan);
    this.popoverCtrl.dismiss({ reload: true });
  }

  projection() {
    if (!this._id) return;
    this.router.navigateByUrl(`emi-projection/${this._id}`);
    this.popoverCtrl.dismiss();
  }

  close(url: string) {
    window.open(url, '_blank');
    this.popoverCtrl.dismiss();
  }

}
