import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
// use HTML file input as cross-platform picker (works in webview on Android/iOS)

import { AppUtils } from '../../services/app.utils';
import { AppStorage } from '../../services/app.storage';
import { AppService } from '../../services/app.services';

@Component({
    selector: 'app-backup-restore',
    templateUrl: './backup-restore.page.html',
    styleUrls: ['./backup-restore.page.scss'],
    standalone: false
})
export class BackupRestorePage implements OnInit {
  defaultHref = 'home';
  constructor(
    private router: Router,
    private service: AppService,
    private storage: AppStorage,
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
      const cap: any = (window as any).Capacitor || (window as any).cordova || {};
      const NativeFilePicker = cap.Plugins && cap.Plugins.NativeFilePicker ? cap.Plugins.NativeFilePicker : null;

      let text: string | null = null;

      if (NativeFilePicker && typeof NativeFilePicker.pickFile === 'function') {
        const res: any = await NativeFilePicker.pickFile();
        if (!res || !res.data) {
          this.service.presentAlert('', 'Sorry..!, this device is not supported..!');
          return;
        }
        text = res.data;
      } else {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json,.json';
        input.multiple = false;

        const filePromise: Promise<File | null> = new Promise((resolve) => {
          input.onchange = () => {
            const files = input.files;
            if (!files || files.length === 0) return resolve(null);
            resolve(files[0]);
          };
        });

        input.click();
        const pickedFile = await filePromise;
        if (!pickedFile) return;

        text = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (err) => reject(err);
          reader.readAsText(pickedFile);
        });
      }

      let data: any = null;
      try {
        data = JSON.parse((text || '').toString());
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
    } catch (e: any) {
      if (e && e.toString() == 'User canceled.') return;
      this.service.presentAlert(e.toString(), 'Sorry..!, this device is not supported..!');
      AppUtils.errorLog(e);
    }
  }

}
