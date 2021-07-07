import { AfterViewInit, Directive, DoCheck, ElementRef, forwardRef, HostListener, Inject, Input, KeyValueDiffer, KeyValueDiffers, OnInit, Optional, Renderer2 } from "@angular/core";
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from "@angular/forms";

import { AppCurrencyPipe } from '../../services/app.pipe';

export const CURRENCYMASKDIRECTIVE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AmountInputDirective),
  multi: true
};

@Directive({
  selector: "[amountInput]",
})
export class AmountInputDirective implements AfterViewInit, ControlValueAccessor, OnInit, Validator {

  @Input() max: number;
  @Input() min: number;
  @Input() options: any = {};

  keyValueDiffer: KeyValueDiffer<any, any>;

  optionsTemplate = {
    allowNegative: true,
    decimal: ".",
    precision: 2,
    prefix: "$ ",
    suffix: "",
    thousands: ","
  };

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private currencyPipe: AppCurrencyPipe,
    private keyValueDiffers: KeyValueDiffers
  ) {
    this.keyValueDiffer = keyValueDiffers.find({}).create();
  }

  ngAfterViewInit() {
    this.el.nativeElement.classList.add('sc-ion-input-md-h');
    this.el.nativeElement.classList.add('amount-input');
  }

  ngOnInit() {
    this.el.nativeElement.insertAdjacentHTML('beforeend', '<span class="amount-display"></span>')
  }

  @HostListener("blur", ["$event"])
  handleBlur(event: any) {
    const input = this.el.nativeElement.querySelector('input');
    const span = this.el.nativeElement.querySelector('span');
    if (!input || !span) return;

    span.innerHTML = this.currencyPipe.transform(this.el.nativeElement.value, '');;
    span.style.display = 'block';
    input.style.visibility = 'hidden';
  }

  @HostListener("focusout", ["$event"])
  handleFocusout(event: any) {
    this.handleBlur(event);
  }


  @HostListener("focusin", ["$event"])
  handleFocus(event: any) {
    const input = this.el.nativeElement.querySelector('input');
    const span = this.el.nativeElement.querySelector('span');
    if (!input || !span) return;

    span.style.display = 'none';
    input.style.visibility = 'visible';
  }

  @HostListener("click", ["$event"])
  handleClick(event: any) {
    this.handleFocus(event);
  }



  // @HostListener("cut", ["$event"])
  // handleCut(event: any) {
  //   if (!this.isChromeAndroid()) {
  //     this.inputHandler.handleCut(event);
  //   }
  // }

  // @HostListener("input", ["$event"])
  // handleInput(event: any) {
  //   if (this.isChromeAndroid()) {
  //     this.inputHandler.handleInput(event);
  //   }
  // }

  // @HostListener("keydown", ["$event"])
  // handleKeydown(event: any) {
  //   console.log(this.el.nativeElement.value);
  // }

  // @HostListener("keypress", ["$event"])
  // handleKeypress(event: any) {
  //   if (!this.isChromeAndroid()) {
  //     this.inputHandler.handleKeypress(event);
  //   }
  // }

  // @HostListener("keyup", ["$event"])
  // handleKeyup(event: any) {
  //   if (!this.isChromeAndroid()) {
  //     this.inputHandler.handleKeyup(event);
  //   }
  // }

  // @HostListener("paste", ["$event"])
  // handlePaste(event: any) {
  //   if (!this.isChromeAndroid()) {
  //     this.inputHandler.handlePaste(event);
  //   }
  // }

  isChromeAndroid(): boolean {
    return /chrome/i.test(navigator.userAgent) && /android/i.test(navigator.userAgent);
  }

  registerOnChange(callbackFunction: Function): void {
    console.log("registerOnChange")
    //this.inputHandler.setOnModelChange(callbackFunction);
  }

  registerOnTouched(callbackFunction: Function): void {
    console.log('registerOnTouched')
    // this.inputHandler.setOnModelTouched(callbackFunction);
  }

  setDisabledState(value: boolean): void {
    this.el.nativeElement.disabled = value;
  }

  validate(abstractControl: AbstractControl): { [key: string]: any; } {
    let result: any = {};

    if (abstractControl.value > this.max) {
      result.max = true;
    }

    if (abstractControl.value < this.min) {
      result.min = true;
    }

    return result != {} ? result : null;
  }

  writeValue(value: number): void {
    console.log("writeValue", value);
    //this.inputHandler.setValue(value);
  }
}