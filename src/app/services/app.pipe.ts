import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Currency } from '../services/currency-map';

@Pipe({ name: 'appCurrency' })

export class AppCurrencyPipe implements PipeTransform {

  private static currency: any;

  public static setCurrency(code) {
    AppCurrencyPipe.currency = code && Currency[code] || null;
  }

  transform(value: number, option): string {

    if (!isNaN(value)) {
      const currency = AppCurrencyPipe.currency;
      const currencySymbol = currency && currency.symbol || '₹';
      let commaForEvery = 2;
      if (currency && currency.commaForEvery) {
        commaForEvery = currency && currency.commaForEvery
      } else if (currency) {
        commaForEvery = 3;
      }

      const noDecimal = option == 'noDecimal';
      const result = value.toFixed(!noDecimal ? 2 : 0).split('.');
      let lastThree = result[0].substring(result[0].length - 3);
      const otherNumbers = result[0].substring(0, result[0].length - 3);
      let output = result[0];

      if (otherNumbers != '' && otherNumbers != '-') {
        lastThree = ',' + lastThree;
        const reg = new RegExp(`\\B(?=(\\d{${commaForEvery}})+(?!\\d))`, 'g');
        output = otherNumbers.replace(reg, ",") + lastThree;
      }

      if (result.length > 1) {
        output += "." + result[1];
      }

      return currencySymbol + output;
    }

    return (value || "").toString();
  }
}

@Pipe({ name: 'monthToYear' })
export class monthToYearPipe implements PipeTransform {
  transform(value: number): string {

    if (!isNaN(value)) {
      if (value < 12) return `${value} months`;
      const months = value % 12 > 0 ? ` ${value % 12}M` : ``;
      return `${Math.floor(value / 12)}Y${months}`;
    }

    return (value || "").toString();
  }
}

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}