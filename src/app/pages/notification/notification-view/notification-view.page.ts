import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  DestroyRef,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { NotificationService } from 'src/app/shared/services/notification-service/notification-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';

import { ImageSliderComponent } from 'src/app/shared/components/image-slider/image-slider.component';
import { AlertAcknowledgePage } from 'src/app/pages/production/sterilizer/alert-acknowledge/alert-acknowledge.page';
import { WeighbridgeUpdateReportPage } from '../../production/weighbridge/weighbridge-update-report/weighbridge-update-report.page';

type NotificationSource = 'alert' | 'general';

@Component({
  selector: 'app-notification-view',
  templateUrl: './notification-view.page.html',
  styleUrls: ['./notification-view.page.scss'],
  standalone: false,
})
export class NotificationViewPage implements OnInit, OnDestroy {
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  // ---------- Header Config ----------
  appTitle: string = this.translate.instant('NOTIFICATION.title');
  headerActions: string = '';
  showLogo: number = 0;
  notificationBackButton: number = 1;

  // ---------- User Context ----------
  userContext = inject(UserContext);

  // ---------- TAB: ALERTS ----------
  alertTodaysArr: any[] = [];
  alertOlderArr: any[] = [];
  alertTodaysCount: number = 0;
  alertOlderCount: number = 0;
  alertTodaysFlag: boolean = false;
  alertOlderFlag: boolean = false;
  alertTodaysClick: number = 0;
  alertOlderClick: number = 0;
  alertEnableFlag: boolean = false;

  // ---------- TAB: MAINTENANCE / REMAINDER ----------
  maintTodaysArr: any[] = [];
  maintOlderArr: any[] = [];
  maintTodaysCount: number = 0;
  maintOlderCount: number = 0;
  maintTodaysFlag: boolean = false;
  maintOlderFlag: boolean = false;
  maintTodaysClick: number = 0;
  maintOlderClick: number = 0;
  maintEnableFlag: boolean = false;

  isDisable: boolean = false;
  isModalActive: boolean = false;

  currentdate: string = '';
  filterstatus: string = '';

  // Segment — default Alerts
  selectedTab: string = 'alerts';

  // Debounce guards
  private lastAlertLoad: number = 0;
  private lastMaintLoad: number = 0;

  // Designations handled on this page
  private readonly ALLOWED_DESIGNATIONS: number[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 15,
  ];

  // Segmented designations (have tabs)
  private readonly SEGMENTED_DESIGNATIONS: number[] = [2, 7, 8];

  // Designations whose ALERT tab uses the alert API
  private readonly ALERT_DESIGNATIONS: number[] = [2, 3, 7, 8];

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private alertController: AlertController,
    public modalController: ModalController,
    private router: Router,
    private location: Location,
    private toastService: ToastService,
  ) {
    this.setCurrentDate();
  }

  // ============================================================
  // Getters
  // ============================================================
  get designationid(): number {
    return this.parseNumber(this.userContext.designId);
  }

  get departmentid(): number {
    return this.parseNumber(this.userContext.departmentId);
  }

  get oillossnotificationflag(): number {
    return this.parseNumber(this.userContext.oilloss_notification_flag);
  }

  private parseNumber(value: any): number {
    if (value === null || value === undefined || value === '') return 0;
    const n = Number(value);
    return isNaN(n) ? 0 : n;
  }

  // ============================================================
  // Lifecycle
  // ============================================================
  ngOnInit(): void {
    this.scheduleLoad();
  }

  ionViewWillEnter(): void {
    this.scheduleLoad();
  }

  ngOnDestroy(): void {}

  private scheduleLoad(): void {
    const fired = this.loadDataBasedOnDesignation();

    if (!fired) {
      setTimeout(() => {
        const retry1 = this.loadDataBasedOnDesignation();
        if (!retry1) {
          setTimeout(() => this.loadDataBasedOnDesignation(), 300);
        }
      }, 0);
    }
  }

  // ============================================================
  // Segment change
  // ============================================================
  onTabChange(event: any): void {
    const newTab = event.detail.value;
    if (newTab === this.selectedTab) return;

    this.selectedTab = newTab;
    this.cdr.detectChanges();

    this.loadForTab(newTab);
  }

  private loadDataBasedOnDesignation(): boolean {
    const designation = this.designationid;

    if (!designation) {
      console.warn(
        '[NotificationView] designation not ready yet:',
        designation,
      );
      return false;
    }

    if (!this.ALLOWED_DESIGNATIONS.includes(designation)) {
      console.warn('[NotificationView] designation not allowed:', designation);
      return true;
    }

    if (this.SEGMENTED_DESIGNATIONS.includes(designation)) {
      this.loadForTab(this.selectedTab);
    } else if (this.ALERT_DESIGNATIONS.includes(designation)) {
      this.getAlert();
    } else {
      this.getNotification();
    }
    return true;
  }

  private loadForTab(tab: string): void {
    switch (tab) {
      case 'alerts':
        if (this.shouldSkip('alert')) return;
        this.getAlert();
        break;

      case 'maintenance':
      case 'remainder':
        if (this.shouldSkip('maint')) return;
        this.getNotification();
        break;

      default:
        break;
    }
  }

  private shouldSkip(kind: 'alert' | 'maint'): boolean {
    const now = Date.now();
    if (kind === 'alert') {
      if (now - this.lastAlertLoad < 500) {
        console.log('[NotificationView] debounced alert load');
        return true;
      }
      this.lastAlertLoad = now;
    } else {
      if (now - this.lastMaintLoad < 500) {
        console.log('[NotificationView] debounced maintenance load');
        return true;
      }
      this.lastMaintLoad = now;
    }
    return false;
  }

  private setCurrentDate(): void {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    this.currentdate = `${day}-${month}-${year}`;
  }

  // ============================================================
  // Color helpers
  // ============================================================
  getBorderColor(value: any): string {
    const v = String(value);
    if (v === '1') return '#FF9800';
    if (v === '2') return '#03A9F4';
    if (v === '3') return '#F44336';
    if (v === '4') return '#4CAF50';
    if (v === '6') return '#B82E8A';
    return '#ffffff';
  }

  getBackgroundColor(value: any): string {
    const v = String(value);
    if (v === '1') return '#FFF3E0';
    if (v === '2') return '#E1F5FE';
    if (v === '3') return '#FFEBEE';
    if (v === '4') return '#E8F5E9';
    if (v === '6') return '#FAEBF5';
    return '#ffffff';
  }

  getTextColor(_value: any): string {
    return '#ffffff';
  }

  // ============================================================
  // Toggles — ALERT tab
  // ============================================================
  getAlertTodays(): void {
    this.alertTodaysClick = this.alertTodaysClick === 0 ? 1 : 0;
    this.alertOlderClick = 0;
    this.alertTodaysFlag = this.alertTodaysClick === 1;
    this.alertOlderFlag = false;
  }

  getAlertOlder(): void {
    this.alertTodaysClick = 0;
    this.alertOlderClick = this.alertOlderClick === 0 ? 1 : 0;
    this.alertTodaysFlag = false;
    this.alertOlderFlag = this.alertOlderClick === 1;
  }

  // ============================================================
  // Toggles — MAINTENANCE / REMAINDER tab
  // ============================================================
  getMaintTodays(): void {
    this.maintTodaysClick = this.maintTodaysClick === 0 ? 1 : 0;
    this.maintOlderClick = 0;
    this.maintTodaysFlag = this.maintTodaysClick === 1;
    this.maintOlderFlag = false;
  }

  getMaintOlder(): void {
    this.maintTodaysClick = 0;
    this.maintOlderClick = this.maintOlderClick === 0 ? 1 : 0;
    this.maintTodaysFlag = false;
    this.maintOlderFlag = this.maintOlderClick === 1;
  }

  // ============================================================
  // API: Alert notifications
  // ============================================================
  getAlert(): void {
    const req = {
      userid: this.userContext.userId,
      departmentid: this.userContext.departmentId,
      designationid: this.userContext.designId,
      millcode: this.userContext.millCode,
      filter: '4',
      language: this.languageService.getLanguage,
    };

    console.log('[NotificationView] getAlert req:', req);

    this.notificationService
      .getalertnotification(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          console.log('[NotificationView] getAlert res:', result);

          if (result?.httpcode == 200) {
            this.alertTodaysCount = result.todaycount ?? 0;
            this.alertOlderCount = result.oldercount ?? 0;

            this.alertTodaysArr = (result.data?.today ?? []).map((item: any) =>
              this.mapAlertItem(item),
            );
            this.alertOlderArr = (result.data?.older ?? []).map((item: any) =>
              this.mapAlertItem(item),
            );

            this.alertEnableFlag = false;
          } else {
            this.alertTodaysCount = 0;
            this.alertOlderCount = 0;
            this.alertTodaysArr = [];
            this.alertOlderArr = [];
            this.alertEnableFlag = true;
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('[NotificationView] getAlert error:', err);
          this.alertTodaysCount = 0;
          this.alertOlderCount = 0;
          this.alertTodaysArr = [];
          this.alertOlderArr = [];
          this.alertEnableFlag = true;
          this.cdr.detectChanges();
        },
      });
  }

  private mapAlertItem(item: any): any {
    return {
      redirect: item.redirect,
      rectify_status: item.rectify_status,
      notification_date: item.notification_date,
      rectify_remarks: item.rectify_remarks,
      id: item.id,
      baseid: item.baseid,
      title: item.title,
      notification_text: this.nl2br(item.notification_text),
      status: item.status,
      type: item.type,
      images: item.images ?? '',
    };
  }

  // ============================================================
  // API: General segregation notifications
  // ============================================================
  getNotification(): void {
    const designation = this.designationid;

    if (designation === 1 || designation === 3) {
      this.filterstatus = '4';
    } else if ([7, 8, 9, 15].includes(designation)) {
      this.filterstatus = '3';
    } else if ([2, 4, 5, 6, 11].includes(designation)) {
      this.filterstatus = '2';
    } else {
      this.filterstatus = '';
    }

    const req = {
      userid: this.userContext.userId,
      departmentid: this.userContext.departmentId,
      designationid: this.userContext.designId,
      millcode: this.userContext.millCode,
      filter: this.filterstatus,
      language: this.languageService.getLanguage,
    };

    console.log('[NotificationView] getNotification req:', req);

    this.notificationService
      .getsegregatenotification(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          console.log('[NotificationView] getNotification res:', result);

          if (result?.httpcode == 200) {
            this.maintTodaysCount = result.todaycount ?? 0;
            this.maintOlderCount = result.oldercount ?? 0;
            this.maintTodaysArr = result.data?.today ?? [];
            this.maintOlderArr = result.data?.older ?? [];
            this.maintEnableFlag = false;
          } else {
            this.maintTodaysCount = 0;
            this.maintOlderCount = 0;
            this.maintTodaysArr = [];
            this.maintOlderArr = [];
            this.maintEnableFlag = true;
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('[NotificationView] getNotification error:', err);
          this.maintTodaysCount = 0;
          this.maintOlderCount = 0;
          this.maintTodaysArr = [];
          this.maintOlderArr = [];
          this.maintEnableFlag = true;
          this.cdr.detectChanges();
        },
      });
  }

  // ============================================================
  // Rectify / Not-rectify
  // ============================================================
  btn_rectify(value: any): void {
    this.alertModalController(value);
  }

  async btn_notrectify(value: any): Promise<void> {
    const alertmessage = this.translate.instant('ALERTACKNOWLEDGE.reasontitle');

    const alert = await this.alertController.create({
      mode: 'md',
      header: '',
      message: alertmessage,
      cssClass: 'customalertmessagetwobuttons',
      backdropDismiss: false,
      inputs: [
        {
          name: 'reason',
          type: 'textarea',
          cssClass: 'alertinput',
          placeholder: this.translate.instant(
            'ALERTACKNOWLEDGE.reasonplaceholder',
          ),
        },
      ],
      buttons: [
        { text: '', role: 'cancel' },
        {
          text: '',
          handler: (data: any) => {
            if (data?.reason && data.reason.trim() !== '') {
              this.save(data.reason, '2', value.baseid, value.id, value.type);
              return true;
            }
            this.toastService.error(
              this.translate.instant('ALERTACKNOWLEDGE.reasonmandatory'),
            );
            return false;
          },
        },
      ],
    });

    await alert.present();
  }

  // ============================================================
  // API: Save rectify status
  // ============================================================
  save(
    getreason: string,
    getrectifystatus: string,
    getbaseid: any,
    getid: any,
    gettype: any,
  ): void {
    const req = {
      userid: this.userContext.userId,
      departmentid: this.userContext.departmentId,
      designationid: this.userContext.designId,
      millcode: this.userContext.millCode,
      baseid: getbaseid,
      id: getid,
      type: gettype,
      rectify_status: getrectifystatus,
      remarks: getreason,
      language: this.languageService.getLanguage,
    };

    this.notificationService
      .updatealertnotification(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          this.isDisable = false;
          if (result?.httpcode == 200) {
            this.toastService.success(
              this.translate.instant('ALERTACKNOWLEDGE.acknowledgementsuccess'),
            );
            this.getAlert();
          } else {
            this.toastService.error(
              this.translate.instant('ALERTACKNOWLEDGE.acknowledgementfailed'),
            );
          }
        },
        error: (err) => {
          console.error('[NotificationView] save error:', err);
          this.isDisable = false;
          this.toastService.error(
            this.translate.instant('ALERTACKNOWLEDGE.acknowledgementfailed'),
          );
        },
      });
  }

  // ============================================================
  // Mark notification as read  →  then route to the target page
  //
  // `source` tells us which list the card came from:
  //   'alert'   → Alerts tab       (uses getalertnotification)
  //   'general' → Reminder / Maint / other designations
  //               (uses getsegregatenotification)
  // ============================================================
  updateNotification(value: any, source: NotificationSource = 'general'): void {
    if (value.redirect == 'WEIGHBRIDGE WEIGHT UPDATE') {
      this.updateWeight(value);
      return;
    }

    // ---- Alert-source branch ---------------------------------
    if (source === 'alert') {
      const req = {
        user_id: this.userContext.userId,
        millcode: this.userContext.millCode,
        id: value.id,
        filter: this.filterstatus || '4',
        language: this.languageService.getLanguage,
      };

      this.notificationService
        .deletedasboardnotification(req)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (result: any) => {
            if (result?.httpcode == 200) {
              this.callModalController(value);
            } else {
              this.toastService.error(
                this.translate.instant('SEGREGATENOTIFICATION.message'),
              );
            }
          },
          error: (err) => {
            console.error('[NotificationView] updateNotification error:', err);
            this.toastService.error(
              this.translate.instant('SEGREGATENOTIFICATION.message'),
            );
          },
        });
      return;
    }

    // ---- General-source branch (Reminder, Maintenance, others)
    const req = {
      user_id: this.userContext.userId,
      millcode: this.userContext.millCode,
      id: value.id,
      filter: this.filterstatus,
      language: this.languageService.getLanguage,
    };

    this.notificationService
      .deletedasboardnotification(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          if (result?.httpcode == 200) {
            // Always hand off to redirectController → it reloads the list
            // AND navigates for HOURLY PRESS / STERILIZER / OIL LOSS / etc.
            this.redirectController(value);
          } else {
            this.toastService.error(
              this.translate.instant('SEGREGATENOTIFICATION.message'),
            );
          }
        },
        error: (err) => {
          console.error('[NotificationView] updateNotification error:', err);
          this.toastService.error(
            this.translate.instant('SEGREGATENOTIFICATION.message'),
          );
        },
      });
  }

  // ============================================================
  // Alert flow — reload list + optional redirect
  // ============================================================
  callModalController(value: any): void {
    // Reload the list the card came from
    if (this.designationid == 2 || this.designationid == 8) {
      // These users opened the Alerts tab — reload alerts
      this.getAlert();
    } else {
      this.getNotification();
    }

    // Delegate all redirect handling to one place
    this.redirectController(value, /*reload*/ false);
  }

  // ============================================================
  // View Images
  // ============================================================
  async btn_ViewImages(images: string): Promise<void> {
    if (images && images !== '') {
      const modal = await this.modalController.create({
        component: ImageSliderComponent,
        componentProps: {
          from: 'Alert',
          alertitem: images,
        },
        cssClass: 'image-slider-modal',
      });

      await modal.present();
    }
  }

  // ============================================================
  // Redirect logic — single source of truth for navigation
  //
  // `reload` (default true): reload the correct list before
  // navigating. `callModalController` passes `false` because it
  // has already reloaded.
  // ============================================================
  redirectController(value: any, reload: boolean = true): void {
    if (reload) {
      // Choose the list to refresh based on the current tab / designation
      const designation = this.designationid;
      const isAlertContext =
        this.ALERT_DESIGNATIONS.includes(designation) &&
        this.selectedTab === 'alerts';

      if (isAlertContext) {
        this.getAlert();
      } else {
        this.getNotification();
      }
    }

    const redirect = value.redirect;
    const designation = this.designationid;
    const isTabMaintenanceUser = designation === 5 || designation === 11;

    switch (redirect) {
      case 'CORRECTIVE MAINTENANCE NOTIFICATION':
      case 'ROUTINE PREVENTIVE MAINTENANCE NOTIFICATION':
      case 'REPLACEMENT PREVENTIVE MAINTENANCE NOTIFICATION':
        localStorage.setItem('notificationdata', redirect);
        if (isTabMaintenanceUser) {
          this.router.navigate(['/tabs']);
        } else {
          const target =
            redirect == 'CORRECTIVE MAINTENANCE NOTIFICATION'
              ? '/tabs/maintenance-cm'
              : '/tabs/maintenance-pm';
          this.router.navigate([target]);
        }
        break;

      case 'CORRECTIVE MAINTENANCE NOTIFICATION ACKNOWLEDGEMENT':
        localStorage.setItem('notificationdata', redirect);
        this.router.navigate(['/tabs/maintenance-cm']);
        break;

      case 'ROUTINE PREVENTIVE MAINTENANCE NOTIFICATION ACKNOWLEDGEMENT':
      case 'REPLACEMENT PREVENTIVE MAINTENANCE NOTIFICATION ACKNOWLEDGEMENT':
        localStorage.setItem('notificationdata', redirect);
        this.router.navigate(['/tabs/maintenance-pm']);
        break;

      // ✅ Fix: designation 7 Reminder → HOURLY PRESS now reaches here
      case 'HOURLY PRESS':
        this.router.navigate(['/production-hourly-press-station']);
        break;

      case 'HOURLY STERILIZER':
        this.router.navigate([
          '/production-hourlysterilizerstation',
          { item: '' },
        ]);
        break;

      case 'HOURLY OIL LOSS':
        this.router.navigate(['/tabs']);
        break;

      case 'HIGH OIL LOSS':
        this.router.navigate(['/dashboard-oilloss-predictionanalysis']);
        break;

      case 'CPO PRODUCTION':
        this.router.navigate(['/report-cpoproduction-and-oer']);
        break;

      default:
        break;
    }
  }

  // ============================================================
  // Modal: Alert Acknowledge
  // ============================================================
  async alertModalController(value: any): Promise<void> {
    this.isModalActive = true;

    const modal = await this.modalController.create({
      component: AlertAcknowledgePage,
      componentProps: { item: JSON.stringify(value) },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: ['alertattend-modal'],
    });

    modal.onDidDismiss().then(() => {
      this.isModalActive = false;
      this.getAlert();
    });

    await modal.present();
  }

  // ============================================================
  // Modal: Weighbridge Update
  // ============================================================
  async updateWeight(value: any): Promise<void> {
    const weighbridgemodal = await this.modalController.create({
      component: WeighbridgeUpdateReportPage,
      componentProps: {
        item: JSON.stringify(value),
        module: 'NOTIFICATION SCREEN',
      },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: ['weighbridgepopup-modal'],
    });

    weighbridgemodal.onDidDismiss().then((modaldata) => {
      const getdata = modaldata?.data?.item;
      if (getdata !== '') {
        this.getNotification();
      }
    });

    await weighbridgemodal.present();
  }

  // ============================================================
  // Utility
  // ============================================================
  nl2br(text: string): string {
    if (!text) return '';
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }

  back(): void {
    this.location.back();
  }
}
