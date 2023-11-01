import moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { AppUtils } from 'src/app/services/app.utils';
import { AppStorage } from '../../services/app.storage';
import { AppService } from '../../services/app.services';

@Component({
  selector: 'app-ledger-entry',
  templateUrl: './ledger-entry.page.html',
  styleUrls: ['./ledger-entry.page.scss'],
})
export class LedgerEntryPage implements OnInit {
  loan: any;
  ledger: any;
  submitted = false;
  defaultHref = 'home';
  ledgerForm = this.formBuilder.group({
    amount: new FormControl('', Validators.compose([
      Validators.max(9999999999),
      Validators.min(1),
      Validators.required
    ])),
    type: new FormControl('DEBIT', Validators.compose([
      Validators.required
    ])),
    transactionDate: new FormControl(new Date().toISOString(), Validators.compose([
      Validators.required
    ])),
    description: new FormControl(null, Validators.compose([
      Validators.required
    ])),
  });
  saveInProgress = false;
  minDate = '2010-01-01T00:00:00';
  maxDate = moment().endOf('month').format("YYYY-MM-DD");

  constructor(
    private router: Router,
    private service: AppService,
    private storage: AppStorage,
    public formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) { }

  async ngOnInit() {
    const _id = this.activatedRoute.snapshot.paramMap.get('loanid');
    this.defaultHref = _id ? 'loan-details/' + _id : 'home';

    if (!_id) {
      this.router.navigateByUrl(this.defaultHref);
      return;
    }

    this.loan = await this.storage.getLoan(_id);
    if (!this.loan) {
      this.router.navigateByUrl(this.defaultHref);
      return;
    }

    const ledgerid = this.activatedRoute.snapshot.paramMap.get('ledgerid');
    if (ledgerid) {
      this.ledger = this.loan.ledger.find((led, i) => led._id === ledgerid);

      if (!this.ledger) {
        this.router.navigateByUrl(this.defaultHref);
        return;
      }

      this.ledgerForm.setValue({
        type: this.ledger.type,
        amount: this.ledger.amount,
        description: this.ledger.description,
        transactionDate: this.ledger.transactionDate,
      });
    }
    this.minDate = this.loan.startDate;
  }

  async save() {
    if (this.saveInProgress) return;
    this.submitted = true;

    const ledger = this.ledgerForm.value;
    this.saveInProgress = true;

    if (this.ledger && this.ledger._id) {
      this.loan.ledger.forEach(led => {
        if (led._id !== this.ledger._id) return;
        led.type = ledger.type;
        led.amount = ledger.amount;
        led.description = ledger.description;
        led.transactionDate = ledger.transactionDate;
      });
    } else {
      this.loan.ledger.push({
        _id: AppUtils.getUid(),
        ...ledger
      });
    }

    await this.storage.updateLoan(this.loan);
    this.service.showToast('Ledger details is saved successfully');
    this.router.navigateByUrl(this.defaultHref);
    this.saveInProgress = false;
  }
}
