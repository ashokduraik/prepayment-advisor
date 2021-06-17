import * as moment from 'moment';

export class LoanUtils {
  static fillInstalments(loan) {
    loan.instalments = loan.instalments || [];
    const currentMonth = moment();
    let emiMonth = moment(loan.startDate);
    let balance = loan.amount;
    const mInterest = loan.interest / (12 * 100);

    if (loan.amountType === 'FULL_AMOUNT') {
      emiMonth = moment(loan.startDate).startOf('month');
    } else if (loan.amountType === 'OUTSTANDING_AMOUNT') {
      emiMonth = moment(loan.startDate).add(1, 'month').startOf('month');
    }

    while (currentMonth.diff(emiMonth, 'month') > 0 && balance > 0) {
      let emi: any;
      emi = {
        amount: loan.emi,
        interest: loan.interest,
        emiDate: emiMonth.toISOString(),
        isSystemEntry: true,
        interestPaid: balance * mInterest
      };

      emi.principalPaid = loan.emi - emi.interestPaid;
      balance -= emi.principalPaid;
      loan.instalments.push(emi);
      emiMonth = emiMonth.add(1, 'month');
    }
  }
}