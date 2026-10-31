/* oil-losses-summary.page.ts */
import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ManagementService } from 'src/app/shared/services/management-service/management-service';
// import { OilLossReportPopupPage } from './oil-loss-report-popup/oil-loss-report-popup.page';

@Component({
  selector: 'app-oil-losses-summary',
  templateUrl: './oil-losses-summary.page.html',
  styleUrls: ['./oil-losses-summary.page.scss'],
  standalone: false,
})
export class OilLossesSummaryPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  // Header Configuration
  appTitle: string = 'Oil Losses Summary';
  showLogo: number = 0;
  showBackButton: number = 1;
  headerActions: string = '';

  // User Data
  userId: number = 0;
  millCode: string = '';
  departmentId: number = 0;
  designationId: number = 0;

  // Dates
  reportDateDisplay: string = ''; // MM-YYYY format for display
  reportDateExternal: string = ''; // YYYY-MM format from API
  private reportDateForAPI: string = ''; // YYYY-MM format for API

  // Data
  oillossesArr: any[] = [];
  mtd: string = '';
  oerMtdFlag: number = 0;

  // Flags
  noRecordsFlag: boolean = false;
  pleaseWaitFlag: boolean = false;

  constructor(
    private translate: TranslateService,
    private userContext: UserContext,
    private languageService: LanguageService,
    private managementService: ManagementService,
    private modalController: ModalController,
  ) {
    // Initialize user data from UserContext
    this.userId = this.userContext.userId || 0;
    this.millCode = this.userContext.millCode || '';
    this.departmentId = this.userContext.departmentId || 0;
    this.designationId = this.userContext.designId || 0;

    // FIX: Initialize with current month for initial API call
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    this.reportDateForAPI = `${year}-${month}`;
    this.reportDateDisplay = `${month}-${year}`;

    console.log('Initialized with current month:', this.reportDateForAPI);
  }

  ngOnInit(): void {}

  ionViewDidEnter(): void {
    this.getReport();
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

    this.getReport();
  }

  /**
   * Get Oil Losses Report
   */
  getReport(): void {
    // Use the API format (YYYY-MM) for the request
    const fromDate = this.reportDateForAPI || '';

    this.oillossesArr = [];
    this.noRecordsFlag = false;
    this.pleaseWaitFlag = true;

    const req = {
      millcode: this.millCode,
      fromdate: fromDate, // Use lowercase to match service
      language: this.languageService.getLanguage,
    };

    console.log('getReport - fromdate:', fromDate);

    this.managementService
      .getOillossesReportList(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleaseWaitFlag = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          console.log('Oil Losses Report Response:', response);

          // Prefill month date from API response root level "fromdate"
          // Only update if we got a valid fromdate from API
          if (response?.fromdate) {
            // Store in YYYY-MM format for API
            this.reportDateForAPI = response.fromdate;
            // Store in MM-YYYY format for display
            this.reportDateDisplay = this.formatMonthFromString(
              response.fromdate,
            );
            this.reportDateExternal = response.fromdate;
            console.log('Date prefilled from API:', this.reportDateDisplay);
          }

          if (response?.httpcode === 200 || response?.httpcode === '200') {
            this.noRecordsFlag = false;
            this.mtd = response.mtd || '';
            this.oerMtdFlag = response.oermtdflag || 0;

            // Process data - response.data is an array
            if (Array.isArray(response.data)) {
              this.oillossesArr = response.data;
            } else if (response.data && typeof response.data === 'object') {
              // If data is an object with date and pressdata
              this.oillossesArr = [response.data];
            } else {
              this.oillossesArr = [];
            }

            console.log('Oil Losses Data:', this.oillossesArr);
          } else {
            this.mtd = '';
            this.oerMtdFlag = 0;
            this.oillossesArr = [];
            this.noRecordsFlag = true;
          }
        },
        error: (error) => {
          console.error('Error fetching oil losses report:', error);
          this.mtd = '';
          this.oerMtdFlag = 0;
          this.oillossesArr = [];
          this.noRecordsFlag = true;
        },
      });
  }

  /**
   * Open Popup for MyPalm details
   */
  async openPopup(item: any[]): Promise<void> {
    console.log('Item:', item);

    // if (!item || item.length === 0) {
    //   return;
    // }

    // const modal = await this.modalController.create({
    //   component: OilLossReportPopupPage,
    //   componentProps: {
    //     item: JSON.stringify(item),
    //   },
    //   showBackdrop: true,
    //   backdropDismiss: false,
    //   cssClass: ['oillossreport-modal'],
    // });

    // await modal.present();
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
