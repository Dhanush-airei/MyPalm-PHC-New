import {
  Component,
  OnInit,
  ViewChild,
  DestroyRef,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { finalize, filter, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ProductionService } from 'src/app/shared/services/production-services/production-service/production-service';

@Component({
  selector: 'app-production-process-status',
  templateUrl: './production-process-status.page.html',
  styleUrls: ['./production-process-status.page.scss'],
  standalone: false,
})
export class ProductionProcessStatusPage implements OnInit {
  /**
   * ============================================================
   * STATIC REFRESH SUBJECT
   * ------------------------------------------------------------
   * The edit page triggers `ProductionProcessStatusPage.refresh$`
   * after a successful save. This guarantees getreport() runs
   * even when Ionic reuses this cached component instance and
   * `ionViewWillEnter()` does NOT fire (which is the root cause
   * of the reported bug).
   * ============================================================
   */
  static readonly refresh$ = new Subject<void>();

  @ViewChild('pageHeader')
  pageHeader!: PageHeaderComponent;

  private destroyRef = inject(DestroyRef);

  // Header Configuration
  appTitle: string = this.nl2br(this.userContext.millName);
  headerActions: string = '2';
  showLogo: number = 1;
  showBackButton: number = 0;

  // Form
  statusForm!: FormGroup;

  // User Data
  getlanguage: string = this.languageService.getLanguage;

  // ============================================
  // Month Display & Picker State
  // ============================================
  monthDisplayValue: string = '';
  isMonthPickerOpen: boolean = false;
  tempMonth: string = '';
  selectedMonth: string = '';
  selectedYear: number = new Date().getFullYear();
  maxDate: string = new Date().toISOString();

  // ============================================
  // Data
  // ============================================
  getDate: string = '';
  statusArr: any[] = [];
  totalArr: any[] = [];
  pleasewaitflag: boolean = false;

  // Guard flag to prevent double fetch on the same navigation
  private hasFetchedForCurrentEntry: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userContext: UserContext,
    private languageService: LanguageService,
    private productionService: ProductionService,
    private translate: TranslateService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    // ============================================
    // FALLBACK 1: Subscribe to the static refresh subject.
    // Fires when the edit page triggers a refresh after save.
    // ============================================
    ProductionProcessStatusPage.refresh$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.hasFetchedForCurrentEntry = false;
        this.getreport();
      });

    // ============================================
    // FALLBACK 2: Subscribe to router events.
    // Ensures data refreshes whenever we navigate back to this
    // route, even if Ionic reuses the cached component instance.
    // ============================================
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        const url = event.urlAfterRedirects || event.url;
        if (url.includes('/tabs/production-process-status')) {
          // Only refetch on SUBSEQUENT returns. The first entry
          // is handled by ionViewWillEnter().
          if (this.hasFetchedForCurrentEntry) {
            this.getreport();
          }
        }
      });
  }

  ionViewWillEnter(): void {
    this.pageHeader?.getNotificationApi();

    // Always fetch on enter. This covers the case where the
    // component is freshly created (not reused).
    this.hasFetchedForCurrentEntry = true;
    this.getreport();
  }

  private createForm(): void {
    this.statusForm = this.fb.group({
      pickdate: new FormControl(''),
    });
  }

  openMonthPicker(): void {
    if (this.monthDisplayValue) {
      const [mm, yyyy] = this.monthDisplayValue.split('-');
      this.tempMonth = `${yyyy}-${mm}-01`;
      this.selectedMonth = mm;
      this.selectedYear = parseInt(yyyy, 10);
    } else {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      this.tempMonth = `${yyyy}-${mm}-01`;
      this.selectedMonth = mm;
      this.selectedYear = yyyy;
    }
    this.isMonthPickerOpen = true;
  }

  onMonthChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (!value) return;
    const valueStr = String(value);
    this.tempMonth = valueStr;
    const parts = valueStr.split('-');
    if (parts.length >= 2) {
      this.selectedYear = parseInt(parts[0], 10);
      this.selectedMonth = parts[1];
    }
  }

  onMonthDismiss(): void {
    this.isMonthPickerOpen = false;
    if (this.tempMonth && this.selectedMonth && this.selectedYear) {
      this.monthDisplayValue = `${this.selectedMonth}-${this.selectedYear}`;
      this.getDate = `${this.selectedYear}-${this.selectedMonth}`;
      this.statusForm.controls['pickdate'].setValue(this.getDate);
    }
  }

  /**
   * Get report data from API.
   */
  getreport(): void {
    if (this.monthDisplayValue) {
      const [mm, yyyy] = this.monthDisplayValue.split('-');
      this.getDate = `${yyyy}-${mm}`;
    } else {
      this.getDate = '';
    }

    this.statusArr = [];
    this.totalArr = [];
    this.pleasewaitflag = true;

    const req = {
      userid: this.userContext.userId,
      departmentid: this.userContext.departmentId,
      designationid: this.userContext.designId,
      millcode: this.userContext.millCode,
      Fromdate: this.getDate,
      language: this.languageService.getLanguage,
    };

    console.log('Request:', req);

    this.productionService
      .getProcessList(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleasewaitflag = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          console.log('Response:', response);

          if (response?.Fromdate) {
            const [yyyy, mm] = response.Fromdate.split('-');
            this.monthDisplayValue = `${mm}-${yyyy}`;
            this.selectedMonth = mm;
            this.selectedYear = parseInt(yyyy, 10);
            this.tempMonth = `${yyyy}-${mm}-01`;
            this.statusForm.controls['pickdate'].setValue(response.Fromdate);
          }

          if (response?.httpcode == 200) {
            this.statusArr = Array.isArray(response.data) ? response.data : [];
            this.totalArr = Array.isArray(response.average)
              ? response.average
              : [];
          } else {
            this.statusArr = [];
            this.totalArr = [];
          }
        },
        error: (error: any) => {
          console.error('Failed to load report:', error);
          this.statusArr = [];
          this.totalArr = [];
        },
      });
  }

  btn_Data(value: any): void {
    const senddata = value === '' ? '' : JSON.stringify(value);
    this.router.navigate([
      '/production-process-status-edit',
      { item: senddata },
    ]);
  }

  nl2br(text: string): string {
    if (!text) return '';
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
