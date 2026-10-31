import {
  Component,
  OnInit,
  DestroyRef,
  inject,
  NgZone,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, Platform } from '@ionic/angular';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { SterilizerService } from 'src/app/shared/services/production-services/sterilizer-service/sterilizer-service';
import { LabService } from 'src/app/shared/services/production-services/lab-service/lab-service';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-lab-cpo-pk-stock',
  templateUrl: './lab-cpo-pk-stock.page.html',
  styleUrls: ['./lab-cpo-pk-stock.page.scss'],
  standalone: false,
})
export class LabCpoPkStockPage implements OnInit {
  @ViewChild('pageHeader')
  pageHeader!: PageHeaderComponent;

  private destroyRef = inject(DestroyRef);
  private zone = inject(NgZone);

  // Header Configuration
  appTitle: string = this.nl2br(this.userContext.millName || '');
  headerActions: string = '2';
  showLogo: number = 1;
  showBackButton: number = 0;

  // Count
  notificationCount: number = 0;
  notificationCountLength: number = 0;
  pendingCount: number = 0;
  pendingCountLength: number = 0;

  // User Data
  userId: number = 0;
  millCode: string = '';
  departmentId: number = 0;
  designationId: number = 0;
  language: string = '';
  userName: string = '';

  // Tab
  tabsSegment: string = 'cpostock';
  platformType: string = '';

  // Form Groups
  cpoaddForm!: FormGroup;
  pkoaddForm!: FormGroup;
  pkaddForm!: FormGroup;

  // Date/Time
  currentDate: string = '';
  currentDateISO: string = '';
  pastDate: Date = new Date();
  logDate: Date = new Date(new Date().setDate(this.pastDate.getDate() - 1));

  // CPO Date Modal Flags
  isCpoLogDateModalOpen: boolean = false;
  isCpoEntryDateModalOpen: boolean = false;
  tempCpoLogDate: string = '';
  tempCpoEntryDate: string = '';

  // PKO Date Modal Flags
  isPkoLogDateModalOpen: boolean = false;
  isPkoEntryDateModalOpen: boolean = false;
  tempPkoLogDate: string = '';
  tempPkoEntryDate: string = '';

  // PK Date Modal Flags
  isPkLogDateModalOpen: boolean = false;
  isPkEntryDateModalOpen: boolean = false;
  tempPkLogDate: string = '';
  tempPkEntryDate: string = '';

  // CPO Stock
  addcpo: number = 0;
  isCpoDisabled: boolean = false;

  // PKO Stock
  addpko: number = 0;
  isPkoDisabled: boolean = false;

  // PK Stock
  addpk: number = 0;
  isPkDisabled: boolean = false;

  // CPO Formatted Dates for Display
  cpoLogDateDisplay: string = '';
  cpoEntryDateDisplay: string = '';
  pkoLogDateDisplay: string = '';
  pkoEntryDateDisplay: string = '';
  pkLogDateDisplay: string = '';
  pkEntryDateDisplay: string = '';

  constructor(
    private translate: TranslateService,
    private userContext: UserContext,
    private languageService: LanguageService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private labService: LabService,
    private sterilizerService: SterilizerService,
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private platform: Platform,
  ) {
    // Initialize user data from UserContext
    this.userId = this.userContext.userId || 0;
    this.millCode = this.userContext.millCode || '';
    this.departmentId = this.userContext.departmentId || 0;
    this.designationId = this.userContext.designId || 0;
    this.language = this.languageService.getLanguage || 'English';

    // Set platform
    this.platformType = this.platform.is('android') ? 'android' : 'ios';

    // Set current date
    this.currentDateISO = this.getCurrentDateISO();
    this.currentDate = this.formatDateForDisplay(this.currentDateISO);

    // Initialize display dates
    const logDateISO = this.formatDateForISOString(this.logDate);
    this.cpoLogDateDisplay = this.formatDateForDisplay(logDateISO);
    this.cpoEntryDateDisplay = this.currentDate;
    this.pkoLogDateDisplay = this.formatDateForDisplay(logDateISO);
    this.pkoEntryDateDisplay = this.currentDate;
    this.pkLogDateDisplay = this.formatDateForDisplay(logDateISO);
    this.pkEntryDateDisplay = this.currentDate;

    // Initialize Forms
    this.initCpoForm();
    this.initPkoForm();
    this.initPkForm();

    // Subscribe to route params
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        this.getMaintenancePendingCount();
      });
  }

  ngOnInit(): void {}

  ionViewDidEnter(): void {
    this.pageHeader?.getNotificationApi();
  }

  /**
   * Initialize CPO Form
   */
  private initCpoForm(): void {
    this.cpoaddForm = this.fb.group({
      txt_logdate: new FormControl(this.cpoLogDateDisplay),
      txt_entrydate: new FormControl(this.cpoEntryDateDisplay),
      txt_broughtforward: new FormControl('', Validators.required),
      txt_storagetank1mt: new FormControl('', Validators.required),
      txt_storagetank1ffa: new FormControl('', Validators.required),
      txt_storagetank2mt: new FormControl('', Validators.required),
      txt_storagetank2ffa: new FormControl('', Validators.required),
      txt_storagetank3mt: new FormControl('', Validators.required),
      txt_storagetank3ffa: new FormControl('', Validators.required),
      txt_storagetank5mt: new FormControl('', Validators.required),
      txt_storagetank5ffa: new FormControl('', Validators.required),
      txt_storagetank6mt: new FormControl('', Validators.required),
      txt_storagetank6ffa: new FormControl('', Validators.required),
      txt_storagetank7mt: new FormControl('', Validators.required),
      txt_storagetank7ffa: new FormControl('', Validators.required),
    });
  }

  /**
   * Initialize PKO Form
   */
  private initPkoForm(): void {
    this.pkoaddForm = this.fb.group({
      txt_logdate: new FormControl(this.pkoLogDateDisplay),
      txt_entrydate: new FormControl(this.pkoEntryDateDisplay),
      txt_broughtforward: new FormControl('', Validators.required),
      txt_storagetank1mt: new FormControl('', Validators.required),
      txt_storagetank1ffa: new FormControl('', Validators.required),
      txt_storagetank2mt: new FormControl('', Validators.required),
      txt_storagetank2ffa: new FormControl('', Validators.required),
    });
  }

  /**
   * Initialize PK Form
   */
  private initPkForm(): void {
    this.pkaddForm = this.fb.group({
      txt_logdate: new FormControl(this.pkLogDateDisplay),
      txt_entrydate: new FormControl(this.pkEntryDateDisplay),
      txt_broughtforward: new FormControl('', Validators.required),
      txt_kernelsilo1mt: new FormControl('', Validators.required),
      txt_kernelsilo1ullage: new FormControl('', Validators.required),
      txt_kernelsilo2mt: new FormControl('', Validators.required),
      txt_kernelsilo2ullage: new FormControl('', Validators.required),
      txt_kernelsilo3mt: new FormControl('', Validators.required),
      txt_kernelsilo3ullage: new FormControl('', Validators.required),
      txt_kernelsilokernelbunkermt: new FormControl('', Validators.required),
      txt_kernelsilokernelbunkerullage: new FormControl(
        '',
        Validators.required,
      ),
      txt_floormt: new FormControl('', Validators.required),
      txt_floorullage: new FormControl('', Validators.required),
      txt_othersmt: new FormControl('', Validators.required),
      txt_othersullage: new FormControl('', Validators.required),
    });
  }

  /**
   * Get current date in YYYY-MM-DD format
   */
  private getCurrentDateISO(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Format date for display (DD-MM-YYYY)
   */
  private formatDateForDisplay(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  /**
   * Parse date from display format (DD-MM-YYYY) to ISO (YYYY-MM-DD)
   */
  private parseDateFromDisplay(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  /**
   * Format date to ISO string for datetime input
   */
  private formatDateForISOString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Segment Changed
   */
  segmentChanged(event: any): void {
    this.tabsSegment = event.detail.value;
  }

  /**
   * Get Maintenance Pending Count
   */
  getMaintenancePendingCount(): void {
    const req = {
      userid: this.userId,
      departmentid: this.departmentId,
      design_id: this.designationId,
      millcode: this.millCode,
      language: this.language,
    };

    this.sterilizerService
      .getmaintenancependingcount(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          this.zone.run(() => {
            if (result.httpcode == 200) {
              this.pendingCount = result.count || 0;
              this.pendingCountLength = this.pendingCount.toString().length;
              this.notificationCount = this.pendingCount;
            } else {
              this.pendingCount = 0;
              this.pendingCountLength = 0;
              this.notificationCount = 0;
            }
          });
        },
        error: (err) => {
          this.zone.run(() => {
            console.error('Failed to get pending count:', err);
            this.pendingCount = 0;
            this.pendingCountLength = 0;
            this.notificationCount = 0;
          });
        },
      });
  }

  /**
   * Navigate to Notification Page
   */
  btnNotification(): void {
    localStorage.setItem('badge_count', '0');
    this.router.navigate(['/segregatenotification']);
  }

  /**
   * Decimal Filter for Input
   */
  decimalFilter(event: KeyboardEvent): void {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    const input = (event.target as HTMLInputElement).value + event.key;
    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  // ============================================
  // CPO DATE PICKER METHODS
  // ============================================

  /**
   * Open CPO Log Date Picker
   */
  openCpoLogDatePicker(): void {
    const logDateISO = this.formatDateForISOString(this.logDate);
    this.tempCpoLogDate = logDateISO;
    this.isCpoLogDateModalOpen = true;
  }

  /**
   * CPO Log Date Changed
   */
  onCpoLogDateChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (!value) {
      return;
    }
    this.tempCpoLogDate = String(value).substring(0, 10);
  }

  /**
   * CPO Log Date Dismissed
   */
  onCpoLogDateDismiss(): void {
    if (this.tempCpoLogDate) {
      this.cpoLogDateDisplay = this.formatDateForDisplay(this.tempCpoLogDate);
      this.cpoaddForm.patchValue({
        txt_logdate: this.cpoLogDateDisplay,
      });
    }
    this.isCpoLogDateModalOpen = false;
  }

  /**
   * Open CPO Entry Date Picker
   */
  openCpoEntryDatePicker(): void {
    this.tempCpoEntryDate = this.currentDateISO;
    this.isCpoEntryDateModalOpen = true;
  }

  /**
   * CPO Entry Date Changed
   */
  onCpoEntryDateChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (!value) {
      return;
    }
    this.tempCpoEntryDate = String(value).substring(0, 10);
  }

  /**
   * CPO Entry Date Dismissed
   */
  onCpoEntryDateDismiss(): void {
    if (this.tempCpoEntryDate) {
      this.cpoEntryDateDisplay = this.formatDateForDisplay(
        this.tempCpoEntryDate,
      );
      this.cpoaddForm.patchValue({
        txt_entrydate: this.cpoEntryDateDisplay,
      });
    }
    this.isCpoEntryDateModalOpen = false;
  }

  // ============================================
  // PKO DATE PICKER METHODS
  // ============================================

  /**
   * Open PKO Log Date Picker
   */
  openPkoLogDatePicker(): void {
    const logDateISO = this.formatDateForISOString(this.logDate);
    this.tempPkoLogDate = logDateISO;
    this.isPkoLogDateModalOpen = true;
  }

  /**
   * PKO Log Date Changed
   */
  onPkoLogDateChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (!value) {
      return;
    }
    this.tempPkoLogDate = String(value).substring(0, 10);
  }

  /**
   * PKO Log Date Dismissed
   */
  onPkoLogDateDismiss(): void {
    if (this.tempPkoLogDate) {
      this.pkoLogDateDisplay = this.formatDateForDisplay(this.tempPkoLogDate);
      this.pkoaddForm.patchValue({
        txt_logdate: this.pkoLogDateDisplay,
      });
    }
    this.isPkoLogDateModalOpen = false;
  }

  /**
   * Open PKO Entry Date Picker
   */
  openPkoEntryDatePicker(): void {
    this.tempPkoEntryDate = this.currentDateISO;
    this.isPkoEntryDateModalOpen = true;
  }

  /**
   * PKO Entry Date Changed
   */
  onPkoEntryDateChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (!value) {
      return;
    }
    this.tempPkoEntryDate = String(value).substring(0, 10);
  }

  /**
   * PKO Entry Date Dismissed
   */
  onPkoEntryDateDismiss(): void {
    if (this.tempPkoEntryDate) {
      this.pkoEntryDateDisplay = this.formatDateForDisplay(
        this.tempPkoEntryDate,
      );
      this.pkoaddForm.patchValue({
        txt_entrydate: this.pkoEntryDateDisplay,
      });
    }
    this.isPkoEntryDateModalOpen = false;
  }

  // ============================================
  // PK DATE PICKER METHODS
  // ============================================

  /**
   * Open PK Log Date Picker
   */
  openPkLogDatePicker(): void {
    const logDateISO = this.formatDateForISOString(this.logDate);
    this.tempPkLogDate = logDateISO;
    this.isPkLogDateModalOpen = true;
  }

  /**
   * PK Log Date Changed
   */
  onPkLogDateChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (!value) {
      return;
    }
    this.tempPkLogDate = String(value).substring(0, 10);
  }

  /**
   * PK Log Date Dismissed
   */
  onPkLogDateDismiss(): void {
    if (this.tempPkLogDate) {
      this.pkLogDateDisplay = this.formatDateForDisplay(this.tempPkLogDate);
      this.pkaddForm.patchValue({
        txt_logdate: this.pkLogDateDisplay,
      });
    }
    this.isPkLogDateModalOpen = false;
  }

  /**
   * Open PK Entry Date Picker
   */
  openPkEntryDatePicker(): void {
    this.tempPkEntryDate = this.currentDateISO;
    this.isPkEntryDateModalOpen = true;
  }

  /**
   * PK Entry Date Changed
   */
  onPkEntryDateChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (!value) {
      return;
    }
    this.tempPkEntryDate = String(value).substring(0, 10);
  }

  /**
   * PK Entry Date Dismissed
   */
  onPkEntryDateDismiss(): void {
    if (this.tempPkEntryDate) {
      this.pkEntryDateDisplay = this.formatDateForDisplay(this.tempPkEntryDate);
      this.pkaddForm.patchValue({
        txt_entrydate: this.pkEntryDateDisplay,
      });
    }
    this.isPkEntryDateModalOpen = false;
  }

  // ============================================
  // CPO STOCK METHODS
  // ============================================

  /**
   * Calculate CPO Total
   */
  onCpoChange(getTank: string): void {
    let addTank = 0;
    const tank1mt = parseFloat(this.cpoaddForm.value.txt_storagetank1mt) || 0;
    const tank2mt = parseFloat(this.cpoaddForm.value.txt_storagetank2mt) || 0;
    const tank3mt = parseFloat(this.cpoaddForm.value.txt_storagetank3mt) || 0;
    const tank5mt = parseFloat(this.cpoaddForm.value.txt_storagetank5mt) || 0;
    const tank6mt = parseFloat(this.cpoaddForm.value.txt_storagetank6mt) || 0;
    const tank7mt = parseFloat(this.cpoaddForm.value.txt_storagetank7mt) || 0;

    addTank = tank1mt + tank2mt + tank3mt + tank5mt + tank6mt + tank7mt;
    this.addcpo = parseFloat(addTank.toFixed(2));
  }

  /**
   * Save CPO Stock
   */
  async cpoSave(): Promise<void> {
    // if (this.cpoaddForm.invalid) {
    //   this.toastService.error(
    //     this.translate.instant('GENERALBUTTON.pleasefilltheform'),
    //   );
    //   return;
    // }

    const alert = await this.alertController.create({
      mode: 'md',
      header: '',
      cssClass: 'customalertmessagetwobuttons',
      message: this.translate.instant('OILLOSSESSREPORT.savealert'),
      buttons: [
        {
          text: this.translate.instant('GENERALBUTTON.cancelbutton'),
          role: 'cancel',
        },
        {
          text: this.translate.instant('GENERALBUTTON.okay'),
          handler: () => {
            this.cpoSaveData();
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Save CPO Data
   */
  cpoSaveData(): void {
    this.isCpoDisabled = true;

    // Parse dates from DD-MM-YYYY to YYYY-MM-DD for API
    const logDate = this.parseDateFromDisplay(
      this.cpoaddForm.value.txt_logdate,
    );
    const entryDate = this.parseDateFromDisplay(
      this.cpoaddForm.value.txt_entrydate,
    );

    const req = {
      userid: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      design_id: this.designationId,
      id: 0,
      logdate: logDate,
      entrydate: entryDate,
      broughtforward: Number(this.cpoaddForm.value.txt_broughtforward),
      storagetank1mt: Number(this.cpoaddForm.value.txt_storagetank1mt),
      storagetank1ffa: Number(this.cpoaddForm.value.txt_storagetank1ffa),
      storagetank2mt: Number(this.cpoaddForm.value.txt_storagetank2mt),
      storagetank2ffa: Number(this.cpoaddForm.value.txt_storagetank2ffa),
      storagetank3mt: Number(this.cpoaddForm.value.txt_storagetank3mt),
      storagetank3ffa: Number(this.cpoaddForm.value.txt_storagetank3ffa),
      storagetank5mt: Number(this.cpoaddForm.value.txt_storagetank5mt),
      storagetank5ffa: Number(this.cpoaddForm.value.txt_storagetank5ffa),
      storagetank6mt: Number(this.cpoaddForm.value.txt_storagetank6mt),
      storagetank6ffa: Number(this.cpoaddForm.value.txt_storagetank6ffa),
      storagetank7mt: Number(this.cpoaddForm.value.txt_storagetank7mt),
      storagetank7ffa: Number(this.cpoaddForm.value.txt_storagetank7ffa),
      totalcpostock: this.addcpo,
    };

    this.labService
      .saveCPOStock(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          this.zone.run(() => {
            this.isCpoDisabled = false;
            if (result.httpcode == 200) {
              this.toastService.success(
                `CPO Stock ${this.translate.instant('STATUSSAVE.savedsuccessfully')}`,
              );
              // this.toastService.success('CPO Stock Saved Successfully');
              this.cpoClear();
            } else {
              this.toastService.success(
                `CPO Stock ${this.translate.instant('STATUSSAVE.savefailed')}`,
              );
              // this.toastService.error('CPO Stock Save Failed');
            }
          });
        },
        error: (err) => {
          this.zone.run(() => {
            this.isCpoDisabled = false;
            console.error('Failed to save CPO stock:', err);
            this.toastService.error('CPO Stock Save Failed');
          });
        },
      });
  }

  /**
   * Clear CPO Form
   */
  cpoClear(): void {
    const logDateISO = this.formatDateForISOString(this.logDate);
    this.cpoLogDateDisplay = this.formatDateForDisplay(logDateISO);
    this.cpoEntryDateDisplay = this.currentDate;

    this.cpoaddForm.patchValue({
      txt_logdate: this.cpoLogDateDisplay,
      txt_entrydate: this.cpoEntryDateDisplay,
      txt_broughtforward: '',
      txt_storagetank1mt: '',
      txt_storagetank1ffa: '',
      txt_storagetank2mt: '',
      txt_storagetank2ffa: '',
      txt_storagetank3mt: '',
      txt_storagetank3ffa: '',
      txt_storagetank5mt: '',
      txt_storagetank5ffa: '',
      txt_storagetank6mt: '',
      txt_storagetank6ffa: '',
      txt_storagetank7mt: '',
      txt_storagetank7ffa: '',
    });
    this.addcpo = 0;
  }

  // ============================================
  // PKO STOCK METHODS
  // ============================================

  /**
   * Calculate PKO Total
   */
  onPkoChange(getTank: string): void {
    let addTank = 0;
    const tank1mt = parseFloat(this.pkoaddForm.value.txt_storagetank1mt) || 0;
    const tank2mt = parseFloat(this.pkoaddForm.value.txt_storagetank2mt) || 0;

    addTank = tank1mt + tank2mt;
    this.addpko = parseFloat(addTank.toFixed(2));
  }

  /**
   * Save PKO Stock
   */
  async pkoSave(): Promise<void> {
    // if (this.pkoaddForm.invalid) {
    //   this.toastService.error(
    //     this.translate.instant('GENERALBUTTON.pleasefilltheform'),
    //   );
    //   return;
    // }

    const alert = await this.alertController.create({
      mode: 'md',
      header: '',
      cssClass: 'customalertmessagetwobuttons',
      message: this.translate.instant('OILLOSSESSREPORT.savealert'),
      buttons: [
        {
          text: this.translate.instant('GENERALBUTTON.cancelbutton'),
          role: 'cancel',
        },
        {
          text: this.translate.instant('GENERALBUTTON.okay'),
          handler: () => {
            this.pkoSaveData();
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Save PKO Data
   */
  pkoSaveData(): void {
    this.isPkoDisabled = true;

    const logDate = this.parseDateFromDisplay(
      this.pkoaddForm.value.txt_logdate,
    );
    const entryDate = this.parseDateFromDisplay(
      this.pkoaddForm.value.txt_entrydate,
    );

    const req = {
      userid: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      design_id: this.designationId,
      id: 0,
      logdate: logDate,
      entrydate: entryDate,
      broughtforward: Number(this.pkoaddForm.value.txt_broughtforward),
      storagetank1mt: Number(this.pkoaddForm.value.txt_storagetank1mt),
      storagetank1ffa: Number(this.pkoaddForm.value.txt_storagetank1ffa),
      storagetank2mt: Number(this.pkoaddForm.value.txt_storagetank2mt),
      storagetank2ffa: Number(this.pkoaddForm.value.txt_storagetank2ffa),
      totalpkostock: this.addpko,
    };

    this.labService
      .savePKOStock(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          this.zone.run(() => {
            this.isPkoDisabled = false;
            if (result.httpcode == 200) {
              this.toastService.success(
                `PKO Stock ${this.translate.instant('STATUSSAVE.savedsuccessfully')}`,
              );
              // this.toastService.success('PKO Stock Saved Successfully');
              this.pkoClear();
            } else {
              // this.toastService.error('PKO Stock Save Failed');
              this.toastService.success(
                `PKO Stock ${this.translate.instant('STATUSSAVE.savefailed')}`,
              );
            }
          });
        },
        error: (err) => {
          this.zone.run(() => {
            this.isPkoDisabled = false;
            console.error('Failed to save PKO stock:', err);
            this.toastService.error('PKO Stock Save Failed');
          });
        },
      });
  }

  /**
   * Clear PKO Form
   */
  pkoClear(): void {
    const logDateISO = this.formatDateForISOString(this.logDate);
    this.pkoLogDateDisplay = this.formatDateForDisplay(logDateISO);
    this.pkoEntryDateDisplay = this.currentDate;

    this.pkoaddForm.patchValue({
      txt_logdate: this.pkoLogDateDisplay,
      txt_entrydate: this.pkoEntryDateDisplay,
      txt_broughtforward: '',
      txt_storagetank1mt: '',
      txt_storagetank1ffa: '',
      txt_storagetank2mt: '',
      txt_storagetank2ffa: '',
    });
    this.addpko = 0;
  }

  // ============================================
  // PK STOCK METHODS
  // ============================================

  /**
   * Calculate PK Total
   */
  onPkChange(getTank: string): void {
    let addTank = 0;
    const silo1mt = parseFloat(this.pkaddForm.value.txt_kernelsilo1mt) || 0;
    const silo2mt = parseFloat(this.pkaddForm.value.txt_kernelsilo2mt) || 0;
    const silo3mt = parseFloat(this.pkaddForm.value.txt_kernelsilo3mt) || 0;
    const bunkerMt =
      parseFloat(this.pkaddForm.value.txt_kernelsilokernelbunkermt) || 0;
    const floorMt = parseFloat(this.pkaddForm.value.txt_floormt) || 0;
    const othersMt = parseFloat(this.pkaddForm.value.txt_othersmt) || 0;

    addTank = silo1mt + silo2mt + silo3mt + bunkerMt + floorMt + othersMt;
    this.addpk = parseFloat(addTank.toFixed(2));
  }

  /**
   * Save PK Stock
   */
  async pkSave(): Promise<void> {
    // if (this.pkaddForm.invalid) {
    //   this.toastService.error(
    //     this.translate.instant('GENERALBUTTON.pleasefilltheform'),
    //   );
    //   return;
    // }

    const alert = await this.alertController.create({
      mode: 'md',
      header: '',
      cssClass: 'customalertmessagetwobuttons',
      message: this.translate.instant('OILLOSSESSREPORT.savealert'),
      buttons: [
        {
          text: this.translate.instant('GENERALBUTTON.cancelbutton'),
          role: 'cancel',
        },
        {
          text: this.translate.instant('GENERALBUTTON.okay'),
          handler: () => {
            this.pkSaveData();
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Save PK Data
   */
  pkSaveData(): void {
    this.isPkDisabled = true;

    const logDate = this.parseDateFromDisplay(this.pkaddForm.value.txt_logdate);
    const entryDate = this.parseDateFromDisplay(
      this.pkaddForm.value.txt_entrydate,
    );

    const req = {
      userid: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      design_id: this.designationId,
      id: 0,
      logdate: logDate,
      entrydate: entryDate,
      broughtforward: Number(this.pkaddForm.value.txt_broughtforward),
      kernelsilo1mt: Number(this.pkaddForm.value.txt_kernelsilo1mt),
      kernelsilo1ullage: Number(this.pkaddForm.value.txt_kernelsilo1ullage),
      kernelsilo2mt: Number(this.pkaddForm.value.txt_kernelsilo2mt),
      kernelsilo2ullage: Number(this.pkaddForm.value.txt_kernelsilo2ullage),
      kernelsilo3mt: Number(this.pkaddForm.value.txt_kernelsilo3mt),
      kernelsilo3ullage: Number(this.pkaddForm.value.txt_kernelsilo3ullage),
      kernelbunkermt: Number(this.pkaddForm.value.txt_kernelsilokernelbunkermt),
      kernelbunkerullage: Number(
        this.pkaddForm.value.txt_kernelsilokernelbunkerullage,
      ),
      floormt: Number(this.pkaddForm.value.txt_floormt),
      floorullage: Number(this.pkaddForm.value.txt_floorullage),
      othersmt: Number(this.pkaddForm.value.txt_othersmt),
      othersullage: Number(this.pkaddForm.value.txt_othersullage),
      totalpkstock: this.addpk,
    };

    this.labService
      .savePKStock(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          this.zone.run(() => {
            this.isPkDisabled = false;
            if (result.httpcode == 200) {
              this.toastService.success(
                `PK Stock ${this.translate.instant('STATUSSAVE.savedsuccessfully')}`,
              );
              // this.toastService.success('PK Stock Saved Successfully');
              this.pkClear();
            } else {
              this.toastService.success(
                `PK Stock ${this.translate.instant('STATUSSAVE.savefailed')}`,
              );
              // this.toastService.error('PK Stock Save Failed');
            }
          });
        },
        error: (err) => {
          this.zone.run(() => {
            this.isPkDisabled = false;
            console.error('Failed to save PK stock:', err);
            this.toastService.error('PK Stock Save Failed');
          });
        },
      });
  }

  /**
   * Clear PK Form
   */
  pkClear(): void {
    const logDateISO = this.formatDateForISOString(this.logDate);
    this.pkLogDateDisplay = this.formatDateForDisplay(logDateISO);
    this.pkEntryDateDisplay = this.currentDate;

    this.pkaddForm.patchValue({
      txt_logdate: this.pkLogDateDisplay,
      txt_entrydate: this.pkEntryDateDisplay,
      txt_broughtforward: '',
      txt_kernelsilo1mt: '',
      txt_kernelsilo1ullage: '',
      txt_kernelsilo2mt: '',
      txt_kernelsilo2ullage: '',
      txt_kernelsilo3mt: '',
      txt_kernelsilo3ullage: '',
      txt_kernelsilokernelbunkermt: '',
      txt_kernelsilokernelbunkerullage: '',
      txt_floormt: '',
      txt_floorullage: '',
      txt_othersmt: '',
      txt_othersullage: '',
    });
    this.addpk = 0;
  }

  /**
   * Convert newlines to <br> tags
   */
  private nl2br(text: string): string {
    if (!text) return '';
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
