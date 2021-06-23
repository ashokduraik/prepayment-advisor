import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

import { AppUtils } from './app.utils';

@Injectable({
    providedIn: 'root'
})

export class AppStorage {

    constructor(public storage: Storage) { }

    async createLoan(loan) {
        try {
            const loans = await this.getLoans() || [];
            loan.createdat = (new Date()).toISOString();
            loans.push(loan);
            await this.storage.set('loans', loans);
            return loans;
        } catch (e) {
            AppUtils.errorLog(e);
            return null;
        }
    }

    async updateLoan(loan) {
        try {
            let loans = await this.getLoans() || [];
            loans = loans.map(l => {
                return l._id == loan._id ? loan : l;
            });
            await this.storage.set('loans', loans);
            return loans;
        } catch (e) {
            AppUtils.errorLog(e);
            return null;
        }
    }

    async saveLoans(loans) {
        try {
            loans = loans || [];
            await this.storage.set('loans', loans);
        } catch (e) {
            AppUtils.errorLog(e);
            return null;
        }
    }

    async getLoans() {
        try {
            //this.storage.clear();
            const loans = await this.storage.get('loans');
            return loans;
        } catch (e) {
            AppUtils.errorLog(e);
            return null;
        }
    }

    async getLoan(_id) {
        try {
            const loans = await this.storage.get('loans') || [];
            return loans.find(l => l._id == _id);
        } catch (e) {
            AppUtils.errorLog(e);
            return null;
        }
    }

    async deleteLoan(_id) {
        try {
            let loans = await this.getLoans() || [];
            loans = JSON.parse(JSON.stringify(loans));
            let index = null;
            let loan = null;
            loans.forEach((l, i) => {
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

            await this.storage.set('loans', loans);
            const deleteLoans = await this.getDeletedLoans() || [];
            deleteLoans.push(loan);
            await this.storage.set('deleteLoans', deleteLoans);
        } catch (e) {
            AppUtils.errorLog(e);
            return null;
        }
    }

    async getDeletedLoans() {
        try {
            const loans = await this.storage.get('deleteLoans');
            return loans;
        } catch (e) {
            AppUtils.errorLog(e);
            return null;
        }
    }

    async getProfile() {
        try {
            const profile = await this.storage.get('profile');
            return profile;
        } catch (e) {
            AppUtils.errorLog(e);
            return null;
        }
    }

    async saveProfile(profile) {
        try {
            profile = profile || {};
            if (!profile._id) profile._id = AppUtils.getUid();
            await this.storage.set('profile', null);
            await this.storage.set('profile', profile);
        } catch (e) {
            AppUtils.errorLog(e);
            return null;
        }
    }
}