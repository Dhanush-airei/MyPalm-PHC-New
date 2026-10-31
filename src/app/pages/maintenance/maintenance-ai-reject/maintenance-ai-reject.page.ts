import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';

import { NavParams } from '@ionic/angular';
@Component({
  selector: 'app-maintenance-ai-reject',
  templateUrl: './maintenance-ai-reject.page.html',
  styleUrls: ['./maintenance-ai-reject.page.scss'],
  standalone: false,
})
export class MaintenanceAiRejectPage implements OnInit {
  private destroyRef = inject(DestroyRef);
  gettitle = '';
  alertMessage = '';
  myForm: any;
  getItem: any;
  constructor(
    private translate: TranslateService,
    private modalController: ModalController,
    private fb: FormBuilder,
    private navParams: NavParams,
    private UserContext: UserContext,
    private MaintenanceService: MaintenanceService,
    private LanguageService: LanguageService,
    private ToastService: ToastService,
  ) {
    this.initializeModalData();
    this.initializeForm();
  }

  ngOnInit() {}

  private initializeModalData(): void {
    this.gettitle = this.navParams.get('title') ?? '';

    this.alertMessage = this.navParams.get('alertmessage') ?? '';

    this.getItem = this.navParams.get('item') ?? '';
  }

  private initializeForm(): void {
    this.myForm = this.fb.group({
      remarks: [''],
    });
  }

  cancel() {
    this.modalController.dismiss({
      dismissed: true,
      item: '',
    });
  }
  save() {
    const formValue = this.myForm.getRawValue();

    if (!formValue.remarks?.toString().trim()) {
      this.ToastService.warning(
        this.translate.instant('SUPERVISORDASHBOARD.reasonmandatory'),
      );

      return;
    }

    // ----------------------------------------------
    // Request
    // ----------------------------------------------

    const request = {
      user_id: this.UserContext.userId,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      millcode: this.UserContext.millCode,
      language: this.LanguageService.getLanguage,
      id: this.getItem.ai_id,
      reject_reason: formValue.reason,
    };

    // ----------------------------------------------
    // API Call
    // ----------------------------------------------
    return;
    this.MaintenanceService.rejectAi(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          console.log('Response:', response);

          if (response?.httpcode == 200) {
            this.modalController.dismiss({
              dismissed: true,
              item: 'Saved',
            });
          } else {
            this.cancel();
          }
        },

        error: (error: any) => {
          console.error('Error:', error);

          this.cancel();
        },
      });
  }
}
