/* preventive-maintenance.page.ts */
import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';
import { ScreenOrientation } from 'src/app/shared/services/screen-orientation-service/screen-orientation';
import { PopupNotificationViewPage } from 'src/app/pages/maintenance/reports/popup-notification-view/popup-notification-view.page';

@Component({
  selector: 'app-preventive-maintenance',
  templateUrl: './preventive-maintenance.page.html',
  styleUrls: ['./preventive-maintenance.page.scss'],
  standalone: false,
})
export class PreventiveMaintenancePage implements OnInit {
  private destroyRef = inject(DestroyRef);

  // Header Configuration
  appTitle: string = this.translate.instant('PREVENTIVEMAINTENANCE.title');
  showLogo: number = 0;
  showBackButton: number = 1;
  headerActions: string = '';

  // Forms
  routineForm: FormGroup;
  replacementForm: FormGroup;

  // User Data
  userId: number = 0;
  millCode: string = '';
  departmentId: number = 0;
  designationId: number = 0;

  // Tab
  tabsSegment: string = 'Routine';

  // Incharge
  inchargePersonArr: any[] = [];
  inchargeOption: any = {
    header: 'Incharge',
    cssClass: 'multiselect',
  };

  // Routine Dates
  routineFromDate: string = '';
  routineToDate: string = '';

  // Routine Date Modals
  isRoutineFromDateModalOpen: boolean = false;
  isRoutineToDateModalOpen: boolean = false;
  tempRoutineFromDate: string = '';
  tempRoutineToDate: string = '';
  private originalRoutineFromDate: string = '';
  private originalRoutineToDate: string = '';

  // Replacement Dates
  replacementFromDate: string = '';
  replacementToDate: string = '';

  // Replacement Date Modals
  isReplacementFromDateModalOpen: boolean = false;
  isReplacementToDateModalOpen: boolean = false;
  tempReplacementFromDate: string = '';
  tempReplacementToDate: string = '';
  private originalReplacementFromDate: string = '';
  private originalReplacementToDate: string = '';

  // Notification Lists
  routineNotificationListArr: any[] = [];
  replacementNotificationListArr: any[] = [];

  // Flags
  routineNoRecordFlag: boolean = false;
  routinePleaseWaitFlag: boolean = false;
  replacementNoRecordFlag: boolean = false;
  replacementPleaseWaitFlag: boolean = false;

  maxDate: string = '';

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private userContext: UserContext,
    private languageService: LanguageService,
    private maintenanceService: MaintenanceService,
    private modalController: ModalController,
    private screenOrientation: ScreenOrientation,
  ) {
    // Initialize user data from UserContext
    this.userId = this.userContext.userId || 0;
    this.millCode = this.userContext.millCode || '';
    this.departmentId = this.userContext.departmentId || 0;
    this.designationId = this.userContext.designId || 0;

    // Set max date
    this.maxDate = this.getTodayISO();

    // Initialize forms
    this.routineForm = this.fb.group({
      routine_from_date: new FormControl(''),
      routine_to_date: new FormControl(''),
      routine_select_incharge_person: new FormControl(''),
    });

    this.replacementForm = this.fb.group({
      replacement_from_date: new FormControl(''),
      replacement_to_date: new FormControl(''),
      replacement_select_incharge_person: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  async ionViewDidEnter() {
    await this.screenOrientation.landscape();
    this.getIncharge('Routine');
    this.getRoutineNotification();
  }
  async ionViewWillLeave() {
    await this.screenOrientation.portrait();
  }

  /**
   * Segment Changed
   */
  segmentChanged(event: any): void {
    const value = event.detail.value;
    this.tabsSegment = value;

    if (value == 'Routine') {
      this.getIncharge('Routine');
      this.getRoutineNotification();
    } else {
      this.getIncharge('Replacement');
      this.getReplacementNotification();
    }
  }

  /**
   * Get Incharge Person List based on type
   */
  getIncharge(type: string): void {
    let notificationType = 0;
    if (type == 'Routine') {
      notificationType = 2;
    } else {
      notificationType = 3;
    }

    const req = {
      user_id: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      desig_id: this.designationId,
      language: this.languageService.getLanguage,
      notification_type: notificationType,
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
   * Routine Incharge Change
   */
  routineInchargeChange(event: any): void {
    const value = event.detail.value;
    console.log('Routine Incharge selected:', value);
    this.routineForm.patchValue({
      routine_select_incharge_person: value,
    });
  }

  /**
   * Replacement Incharge Change
   */
  replacementInchargeChange(event: any): void {
    const value = event.detail.value;
    console.log('Replacement Incharge selected:', value);
    this.replacementForm.patchValue({
      replacement_select_incharge_person: value,
    });
  }

  // ============================================================
  // ROUTINE DATE PICKERS
  // ============================================================

  /**
   * Open Routine From Date Modal
   */
  openRoutineFromDateTimePicker(): void {
    this.originalRoutineFromDate = this.routineFromDate || '';
    this.tempRoutineFromDate =
      this.formatDateForDatetime(this.originalRoutineFromDate) ||
      this.getTodayISO();
    this.isRoutineFromDateModalOpen = true;
  }

  /**
   * Open Routine To Date Modal
   */
  openRoutineToDateTimePicker(): void {
    this.originalRoutineToDate = this.routineToDate || '';
    this.tempRoutineToDate =
      this.formatDateForDatetime(this.originalRoutineToDate) ||
      this.getTodayISO();
    this.isRoutineToDateModalOpen = true;
  }

  /**
   * Routine From Date Changed
   */
  onRoutineFromDateChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (!value) return;
    this.tempRoutineFromDate = String(value).substring(0, 10);
  }

  /**
   * Routine To Date Changed
   */
  onRoutineToDateChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (!value) return;
    this.tempRoutineToDate = String(value).substring(0, 10);
  }

  /**
   * Routine From Date Dismissed
   */
  onRoutineFromDateDismiss(): void {
    if (
      this.tempRoutineFromDate &&
      this.tempRoutineFromDate !==
        this.formatDateForDatetime(this.originalRoutineFromDate)
    ) {
      this.routineFromDate = this.formatDateFromISO(this.tempRoutineFromDate);
      this.routineForm.patchValue({ routine_from_date: this.routineFromDate });
    } else {
      this.routineFromDate = this.originalRoutineFromDate;
      this.routineForm.patchValue({ routine_from_date: this.routineFromDate });
    }
    this.isRoutineFromDateModalOpen = false;
  }

  /**
   * Routine To Date Dismissed
   */
  onRoutineToDateDismiss(): void {
    if (
      this.tempRoutineToDate &&
      this.tempRoutineToDate !==
        this.formatDateForDatetime(this.originalRoutineToDate)
    ) {
      this.routineToDate = this.formatDateFromISO(this.tempRoutineToDate);
      this.routineForm.patchValue({ routine_to_date: this.routineToDate });
    } else {
      this.routineToDate = this.originalRoutineToDate;
      this.routineForm.patchValue({ routine_to_date: this.routineToDate });
    }
    this.isRoutineToDateModalOpen = false;
  }

  // ============================================================
  // REPLACEMENT DATE PICKERS
  // ============================================================

  /**
   * Open Replacement From Date Modal
   */
  openReplacementFromDateTimePicker(): void {
    this.originalReplacementFromDate = this.replacementFromDate || '';
    this.tempReplacementFromDate =
      this.formatDateForDatetime(this.originalReplacementFromDate) ||
      this.getTodayISO();
    this.isReplacementFromDateModalOpen = true;
  }

  /**
   * Open Replacement To Date Modal
   */
  openReplacementToDateTimePicker(): void {
    this.originalReplacementToDate = this.replacementToDate || '';
    this.tempReplacementToDate =
      this.formatDateForDatetime(this.originalReplacementToDate) ||
      this.getTodayISO();
    this.isReplacementToDateModalOpen = true;
  }

  /**
   * Replacement From Date Changed
   */
  onReplacementFromDateChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (!value) return;
    this.tempReplacementFromDate = String(value).substring(0, 10);
  }

  /**
   * Replacement To Date Changed
   */
  onReplacementToDateChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (!value) return;
    this.tempReplacementToDate = String(value).substring(0, 10);
  }

  /**
   * Replacement From Date Dismissed
   */
  onReplacementFromDateDismiss(): void {
    if (
      this.tempReplacementFromDate &&
      this.tempReplacementFromDate !==
        this.formatDateForDatetime(this.originalReplacementFromDate)
    ) {
      this.replacementFromDate = this.formatDateFromISO(
        this.tempReplacementFromDate,
      );
      this.replacementForm.patchValue({
        replacement_from_date: this.replacementFromDate,
      });
    } else {
      this.replacementFromDate = this.originalReplacementFromDate;
      this.replacementForm.patchValue({
        replacement_from_date: this.replacementFromDate,
      });
    }
    this.isReplacementFromDateModalOpen = false;
  }

  /**
   * Replacement To Date Dismissed
   */
  onReplacementToDateDismiss(): void {
    if (
      this.tempReplacementToDate &&
      this.tempReplacementToDate !==
        this.formatDateForDatetime(this.originalReplacementToDate)
    ) {
      this.replacementToDate = this.formatDateFromISO(
        this.tempReplacementToDate,
      );
      this.replacementForm.patchValue({
        replacement_to_date: this.replacementToDate,
      });
    } else {
      this.replacementToDate = this.originalReplacementToDate;
      this.replacementForm.patchValue({
        replacement_to_date: this.replacementToDate,
      });
    }
    this.isReplacementToDateModalOpen = false;
  }

  // ============================================================
  // API CALLS
  // ============================================================

  /**
   * Get Routine Notification List
   */
  getRoutineNotification(): void {
    let getfromdate = '';
    let gettodate = '';

    if (this.routineFromDate != '' || this.routineToDate != '') {
      getfromdate = this.formatDateForAPI(this.routineFromDate);
      gettodate = this.formatDateForAPI(this.routineToDate);
    }

    this.routineNotificationListArr = [];
    this.routineNoRecordFlag = false;
    this.routinePleaseWaitFlag = true;

    const req = {
      user_id: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      Fromdate: getfromdate,
      Todate: gettodate,
      type: 2,
      incharge_id: this.routineForm.value.routine_select_incharge_person || '',
      language: this.languageService.getLanguage,
    };

    console.log('getRoutineNotification Request:', req);

    this.maintenanceService
      .getNotificationListReport(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.routinePleaseWaitFlag = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          console.log('getRoutineNotification Response:', response);

          // Prefill dates from API response if empty
          if (
            (this.routineFromDate == '' || this.routineToDate == '') &&
            response?.Fromdate &&
            response?.Todate
          ) {
            this.routineFromDate = this.formatDateFromString(response.Fromdate);
            this.routineToDate = this.formatDateFromString(response.Todate);
            this.routineForm.patchValue({
              routine_from_date: this.routineFromDate,
              routine_to_date: this.routineToDate,
            });
          }

          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.routineNotificationListArr = response.data || [];
            this.routineNoRecordFlag = false;
          } else {
            this.routineNotificationListArr = [];
            this.routineNoRecordFlag = true;
          }
        },
        error: (error) => {
          console.error('Error fetching routine notifications:', error);
          this.routineNotificationListArr = [];
          this.routineNoRecordFlag = true;
        },
      });
  }

  /**
   * Get Replacement Notification List
   */
  getReplacementNotification(): void {
    let getfromdate = '';
    let gettodate = '';

    if (this.replacementFromDate != '' || this.replacementToDate != '') {
      getfromdate = this.formatDateForAPI(this.replacementFromDate);
      gettodate = this.formatDateForAPI(this.replacementToDate);
    }

    this.replacementNotificationListArr = [];
    this.replacementNoRecordFlag = false;
    this.replacementPleaseWaitFlag = true;

    const req = {
      user_id: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      Fromdate: getfromdate,
      Todate: gettodate,
      type: 3,
      incharge_id:
        this.replacementForm.value.replacement_select_incharge_person || '',
      language: this.languageService.getLanguage,
    };

    console.log('getReplacementNotification Request:', req);

    this.maintenanceService
      .getNotificationListReport(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.replacementPleaseWaitFlag = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          console.log('getReplacementNotification Response:', response);

          // Prefill dates from API response if empty
          if (
            (this.replacementFromDate == '' || this.replacementToDate == '') &&
            response?.Fromdate &&
            response?.Todate
          ) {
            this.replacementFromDate = this.formatDateFromString(
              response.Fromdate,
            );
            this.replacementToDate = this.formatDateFromString(response.Todate);
            this.replacementForm.patchValue({
              replacement_from_date: this.replacementFromDate,
              replacement_to_date: this.replacementToDate,
            });
          }

          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.replacementNotificationListArr = response.data || [];
            this.replacementNoRecordFlag = false;
          } else {
            this.replacementNotificationListArr = [];
            this.replacementNoRecordFlag = true;
          }
        },
        error: (error) => {
          console.error('Error fetching replacement notifications:', error);
          this.replacementNotificationListArr = [];
          this.replacementNoRecordFlag = true;
        },
      });
  }

  // ============================================================
  // UTILITY METHODS
  // ============================================================

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
  async callModalController(value: any, type: string): Promise<void> {
    let module = '';
    if (type == 'Routine') {
      module = 'RoPMVIEW';
    } else {
      module = 'RePMVIEW';
    }

    const modal = await this.modalController.create({
      component: PopupNotificationViewPage,
      componentProps: {
        item: JSON.stringify(value),
        module: module,
        screen: 'Preventive',
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
