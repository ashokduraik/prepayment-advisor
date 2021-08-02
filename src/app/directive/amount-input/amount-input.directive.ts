import { Directive, ElementRef, HostListener, Input, OnInit } from "@angular/core";

import { AppCurrencyPipe } from '../../services/app.pipe';

@Directive({
  selector: "[amountInput]",
})
export class AmountInputDirective implements OnInit {
  @Input() autofocus: any;
  oldValue: Number;

  constructor(
    private el: ElementRef,
    private currencyPipe: AppCurrencyPipe,
  ) { }

  ngOnInit() {
    this.el.nativeElement.classList.add('amount-input');
    this.el.nativeElement.classList.add('sc-ion-input-md-h');
    this.el.nativeElement.insertAdjacentHTML('beforeend', '<span class="amount-display"></span>');

    this.init();
    setTimeout(_ => {
      this.init();
    }, 500);
  }

  init() {
    if (this.autofocus && (this.autofocus === 'true' || this.autofocus === true)) {
      this.handleFocus();
    } else {
      this.handleBlur();
    }
  }

  @HostListener("blur")
  handleBlur() {
    const input = this.el.nativeElement.querySelector('input');
    const span = this.el.nativeElement.querySelector('span');
    if (!input || !span) return;

    this.oldValue = this.el.nativeElement.value;
    span.innerHTML = this.currencyPipe.transform(this.el.nativeElement.value, '');
    span.style.display = 'block';
    input.style.visibility = 'hidden';
  }

  @HostListener("focusout")
  handleFocusout() {
    this.handleBlur();
  }


  @HostListener("focusin")
  handleFocus() {
    const input = this.el.nativeElement.querySelector('input');
    const span = this.el.nativeElement.querySelector('span');
    if (!input || !span) return;

    span.style.display = 'none';
    input.style.visibility = 'visible';
    input.focus();
    this.oldValue = this.el.nativeElement.value;
  }

  @HostListener("click")
  handleClick() {
    this.handleFocus();
  }

  ngDoCheck() {
    if (this.oldValue == this.el.nativeElement.value) return;

    this.oldValue = this.el.nativeElement.value;
    const span = this.el.nativeElement.querySelector('span');
    if (!span || span.style.display === 'none') return;
    span.innerHTML = this.currencyPipe.transform(this.el.nativeElement.value, '');
  }
}