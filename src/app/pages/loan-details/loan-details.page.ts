import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DateUtils } from 'src/app/services/date.utils';
import Highcharts from 'highcharts/es-modules/masters/highcharts.src.js';
// import { AppRate } from '@ionic-native/app-rate/ngx';
import {
  ActionSheetController,
  AlertController,
  PopoverController,
} from '@ionic/angular';

import { LoanUtils } from '../../services/loan.utils';
import { AppStorage } from '../../services/app.storage';
import { AppService } from '../../services/app.services';
import { AppCurrencyPipe } from '../../services/app.pipe';
import { LoanDetailsPopoverComponent } from '../loan-details-popover/loan-details-popover.component';
import { ChartUtils } from 'src/app/services/chart.utils';
import { AppUtils } from 'src/app/services/app.utils';

@Component({
    selector: 'app-loan-details',
    templateUrl: './loan-details.page.html',
    styleUrls: ['./loan-details.page.scss'],
    standalone: false
})
export class LoanDetailsPage implements OnInit {
  _id: String = '';
  loan: any;
  ledger: any;
  loanRaw: any;
  instalments: any;
  defaultHref = 'home';
  Highcharts: typeof Highcharts = Highcharts;
  loanChartOpns: Highcharts.Options | null = null;
  repaidChartOpns: Highcharts.Options | null = null;
  prinpaidChartOpns: Highcharts.Options | null = null;
  payableChartOpns: Highcharts.Options | null = null;
  instaChartOpns: Highcharts.Options | null = null;

  constructor(
    // private appRate: AppRate,
    private storage: AppStorage,
    private router: Router,
    private datePipe: DatePipe,
    private appService: AppService,
    private currencyPipe: AppCurrencyPipe,
    public popoverCtrl: PopoverController,
    private activatedRoute: ActivatedRoute,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController
  ) {}

  async ionViewWillEnter() {
    const _id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!_id) {
      this.router.navigateByUrl('home');
      return;
    }

    this.init(_id);
    this.appService.getEvent().subscribe((data: any) => {
      console.log(data);
    });
  }

  async init(_id) {
    this.loan = await this.storage.getLoan(_id);
    if (!this.loan) {
      this.router.navigateByUrl('home');
      return;
    }

    this._id = _id;
    this.loanRaw = JSON.parse(JSON.stringify(this.loan));
    LoanUtils.calculateLoanDetails(this.loan);
    this.ledger = Object.assign([], this.loan.ledger).reverse();
    this.instalments = Object.assign([], this.loan.instalments).reverse();

    const loanData = [
      {
        name: 'Principal<br> Paid',
        y: (this.loan.principalPaid * 100) / this.loan.amount,
        amount: this.loan.principalPaid,
        color: '#2dd36f',
      },
      {
        name: 'Balanace',
        y: (this.loan.balanceAmount * 100) / this.loan.amount,
        amount: this.loan.balanceAmount,
        color: '#eb445a',
      },
    ];
    this.loanChartOpns = ChartUtils.getPieChartOptions(
      this.currencyPipe,
      `Total Loan<br>${this.currencyPipe.transform(
        this.loan.amount,
        'noDecimal'
      )}`,
      loanData
    );

    const paidData = [
      {
        name: 'Interest<br> Paid',
        y:
          (this.loan.interestPaid * 100) /
          (this.loan.principalPaid + this.loan.interestPaid),
        amount: this.loan.interestPaid,
        color: '#eb445a',
      },
      {
        name: 'Principal<br> Paid',
        y:
          (this.loan.principalPaid * 100) /
          (this.loan.principalPaid + this.loan.interestPaid),
        amount: this.loan.principalPaid,
        color: '#2dd36f',
      },
    ];
    this.repaidChartOpns = ChartUtils.getPieChartOptions(
      this.currencyPipe,
      `Total Paid<br>${this.currencyPipe.transform(
        this.loan.principalPaid + this.loan.interestPaid,
        'noDecimal'
      )}`,
      paidData
    );

    const prinPaidData = [
      {
        name: 'EMI',
        y: (this.loan.emiPaid * 100) / this.loan.principalPaid,
        amount: this.loan.emiPaid,
      },
      {
        name: 'Prepayment',
        y: (this.loan.totalPrepayment * 100) / this.loan.principalPaid,
        amount: this.loan.totalPrepayment,
        color: '#2dd36f',
      },
    ];
    this.prinpaidChartOpns = ChartUtils.getPieChartOptions(
      this.currencyPipe,
      `Principal Paid<br>${this.currencyPipe.transform(
        this.loan.principalPaid,
        'noDecimal'
      )}`,
      prinPaidData
    );

    const interest = this.loan.interestPaid + this.loan.interestPayable;
    const total = this.loan.amount + interest;
    const payableData = [
      {
        name: 'Principal',
        y: (this.loan.amount * 100) / total,
        amount: this.loan.amount,
        color: '#2dd36f',
      },
      {
        name: 'Interest',
        y: (interest * 100) / total,
        amount: interest,
        color: '#eb445a',
      },
    ];

    if (this.loan.loanType === 'EMI_LOAN') {
      this.payableChartOpns = ChartUtils.getPieChartOptions(
        this.currencyPipe,
        `Repayment Projection<br>${this.currencyPipe.transform(
          total,
          'noDecimal'
        )}`,
        payableData
      );
      this.instaChartOpns = ChartUtils.getPaymentHistoryChart(
        this.currencyPipe,
        this.instalments.slice(0, 5).reverse()
      );
    } else if (this.loan.loanType === 'FLEXI_LOAN') {
      const lastInstallments = Array.from({ length: 5 }, (_, index) => {
        const currentDate = DateUtils.addMonths(DateUtils.now(), -index);
        return {
          interestPaid: 0,
          principalPaid: 0,
          emiDate: DateUtils.addDays(DateUtils.startOfMonth(currentDate), 1),
        };
      });

      lastInstallments.forEach((insta) => {
        const month = DateUtils.toDate(insta.emiDate);
        let monthPaid = 0;
        let monthInterest = 0;
        let principalPaid = 0;

        this.loan.ledger.forEach((led) => {
          if (DateUtils.isSameMonth(month, led.transactionDate)) {
            if (led.type === 'DEBIT') {
              monthPaid += led.amount;
            } else {
              monthInterest += led.amount;
            }
          }
        });

        insta.interestPaid += monthInterest;
        if (monthPaid > monthInterest) {
          principalPaid = monthPaid - monthInterest;
        }
        insta.principalPaid += principalPaid;
      });

      this.instaChartOpns = ChartUtils.getPaymentHistoryChart(
        this.currencyPipe,
        lastInstallments.reverse()
      );
    }
  }

  ngOnInit() {
    //this.appService.showInterstitialAds();
    // this.appRate.setPreferences({
    //   displayAppName: 'Prepayment Advisor',
    //   usesUntilPrompt: 3,
    //   promptAgainForEachNewVersion: false,
    //   storeAppURL: {
    //     //ios: '<app_id>',
    //     android: 'market://details?id=com.altooxs.prepaymentadvisor',
    //   },
    //   customLocale: {
    //     title: 'Would you mind rating %@?',
    //     message:
    //       'It won’t take more than a minute and helps to promote our app. Thanks for your support!',
    //   },
    // });
    // this.appRate.promptForRating(false);
  }

  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: LoanDetailsPopoverComponent,
      componentProps: {
        _id: this.loan._id,
        loanType: this.loan.loanType,
        isCompleted: this.loan.isCompleted,
      },
      event,
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

    const actionSheet = await this.getEMIActionSheet(emi);
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    if (!role) return;

    if (role === 'topup') {
      this.router.navigateByUrl(`loan-topup/${this.loan._id}/${emi._id}`, {
        skipLocationChange: true,
      });
    } else if (role === 'callogic') {
      this.router.navigateByUrl(
        `calculation-logic/${this.loan._id}/${emi._id}`
      );
    } else if (role === 'edit') {
      this.router.navigateByUrl(`emi-edit/${this.loan._id}/${emi._id}`, {
        skipLocationChange: true,
      });
    } else if (role === 'prepayment') {
      this.router.navigateByUrl(`prepayment/${this.loan._id}/${emi._id}`, {
        skipLocationChange: true,
      });
    }
  }

  async getEMIActionSheet(emi) {
    const buttons: any = [];
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

    buttons.push(
      {
        role: 'prepayment',
        text: 'Add / Edit Prepayment',
        icon: 'cash-outline',
        cssClass: 'action-sheet-primary',
      },
      {
        role: 'callogic',
        text: 'Calculation Logic',
        icon: 'calculator-outline',
        cssClass: 'action-sheet-primary',
      }
    );

    buttons.push({
      text: 'Cancel',
      icon: 'close',
    });

    return await this.actionSheetController.create({
      header: this.datePipe.transform(emi.emiDate, 'MMMM y') || '',
      cssClass: 'my-custom-class',
      buttons,
    });
  }

  addLedgerItem() {
    this.router.navigateByUrl(`ledger-entry/${this.loan._id}`, {
      skipLocationChange: true,
    });
  }

  async onLedgerClick(ledger) {
    if (!ledger || !ledger._id) return;

    const actionSheet = await this.getLedgerActionSheet(ledger);
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    if (!role) return;

    if (role === 'edit') {
      this.router.navigateByUrl(`ledger-entry/${this.loan._id}/${ledger._id}`);
    } else if (role === 'clone') {
      const newrole = await this.alertConfirmation(
        'Are you sure want to clone this transaction?'
      );
      if (newrole !== 'Yes') return;

      const newLedger = Object.assign({}, ledger);
      newLedger._id = AppUtils.getUid();
      newLedger.transactionDate = new Date().toISOString();
      this.loanRaw.ledger.push(newLedger);
      await this.storage.updateLoan(this.loanRaw);
      this.appService.showToast('The transaction cloned successfully');
      this.init(this.loan._id);
    } else if (role === 'delete') {
      const newrole = await this.alertConfirmation(
        'Are you sure want to delete this transaction?'
      );
      if (newrole !== 'Yes') return;

      this.loanRaw.ledger = this.loanRaw.ledger.filter(
        (e) => e._id != ledger._id
      );
      await this.storage.updateLoan(this.loanRaw);
      this.appService.showToast('The transaction deleted successfully');
      this.init(this.loan._id);
    }
  }

  async alertConfirmation(message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmation',
      message,
      buttons: [
        {
          text: 'No',
          role: 'No',
        },
        {
          text: 'Yes',
          role: 'Yes',
        },
      ],
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role;
  }

  async getLedgerActionSheet(ledger) {
    const buttons: any = [];
    buttons.push(
      {
        text: 'Edit',
        role: 'edit',
        cssClass: 'primary-color',
        icon: 'create-outline',
      },
      {
        text: 'Clone this in the current month',
        role: 'clone',
        icon: 'copy-outline',
      },
      {
        text: 'Delete',
        role: 'delete',
        cssClass: 'danger-color',
        icon: 'trash-outline',
      },
      {
        text: 'Close',
        icon: 'close',
      }
    );

    return await this.actionSheetController.create({
      header: `${ledger.description} (${this.currencyPipe.transform(
        ledger.amount,
        ''
      )})`,
      cssClass: 'my-custom-class',
      buttons,
    });
  }
}
