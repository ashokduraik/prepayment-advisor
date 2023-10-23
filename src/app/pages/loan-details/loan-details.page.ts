import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as Highcharts from 'highcharts';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { ActionSheetController, AlertController, PopoverController } from '@ionic/angular';

import { LoanUtils } from '../../services/loan.utils';
import { AppStorage } from '../../services/app.storage';
import { AppService } from '../../services/app.services';
import { AppCurrencyPipe } from '../../services/app.pipe';
import { LoanDetailsPopoverComponent } from '../loan-details-popover/loan-details-popover.component';
import { ChartUtils } from 'src/app/services/chart.utils';

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
  Highcharts: typeof Highcharts = Highcharts;
  loanChartOpns: Highcharts.Options = null;
  repaidChartOpns: Highcharts.Options = null;
  prinpaidChartOpns: Highcharts.Options = null;
  payableChartOpns: Highcharts.Options = null;
  instaChartOpns: Highcharts.Options = null;

  constructor(
    private appRate: AppRate,
    private storage: AppStorage,
    private router: Router,
    private datePipe: DatePipe,
    private appService: AppService,
    private currencyPipe: AppCurrencyPipe,
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

    const loanData = [{
      name: 'Principal<br> Paid',
      y: this.loan.principalPaid * 100 / this.loan.amount,
      amount: this.loan.principalPaid,
      color: '#2dd36f',
    }, {
      name: 'Balanace',
      y: this.loan.balanceAmount * 100 / this.loan.amount,
      amount: this.loan.balanceAmount,
      color: '#eb445a',
    }]
    this.loanChartOpns = ChartUtils.getPieChartOptions(this.currencyPipe, `Total Loan<br>${this.currencyPipe.transform(this.loan.amount, 'noDecimal')}`, loanData);

    const paidData = [{
      name: 'Interest<br> Paid',
      y: this.loan.interestPaid * 100 / (this.loan.principalPaid + this.loan.interestPaid),
      amount: this.loan.interestPaid,
      color: '#eb445a'
    }, {
      name: 'Principal<br> Paid',
      y: this.loan.principalPaid * 100 / (this.loan.principalPaid + this.loan.interestPaid),
      amount: this.loan.principalPaid,
      color: '#2dd36f',
    }];
    this.repaidChartOpns = ChartUtils.getPieChartOptions(this.currencyPipe, `Total Paid<br>${this.currencyPipe.transform(this.loan.principalPaid + this.loan.interestPaid, 'noDecimal')}`, paidData);

    const prinPaidData = [{
      name: 'EMI',
      y: this.loan.emiPaid * 100 / this.loan.principalPaid,
      amount: this.loan.emiPaid,
    }, {
      name: 'Prepayment',
      y: this.loan.totalPrepayment * 100 / this.loan.principalPaid,
      amount: this.loan.totalPrepayment,
      color: '#2dd36f',
    }];
    this.prinpaidChartOpns = ChartUtils.getPieChartOptions(this.currencyPipe, `Principal Paid<br>${this.currencyPipe.transform(this.loan.principalPaid, 'noDecimal')}`, prinPaidData);

    const interest = this.loan.interestPaid + this.loan.interestPayable;
    const total = this.loan.amount + interest;
    const payableData = [{
      name: 'Principal',
      y: this.loan.amount * 100 / total,
      amount: this.loan.amount,
      color: '#2dd36f',
    }, {
      name: 'Interest',
      y: interest * 100 / total,
      amount: interest,
      color: '#eb445a'
    }];

    this.payableChartOpns = ChartUtils.getPieChartOptions(this.currencyPipe, `Repayment Projection<br>${this.currencyPipe.transform(total, 'noDecimal')}`, payableData);
    this.instaChartOpns = ChartUtils.getPaymentHistoryChart(this.currencyPipe, this.instalments.slice(0, 4));
  }

  ngOnInit() {
    //this.appService.showInterstitialAds();

    this.appRate.setPreferences({
      displayAppName: 'Loan Manager',
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
    if (this.loan.loanType === 'EMI_LOAN') {
      buttons.push({
        text: 'Edit',
        role: 'edit',
        icon: 'create-outline',
      });

      if (!this.loan.isCompleted) {
        buttons.push({
          role: 'topup',
          text: 'Add / Edit Loan topup',
          icon: 'bag-handle-outline',
          cssClass: 'action-sheet-danger',
        });
      }
    }

    if (this.loan.loanType === 'EMI_LOAN') {
      buttons.push({
        role: 'prepayment',
        text: 'Add / Edit Prepayment',
        icon: 'cash-outline',
        cssClass: 'action-sheet-primary',
      });
    } else {
      buttons.push({
        role: 'prepayment',
        text: 'Add / Edit Payment details',
        icon: 'cash-outline',
        cssClass: 'action-sheet-primary',
      });
    }

    if (this.loan.loanType === 'EMI_LOAN') {
      buttons.push({
        role: 'callogic',
        text: 'Calculation Logic',
        icon: 'calculator-outline',
        cssClass: 'action-sheet-primary',
      })
    }

    buttons.push({
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
