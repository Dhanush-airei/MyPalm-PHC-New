/* corrective-maintenance.page.ts */
import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';

import { PopupNotificationViewPage } from 'src/app/pages/maintenance/reports/popup-notification-view/popup-notification-view.page';

@Component({
  selector: 'app-corrective-maintenance',
  templateUrl: './corrective-maintenance.page.html',
  styleUrls: ['./corrective-maintenance.page.scss'],
  standalone: false,
})
export class CorrectiveMaintenancePage implements OnInit {
  private destroyRef = inject(DestroyRef);

  // Header Configuration
  appTitle: string = this.translate.instant(
    'REPORTCORRECTIVEMAINTENANCE.title',
  );
  showLogo: number = 0;
  showBackButton: number = 1;
  headerActions: string = '';

  // Form
  correctiveForm: FormGroup;

  // User Data
  userId: number = 0;
  millCode: string = '';
  departmentId: number = 0;
  designationId: number = 0;

  // Dates
  fromDate: string = '';
  toDate: string = '';
  currentDate: string = '';

  // Date Modal
  isFromDateModalOpen: boolean = false;
  isToDateModalOpen: boolean = false;
  tempFromDate: string = '';
  tempToDate: string = '';
  maxDate: string = '';

  // Store original values for cancel
  private originalFromDate: string = '';
  private originalToDate: string = '';

  // Incharge
  inchargePersonArr: any[] = [];
  inchargeOption: any = {
    header: 'Incharge',
    cssClass: 'multiselect',
  };

  // Notification List
  notificationlistArr: any[] = [];

  // Flags
  enableFlag: boolean = false;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private userContext: UserContext,
    private languageService: LanguageService,
    private maintenanceService: MaintenanceService,
    private modalController: ModalController,
  ) {
    // Initialize user data from UserContext
    this.userId = this.userContext.userId || 0;
    this.millCode = this.userContext.millCode || '';
    this.departmentId = this.userContext.departmentId || 0;
    this.designationId = this.userContext.designId || 0;

    // Set current date
    const today = new Date();
    this.currentDate = this.formatDate(today);
    this.maxDate = this.getTodayISO();

    // Initialize form
    this.correctiveForm = this.fb.group({
      from_date: new FormControl(''),
      to_date: new FormControl(''),
      select_incharge_person: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  ionViewDidEnter(): void {
    this.getIncharge();
    this.getNotification();
  }

  /**
   * Open From Date Modal
   */
  openFromDateTimePicker(): void {
    this.originalFromDate = this.fromDate || '';
    // Convert to YYYY-MM-DD for ion-datetime
    this.tempFromDate =
      this.formatDateForDatetime(this.originalFromDate) || this.getTodayISO();
    this.isFromDateModalOpen = true;
  }

  /**
   * Open To Date Modal
   */
  openToDateTimePicker(): void {
    this.originalToDate = this.toDate || '';
    // Convert to YYYY-MM-DD for ion-datetime
    this.tempToDate =
      this.formatDateForDatetime(this.originalToDate) || this.getTodayISO();
    this.isToDateModalOpen = true;
  }

  /**
   * From Date Changed
   */
  onFromDateChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (!value) return;
    this.tempFromDate = String(value).substring(0, 10);
  }

  /**
   * To Date Changed
   */
  onToDateChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (!value) return;
    this.tempToDate = String(value).substring(0, 10);
  }

  /**
   * From Date Dismissed
   */
  onFromDateDismiss(): void {
    if (
      this.tempFromDate &&
      this.tempFromDate !== this.formatDateForDatetime(this.originalFromDate)
    ) {
      this.fromDate = this.formatDateFromISO(this.tempFromDate);
      this.correctiveForm.patchValue({ from_date: this.fromDate });
    } else {
      // Revert to original on cancel
      this.fromDate = this.originalFromDate;
      this.correctiveForm.patchValue({ from_date: this.fromDate });
    }
    this.isFromDateModalOpen = false;
  }

  /**
   * To Date Dismissed
   */
  onToDateDismiss(): void {
    if (
      this.tempToDate &&
      this.tempToDate !== this.formatDateForDatetime(this.originalToDate)
    ) {
      this.toDate = this.formatDateFromISO(this.tempToDate);
      this.correctiveForm.patchValue({ to_date: this.toDate });
    } else {
      // Revert to original on cancel
      this.toDate = this.originalToDate;
      this.correctiveForm.patchValue({ to_date: this.toDate });
    }
    this.isToDateModalOpen = false;
  }

  /**
   * Get Incharge Person List
   */
  getIncharge(): void {
    const req = {
      user_id: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      desig_id: this.designationId,
      language: this.languageService.getLanguage,
      notification_type: 1,
    };

    console.log('getIncharge Request:', req);

    this.maintenanceService
      .getInchargePerson(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          console.log('getIncharge Response:', response);
          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.inchargePersonArr = response.data || [];
          } else {
            this.inchargePersonArr = [];
          }
        },
        error: (error) => {
          console.error('Error fetching incharge persons:', error);
          this.inchargePersonArr = [];
        },
      });
  }

  /**
   * Handle Incharge Selection Change
   */
  inchargeChange(event: any): void {
    const value = event.detail.value;
    console.log('Incharge selected:', value);
    this.correctiveForm.patchValue({
      select_incharge_person: value,
    });
  }

  /**
   * Get Notification List
   */
  getNotification(): void {
    let getfromdate = '';
    let gettodate = '';

    if (this.fromDate != '' || this.toDate != '') {
      getfromdate = this.formatDateForAPI(this.fromDate);
      gettodate = this.formatDateForAPI(this.toDate);
    }

    const req = {
      user_id: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      Fromdate: getfromdate,
      Todate: gettodate,
      type: 1,
      incharge_id: this.correctiveForm.value.select_incharge_person || '',
      language: this.languageService.getLanguage,
    };

    console.log('getNotification Request:', req);

    this.maintenanceService
      .getNotificationListReport(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          // Any cleanup if needed
        }),
      )
      .subscribe({
        next: (response: any) => {
          console.log('getNotification Response:', response);

          // Prefill dates from API response if empty
          if (
            (this.fromDate == '' || this.toDate == '') &&
            response?.Fromdate &&
            response?.Todate
          ) {
            this.fromDate = this.formatDateFromString(response.Fromdate);
            this.toDate = this.formatDateFromString(response.Todate);
            this.correctiveForm.patchValue({
              from_date: this.fromDate,
              to_date: this.toDate,
            });
          }

          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.notificationlistArr = response.data || [];
            this.enableFlag = false;
          } else {
            this.notificationlistArr = [];
            this.enableFlag = true;
          }
        },
        error: (error) => {
          console.error('Error fetching notifications:', error);
          this.notificationlistArr = [];
          this.enableFlag = true;
        },
      });
  }

  /**
   * Get Status Text Color based on statusId
   */
  getStatusTextColor(statusId: string): string {
    const status = String(statusId);
    const colorMap: { [key: string]: string } = {
      '1': '#cb4335',
      '2': '#ff9f0c',
      '3': '#ff9f0c',
      '4': '#9b59b6',
      '5': '#f39c12',
      '6': '#007bb3',
      '7': '#008000',
      '8': '#616161',
      '9': '#e74c3c',
      '10': '#01b800',
      '12': '#f36311',
      '13': '#36454f',
    };
    return colorMap[status] || '';
  }

  /**
   * Open Modal for Notification View
   */
  async callModalController(value: any): Promise<void> {
    const modal = await this.modalController.create({
      component: PopupNotificationViewPage,
      componentProps: {
        item: JSON.stringify(value),
        module: 'CM',
        screen: 'Corrective',
      },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: ['acknowledgement-modal'],
    });
    await modal.present();
  }

  /**
   * Format date to DD-MM-YYYY
   */
  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  /**
   * Format date from YYYY-MM-DD to DD-MM-YYYY
   */
  private formatDateFromString(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  /**
   * Format date from DD-MM-YYYY to YYYY-MM-DD for API
   */
  private formatDateForAPI(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  /**
   * Format date from DD-MM-YYYY to YYYY-MM-DD for ion-datetime
   */
  private formatDateForDatetime(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  /**
   * Format date from YYYY-MM-DD to DD-MM-YYYY
   */
  private formatDateFromISO(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  /**
   * Get today's date in YYYY-MM-DD format
   */
  private getTodayISO(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Convert newlines to <br> tags
   */
  private nl2br(text: string): string {
    if (!text) return '';
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
