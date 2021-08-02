import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AppRate } from '@ionic-native/app-rate/ngx';
import { ActionSheetController, AlertController, PopoverController } from '@ionic/angular';

import { LoanUtils } from '../../services/loan.utils';
import { AppStorage } from '../../services/app.storage';
import { AppService } from '../../services/app.services';
import { LoanDetailsPopoverComponent } from '../loan-details-popover/loan-details-popover.component';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.page.html',
  styleUrls: ['./loan-details.page.scss'],
})
export class LoanDetailsPage implements OnInit {
  _id: String;
  loan: any;
  instalments: any;
  defaultHref = 'home';

  constructor(
    private appRate: AppRate,
    private storage: AppStorage,
    private router: Router,
    private datePipe: DatePipe,
    private appService: AppService,
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

    this.init(_id);
  }

  async init(_id) {
    this.loan = await this.storage.getLoan(_id);
    if (!this.loan) {
      this.router.navigateByUrl("home");
      return;
    }

    this._id = _id;
    LoanUtils.calculateLoanDetails(this.loan);
    this.instalments = (Object.assign([], this.loan.instalments)).reverse();
  }

  ngOnInit() {
    //this.appService.showInterstitialAds();

    this.appRate.setPreferences({
      displayAppName: 'Prepayment Advisor',
      usesUntilPrompt: 3,
      promptAgainForEachNewVersion: false,
      storeAppURL: {
        //ios: '<app_id>',
        android: 'market://details?id=com.altooxs.prepaymentadvisor',
      },
      customLocale: {
        title: "Would you mind rating %@?",
        message: "It won’t take more than a minute and helps to promote our app. Thanks for your support!",
      }
    });

    this.appRate.promptForRating(false);
  }

  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: LoanDetailsPopoverComponent,
      componentProps: { _id: this.loan._id },
      event
    });

    await popover.present();
    const { data } = await popover.onDidDismiss();
    if (data && data.reload) {
      this.init(this._id);
    }
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
      this.router.navigateByUrl(`loan-topup/${this.loan._id}/${emi._id}`, {
        skipLocationChange: true
      });
    } else if (role === 'callogic') {
      this.router.navigateByUrl(`calculation-logic/${this.loan._id}/${emi._id}`);
    } else if (role === 'edit') {
      this.router.navigateByUrl(`emi-edit/${this.loan._id}/${emi._id}`, {
        skipLocationChange: true
      });
    } else if (role === 'prepayment') {
      this.router.navigateByUrl(`prepayment/${this.loan._id}/${emi._id}`, {
        skipLocationChange: true
      });
    }
  }

  async getActionSheet(emi) {
    const buttons = [];
    if (!this.loan.isCompleted) {
      buttons.push({
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
      });
    }

    buttons.push({
      role: 'callogic',
      text: 'Calculation Logic',
      icon: 'calculator-outline',
      cssClass: 'action-sheet-primary',
    }, {
      text: 'Cancel',
      icon: 'close',
    });

    return await this.actionSheetController.create({
      header: this.datePipe.transform(emi.emiDate, 'MMMM YYYY'),
      cssClass: 'my-custom-class',
      buttons,
    });
  }
}
