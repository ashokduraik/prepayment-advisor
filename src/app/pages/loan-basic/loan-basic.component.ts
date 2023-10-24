import moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { ModalController } from '@ionic/angular';

import { AppUtils } from '../../services/app.utils';
import { LoanUtils } from '../../services/loan.utils';
import { AppStorage } from '../../services/app.storage';
import { AppService } from '../../services/app.services';
import { CurrencySelectComponent } from '../currency-select/currency-select.component';

@Component({
  selector: 'app-loan-basic',
  templateUrl: './loan-basic.component.html',
  styleUrls: ['./loan-basic.component.scss'],
})
export class LoanBasicComponent implements OnInit {
  _id: string;
  loanForm: FormGroup;
  submitted = false;
  minEmi = null;
  defaultHref = 'home';
  saveInProgress = false;
  maxDate = moment().endOf('month').format("YYYY-MM-DD");
  days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

  constructor(
    private router: Router,
    private storage: AppStorage,
    private service: AppService,
    public formBuilder: FormBuilder,
    public modalController: ModalController,
  ) {
    // router.events
    //   .subscribe((event: NavigationStart) => {
    //     if (event.navigationTrigger === 'popstate') {
    //       if (event.url == "/loan-basic") {
    //       }
    //     }
    //   });
  }

  canActivate() {
    return false;
  }

  async ngOnInit() {
    this.loanForm = this.formBuilder.group({
      interestRate: new FormControl('', Validators.compose([
        Validators.max(50),
        Validators.min(0.1),
        Validators.required
      ])),
      emi: new FormControl('', Validators.compose([
        Validators.max(9999999),
        Validators.min(1),
      ])),
      amount: new FormControl('', Validators.compose([
        Validators.max(9999999999),
        Validators.min(1),
        Validators.required
      ])),
      amountType: new FormControl(''),
      loanType: new FormControl('', Validators.compose([
        Validators.required
      ])),
      startDate: new FormControl(new Date().toISOString(), Validators.compose([
        Validators.required
      ])),
      emiDay: new FormControl(null),
      name: new FormControl(null),
    });

    const profile = await this.storage.getProfile() || {};
    if (!profile.currency) {
      this.forceToSelectCurrency(profile);
    }
  }

  onFlexiLoan() {
    this.loanForm.patchValue({ amountType: '' });
  }

  async forceToSelectCurrency(profile) {
    const modal = await this.modalController.create({
      component: CurrencySelectComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        profile: profile
      }
    });

    await modal.present();
    await modal.onWillDismiss();
  }

  async save(loanForm: FormGroup) {
    this.minEmi = null;
    this.submitted = true;
    const loan = loanForm.value;
    if (loan.loanType === 'EMI_LOAN' && (!loan.emi || !loan.amountType || !loan.emiDay)) return;
    if (!loanForm.valid || this.saveInProgress) return;

    if (loan.loanType === 'FLEXI_LOAN') {
      loan.emiDay = '1';
      loan.emi = 0;
    } else {
      const interest = (loan.interestRate / (100 * 12)) * loan.amount;
      this.minEmi = interest * 1.1;
      if (this.minEmi > loan.emi) return
    }

    this.saveInProgress = true;
    loan._id = AppUtils.getUid();
    loan.startDate = (new Date(loan.startDate)).toISOString();
    LoanUtils.fillInstalments(loan);
    await this.storage.createLoan(loan);
    this.service.showToast('Your Loan details is saved successfully');
    this.router.navigateByUrl('home');
    this.saveInProgress = false;
  }
}
