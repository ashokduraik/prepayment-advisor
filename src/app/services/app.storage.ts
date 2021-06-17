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
}