import * as moment from 'moment';
import { AppUtils } from './app.utils';

export class LoanUtils {
  static fillInstalments(loan) {
    loan.instalments = loan.instalments || [];
    const currentMonth = moment();
    const currentDay = currentMonth.get("date");
    let emiMonth = moment(loan.startDate);
    let balance = loan.amount;
    const mInterest = loan.interestRate / (12 * 100);
    const lastInstalments = loan.instalments[loan.instalments.length - 1];

    if (lastInstalments) {
      emiMonth = moment(lastInstalments.emiDate).add(1, 'month');
    } else {
      if (loan.amountType === 'FULL_TRANS') {
        emiMonth = moment(loan.startDate).startOf('month');
      } else if (loan.amountType === 'OUTSTANDING_AMOUNT') {
        emiMonth = moment(loan.startDate).add(1, 'month').startOf('month');
      }
    }

    while (balance > 0 && (currentMonth.isAfter(emiMonth, 'month') || (currentMonth.isSame(emiMonth, "month") && currentDay > Number(loan.emiDay)))) {
      let emi: any;
      emi = {
        _id: AppUtils.getUid(),
        amount: loan.emi,
        emiDay: loan.emiDay,
        interestRate: loan.interestRate,
        emiDate: emiMonth.toISOString(),
      };

      const interestPaid = balance * mInterest;
      balance -= loan.emi - interestPaid;
      loan.instalments.push(emi);
      emiMonth = emiMonth.add(1, 'month');
    }
  }

  static calculateLoanDetails(loan) {
    loan.instalments = loan.instalments || [];
    loan.principalPaid = 0;
    loan.interestPaid = 0;
    loan.balanceAmount = 0;
    let term = 1;
    loan.balanceAmount = loan.amount;
    const mInterest = loan.interestRate / (12 * 100);
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
      emi.topups = emi.topups || [];
      const daysInMonth = moment(emi.emiDate).daysInMonth()
      const interestPerDay = mInterest / daysInMonth;
      let topupInterest = topupPending.interest;

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
      emi.prepayments.forEach(pp=> {
        if (!pp || !pp.amount || !pp.prepaymentDate) return;
        emi.prepaymentTotal += pp.amount;
        const noOfDay = moment(pp.prepaymentDate).endOf('month').diff(pp.prepaymentDate, 'days') + 1;

        if (emi.emiDay < moment(pp.prepaymentDate).get('date')) {

        }
      });

      emi.openingBalance = loan.balanceAmount;
      emi.amount += topupInterest;
      emi.interestPaid = (loan.balanceAmount * mInterest) + topupInterest;
      if (emi.interestAdjustment != null && !isNaN(emi.interestAdjustment))  {
        emi.interestPaid += emi.interestAdjustment;
      }

      emi.principalPaid = emi.amount - emi.interestPaid;
      emi.amount += (emi.charges || 0);
      loan.principalPaid += emi.principalPaid;
      loan.interestPaid += emi.interestPaid;
      fyPrincipal += emi.principalPaid;
      fyInterest += emi.interestPaid;
      loan.amount += emi.topupTotal - emi.prepaymentTotal;
      term++;
      loan.balanceAmount -= emi.principalPaid - emi.topupTotal + emi.prepaymentTotal;
      emi.closingBalance = loan.balanceAmount;

      /** if the month is march or this is last element then the financial Year info will be shown */
      if (moment(emi.emiDate).get('month') == 2 || !loan.instalments[ei + 1]) {
        let year = moment(emi.emiDate).get('year')
        if (moment(emi.emiDate).get('month') == 2) {
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

    const temp = LoanUtils.getBalanceTermAndInterest(
      loan.balanceAmount, 
      loan.emi, 
      loan.interestRate
    );

    loan.balanceTerm = temp.balanceTerm;
    loan.interestPayable = temp.interestPayable;
  }

  static getBalanceTermAndInterest(balanceAmount, emi, interestRate) {
    let balance = balanceAmount || 0;
    const mInterest = interestRate / (12 * 100);
    let balanceTerm = 0;
    let interestPayable = 0;

    while (balance > 0) {
      const interest = balance * mInterest
      balanceTerm++;
      balance -= emi - interest;
      interestPayable += interest;
      if (balanceTerm > 5000) {
        break;
      }
    }

    return { balanceTerm, interestPayable};
  }

  static getEMIAmount(amount, term, interestRate) {
    const r = interestRate / (100 * 12);
    const pow = Math.pow(1 + r, term);
    return (amount * r * pow) / (pow - 1);
  }
}