import moment from 'moment';
import * as Highcharts from 'highcharts';

import { AppUtils } from './app.utils';
import { Currency } from '../services/currency-map';

export class LoanUtils {
  private static financialYearEnd = 3;

  static setFinancialYearEnd(currencyCode) {
    const currency = currencyCode && Currency[currencyCode] || null;
    if (currency) {
      LoanUtils.financialYearEnd = currency.financialYearEnd || 12;
    }
  }

  static fillInstalments(loan, isProjection?) {
    loan.instalments = loan.instalments || [];
    let noOfDays = null;
    let lastMonthInterest = 0;
    const currentMonth = isProjection ? moment().add(100, 'year') : moment();
    const currentDay = currentMonth.get("date");
    const previousMonth = moment().add(-1, 'month');
    let emiDate = moment(loan.startDate);
    let balance = loan.balanceAmount != null ? loan.balanceAmount : loan.amount;
    const mInterest = loan.interestRate / (12 * 100);
    const lastInstalments = loan.instalments[loan.instalments.length - 1];

    if (lastInstalments) {
      emiDate = moment(lastInstalments.emiDate).add(1, 'month');
    } else {
      emiDate = moment(loan.startDate);
    }

    while (balance > 0 && ((currentMonth.isAfter(emiDate, 'month') || (currentMonth.isSame(emiDate, "month") && currentDay >= Number(loan.emiDay))))) {
      if (!loan.instalments.length && !lastMonthInterest && moment(emiDate).get("date") != 1) {
        const days = moment(emiDate).daysInMonth();
        noOfDays = (days - emiDate.get("date") + 1);
        lastMonthInterest = balance * (mInterest / days) * noOfDays;

        if (emiDate.get("date") >= Number(loan.emiDay)) {
          emiDate = emiDate.add(1, 'month');
          continue;
        }
      }

      let emi: any;
      emi = {
        _id: AppUtils.getUid(),
        amount: loan.emi,
        emiDay: loan.emiDay,
        noOfDays,
        interestRate: loan.interestRate,
        emiDate: emiDate.set('date', loan.emiDay).toISOString(),
      };

      const interestPaid = lastMonthInterest || (balance * mInterest);
      emi.interestPaid = interestPaid;
      balance -= loan.emi - interestPaid;
      lastMonthInterest = 0;
      noOfDays = null;

      /** then this is the last month and last month emi is less then the actual  */
      if (balance < 0) {
        emi.amount += balance;
        balance = 0;
      }

      loan.instalments.push(emi);
      emiDate = emiDate.add(1, 'month');
    }

    loan.balanceAmount = balance;
  }

  static calculateLoanDetails(loan) {
    loan.instalments = loan.instalments || [];
    loan.emiPaid = 0;
    loan.principalPaid = 0;
    loan.interestPaid = 0;
    loan.balanceAmount = 0;
    loan.totalPrepayment = 0;
    let term = 1;
    let emiMonth = null;
    loan.balanceAmount = loan.amount;
    const fyStart = LoanUtils.financialYearEnd - 1;
    let fyInterest = 0;
    let fyPrincipal = 0;
    let topupPending = {
      amount: 0,
      interest: 0,
      noOfDay: 0,
      daysInMonth: 0,
    };

    loan.instalments.forEach((emi, ei) => {
      if (!emi._id) emi._id = AppUtils.getUid();
      emi.term = term;
      emi.topupAmount = 0;
      emi.topupInterest = 0;
      emi.topupTotal = 0;
      emi.prepaymentTotal = 0;
      emi.prepaymentInterest = 0;
      emi.topups = emi.topups || [];
      const daysInMonth = moment(emi.emiDate).daysInMonth();
      const mInterest = emi.interestRate / (12 * 100);
      const interestPerDay = mInterest / daysInMonth;
      let topupInterest = topupPending.interest;
      emi.daysInMonth = daysInMonth;

      if (topupPending.interest > 0) {
        emi.previousMonthTopupPending = topupPending;
        topupPending = {
          amount: 0,
          interest: 0,
          noOfDay: 0,
          daysInMonth: 0,
        };
      }

      emi.topups.forEach(t => {
        if (!t || !t.amount || !t.topupDate) return;
        emi.topupTotal += t.amount;
        const noOfDay = moment(t.topupDate).endOf('month').diff(t.topupDate, 'days') + 1;

        /** if topup were added after the emi day then the interst for this month has to be add in the next month */
        if (emi.emiDay < moment(t.topupDate).get('date')) {
          t.interest = t.amount * noOfDay * interestPerDay;
          topupPending.amount += t.amount;
          topupPending.interest += t.interest;
          topupPending.noOfDay = noOfDay;
          topupPending.daysInMonth = daysInMonth;
        } else {
          t.noOfDay = noOfDay;
          t.interest = t.amount * noOfDay * interestPerDay;
          topupInterest += t.interest;
          emi.topupInterest += t.interest;
          emi.topupAmount += t.amount;
          emi.topupAmountNoOfDay = noOfDay;
          emi.daysInMonth = daysInMonth;
        }
      });

      emi.prepayments = emi.prepayments || [];
      emi.prepayments.forEach(pp => {
        if (!pp || !pp.amount || !pp.prepaymentDate) return;
        emi.prepaymentTotal += pp.amount;
        let noOfDay = moment(pp.prepaymentDate).startOf('month').diff(pp.prepaymentDate, 'days');
        pp.noOfDay = noOfDay * -1;
        pp.interest = LoanUtils.getPrepaymentInterest(pp.amount, pp.noOfDay, interestPerDay);
        emi.prepaymentInterest += pp.interest;
        pp.ppamount = pp.amount - pp.interest;
        pp.daysInMonth = daysInMonth;
      });

      emi.prepaymentActual = emi.prepaymentTotal - emi.prepaymentInterest;
      emi.openingBalance = loan.balanceAmount;
      emi.amount += topupInterest;
      loan.emiPaid += emi.amount;
      emi.interestPaid = (emi.noOfDays ? loan.balanceAmount * emi.noOfDays * interestPerDay : loan.balanceAmount * mInterest) + topupInterest;
      emi.principalPaid = emi.amount - emi.interestPaid - (emi.interestAdjustment || 0);
      loan.principalPaid += emi.principalPaid + emi.prepaymentActual;
      loan.interestPaid += emi.interestPaid + (emi.interestAdjustment || 0) + emi.prepaymentInterest;
      fyPrincipal += emi.principalPaid + emi.prepaymentActual;
      fyInterest += emi.interestPaid + (emi.interestAdjustment || 0);
      loan.amount += emi.topupTotal;
      term++;
      loan.balanceAmount -= emi.principalPaid - emi.topupTotal + emi.prepaymentActual;
      emi.closingBalance = loan.balanceAmount;
      loan.totalPrepayment += emi.prepaymentTotal;
      emiMonth = moment(emi.emiDate).get('month');

      /** if the month is march or this is last element then the financial Year info will be shown */
      if (emiMonth == fyStart || !loan.instalments[ei + 1]) {
        let year = moment(emi.emiDate).get('year')

        if (fyStart == 11) {
          emi.financialYear = year;
        } else if (emiMonth == fyStart) {
          emi.financialYear = (year - 1) + '-' + year.toString().slice(-2);
        } else {
          emi.financialYear = year + '-' + (year + 1).toString().slice(-2);
        }
        emi.fyPrincipal = fyPrincipal;
        emi.fyInterest = fyInterest;
        fyPrincipal = 0;
        fyInterest = 0;
      }
    });

    let fyPendingMonth = null;
    const lastEMI = loan.instalments[loan.instalments.length - 1];
    if (emiMonth > -1 && emiMonth < 11) {
      fyPendingMonth = 12 - emiMonth + fyStart;
    }

    const temp1 = LoanUtils.getEMIProjections(loan);
    loan.endDate = temp1.endDate;
    loan.balanceTerm = temp1.balanceTerm;
    loan.emiProjection = temp1.emiProjection;
    const temp = LoanUtils.getBalanceTermAndInterest(
      loan.balanceAmount,
      loan.emi,
      loan.interestRate,
      fyPendingMonth,
    );

    loan.interestPayable = temp.interestPayable;

    if (loan.balanceAmount <= 0) {
      loan.isCompleted = true;
      loan.completedAt = loan.instalments[loan.instalments.length - 1].emiDate;
    } else if (fyPendingMonth > 0 && lastEMI && temp.fyPendingInterest && temp.fyPendingPrincipal) {
      lastEMI.fyProvisionalInterest = temp.fyPendingInterest + lastEMI.fyInterest;
      lastEMI.fyProvisionalPrincipal = temp.fyPendingPrincipal + lastEMI.fyPrincipal;
    }
  }

  static getPrepaymentInterest(amount, noOfDay, interestPerDay) {
    const interest = amount * noOfDay * interestPerDay;
    let ppamount = amount - interest;
    const newInterst = ppamount * noOfDay * interestPerDay;
    return newInterst;
  }

  static getEMIProjections(loan) {
    loan.instalments = loan.instalments || [];
    const paidInstalments = loan.instalments.length;
    const tempLoan = JSON.parse(JSON.stringify(loan));
    LoanUtils.fillInstalments(tempLoan, true);
    const lastEmi = tempLoan.instalments[tempLoan.instalments.length - 1];

    return {
      balanceTerm: tempLoan.instalments.length - paidInstalments,
      emiProjection: tempLoan.instalments.splice(paidInstalments, tempLoan.instalments.length),
      endDate: lastEmi && lastEmi.emiDate,
    };
  }

  static getBalanceTermAndInterest(balanceAmount, emi, interestRate, fyPendingMonth?: number) {
    let balance = balanceAmount || 0;
    const mInterest = interestRate / (12 * 100);
    let balanceTerm = 0;
    let interestPayable = 0;
    let fyPendingInterest = 0;
    let fyPendingPrincipal = 0;

    while (balance > 0) {
      const interest = balance * mInterest
      balanceTerm++;
      const principal = emi - interest;
      balance -= principal;
      interestPayable += interest;

      if (fyPendingMonth > 0 && fyPendingMonth >= balanceTerm) {
        fyPendingInterest += interest;
        fyPendingPrincipal += principal;
      }

      if (balanceTerm > 5000) {
        break;
      }
    }

    return {
      balanceTerm,
      interestPayable,
      fyPendingInterest,
      fyPendingPrincipal,
    };
  }

  static getEMIAmount(amount, term, interestRate) {
    const r = interestRate / (100 * 12);
    const pow = Math.pow(1 + r, term);
    return (amount * r * pow) / (pow - 1);
  }
}