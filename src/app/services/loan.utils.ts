import * as moment from 'moment';
import { AppUtils } from './app.utils';

export class LoanUtils {
  static fillInstalments(loan) {
    loan.instalments = loan.instalments || [];
    const currentMonth = moment();
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

    while (currentMonth.diff(emiMonth, 'month') > 0 && balance > 0) {
      let emi: any;
      emi = {
        _id: AppUtils.getUid(),
        amount: loan.emi,
        interestRate: loan.interestRate,
        emiDate: emiMonth.toISOString(),
        isSystemEntry: true,
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

    loan.instalments.forEach(emi => {
      if (!emi._id) emi._id = AppUtils.getUid();
      emi.term = term;
      emi.topupAmount = 0;
      emi.topupInterest = 0;
      emi.topups = emi.topups || [];

      emi.topups.forEach(t => {
        if (!t || !t.amount || !t.topupDate) return;
        emi.topupAmount += t.amount;
        emi.topupInterest += t.interest;
      });

      emi.openingBalance = loan.balanceAmount;
      emi.interestPaid = (loan.balanceAmount * mInterest) + emi.topupInterest;
      emi.principalPaid = emi.amount - emi.interestPaid;
      loan.principalPaid += emi.principalPaid;
      loan.interestPaid += emi.interestPaid;
      loan.amount += emi.topupAmount;
      term++;
      loan.balanceAmount -= emi.principalPaid + emi.topupAmount;
      emi.closingBalance = loan.balanceAmount;
    });

    LoanUtils.calculateBalanceTerm(loan);
  }

  static calculateBalanceTerm(loan) {
    let balance = loan.balanceAmount || 0;
    const mInterest = loan.interestRate / (12 * 100);
    loan.balanceTerm = 0;
    loan.estimatedInterest = loan.interestPaid;

    while (balance > 0) {
      const interest = balance * mInterest
      loan.balanceTerm++;
      balance -= loan.emi - interest;
      loan.estimatedInterest += interest;
      if (loan.balanceTerm > 500) {
        loan.balanceTerm = '500++';
        break
      }
    }
  }

  static getEMIAmount(amount, term, interestRate) {
    const r = interestRate / (100 * 12);
    const pow = Math.pow(1 + r, term);
    return (amount * r * pow) / (pow - 1);
  }
}