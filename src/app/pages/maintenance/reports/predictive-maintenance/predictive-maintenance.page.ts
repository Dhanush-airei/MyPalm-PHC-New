/* predictive-maintenance.page.ts */
import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';
import { PopupNotificationViewPage } from 'src/app/pages/maintenance/reports/popup-notification-view/popup-notification-view.page';

@Component({
  selector: 'app-predictive-maintenance',
  templateUrl: './predictive-maintenance.page.html',
  styleUrls: ['./predictive-maintenance.page.scss'],
  standalone: false,
})
export class PredictiveMaintenancePage implements OnInit {
  private destroyRef = inject(DestroyRef);

  // Header Configuration
  appTitle: string = this.translate.instant(
    'QRCODESCANNER.predictivemaintenance',
  );
  showLogo: number = 0;
  showBackButton: number = 1;
  headerActions: string = '';

  // User Data
  userId: number = 0;
  millCode: string = '';
  departmentId: number = 0;
  designationId: number = 0;

  // Month Date
  reportDateDisplay: string = ''; // MM-YYYY format for display
  reportDateExternal: string = ''; // YYYY-MM format from API
  private reportDateForAPI: string = ''; // YYYY-MM format for API

  // Notification List
  notificationListArr: any[] = [];

  // Flags
  noRecordsFlag: boolean = false;
  pleaseWaitFlag: boolean = false;

  constructor(
    private translate: TranslateService,
    private userContext: UserContext,
    private languageService: LanguageService,
    private maintenanceService: MaintenanceService,
    private modalController: ModalController,
    private router: Router,
  ) {
    // Initialize user data from UserContext
    this.userId = this.userContext.userId || 0;
    this.millCode = this.userContext.millCode || '';
    this.departmentId = this.userContext.departmentId || 0;
    this.designationId = this.userContext.designId || 0;
  }

  ngOnInit(): void {}

  ionViewDidEnter(): void {
    this.getNotification();
  }

  /**
   * Handle month selected from month picker
   */
  onMonthSelected(event: { month: string }): void {
    console.log('Month selected:', event);
    // Month is in YYYY-MM format from the month picker
    this.reportDateForAPI = event.month;
    // Store in MM-YYYY format for display
    this.reportDateDisplay = this.formatMonthFromString(event.month);
    // Reset external date to avoid overriding user selection
    this.reportDateExternal = '';

    console.log('Month selected - API format:', this.reportDateForAPI);
    console.log('Month selected - Display format:', this.reportDateDisplay);

    this.getNotification();
  }

  /**
   * Get Predictive Notification List
   */
  getNotification(): void {
    const fromDate = this.reportDateForAPI || '';

    this.notificationListArr = [];
    this.noRecordsFlag = false;
    this.pleaseWaitFlag = true;

    const req = {
      user_id: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      Fromdate: fromDate,
      design_id: this.designationId,
      language: this.languageService.getLanguage,
    };

    console.log('getNotification Request:', req);

    this.maintenanceService
      .getPredictiveNotificationListReport(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleaseWaitFlag = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          console.log('getNotification Response:', response);

          // Prefill month date from API response if no date was sent
          if (!fromDate) {
            if (response?.Fromdate) {
              // Store in YYYY-MM format for API
              this.reportDateForAPI = response.Fromdate;
              // Store in MM-YYYY format for display
              this.reportDateDisplay = this.formatMonthFromString(
                response.Fromdate,
              );
              this.reportDateExternal = response.Fromdate;
              console.log('Date prefilled from API:', this.reportDateDisplay);
            }
          }

          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.notificationListArr = response.data || [];
            this.noRecordsFlag = false;
          } else {
            this.notificationListArr = [];
            this.noRecordsFlag = true;
          }
        },
        error: (error) => {
          console.error('Error fetching notifications:', error);
          this.notificationListArr = [];
          this.noRecordsFlag = true;
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
        module: 'RoPMVIEW',
        screen: 'Predictive',
      },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: ['acknowledgement-modal'],
    });
    await modal.present();
  }

  /**
   * Navigate to Rejected Records Page
   */
  btnRejectedRecords(): void {
    this.router.navigate(['/predictive-maintenance-rejected-records']);
  }

  /**
   * Format month from YYYY-MM to MM-YYYY
   */
  private formatMonthFromString(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 2) return dateStr;
    return `${parts[1]}-${parts[0]}`;
  }

  /**
   * Convert newlines to <br> tags
   */
  private nl2br(text: string): string {
    if (!text) return '';
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
