import {
  Component,
  OnInit,
  DestroyRef,
  inject,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { SterilizerService } from 'src/app/shared/services/production-services/sterilizer-service/sterilizer-service';
import { ManagementService } from 'src/app/shared/services/management-service/management-service';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-management-maintenance',
  templateUrl: './management-maintenance.page.html',
  styleUrls: ['./management-maintenance.page.scss'],
  standalone: false,
})
export class ManagementMaintenancePage implements OnInit {
  private destroyRef = inject(DestroyRef);

  @ViewChild('pageHeader')
  pageHeader!: PageHeaderComponent;

  // Header Configuration
  appTitle: string = '';
  headerActions: string = '6,7';
  showLogo: number = 1;
  showBackButton: number = 0;

  // User Data
  userDesignation: number = 0;
  userId: number = 0;
  millCode: string = '';
  departmentId: number = 0;
  designationId: number = 0;

  // Form
  maintenanceForm: FormGroup;

  // Data Arrays
  correctivemaintenanceArr: any[] = [];
  routinepreventivemaintenanceArr: any[] = [];
  replacementpreventivemaintenanceArr: any[] = [];
  predictivemaintenanceArr: any[] = [];

  // Date
  reportDateDisplay: string = '';
  reportDateExternal: string = '';

  /**
   * The YYYY-MM string sent to the API as `fromdate`.
   * Kept separate from the display string.
   */
  private reportDateForAPI: string = '';

  // Counts
  maintenanceCount: number = 0;
  maintenanceCountLength: number = 0;
  productionCount: number = 0;
  productionCountLength: number = 0;
  totalCount: number = 0;

  // Flags
  pleaseWaitFlag: boolean = false;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private userContext: UserContext,
    private languageService: LanguageService,
    private managementService: ManagementService,
    private sterilizerService: SterilizerService,
  ) {
    this.userDesignation = this.userContext.designId || 0;
    this.userId = this.userContext.userId || 0;
    this.millCode = this.userContext.millCode || '';
    this.departmentId = this.userContext.departmentId || 0;
    this.designationId = this.userContext.designId || 0;

    this.appTitle = this.nl2br(this.userContext.millName || '');

    this.maintenanceForm = this.fb.group({
      pickdate: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  ionViewDidEnter(): void {
    this.pageHeader?.getNotificationApi();
    // this.getBellCount();

    // On first enter, `reportDateForAPI` is empty — the API will
    // return the current month and we'll populate the picker.
    this.getMaintenanceData();
  }

  // ============================================================
  // Public helpers
  // ============================================================

  getTextColor(position: string | number): string {
    const pos = Number(position);
    if (pos == 1) return '#cb4335';
    if (pos == 2) return '#ff9f0c';
    return '#008000';
  }

  /**
   * Handle month selection from <app-month-picker>.
   *
   * The event shape may vary; we accept all of:
   *   - { month: "2025-10" }
   *   - { month: "10-2025" }
   *   - { value: "2025-10" }
   *   - { date: "2025-10" }
   *   - "2025-10"
   */
  onMonthSelected(event: any): void {
    console.log('[MonthPicker] raw event =', event);

    const raw: string =
      (typeof event === 'string' && event) ||
      event?.month ||
      event?.value ||
      event?.date ||
      '';

    if (!raw) {
      console.warn(
        '[MonthPicker] Could not extract a month value from the event. ' +
          'Expected `{ month: "YYYY-MM" }`, `"YYYY-MM"`, or `{ value: "YYYY-MM" }`.',
      );
      return;
    }

    // Always normalize to YYYY-MM for the API.
    this.reportDateForAPI = this.normalizeToYYYYMM(raw);
    this.reportDateDisplay = this.formatMonthFromString(this.reportDateForAPI);
    this.reportDateExternal = '';

    console.log('[MonthPicker] normalized API format =', this.reportDateForAPI);

    this.getMaintenanceData();
  }

  // ============================================================
  // API methods
  // ============================================================

  /**
   * Fetch maintenance data for the selected month.
   */
  getMaintenanceData(): void {
    this.pleaseWaitFlag = true;

    // The exact string the API will receive.
    const fromDate = this.reportDateForAPI || '';

    const req = {
      userid: this.userId,
      millcode: this.millCode,
      departmentid: this.departmentId,
      designationid: this.designationId,
      fromdate: fromDate,
      language: this.languageService.getLanguage,
    };

    console.log(
      '[MaintenanceData] fromdate (YYYY-MM):',
      JSON.stringify(fromDate),
    );
    console.log('[MaintenanceData] full request:', req);

    this.managementService
      .getMaintenanceData(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleaseWaitFlag = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          console.log('[MaintenanceData] response:', response);

          // Only seed the picker if we hadn't specified a month.
          if (!fromDate && response?.fromdate) {
            this.reportDateForAPI = this.normalizeToYYYYMM(response.fromdate);
            this.reportDateDisplay = this.formatMonthFromString(
              this.reportDateForAPI,
            );
            this.reportDateExternal = this.reportDateForAPI;
          }

          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.correctivemaintenanceArr = response.data?.cm || [];
            this.routinepreventivemaintenanceArr = response.data?.ropm || [];
            this.replacementpreventivemaintenanceArr =
              response.data?.repm || [];
            this.predictivemaintenanceArr = response.data?.predictive || [];
          } else {
            this.setDefaultData();
          }
        },
        error: (err) => {
          console.error('[MaintenanceData] error:', err);
          this.setDefaultData();
        },
      });
  }

  // ============================================================
  // Fallback data
  // ============================================================

  private setDefaultData(): void {
    this.predictivemaintenanceArr = [
      { title: 'Generated', position: 1, value: '-' },
      { title: 'Created', position: 2, value: '-' },
      { title: 'In Progress', position: 3, value: '-' },
      { title: 'Completed', position: 4, value: '-' },
      { title: 'Rejected', position: 5, value: '-' },
    ];
    this.correctivemaintenanceArr = [
      { title: 'Created', position: 1, value: '-' },
      { title: 'In Progress', position: 2, value: '-' },
      { title: 'Completed', position: 3, value: '-' },
    ];
    this.routinepreventivemaintenanceArr = [
      { title: 'Created', position: 1, value: '-' },
      { title: 'In Progress', position: 2, value: '-' },
      { title: 'Completed', position: 3, value: '-' },
    ];
    this.replacementpreventivemaintenanceArr = [
      { title: 'Created', position: 1, value: '-' },
      { title: 'In Progress', position: 2, value: '-' },
      { title: 'Completed', position: 3, value: '-' },
    ];
  }

  // ============================================================
  // Date helpers
  // ============================================================

  /**
   * Normalize `"YYYY-MM"` or `"MM-YYYY"` to `"YYYY-MM"`.
   * If the input is already in an unexpected shape, return it unchanged.
   */
  private normalizeToYYYYMM(value: string): string {
    if (!value) return '';

    const parts = value.split('-');
    if (parts.length !== 2) return value;

    const [a, b] = parts;
    if (a.length === 4) {
      // already YYYY-MM
      return `${a}-${b}`;
    }
    // MM-YYYY → YYYY-MM
    return `${b}-${a}`;
  }

  /**
   * Display month picker value as MM-YYYY.
   */
  private formatMonthFromString(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 2) return dateStr;

    // YYYY-MM → MM-YYYY
    if (parts[0].length === 4) {
      return `${parts[1]}-${parts[0]}`;
    }
    // already MM-YYYY
    return dateStr;
  }

  private nl2br(text: string): string {
    if (!text) return '';
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
