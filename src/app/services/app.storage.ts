import { Plugins } from '@capacitor/core';
const { Storage } = (Plugins as any);
import { Injectable } from '@angular/core';

import { AppUtils } from './app.utils';

@Injectable({
  providedIn: 'root'
})

export class AppStorage {

  constructor() { }

  private async setKey(key: string, value: any) {
    try {
      await Storage.set({ key, value: JSON.stringify(value) });
    } catch (e) {
      AppUtils.errorLog(e);
    }
  }

  private async getKey(key: string) {
    try {
      const res = await Storage.get({ key });
      return res && res.value ? JSON.parse(res.value) : null;
    } catch (e) {
      AppUtils.errorLog(e);
      return null;
    }
  }

  async createLoan(loan: { createdat: string; }) {
    try {
      const loans = (await this.getLoans()) || [];
      loan.createdat = (new Date()).toISOString();
      loans.push(loan);
      await this.setKey('loans', loans);
      return loans;
    } catch (e) {
      AppUtils.errorLog(e);
      return null;
    }
  }

  async updateLoan(loan: { _id: any; }) {
    try {
      let loans = (await this.getLoans()) || [];
      loans = loans.map((l: { _id: any; }) => {
        return l._id == loan._id ? loan : l;
      });
      await this.setKey('loans', loans);
      return loans;
    } catch (e) {
      AppUtils.errorLog(e);
      return null;
    }
  }

  async saveLoans(loans: any[]) {
    try {
      loans = loans || [];
      await this.setKey('loans', loans);
    } catch (e) {
      AppUtils.errorLog(e);
    }
  }

  async getLoans() {
    try {
      const loans = await this.getKey('loans');
      return loans;
    } catch (e) {
      AppUtils.errorLog(e);
      return null;
    }
  }

  async getLoan(_id: string) {
    try {
      const loans = (await this.getKey('loans')) || [];
      return loans.find((l: { _id: any; }) => l._id == _id);
    } catch (e) {
      AppUtils.errorLog(e);
      return null;
    }
  }

  async deleteLoan(_id: string) {
    try {
      let loans = await this.getLoans() || [];
      loans = JSON.parse(JSON.stringify(loans));
      let index = null;
      let loan: any = null;
      loans.forEach((l: { _id: any; }, i: any) => {
        if (l._id == _id) {
          loan = l;
          index = i;
        }
      });

      if (index == null) {
        AppUtils.errorLog('ele not matched ' + _id);
        return;
      }

      const beforeLength = loans.length;
      loans.splice(index, 1);

      if (beforeLength == loans.length) {
        AppUtils.errorLog('cant deleted the loan ' + _id);
        return;
      }

      await this.setKey('loans', loans);
      const deleteLoans = await this.getDeletedLoans() || [];
      deleteLoans.push(loan);
      await this.setKey('deleteLoans', deleteLoans);
    } catch (e) {
      AppUtils.errorLog(e);
    }
  }

  async getDeletedLoans() {
    try {
      const loans = await this.getKey('deleteLoans');
      return loans;
    } catch (e) {
      AppUtils.errorLog(e);
      return null;
    }
  }

  async getProfile() {
    try {
      const profile = await this.getKey('profile');
      return profile;
    } catch (e) {
      AppUtils.errorLog(e);
      return null;
    }
  }

  async saveProfile(profile: { _id?: any; }) {
    try {
      profile = profile || {};
      if (!profile._id) profile._id = AppUtils.getUid();
      await this.setKey('profile', profile);
    } catch (e) {
      AppUtils.errorLog(e);
    }
  }
}