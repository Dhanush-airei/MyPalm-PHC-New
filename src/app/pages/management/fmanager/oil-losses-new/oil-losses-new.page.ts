import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { ManagementService } from 'src/app/shared/services/management-service/management-service';

@Component({
  selector: 'app-oil-losses-new',
  templateUrl: './oil-losses-new.page.html',
  styleUrls: ['./oil-losses-new.page.scss'],
  standalone: false,
})
export class OilLossesNewPage implements OnInit, AfterViewInit {
  appTitle: string = this.translate.instant('OILLOSSESNEW.title');
  headerActions: string = '';
  showLogo: number = 0;
  showBackButton: number = 1;
  showNewLoad: boolean = false;

  // Data properties
  oillossesArr: any[] = [];
  pressdataArr: any[] = [];

  // UI state
  norecordsflag: boolean = false;
  pleasewaitflag: boolean = false;

  // Date
  reportDate: string = ''; // YYYY-MM-DD format for API
  displayDateForPicker: string = ''; // Date for date-picker (expects YYYY-MM-DD)
  externalDate: string = ''; // Date from API response
  getLanguage: string = 'English';

  // Track if this is the initial load
  private isInitialLoad: boolean = true;

  constructor(
    private userContext: UserContext,
    private translate: TranslateService,
    private languageService: LanguageService,
    private managementService: ManagementService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.getLanguage = this.languageService.getLanguage || 'English';
  }

  ngOnInit(): void {
    // Get reportdate from route parameters
    this.route.paramMap.subscribe((params) => {
      const reportDateParam = params.get('reportdate');

      if (reportDateParam) {
        // The date from URL is in DD-MM-YYYY format
        // Convert to YYYY-MM-DD for the date-picker and API
        this.displayDateForPicker =
          this.convertToAPIDateFormat(reportDateParam);
        this.reportDate = this.displayDateForPicker;

        console.log('Initial date from route:', {
          reportDateParam: reportDateParam,
          displayDateForPicker: this.displayDateForPicker,
          reportDate: this.reportDate,
        });
      } else {
        // If no date in route, use today's date
        const today = this.getToday();
        this.reportDate = today;
        this.displayDateForPicker = today;
      }
    });
  }

  ngAfterViewInit(): void {
    // Load data with initial date
    this.loadData();
  }

  /**
   * Handle date selection from date-picker component
   */
  onGetRecords(event: { date: string }): void {
    if (event.date) {
      // Event date is in YYYY-MM-DD format
      this.reportDate = event.date;
      this.displayDateForPicker = event.date;

      // Update the URL with the new date
      this.updateUrlWithDate(event.date);

      // Load data with new date
      this.loadData();
    }
  }

  /**
   * Update URL with the selected date
   */
  private updateUrlWithDate(date: string): void {
    // Convert YYYY-MM-DD to DD-MM-YYYY for URL
    const dateForUrl = this.formatDateForDisplay(date);

    // Navigate with the new date parameter without reloading the page
    this.router.navigate(['/oil-losses-new', { reportdate: dateForUrl }], {
      replaceUrl: true,
      skipLocationChange: false,
    });

    console.log('URL updated with date:', dateForUrl);
  }

  /**
   * Load oil losses data from API
   */
  loadData(): void {
    this.oillossesArr = [];
    this.norecordsflag = false;
    this.pleasewaitflag = true;

    const req = {
      userid: this.userContext.userId,
      millcode: this.userContext.millCode,
      Fromdate: this.reportDate,
      language: this.languageService.getLanguage || this.getLanguage,
    };

    console.log('Request:', req);

    this.managementService
      .getOillossesvalues(req)
      .pipe(
        finalize(() => {
          this.pleasewaitflag = false;
        }),
      )
      .subscribe({
        next: (result: any) => {
          console.log('API Response:', result);

          if (result.httpcode == 200) {
            this.oillossesArr = result.data || [];
            this.norecordsflag = this.oillossesArr.length === 0;

            // Update external date from API response
            if (result.Fromdate) {
              this.externalDate = result.Fromdate;
              // Update display date with API response date
              this.displayDateForPicker = result.Fromdate;
              this.reportDate = result.Fromdate;

              // Update URL with the date from API response (if not initial load)
              if (!this.isInitialLoad) {
                this.updateUrlWithDate(result.Fromdate);
              }
            }

            // Show toast if no records
            if (this.oillossesArr.length === 0) {
              this.toastService.info(
                this.translate.instant('NORECORDSFOUND.norecordsfound'),
              );
            }
          } else if (result.httpcode == 203) {
            // No records found
            this.oillossesArr = [];
            this.norecordsflag = true;

            // Update external date from API response even if no records
            if (result.Fromdate) {
              this.externalDate = result.Fromdate;
              this.displayDateForPicker = result.Fromdate;
              this.reportDate = result.Fromdate;

              // Update URL with the date from API response (if not initial load)
              if (!this.isInitialLoad) {
                this.updateUrlWithDate(result.Fromdate);
              }
            }
          } else {
            this.oillossesArr = [];
            this.norecordsflag = true;
            this.toastService.error(result.status || 'Failed to load data');
          }

          // Mark initial load as complete
          this.isInitialLoad = false;
        },
        error: (error) => {
          console.error('Error loading oil losses data:', error);
          this.oillossesArr = [];
          this.norecordsflag = true;
          this.toastService.error(
            error?.error?.message || 'Failed to load oil losses data.',
          );
          this.isInitialLoad = false;
        },
      });
  }

  /**
   * Get status background color based on level
   */
  getStatusBackgroundColor(level: number): string {
    return level === 0 ? '#53c65c' : '#e8414f';
  }

  /**
   * Convert DD-MM-YYYY to YYYY-MM-DD for API
   */
  private convertToAPIDateFormat(dateString: string): string {
    if (!dateString) return '';

    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Convert DD-MM-YYYY to YYYY-MM-DD
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      const parts = dateString.split('-');
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    return dateString;
  }

  /**
   * Format date for display (DD-MM-YYYY)
   */
  private formatDateForDisplay(dateString: string): string {
    if (!dateString) return '';

    // If already in DD-MM-YYYY format, return as is
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      return dateString;
    }

    // Convert YYYY-MM-DD to DD-MM-YYYY
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const parts = dateString.split('-');
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    return dateString;
  }

  /**
   * Get today's date in YYYY-MM-DD format
   */
  private getToday(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Convert newlines to <br> tags
   */
  nl2br(text: string): string {
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
