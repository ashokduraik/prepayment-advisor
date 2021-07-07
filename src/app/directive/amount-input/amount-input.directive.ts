import { Directive, ElementRef, HostListener, Input, OnInit } from "@angular/core";

import { AppCurrencyPipe } from '../../services/app.pipe';

@Directive({
  selector: "[amountInput]",
})
export class AmountInputDirective implements OnInit {
  @Input() autofocus: any;

  constructor(
    private el: ElementRef,
    private currencyPipe: AppCurrencyPipe,
  ) { }

  ngOnInit() {
    this.el.nativeElement.classList.add('amount-input');
    this.el.nativeElement.classList.add('sc-ion-input-md-h');
    this.el.nativeElement.insertAdjacentHTML('beforeend', '<span class="amount-display"></span>');

    setTimeout(_ => {
      if (this.autofocus && (this.autofocus === 'true' || this.autofocus === true)) {
        this.handleFocus();
      } else {
        this.handleBlur();
      }
    }, 500);
  }

  @HostListener("blur")
  handleBlur() {
    const input = this.el.nativeElement.querySelector('input');
    const span = this.el.nativeElement.querySelector('span');
    if (!input || !span) return;

    span.innerHTML = this.currencyPipe.transform(this.el.nativeElement.value, '');;
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
  }

  @HostListener("click")
  handleClick() {
    this.handleFocus();
  }
}