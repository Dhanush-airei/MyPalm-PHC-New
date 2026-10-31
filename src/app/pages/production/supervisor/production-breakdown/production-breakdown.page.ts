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
  selector: 'app-production-breakdown',
  templateUrl: './production-breakdown.page.html',
  styleUrls: ['./production-breakdown.page.scss'],
  standalone: false,
})
export class ProductionBreakdownPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  // --------------------------------------------------
  // Form
  // --------------------------------------------------

  ffbcageForm: any;

  // --------------------------------------------------
  // Page Variables
  // --------------------------------------------------

  gettitle = '';
  message = '';

  placeholder = '';

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

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------

  ngOnInit(): void {}

  // --------------------------------------------------
  // Initialization
  // --------------------------------------------------

  private initializeModalData(): void {
    this.gettitle = this.navParams.get('title') ?? '';

    this.message = this.navParams.get('millstatus') ?? '';

    this.placeholder = this.navParams.get('placeholder') ?? '';
  }

  private initializeForm(): void {
    this.ffbcageForm = this.fb.group({
      reason: [''],
    });
  }

  // --------------------------------------------------
  // Save
  // --------------------------------------------------

  save(): void {
    const formValue = this.ffbcageForm.getRawValue();

    if (!formValue.reason?.toString().trim()) {
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
      departmentid: this.UserContext.departmentId,
      designationid: this.UserContext.designId,
      millcode: this.UserContext.millCode,
      remarks: formValue.reason,
      balanceCrop: '',
      language: this.LanguageService.getLanguage,
    };

    console.log(request);

    // ----------------------------------------------
    // API Call
    // ----------------------------------------------

    this.MaintenanceService.saveBreakDownStatus(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          console.log('Save breakdown Response:', response);

          if (response?.httpcode == 200) {
            this.modalController.dismiss({
              dismissed: true,
              item: 'Saved',
            });
          } else {
            this.cancel();
          }
        },

        error: (error) => {
          console.error('Save breakdown Error:', error);

          this.cancel();
        },
      });
  }

  // --------------------------------------------------
  // Cancel
  // --------------------------------------------------

  cancel(): void {
    this.modalController.dismiss({
      dismissed: true,
      item: '',
    });
  }
}
