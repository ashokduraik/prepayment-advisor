import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

import { AppUtils } from '../../services/app.utils';
import { AppStorage } from '../../services/app.storage';
import { AppService } from '../../services/app.services';

@Component({
  selector: 'app-backup-restore',
  templateUrl: './backup-restore.page.html',
  styleUrls: ['./backup-restore.page.scss'],
})
export class BackupRestorePage implements OnInit {
  defaultHref = 'home';
  constructor(
    private router: Router,
    private service: AppService,
    private storage: AppStorage,
    private fileChooser: FileChooser,
  ) { }

  ngOnInit() {
  }

  async backup() {
    const loans = await this.storage.getLoans() || [];
    const profile = await this.storage.getProfile() || {};
    const dataToSave = JSON.stringify({ loans, profile });
    const fileName = `Prepayment_Advisor_${Date.now()}.json`;

    try {
      let filePath = Directory.Documents;
      if (!filePath) {
        this.service.presentAlert('', 'Sorry..!, this device is not supported..!');
        return;
      }

      await Filesystem.writeFile({
        path: fileName,
        data: dataToSave,
        directory: filePath,
        encoding: Encoding.UTF8,
      });

      const msg = `Backup is stored in Documents/${fileName}`;
      this.service.showToast(msg);
    } catch (e) {
      this.service.presentAlert('', 'Sorry..!, this device is not supported..!');
      AppUtils.errorLog(e);
    }
  }

  async restore() {
    try {
      const uri = await this.fileChooser.open();
      if (!uri) return;

      const contents = await Filesystem.readFile({
        path: uri,
        encoding: Encoding.UTF8,
      });

      if (!contents || !contents.data) {
        this.service.presentAlert('', 'Sorry..!, this device is not supported..!');
        return;
      }

      let data = null;
      try {
        data = JSON.parse(contents.data);
      } catch (e) {
        this.service.presentAlert('', 'Invalid backup file, please select valid backup file');
        return;
      }

      if (!data || !data.loans || !data.profile) {
        this.service.presentAlert('', 'Invalid backup, please select valid backup file');
        return;
      }

      await this.storage.saveLoans(data.loans);
      await this.storage.saveProfile(data.profile);
      this.service.showToast("Backup restored successfully..!");
      this.router.navigateByUrl('home');
    } catch (e) {
      if (e && e.toString() == 'User canceled.') return;
      this.service.presentAlert(e, 'Sorry..!, this device is not supported..!');
      AppUtils.errorLog(e);
    }
  }

}
