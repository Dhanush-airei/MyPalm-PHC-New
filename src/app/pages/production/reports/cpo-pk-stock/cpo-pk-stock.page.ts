/* cpo-pk-stock.page.ts */
import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { CpoPkStockService } from 'src/app/shared/services/production-services/cpo-pk-stock-service/cpo-pk-stock-service';

@Component({
  selector: 'app-cpo-pk-stock',
  templateUrl: './cpo-pk-stock.page.html',
  styleUrls: ['./cpo-pk-stock.page.scss'],
  standalone: false,
})
export class CpoPkStockPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  // Header Configuration
  appTitle: string = 'CPO/PKO/PK Stock';
  showLogo: number = 0;
  showBackButton: number = 1;
  headerActions: string = '';

  // User Data
  userId: number = 0;
  millCode: string = '';
  departmentId: number = 0;
  designationId: number = 0;
  language: string = '';

  // Tab
  tabsSegment: string = 'cpostock';

  // CPO Stock
  cpoReportDateDisplay: string = '';
  cpoReportDateExternal: string = '';
  private cpoReportDateForAPI: string = '';
  cpoStockListArr: any[] = [];
  cpoNoRecordsFlag: boolean = false;

  // PKO Stock
  pkoReportDateDisplay: string = '';
  pkoReportDateExternal: string = '';
  private pkoReportDateForAPI: string = '';
  pkoStockListArr: any[] = [];
  pkoNoRecordsFlag: boolean = false;

  // PK Stock
  pkReportDateDisplay: string = '';
  pkReportDateExternal: string = '';
  private pkReportDateForAPI: string = '';
  pkStockListArr: any[] = [];
  pkNoRecordsFlag: boolean = false;

  // Flags
  pleaseWaitFlag: boolean = false;

  constructor(
    private translate: TranslateService,
    private userContext: UserContext,
    private languageService: LanguageService,
    private cpoPkStockService: CpoPkStockService,
  ) {
    // Initialize user data from UserContext
    this.userId = this.userContext.userId || 0;
    this.millCode = this.userContext.millCode || '';
    this.departmentId = this.userContext.departmentId || 0;
    this.designationId = this.userContext.designId || 0;
    this.language = this.languageService.getLanguage || 'English';
  }

  ngOnInit(): void {}

  ionViewDidEnter(): void {
    this.getCPOStockReport();
  }

  /**
   * Segment Changed
   */
  segmentChanged(event: any): void {
    const value = event.detail.value;
    this.tabsSegment = value;

    if (value == 'cpostock') {
      this.getCPOStockReport();
    } else if (value == 'pkostock') {
      this.getPKOStockReport();
    } else {
      this.getPKStockReport();
    }
  }

  /**
   * Handle CPO Month Selected
   */
  onCpoMonthSelected(event: { month: string }): void {
    console.log('CPO Month selected:', event);
    this.cpoReportDateForAPI = event.month;
    this.cpoReportDateDisplay = this.formatMonthFromString(event.month);
    this.cpoReportDateExternal = '';
    this.getCPOStockReport();
  }

  /**
   * Handle PKO Month Selected
   */
  onPkoMonthSelected(event: { month: string }): void {
    console.log('PKO Month selected:', event);
    this.pkoReportDateForAPI = event.month;
    this.pkoReportDateDisplay = this.formatMonthFromString(event.month);
    this.pkoReportDateExternal = '';
    this.getPKOStockReport();
  }

  /**
   * Handle PK Month Selected
   */
  onPkMonthSelected(event: { month: string }): void {
    console.log('PK Month selected:', event);
    this.pkReportDateForAPI = event.month;
    this.pkReportDateDisplay = this.formatMonthFromString(event.month);
    this.pkReportDateExternal = '';
    this.getPKStockReport();
  }

  /**
   * Get CPO Stock Report
   */
  getCPOStockReport(): void {
    const month = this.cpoReportDateForAPI || '';

    this.cpoStockListArr = [];
    this.cpoNoRecordsFlag = false;
    this.pleaseWaitFlag = true;

    const req = {
      millcode: this.millCode,
      userid: this.userId,
      dept_id: this.departmentId,
      design_id: this.designationId,
      month: month,
      language: this.languageService.getLanguage,
    };

    console.log('getCPOStockReport Request:', req);

    this.cpoPkStockService
      .getCPOStockReport(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleaseWaitFlag = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          console.log('getCPOStockReport Response:', response);

          // Prefill month from API response if no date was sent
          if (!month) {
            if (response?.month) {
              this.cpoReportDateForAPI = response.month;
              this.cpoReportDateDisplay = this.formatMonthFromString(
                response.month,
              );
              this.cpoReportDateExternal = response.month;
              console.log(
                'CPO Month prefilled from API:',
                this.cpoReportDateDisplay,
              );
            }
          }

          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.cpoStockListArr = response.data || [];
            this.cpoNoRecordsFlag = false;
          } else {
            this.cpoStockListArr = [];
            this.cpoNoRecordsFlag = true;
          }
        },
        error: (error) => {
          console.error('Error fetching CPO stock report:', error);
          this.cpoStockListArr = [];
          this.cpoNoRecordsFlag = true;
        },
      });
  }

  /**
   * Get PKO Stock Report
   */
  getPKOStockReport(): void {
    const month = this.pkoReportDateForAPI || '';

    this.pkoStockListArr = [];
    this.pkoNoRecordsFlag = false;
    this.pleaseWaitFlag = true;

    const req = {
      millcode: this.millCode,
      userid: this.userId,
      dept_id: this.departmentId,
      design_id: this.designationId,
      month: month,
      language: this.languageService.getLanguage,
    };

    console.log('getPKOStockReport Request:', req);

    this.cpoPkStockService
      .getPKOStockReport(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleaseWaitFlag = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          console.log('getPKOStockReport Response:', response);

          // Prefill month from API response if no date was sent
          if (!month) {
            if (response?.month) {
              this.pkoReportDateForAPI = response.month;
              this.pkoReportDateDisplay = this.formatMonthFromString(
                response.month,
              );
              this.pkoReportDateExternal = response.month;
              console.log(
                'PKO Month prefilled from API:',
                this.pkoReportDateDisplay,
              );
            }
          }

          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.pkoStockListArr = response.data || [];
            this.pkoNoRecordsFlag = false;
          } else {
            this.pkoStockListArr = [];
            this.pkoNoRecordsFlag = true;
          }
        },
        error: (error) => {
          console.error('Error fetching PKO stock report:', error);
          this.pkoStockListArr = [];
          this.pkoNoRecordsFlag = true;
        },
      });
  }

  /**
   * Get PK Stock Report
   */
  getPKStockReport(): void {
    const month = this.pkReportDateForAPI || '';

    this.pkStockListArr = [];
    this.pkNoRecordsFlag = false;
    this.pleaseWaitFlag = true;

    const req = {
      millcode: this.millCode,
      userid: this.userId,
      dept_id: this.departmentId,
      design_id: this.designationId,
      month: month,
      language: this.languageService.getLanguage,
    };

    console.log('getPKStockReport Request:', req);

    this.cpoPkStockService
      .getPKStockReport(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleaseWaitFlag = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          console.log('getPKStockReport Response:', response);

          // Prefill month from API response if no date was sent
          if (!month) {
            if (response?.month) {
              this.pkReportDateForAPI = response.month;
              this.pkReportDateDisplay = this.formatMonthFromString(
                response.month,
              );
              this.pkReportDateExternal = response.month;
              console.log(
                'PK Month prefilled from API:',
                this.pkReportDateDisplay,
              );
            }
          }

          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.pkStockListArr = response.data || [];
            this.pkNoRecordsFlag = false;
          } else {
            this.pkStockListArr = [];
            this.pkNoRecordsFlag = true;
          }
        },
        error: (error) => {
          console.error('Error fetching PK stock report:', error);
          this.pkStockListArr = [];
          this.pkNoRecordsFlag = true;
        },
      });
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
