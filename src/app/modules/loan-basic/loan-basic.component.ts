import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder,FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-loan-basic',
  templateUrl: './loan-basic.component.html',
  styleUrls: ['./loan-basic.component.scss'],
})
export class LoanBasicComponent implements OnInit {
  loanForm: FormGroup;
  submitted = false;
  defaultHref = '';

  constructor( public formBuilder: FormBuilder,) { }

  ionViewDidEnter() {
    this.defaultHref = `home`;
  }

  ngOnInit() {
    this.loanForm = this.formBuilder.group({
      interest: new FormControl('', Validators.compose([
        Validators.max(50),
        Validators.min(0.1),
        Validators.required
      ])),
      emi: new FormControl('', Validators.compose([
        Validators.max(9999999),
        Validators.min(1),
        Validators.required
      ])),
    });
  }

  onLogin(form: NgForm) {
    this.submitted = true;
    if (!form.valid) return;

    console.log(form.value);
    if (form.valid) {
      
    }
  }

}
