import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  inject,
  DestroyRef,
  NgZone,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, Platform } from '@ionic/angular';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { LabService } from 'src/app/shared/services/production-services/lab-service/lab-service';
import { SterilizerService } from 'src/app/shared/services/production-services/sterilizer-service/sterilizer-service';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-lab-dashboard',
  templateUrl: './lab-dashboard.page.html',
  styleUrls: ['./lab-dashboard.page.scss'],
  standalone: false,
})
export class LabDashboardPage implements OnInit {
  private destroyRef = inject(DestroyRef);
  private zone = inject(NgZone);

  @ViewChild('myElementRef', { static: false }) myElementRef!: ElementRef;

  @ViewChild('pageHeader')
  pageHeader!: PageHeaderComponent;

  // Header Configuration
  appTitle: string = this.nl2br(this.userContext.millName || '');
  headerActions: string = '2';
  showLogo: number = 1;
  showBackButton: number = 0;

  // Count
  notificationCount: number = 0;
  notificationCountLength: number = 0;
  pendingCount: number = 0;
  pendingCountLength: number = 0;

  // User Data
  userId: number = 0;
  millCode: string = '';
  departmentId: number = 0;
  designationId: number = 0;
  language: string = '';
  userName: string = '';

  // Form
  labForm: FormGroup;
  currentDate: string = '';
  currentTime: string = '';
  formattedDate: string = '';
  formattedTime: string = '';

  // Modal Flags
  isDateModalOpen: boolean = false;
  isTimeModalOpen: boolean = false;

  // Temp values for modals
  tempDate: string = '';
  tempTime: string = '';

  // UI Flags
  isDisabled: boolean = false;
  showNoRecords: boolean = false;
  platformType: string = '';

  constructor(
    private translate: TranslateService,
    private userContext: UserContext,
    private languageService: LanguageService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private labService: LabService,
    private sterilizerService: SterilizerService,
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private platform: Platform,
  ) {
    // Initialize user data from UserContext
    this.userId = this.userContext.userId || 0;
    this.millCode = this.userContext.millCode || '';
    this.departmentId = this.userContext.departmentId || 0;
    this.designationId = this.userContext.designId || 0;
    this.language = this.languageService.getLanguage || 'English';

    // Set platform
    this.platformType = this.platform.is('android') ? 'android' : 'ios';

    // Set current date and time
    this.currentDate = this.getCurrentDate();
    this.currentTime = this.getCurrentTime();
    this.formattedDate = this.formatDateForDisplay(this.currentDate);
    this.formattedTime = this.currentTime;

    // Initialize form
    this.labForm = this.fb.group({
      txt_date: new FormControl(this.formattedDate),
      txt_fromtime: new FormControl(this.formattedTime),
      txt_gutter: new FormControl('', [Validators.required]),
      txt_vertical: new FormControl('', [Validators.required]),
    });

    // Subscribe to route params to refresh data
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        this.getMaintenancePendingCount();
      });
  }

  ngOnInit(): void {}

  ionViewDidEnter(): void {
    this.pageHeader?.getNotificationApi();
    // this.getMaintenancePendingCount();
    this.resetForm();
  }

  /**
   * Get current date in YYYY-MM-DD format
   */
  private getCurrentDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Get current time in HH:mm format
   */
  private getCurrentTime(): string {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * Format date for display (DD-MM-YYYY)
   */
  private formatDateForDisplay(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  /**
   * Parse date from display format (DD-MM-YYYY) to ISO (YYYY-MM-DD)
   */
  private parseDateFromDisplay(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  /**
   * Open Date Picker Modal
   */
  openDatePicker(): void {
    this.tempDate = this.currentDate;
    this.isDateModalOpen = true;
  }

  /**
   * Date changed in modal
   */
  onDateChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (!value) {
      return;
    }
    this.tempDate = String(value).substring(0, 10);
  }

  /**
   * Date modal dismissed
   */
  onDateDismiss(): void {
    if (this.tempDate) {
      this.currentDate = this.tempDate;
      this.formattedDate = this.formatDateForDisplay(this.currentDate);
      this.labForm.patchValue({
        txt_date: this.formattedDate,
      });
    }
    this.isDateModalOpen = false;
  }

  /**
   * Open Time Picker Modal
   */
  openTimePicker(): void {
    this.tempTime = this.currentTime;
    this.isTimeModalOpen = true;
  }

  /**
   * Time changed in modal
   */
  onTimeChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (!value) {
      return;
    }
    this.tempTime = String(value).substring(0, 5);
  }

  /**
   * Time modal dismissed
   */
  onTimeDismiss(): void {
    if (this.tempTime) {
      this.currentTime = this.tempTime;
      this.formattedTime = this.currentTime;
      this.labForm.patchValue({
        txt_fromtime: this.formattedTime,
      });
    }
    this.isTimeModalOpen = false;
  }

  /**
   * Get Maintenance Pending Count
   */
  getMaintenancePendingCount(): void {
    const req = {
      userid: this.userId,
      departmentid: this.departmentId,
      design_id: this.designationId,
      millcode: this.millCode,
      language: this.language,
    };

    console.log('Maintenance Pending Count Request:', req);

    this.sterilizerService
      .getmaintenancependingcount(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          this.zone.run(() => {
            if (result.httpcode == 200) {
              this.pendingCount = result.count || 0;
              this.pendingCountLength = this.pendingCount.toString().length;
              this.notificationCount = this.pendingCount;
            } else {
              this.pendingCount = 0;
              this.pendingCountLength = 0;
              this.notificationCount = 0;
            }
          });
        },
        error: (err) => {
          this.zone.run(() => {
            console.error('Failed to get pending count:', err);
            this.pendingCount = 0;
            this.pendingCountLength = 0;
            this.notificationCount = 0;
          });
        },
      });
  }

  /**
   * Navigate to Notification Page
   */
  btnNotification(): void {
    localStorage.setItem('badge_count', '0');
    this.router.navigate(['/segregatenotification']);
  }

  /**
   * Reset Form
   */
  resetForm(): void {
    this.currentDate = this.getCurrentDate();
    this.currentTime = this.getCurrentTime();
    this.formattedDate = this.formatDateForDisplay(this.currentDate);
    this.formattedTime = this.currentTime;

    this.labForm.patchValue({
      txt_date: this.formattedDate,
      txt_fromtime: this.formattedTime,
      txt_gutter: '',
      txt_vertical: '',
    });
    this.isDisabled = false;
  }

  /**
   * Show Alert Before Saving
   */
  async showAlert(): Promise<void> {
    if (this.labForm.invalid) {
      this.toastService.error(
        this.translate.instant('GENERALBUTTON.pleasefilltheform'),
      );
      return;
    }

    const gutterValue = parseFloat(this.labForm.value.txt_gutter);
    const verticalValue = parseFloat(this.labForm.value.txt_vertical);

    if (gutterValue > 100 || verticalValue > 100) {
      this.toastService.error(
        this.translate.instant('GRADINGHOME.percentagevalidation'),
      );
      return;
    }

    const alert = await this.alertController.create({
      mode: 'md',
      header: '',
      cssClass: 'customalertmessagetwobuttons',
      message: this.translate.instant('OILLOSSESSREPORT.savealert'),
      buttons: [
        {
          text: '',
          role: 'cancel',
          handler: () => {
            // Cancel
          },
        },
        {
          text: '',
          handler: () => {
            this.saveData();
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Save Lab Data
   */
  saveData(): void {
    this.isDisabled = true;

    // Parse date from DD-MM-YYYY to YYYY-MM-DD for API
    const dateValue = this.parseDateFromDisplay(this.labForm.value.txt_date);
    const timeValue = this.labForm.value.txt_fromtime;

    const req = {
      userid: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      id: 0,
      date: dateValue,
      time: timeValue,
      gutter_ffa: this.labForm.value.txt_gutter,
      vertical_clarifier_ffa: this.labForm.value.txt_vertical,
      pure_oil_tank_ffa: 0,
      language: this.language,
    };

    console.log('Save Lab Data Request:', req);

    this.labService
      .saveLabOilLosses(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          this.zone.run(() => {
            this.isDisabled = false;

            if (result.httpcode == 200) {
              this.toastService.success(
                this.translate.instant('OILLOSSESSREPORT.insertedsuccessfully'),
              );
              this.resetForm();
            } else {
              this.toastService.error(
                this.translate.instant('OILLOSSESSREPORT.insertedfailed'),
              );
            }
          });
        },
        error: (err) => {
          this.zone.run(() => {
            this.isDisabled = false;
            console.error('Failed to save lab data:', err);
            this.toastService.error(
              this.translate.instant('OILLOSSESSREPORT.insertedfailed'),
            );
          });
        },
      });
  }

  /**
   * Decimal Filter for Input
   */
  decimalFilter(event: KeyboardEvent): void {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    const input = (event.target as HTMLInputElement).value + event.key;
    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  /**
   * Convert newlines to <br> tags
   */
  private nl2br(text: string): string {
    if (!text) return '';
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
