import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { IonicModule, ModalController, Platform } from '@ionic/angular';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';

@Component({
  selector: 'app-summary-popup-modal',
  templateUrl: './summary-popup-modal.page.html',
  styleUrls: ['./summary-popup-modal.page.scss'],
  standalone: false,
})
export class SummaryPopupModalPage implements OnInit {
  private destroyRef = inject(DestroyRef);
  // Existing properties
  summaryArr: any[] = [];
  title = '';
  buttonname = '';
  getplatform = '';
  getlanguage = '';
  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    private modalController: ModalController,
    private platform: Platform,
    private UserContext: UserContext,
    private MaintenanceService: MaintenanceService,
    private ToastService: ToastService,
  ) {
    if (this.platform.is('android')) {
      this.getplatform = 'android';
    } else if (this.platform.is('ios')) {
      this.getplatform = 'ios';
    }
  }

  ngOnInit(): void {
    this.getlanguage = this.languageService.getLanguage;
    this.getSummary();
  }

  getSummary(): void {
    const req = {
      userid: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      desig_id: this.UserContext.designId,
      departmentid: this.UserContext.departmentId,
      language: this.languageService.getLanguage,
    };

    console.log('Summary Request:', req);

    this.MaintenanceService.getsummarypopup(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          console.log('Summary Response:', response);

          if (response?.httpcode == 200) {
            this.summaryArr = response?.data ?? [];

            if (this.summaryArr.length > 0) {
              this.title = this.summaryArr[0]?.title ?? '';
              this.buttonname =
                this.summaryArr[0]?.buttonname ??
                this.translate.instant('SUMMARYPOPUP.acknowledge');
            } else {
              this.title = '';
              this.buttonname = this.translate.instant(
                'SUMMARYPOPUP.acknowledge',
              );
            }

            return;
          }

          this.summaryArr = [];
          this.title = '';
          this.buttonname = this.translate.instant('SUMMARYPOPUP.acknowledge');
        },

        error: (error) => {
          console.error('Get Summary Error:', error);

          this.summaryArr = [];
          this.title = '';
          this.buttonname = this.translate.instant('SUMMARYPOPUP.acknowledge');
        },
      });
  }

  acknowledge(): void {
    const req = {
      userid: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      language: this.languageService.getLanguage,
    };

    console.log('Acknowledge Request:', req);

    this.MaintenanceService.updatesummarypopup(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          console.log('Acknowledge Response:', response);

          if (response?.httpcode == 200) {
            this.btn_close();
            return;
          }

          this.ToastService.error(
            this.translate.instant('SUMMARYPOPUP.acknowledgementfailed'),
          );
        },

        error: (error) => {
          console.error('Acknowledge Error:', error);

          this.ToastService.error(
            this.translate.instant('SUMMARYPOPUP.acknowledgementfailed'),
          );
        },
      });
  }

  btn_close(): void {
    this.modalController.dismiss({
      dismissed: true,
      item: '',
    });
  }
}
