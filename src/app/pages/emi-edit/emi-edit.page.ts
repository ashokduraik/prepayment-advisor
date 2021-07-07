import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { LoanUtils } from '../../services/loan.utils';
import { AppStorage } from '../../services/app.storage';
import { AppService } from '../../services/app.services';

@Component({
  selector: 'app-emi-edit',
  templateUrl: './emi-edit.page.html',
  styleUrls: ['./emi-edit.page.scss'],
})
export class EmiEditPage implements OnInit {
  emi: any;
  loan: any;
  emiIndex = null;
  defaultHref = 'home';
  loanForm: FormGroup;
  submitted = false;
  minEmi = null;
  saveInProgress = false;
  days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

  constructor(
    private router: Router,
    private storage: AppStorage,
    private service: AppService,
    public formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) { }

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
      emiDay: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      emiChangeCurrent: new FormControl(false),
      charges: new FormControl(null),
      interestAdjustment: new FormControl(null),
    });

    const _id = this.activatedRoute.snapshot.paramMap.get('loanid');
    const emiid = this.activatedRoute.snapshot.paramMap.get('emiid');
    this.defaultHref = _id ? 'loan-details/' + _id : 'home';

    if (!_id || !emiid) {
      this.router.navigateByUrl(this.defaultHref);
      return;
    }

    this.loan = await this.storage.getLoan(_id);
    if (!this.loan) {
      this.router.navigateByUrl(this.defaultHref);
      return;
    }

    this.emi = this.loan.instalments.find((emi, i) => {
      if (emi._id !== emiid) return false;
      this.emiIndex = i;
      return true;
    });
    if (!this.emi) {
      this.router.navigateByUrl(this.defaultHref);
      return;
    }

    this.loanForm.patchValue({
      emi: this.emi.amount || this.loan.emi,
      emiDay: this.loan.emiDay,
      interestRate: this.emi.interestRate || this.loan.interestRate,
      charges: this.emi.charges,
      emiChangeCurrent: this.loan.emi != this.emi.amount,
      interestAdjustment: this.emi.interestAdjustment,
    });

    const interest = (this.loan.interestRate / (100 * 12)) * this.loan.amount;
    this.minEmi = interest * 1.1;
  }

  async save(loanForm: FormGroup) {
    this.submitted = true;
    if (!loanForm.valid || this.saveInProgress) return;

    const loanDetails = loanForm.value;
    const interest = (loanDetails.interestRate / (100 * 12)) * this.loan.amount;
    this.minEmi = interest * 1.1;
    if (this.minEmi > loanDetails.emi) return

    this.saveInProgress = true;
    this.emi.charges = loanDetails.charges;
    this.emi.interestAdjustment = loanDetails.interestAdjustment;
    const emiChanged = loanDetails.emi != this.emi.amount;
    const interestChanged = loanDetails.interestRate != this.emi.interestRate;
    const emiDayChanged = loanDetails.emiDay != this.emi.emiDay;

    if (!loanDetails.emiChangeCurrent && emiChanged) {
      this.loan.emi = loanDetails.emi;
    }

    if (emiDayChanged) {
      this.loan.emiDay = loanDetails.emiDay;
    }

    if (interestChanged) {
      this.loan.interestRate = loanDetails.interestRate;
    }

    for (let i = this.emiIndex; i < this.loan.instalments.length; i++) {
      const emi = this.loan.instalments[i];
      if (emiChanged || i == this.emiIndex) {
        emi.amount = loanDetails.emi;
      }

      if (emiDayChanged || i == this.emiIndex) {
        emi.emiDay = loanDetails.emiDay;
      }

      if (interestChanged || i == this.emiIndex) {
        emi.interestRate = loanDetails.interestRate;
      }
    }

    await this.storage.updateLoan(this.loan);
    this.service.showToast('Your EMI details is updated successfully');
    this.router.navigateByUrl(this.defaultHref);
    this.saveInProgress = false;
  }
}
