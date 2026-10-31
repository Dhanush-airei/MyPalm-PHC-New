/* sterilizer-dashboard.page.ts */

import {
  Component,
  OnInit,
  DestroyRef,
  inject,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { filter, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { SterilizerService } from 'src/app/shared/services/production-services/sterilizer-service/sterilizer-service';
import { DooropenlaterUpdateModalPage } from 'src/app/pages/production/sterilizer/dooropenlater-update-modal/dooropenlater-update-modal.page';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-sterilizer-dashboard',
  templateUrl: './sterilizer-dashboard.page.html',
  styleUrls: ['./sterilizer-dashboard.page.scss'],
  standalone: false,
})
export class SterilizerDashboardPage implements OnInit, AfterViewInit {
  private destroyRef = inject(DestroyRef);

  @ViewChild('pageHeader')
  pageHeader!: PageHeaderComponent;

  // Header Configuration
  appTitle: string = '';
  headerActions = '2';
  showLogo = 1;
  showBackButton = 0;

  // User Data
  flowFlag: number = 0;
  getLanguage: string = '';
  pressDataEnableFlag: number = 0;

  // Arrays
  pressStationAlertArr: any[] = [];
  sterilizerListArr: any[] = [];
  sterilizerStationAlertArr: any[] = [];
  sterilizerSensorListArr: any[] = [];

  // Flags
  enableFlag: boolean = false;
  uiNoRecordFlag: boolean = true;
  pleaseWaitFlag: boolean = false;
  noRecordFlag: boolean = false;

  // Computed flags
  isPressStationUser: boolean = false;
  isSterilizerStationUser: boolean = false;

  // Notification Counts
  count: number = 0;
  pendingcount: number = 0;
  pendingcountlength: number = 0;

  /** Timestamp of the last data refresh — used to debounce multiple
   *  lifecycle triggers that happen within a very short window. */
  private lastRefreshTime: number = 0;

  /** Debounce window in milliseconds. If a refresh happens within
   *  this window, subsequent triggers are ignored. */
  private readonly REFRESH_DEBOUNCE_MS = 400;

  constructor(
    private modalController: ModalController,
    private router: Router,
    private userContext: UserContext,
    private sterilizerService: SterilizerService,
    private languageService: LanguageService,
  ) {
    console.log('[SterilizerDashboard] constructor');
    this.getProductionPendingCount();
  }

  ngOnInit(): void {
    console.log('[SterilizerDashboard] ngOnInit');

    // Initialize the user data once on creation.
    this.initializeUserData();

    // Initial load (when arriving for the first time).
    this.refreshData();

    // Subscribe to router NavigationEnd. This is the RELIABLE hook:
    // whenever Angular finishes navigating TO this page, we refresh.
    this.router.events
      .pipe(
        filter(
          (event: RouterEvent): event is NavigationEnd =>
            event instanceof NavigationEnd,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event: NavigationEnd) => {
        console.log(
          '[SterilizerDashboard] NavigationEnd ->',
          event.urlAfterRedirects,
        );

        // Only refresh when the navigation target is this dashboard.
        // Adjust the string check if your route path differs.
        if (
          event.urlAfterRedirects.includes('sterilizer-dashboard') ||
          event.urlAfterRedirects.includes('tabs/sterilizer-dashboard')
        ) {
          this.refreshData();
        }
      });
  }

  ngAfterViewInit(): void {
    // ViewChild is now resolved — safe to call header methods.
    if (this.pageHeader) {
      this.pageHeader.getNotificationApi();
    }
  }

  /**
   * Ionic hook — fires every time the view is about to enter (including
   * tab switches when Ionic properly tracks the page). Kept as a second
   * trigger in case the router NavigationEnd check misses.
   */
  ionViewWillEnter(): void {
    console.log('[SterilizerDashboard] ionViewWillEnter');
    this.refreshData();

    if (this.pageHeader) {
      this.pageHeader.getNotificationApi();
    }
  }

  /**
   * Central refresh method. Uses a debounce so multiple triggers
   * (ionViewWillEnter + NavigationEnd) within the same navigation
   * do not cause duplicate API calls.
   */
  private refreshData(): void {
    const now = Date.now();
    if (now - this.lastRefreshTime < this.REFRESH_DEBOUNCE_MS) {
      console.log('[SterilizerDashboard] refresh skipped (debounced)');
      return;
    }
    this.lastRefreshTime = now;

    console.log('[SterilizerDashboard] refreshing data...');

    // Re-initialize user data in case the context changed
    // (e.g. after login / designation change).
    this.initializeUserData();

    // Trigger the correct API based on user role.
    this.loadDataBasedOnUserRole();

    // Refresh the pending count too.
    this.getProductionPendingCount();
  }

  /**
   * Initialize user data from UserContext
   */
  private initializeUserData(): void {
    this.appTitle = this.nl2br(this.userContext.millName);
    this.flowFlag = this.userContext.sterilizer_sensor_flag ?? 0;
    this.getLanguage = this.languageService.getLanguage;

    this.isPressStationUser = this.userContext.designId == 7;
    this.isSterilizerStationUser = this.userContext.designId == 8;

    console.log('User Designation:', this.userContext.designId);
    console.log('Is Press Station User:', this.isPressStationUser);
    console.log('Is Sterilizer Station User:', this.isSterilizerStationUser);
  }

  /**
   * Load data based on user designation
   */
  private loadDataBasedOnUserRole(): void {
    if (this.isPressStationUser) {
      this.getPressStationAlertData();
    } else if (this.isSterilizerStationUser) {
      if (this.flowFlag == 0) {
        this.getDoorOpenData();
      } else {
        this.getSterilizersSensorData();
      }
    }
  }

  /**
   * Get Press Station Alert Data
   */
  getPressStationAlertData(): void {
    const req = {
      userid: this.userContext.userId,
      millcode: this.userContext.millCode,
      dept_id: this.userContext.departmentId,
      design_id: this.userContext.designId,
      language: this.languageService.getLanguage,
    };

    this.pleaseWaitFlag = true;

    this.sterilizerService
      .getPressStationAlertData(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleaseWaitFlag = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          if (response?.httpcode == 200) {
            this.pressDataEnableFlag = response.pressdataenableflag || 0;
            this.pressStationAlertArr = response.data || [];
            this.enableFlag = false;
          } else {
            this.pressDataEnableFlag = 0;
            this.pressStationAlertArr = [];
            this.enableFlag = true;
          }
        },
        error: (err) => {
          console.error('Failed to load press station alert data:', err);
          this.pressDataEnableFlag = 0;
          this.pressStationAlertArr = [];
          this.enableFlag = true;
        },
      });
  }

  /**
   * Get Door Open Later Data (Flow Flag = 0)
   */
  getDoorOpenData(): void {
    const req = {
      userid: this.userContext.userId,
      millcode: this.userContext.millCode,
      dept_id: this.userContext.departmentId,
      design_id: this.userContext.designId,
      language: this.languageService.getLanguage,
    };

    this.pleaseWaitFlag = true;

    this.sterilizerService
      .getDoorOpenLaterData(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleaseWaitFlag = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          if (response?.httpcode == 200) {
            this.sterilizerListArr = response.data || [];
            this.uiNoRecordFlag = true;
          } else {
            this.sterilizerListArr = [];
            this.uiNoRecordFlag = false;
            this.getSterilizerStationAlertData();
          }
        },
        error: (err) => {
          console.error('Failed to load door open later data:', err);
          this.sterilizerListArr = [];
          this.uiNoRecordFlag = false;
          this.getSterilizerStationAlertData();
        },
      });
  }

  /**
   * Get Sterilizer Station Alert Data (Flow Flag = 0 - Fallback)
   */
  getSterilizerStationAlertData(): void {
    const req = {
      userid: this.userContext.userId,
      millcode: this.userContext.millCode,
      dept_id: this.userContext.departmentId,
      language: this.languageService.getLanguage,
    };

    this.pleaseWaitFlag = true;

    this.sterilizerService
      .getSterilizerStationAlertData(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleaseWaitFlag = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          if (response?.httpcode == 200) {
            this.sterilizerStationAlertArr = response.data || [];
            this.enableFlag = false;
          } else {
            this.sterilizerStationAlertArr = [];
            this.enableFlag = true;
          }
        },
        error: (err) => {
          console.error('Failed to load sterilizer station alert data:', err);
          this.sterilizerStationAlertArr = [];
          this.enableFlag = true;
        },
      });
  }

  /**
   * Get Sterilizer Sensor Data (Flow Flag = 1)
   */
  getSterilizersSensorData(): void {
    const req = {
      userid: this.userContext.userId,
      millcode: this.userContext.millCode,
      dept_id: this.userContext.departmentId,
      design_id: this.userContext.designId,
      language: this.languageService.getLanguage,
      fromdate: '',
    };

    this.noRecordFlag = false;
    this.pleaseWaitFlag = true;

    this.sterilizerService
      .getSterilizerSensorData(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleaseWaitFlag = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          if (response?.httpcode == 200) {
            this.sterilizerSensorListArr = response.data || [];
            this.noRecordFlag = false;
          } else {
            this.sterilizerSensorListArr = [];
            this.noRecordFlag = true;
          }
        },
        error: (err) => {
          console.error('Failed to load sterilizer sensor data:', err);
          this.sterilizerSensorListArr = [];
          this.noRecordFlag = true;
        },
      });
  }

  /**
   * Get production pending count
   */
  getProductionPendingCount(): void {
    const req = {
      userid: this.userContext.userId,
      departmentid: this.userContext.departmentId,
      design_id: this.userContext.designId,
      millcode: this.userContext.millCode,
      language: this.languageService.getLanguage,
    };

    this.sterilizerService
      .getmaintenancependingcount(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          if (result.httpcode == 200) {
            this.pendingcount = result.count;
            this.pendingcountlength = this.pendingcount.toString().length;
          } else {
            this.pendingcount = 0;
            this.pendingcountlength = this.pendingcount.toString().length;
          }
        },
        error: (err) => {
          console.error('Failed to get pending count:', err);
          this.pendingcount = 0;
          this.pendingcountlength = this.pendingcount.toString().length;
        },
      });
  }

  /**
   * Navigate to Press Station Page
   */
  btnPressStation(): void {
    this.router.navigate(['/production-hourly-press-station']);
  }

  /**
   * Navigate to Sterilizer Station Page
   */
  btnSterilizerStation(): void {
    console.log('Navigating to Sterilizer Station...');
    this.router.navigate([
      '/production-hourly-sterilizer-station',
      { item: '' },
    ]);
  }

  /**
   * Navigate to Update Sensor Data Page
   */
  btnUpdateSensorData(value: any): void {
    this.router.navigate([
      '/production-hourly-sterilizer-station',
      { item: JSON.stringify(value) },
    ]);
  }

  /**
   * Open Modal for Door Open Later Update
   */
  async callModalController(value: any): Promise<void> {
    const modal = await this.modalController.create({
      component: DooropenlaterUpdateModalPage,
      componentProps: {
        item: JSON.stringify(value),
      },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: ['notification-modal'],
    });
    modal.onDidDismiss().then((modalData: any) => {
      const getdata = modalData?.data?.item;
      if (getdata !== '') {
        this.getDoorOpenData();
      }
    });
    await modal.present();
  }

  /**
   * Convert newline to <br>
   */
  nl2br(text: string): string {
    if (!text) return '';
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
