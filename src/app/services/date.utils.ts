export const DateUtils = {
  toDate(input?: any): Date {
    if (!input) return new Date();
    return input instanceof Date ? input : new Date(input);
  },

  now(): Date {
    return new Date();
  },

  addYears(d: any, n: number) {
    const dt = this.toDate(d);
    return new Date(dt.getFullYear() + n, dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds());
  },

  addMonths(d: any, n: number) {
    const dt = this.toDate(d);
    const year = dt.getFullYear();
    const month = dt.getMonth() + n;
    const day = Math.min(dt.getDate(), new Date(year, month + 1, 0).getDate());
    return new Date(year, month, day, dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds());
  },
  addDays(d: any, n: number) {
    const dt = this.toDate(d);
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + n, dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds());
  },

  getDate(d: any) {
    return this.toDate(d).getDate();
  },

  getMonth(d: any) {
    return this.toDate(d).getMonth();
  },

  getYear(d: any) {
    return this.toDate(d).getFullYear();
  },

  daysInMonth(d: any) {
    const dt = this.toDate(d);
    return new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate();
  },

  setDate(d: any, day: number) {
    const dt = this.toDate(d);
    dt.setDate(day);
    return dt;
  },

  isAfterMonth(a: any, b: any) {
    const da = this.toDate(a);
    const db = this.toDate(b);
    return da.getFullYear() > db.getFullYear() || (da.getFullYear() === db.getFullYear() && da.getMonth() > db.getMonth());
  },

  isSameMonth(a: any, b: any) {
    const da = this.toDate(a);
    const db = this.toDate(b);
    return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth();
  },

  endOfMonth(d: any) {
    const dt = this.toDate(d);
    return new Date(dt.getFullYear(), dt.getMonth() + 1, 0, 23, 59, 59, 999);
  },

  startOfMonth(d: any) {
    const dt = this.toDate(d);
    return new Date(dt.getFullYear(), dt.getMonth(), 1, 0, 0, 0, 0);
  },

  diffDays(a: any, b: any) {
    const da = Math.floor(this.toDate(a).getTime() / 86400000);
    const db = Math.floor(this.toDate(b).getTime() / 86400000);
    return da - db;
  },

  formatMonthYear(d: any) {
    const dt = this.toDate(d);
    return dt.toLocaleString(undefined, { month: 'short', year: 'numeric' });
  },
};
