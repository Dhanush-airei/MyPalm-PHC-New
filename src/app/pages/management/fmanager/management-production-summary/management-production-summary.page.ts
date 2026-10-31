/* management-production-summary.page.ts */
import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ManagementService } from 'src/app/shared/services/management-service/management-service';

@Component({
  selector: 'app-management-production-summary',
  templateUrl: './management-production-summary.page.html',
  styleUrls: ['./management-production-summary.page.scss'],
  standalone: false,
})
export class ManagementProductionSummaryPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  // Header Configuration
  appTitle: string = this.translate.instant(
    'OWNERPRODUCTIONSUMMARY.productionalertsummary',
  );
  showLogo: number = 0;
  showBackButton: number = 1;
  headerActions: string = '';

  // Form
  productionSummaryForm: FormGroup;

  // User Data
  userId: number = 0;
  millCode: string = '';
  departmentId: number = 0;
  designationId: number = 0;

  // Data Arrays
  dailyArr: any[] = [];
  weeklyArr: any[] = [];
  monthlyArr: any[] = [];

  // Dates - Weekly
  weeklyReportDate: string = '';
  weeklyExternalDate: string = '';

  // Dates - Monthly
  monthlyReportDate: string = ''; // MM-YYYY format for display
  monthlyDisplayDate: string = ''; // Formatted display date
  monthlyExternalDate: string = ''; // YYYY-MM format from API
  private monthlyReportDateForAPI: string = ''; // YYYY-MM format for API

  // Month Modal
  isMonthModalOpen: boolean = false;
  tempMonth: string = '';
  private originalMonth: string = '';
  private isUserSelectedMonth: boolean = false;
  maxDate: string = '';

  currentDate: string = '';
  currentMonthYear: string = '';

  // Flags
  pleaseWaitFlag: boolean = false;

  // Disclaimer
  disclaimerData: string = '';

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private userContext: UserContext,
    private languageService: LanguageService,
    private managementService: ManagementService,
  ) {
    // Initialize user data from UserContext
    this.userId = this.userContext.userId || 0;
    this.millCode = this.userContext.millCode || '';
    this.departmentId = this.userContext.departmentId || 0;
    this.designationId = this.userContext.designId || 0;

    // Set current date
    const today = new Date();
    this.currentDate = this.formatDate(today);
    this.currentMonthYear = this.formatMonthYear(today);
    this.maxDate = this.getTodayISO();

    // Initialize form
    this.productionSummaryForm = this.fb.group({
      select_week: new FormControl(''),
      pickmonth: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  ionViewDidEnter(): void {
    this.getDailyReport();
  }

  /**
   * Get text color based on position
   * Position 1: Red (Total Alerts) - #cb4335
   * Position 2: Orange (Unattended) - #ff9f0c
   * Position 3: Green (Attended) - #008000
   */
  getTextColor(position: string): string {
    if (position == '1') {
      return '#cb4335'; // Red
    } else if (position == '2') {
      return '#ff9f0c'; // Orange
    } else {
      return '#008000'; // Green
    }
  }

  /**
   * Get Daily Report - API type=1
   */
  getDailyReport(): void {
    this.pleaseWaitFlag = true;

    const req = {
      userid: this.userId,
      millcode: this.millCode,
      type: 1,
      Fromdate: '',
      language: this.languageService.getLanguage,
    };

    this.managementService
      .getProductionAlertSummary(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleaseWaitFlag = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.dailyArr = response.data || [];
          } else {
            this.dailyArr = [];
          }
          // Always call weekly report regardless of daily result
          this.getWeeklyReport();
        },
        error: () => {
          this.dailyArr = [];
          this.getWeeklyReport();
        },
      });
  }

  /**
   * Get Weekly Report - API type=2
   */
  getWeeklyReport(): void {
    this.pleaseWaitFlag = true;

    const fromDate = this.weeklyReportDate || '';

    const req = {
      userid: this.userId,
      millcode: this.millCode,
      type: 2,
      Fromdate: fromDate,
      language: this.languageService.getLanguage,
    };

    console.log('getWeeklyReport - Fromdate:', fromDate);

    this.managementService
      .getProductionAlertSummary(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleaseWaitFlag = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          if (!fromDate) {
            if (response?.Fromdate) {
              this.weeklyExternalDate = response.Fromdate;
              this.weeklyReportDate = this.formatDateFromString(
                response.Fromdate,
              );
            }
          }

          if (response?.disclaimer) {
            this.disclaimerData = response.disclaimer;
          }

          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.weeklyArr = response.data || [];
          } else {
            this.weeklyArr = [];
          }

          this.getMonthlyReport();
        },
        error: () => {
          this.weeklyArr = [];
          this.getMonthlyReport();
        },
      });
  }

  /**
   * Get Monthly Report - API type=3
   */
  getMonthlyReport(): void {
    this.pleaseWaitFlag = true;

    const fromDate = this.monthlyReportDateForAPI || '';

    const req = {
      userid: this.userId,
      millcode: this.millCode,
      type: 3,
      Fromdate: fromDate,
      language: this.languageService.getLanguage,
    };

    console.log('getMonthlyReport - Fromdate (API format):', fromDate);

    this.managementService
      .getProductionAlertSummary(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleaseWaitFlag = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          if (!fromDate) {
            if (response?.Fromdate) {
              this.monthlyReportDateForAPI = response.Fromdate;
              this.monthlyReportDate = this.formatMonthFromString(
                response.Fromdate,
              );
              this.monthlyDisplayDate = this.monthlyReportDate;
              this.monthlyExternalDate = response.Fromdate;
            }
          }

          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.monthlyArr = response.data || [];
          } else {
            this.monthlyArr = [];
          }
        },
        error: () => {
          this.monthlyArr = [];
        },
      });
  }

  /**
   * Handle week date selected
   */
  onWeekDateSelected(event: { date: string }): void {
    console.log('Week date selected:', event);
    this.weeklyReportDate = event.date;
    this.weeklyExternalDate = '';
    this.getWeeklyReport();
  }

  /**
   * Handle month get records
   */
  onMonthGetRecords(): void {
    console.log('Month Get Records clicked');
    this.getMonthlyReport();
  }

  /**
   * Open Month Modal
   */
  openMonthModal(): void {
    this.originalMonth = this.monthlyReportDateForAPI || '';
    this.tempMonth = this.originalMonth || '';
    console.log('Opening month modal with tempMonth:', this.tempMonth);
    this.isMonthModalOpen = true;
  }

  /**
   * Month changed
   */
  onMonthChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (!value) return;
    this.tempMonth = String(value).substring(0, 7);
    console.log('Month selected in modal:', this.tempMonth);
  }

  /**
   * Month modal dismissed
   */
  onMonthDismiss(): void {
    console.log('Month dismissed - tempMonth:', this.tempMonth);
    console.log('Original month:', this.originalMonth);

    if (this.tempMonth && this.tempMonth !== this.originalMonth) {
      this.monthlyReportDateForAPI = this.tempMonth;
      this.monthlyReportDate = this.formatMonthFromString(this.tempMonth);
      this.monthlyDisplayDate = this.monthlyReportDate;
      this.isUserSelectedMonth = true;
      console.log('Month updated - API format:', this.monthlyReportDateForAPI);
      console.log('Month updated - Display format:', this.monthlyReportDate);
    } else {
      this.monthlyReportDateForAPI = this.originalMonth;
      this.monthlyReportDate = this.formatMonthFromString(this.originalMonth);
      this.monthlyDisplayDate = this.monthlyReportDate;
      console.log('Month reverted to:', this.monthlyReportDate);
    }
    this.isMonthModalOpen = false;
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
   * Format date to MM-YYYY
   */
  private formatMonthYear(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${year}`;
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
   * Format month from YYYY-MM to MM-YYYY
   */
  private formatMonthFromString(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 2) return dateStr;
    return `${parts[1]}-${parts[0]}`;
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
