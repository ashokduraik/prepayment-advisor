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
      emi: this.loan.emi,
      emiDay: this.loan.emiDay,
      interestRate: this.loan.interestRate,
      charges: this.emi.charges,
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
    this.loan.emi = loanDetails.emi;
    this.loan.emiDay = loanDetails.emiDay;
    this.loan.interestRate = loanDetails.interestRate;
    this.emi.charges = loanDetails.charges;
    this.emi.interestAdjustment = loanDetails.interestAdjustment;

    for (let i = this.emiIndex; i < this.loan.instalments.length; i++) {
      const emi = this.loan.instalments[i];
      emi.amount = loanDetails.emi;
      emi.emiDay = loanDetails.emiDay;
      emi.interestRate = loanDetails.interestRate;
    }

    await this.storage.updateLoan(this.loan);
    this.service.showToast('Your EMI details is updated successfully');
    this.router.navigateByUrl(this.defaultHref);
  }
}
