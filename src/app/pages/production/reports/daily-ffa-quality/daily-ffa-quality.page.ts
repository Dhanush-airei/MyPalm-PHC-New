/* daily-ffa-quality.page.ts */
import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { DailyFfaQualityService } from 'src/app/shared/services/production-services/daily-ffa-quality-service/daily-ffa-quality-service';
import { SterilizerService } from 'src/app/shared/services/production-services/sterilizer-service/sterilizer-service';

@Component({
  selector: 'app-daily-ffa-quality',
  templateUrl: './daily-ffa-quality.page.html',
  styleUrls: ['./daily-ffa-quality.page.scss'],
  standalone: false,
})
export class DailyFfaQualityPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  // Header Configuration
  appTitle: string =
    this.translate.instant('OILLOSSESSREPORT.ffa') + ' Quality';
  showLogo: number = 0;
  showBackButton: number = 1;
  headerActions: string = '';

  // User Data
  userId: number = 0;
  millCode: string = '';
  departmentId: number = 0;
  designationId: number = 0;

  // Dates
  fromDate: string = '';
  toDate: string = '';

  // Data Arrays
  labOilLossListArr: any[] = [];

  // Flags
  noRecordsFlag: boolean = false;
  pleaseWaitFlag: boolean = false;

  // Notification Count
  pendingCount: number = 0;
  pendingCountLength: number = 0;

  constructor(
    private translate: TranslateService,
    private userContext: UserContext,
    private languageService: LanguageService,
    private dailyFfaQualityService: DailyFfaQualityService,
    private sterilizerService: SterilizerService,
  ) {
    // Initialize user data from UserContext
    this.userId = this.userContext.userId || 0;
    this.millCode = this.userContext.millCode || '';
    this.departmentId = this.userContext.departmentId || 0;
    this.designationId = this.userContext.designId || 0;
  }

  ngOnInit(): void {}

  ionViewDidEnter(): void {
    this.getMaintenancePendingCount();
    this.getLabOilLossReport();
  }

  /**
   * Handle date range selected from date-ranger-picker
   */
  onDateRangeSelected(event: { fromDate: string; toDate: string }): void {
    console.log('Date range selected:', event);
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.getLabOilLossReport();
  }

  /**
   * Get Maintenance Pending Count (Bell Count)
   */
  getMaintenancePendingCount(): void {
    const req = {
      userid: this.userId,
      departmentid: this.departmentId,
      design_id: this.designationId,
      millcode: this.millCode,
      language: this.languageService.getLanguage,
    };

    console.log('getMaintenancePendingCount Request:', req);

    this.sterilizerService
      .getmaintenancependingcount(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          console.log('getMaintenancePendingCount Response:', response);
          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.pendingCount = response.count || 0;
            this.pendingCountLength = this.pendingCount.toString().length;
          } else {
            this.pendingCount = 0;
            this.pendingCountLength = 1;
          }
        },
        error: (error) => {
          console.error('Error fetching pending count:', error);
          this.pendingCount = 0;
          this.pendingCountLength = 1;
        },
      });
  }

  /**
   * Get Lab Oil Loss Report
   */
  getLabOilLossReport(): void {
    let getfromdate = '';
    let gettodate = '';

    if (this.fromDate != '' || this.toDate != '') {
      getfromdate = this.fromDate;
      gettodate = this.toDate;
    }

    this.labOilLossListArr = [];
    this.noRecordsFlag = false;
    this.pleaseWaitFlag = true;

    const req = {
      user_id: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      design_id: this.designationId,
      fromdate: getfromdate,
      todate: gettodate,
      language: this.languageService.getLanguage,
    };

    console.log('getLabOilLossReport Request:', req);

    this.dailyFfaQualityService
      .getLabOilLosses(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleaseWaitFlag = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          console.log('getLabOilLossReport Response:', response);

          // Prefill dates from API response if empty
          if (
            (this.fromDate == '' || this.toDate == '') &&
            response?.Fromdate &&
            response?.Todate
          ) {
            this.fromDate = response.Fromdate;
            this.toDate = response.Todate;
            console.log(
              'Dates prefilled from API:',
              this.fromDate,
              this.toDate,
            );
          }

          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.labOilLossListArr = response.data || [];
            this.noRecordsFlag = false;
          } else {
            this.labOilLossListArr = [];
            this.noRecordsFlag = true;
          }
        },
        error: (error) => {
          console.error('Error fetching lab oil loss report:', error);
          this.labOilLossListArr = [];
          this.noRecordsFlag = true;
        },
      });
  }

  /**
   * Convert newlines to <br> tags
   */
  private nl2br(text: string): string {
    if (!text) return '';
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
