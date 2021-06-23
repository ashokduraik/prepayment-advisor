import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { AppUtils } from '../../services/app.utils';
import { LoanUtils } from '../../services/loan.utils';
import { AppStorage } from '../../services/app.storage';
import { AppService } from '../../services/app.services';

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
  maxDate = moment().endOf('month').format("YYYY-MM-DD");
  days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

  constructor(
    public formBuilder: FormBuilder,
    private storage: AppStorage,
    private service: AppService,
    private router: Router
  ) { }

  ionViewDidEnter() {
    this.defaultHref = `home`;
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
        Validators.required
      ])),
      amount: new FormControl('', Validators.compose([
        Validators.max(9999999999),
        Validators.min(1),
        Validators.required
      ])),
      amountType: new FormControl('', Validators.compose([
        Validators.required
      ])),
      startDate: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      emiDay: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      name: new FormControl(null),
    });
  }

  async save(loanForm: FormGroup) {
    this.submitted = true;
    if (!loanForm.valid) return;

    this.minEmi = null;
    const loan = loanForm.value;
    const interest = (loan.interestRate / (100 * 12)) * loan.amount;
    this.minEmi = interest * 1.1;
    if (this.minEmi > loan.emi) return

    loan._id = AppUtils.getUid();
    loan.startDate = (new Date(loan.startDate)).toISOString();
    loan.isAllInfoCollected = false;
    LoanUtils.fillInstalments(loan);
    await this.storage.createLoan(loan);
    this.service.showToast('Your Loan details is saved successfully');
    this.router.navigateByUrl('home');
  }
}
