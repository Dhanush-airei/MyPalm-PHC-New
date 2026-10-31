import { Component, OnInit, Input, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, ToastController } from '@ionic/angular';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';
import { NotificationFormHistoryModalPage } from 'src/app/pages/scanner/notification-form-history-modal/notification-form-history-modal.page';
import { NotificationTimelineModalPage } from '../notification-timeline-modal/notification-timeline-modal.page';

@Component({
  selector: 'app-notification-list-modal',
  templateUrl: './notification-list-modal.page.html',
  styleUrls: ['./notification-list-modal.page.scss'],
  standalone: false,
})
export class NotificationListModalPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  /**
   * ✅ FIX: Declare @Input() so ModalController.componentProps
   * binds them BEFORE ngOnInit/ionViewWillEnter runs.
   * The keys here MUST match componentProps keys in the scanner.
   */
  @Input() stationId: string = '';
  @Input() machineId: string = '';
  @Input() partId: string = '';

  // Header Configuration
  appTitle: string = this.translate.instant('QRCODESCANNER.maintenancehistory');
  headerActions: string = '0';
  showLogo: number = 0;
  showBackButton: number = 1;

  // Form
  historyForm!: FormGroup;

  // Segment state
  tabsSegment: string = 'Corrective Maintenance';
  secondTabsSegment: string = 'RoPM';
  segment: string = 'CM';

  // Data
  stationName: string = '';
  machineryName: string = '';
  historyList: any[] = [];
  statusArr: any[] = [];

  // Pagination
  size: number = 0;
  totalPage: number = 0;

  // Flags
  enableFlag: boolean = false;
  pleaseWaitFlag: boolean = false;
  isLoadingMore: boolean = false;

  // ✅ Guard so we only load data once with fresh props
  private dataLoaded: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private modalController: ModalController,
    private historyModalController: ModalController,
    private timelineModalController: ModalController,
    private toastController: ToastController,
    private userContext: UserContext,
    private languageService: LanguageService,
    private maintenanceService: MaintenanceService,
  ) {
    this.createForm();
  }

  /**
   * ✅ FIX: Use ngOnInit — by the time Angular calls this,
   * ModalController has already assigned all componentProps to @Input()s.
   */
  ngOnInit(): void {
    console.log('✅ Modal received props:', {
      stationId: this.stationId,
      machineId: this.machineId,
      partId: this.partId,
    });

    // Safety guard — don't call API with empty IDs
    if (!this.stationId || !this.machineId) {
      console.warn('⚠️ Missing stationId / machineId. Skipping data load.');
      return;
    }

    this.getMaintenanceStatus();
    this.dataLoaded = true;
  }

  private createForm(): void {
    this.historyForm = this.fb.group({
      select_cm_status: new FormControl(''),
      select_ropm_status: new FormControl(''),
      select_repm_status: new FormControl(''),
      select_pm_status: new FormControl(''),
    });
  }

  getBorderColor(type: any): string {
    return '#ff9f0c';
  }

  getMaintenanceStatus(): void {
    const req = {
      user_id: this.userContext.userId,
      millcode: this.userContext.millCode,
      dept_id: this.userContext.departmentId,
      language: this.languageService.getLanguage,
    };

    this.maintenanceService
      .getMaintenanceStatusList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          if (result?.httpcode == 200 || result?.httpcode == '200') {
            this.statusArr = result.data || [];
          } else {
            this.statusArr = [];
          }
          this.getNotificationHistory(this.segment, true, '0');
        },
        error: () => {
          this.statusArr = [];
          this.getNotificationHistory(this.segment, true, '0');
        },
      });
  }

  getNotificationHistory(
    value: string,
    pageRefresh: boolean,
    pageNum: string,
  ): void {
    let getStatus: string;

    if (value === 'CM') {
      getStatus = this.historyForm.value.select_cm_status;
    } else if (value === 'RoPM') {
      getStatus = this.historyForm.value.select_ropm_status;
    } else if (value === 'RePM') {
      getStatus = this.historyForm.value.select_repm_status;
    } else {
      getStatus = this.historyForm.value.select_pm_status;
    }

    this.enableFlag = false;
    this.pleaseWaitFlag = true;

    if (pageRefresh) {
      this.historyList = [];
      this.size = 0;
      this.totalPage = 0;
    }

    const req = {
      user_id: this.userContext.userId,
      millcode: this.userContext.millCode,
      stationid: this.stationId,
      equipmentid: this.machineId,
      type: value,
      status: getStatus,
      page: parseInt(pageNum, 10) + 1,
      language: this.languageService.getLanguage,
    };

    console.log('REQ:', req);

    this.maintenanceService
      .getNotificationHistoryDetails(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleaseWaitFlag = false;
        }),
      )
      .subscribe({
        next: (result: any) => {
          this.size = parseInt(result?.size || 0, 10);
          this.totalPage = (result?.total_page || 0) * this.size;

          const data = result?.data || {};
          this.stationName = data.stationname || '';
          this.machineryName = data.machineryname || '';

          if (
            (result?.httpcode == 200 || result?.httpcode == '200') &&
            Array.isArray(data.histoydata) &&
            data.histoydata.length > 0
          ) {
            for (const eachItem of data.histoydata) {
              this.historyList.push({
                damage: eachItem.damage,
                date: eachItem.date,
                equipmentid: eachItem.equipmentid,
                equipmentname: eachItem.equipmentname,
                frequency: eachItem.frequency,
                id: eachItem.id,
                notificationno: eachItem.notificationno,
                operationoractivity: eachItem.operationoractivity,
                partdefect: this.nl2br(eachItem.partdefect || ''),
                runninghours: eachItem.runninghours,
                stationid: eachItem.stationid,
                stationname: eachItem.stationname,
                statusId: eachItem.statusId,
                statusName: eachItem.statusName,
              });
            }
            this.enableFlag = false;
          } else {
            this.enableFlag = this.historyList.length === 0;
          }
        },
        error: () => {
          this.enableFlag = this.historyList.length === 0;
        },
      });
  }

  onChangeStatus(value: string): void {
    this.getNotificationHistory(this.segment, true, '0');
  }

  segmentChanged(event: any): void {
    const val = event.detail.value;
    this.tabsSegment = val;

    if (val === 'Corrective Maintenance') {
      this.segment = 'CM';
      this.getNotificationHistory('CM', true, '0');
    } else if (val === 'Preventive Maintenance') {
      this.secondTabsSegment = 'RoPM';
      this.segment = 'RoPM';
      this.getNotificationHistory('RoPM', true, '0');
    } else if (val === 'Predictive Maintenance') {
      this.segment = 'PM';
      this.getNotificationHistory('PM', true, '0');
    }
  }

  secondSegmentChanged(event: any): void {
    if (this.tabsSegment === 'Preventive Maintenance') {
      const val = event.detail.value;
      this.secondTabsSegment = val;
      this.segment = val;
      this.getNotificationHistory(val, true, '0');
    }
  }

  pagination(event: any): void {
    event.target.complete();

    if (this.size <= 0 || this.totalPage <= 0 || this.historyList.length <= 0) {
      return;
    }
    if (this.historyList.length >= this.totalPage) {
      return;
    }
    if (this.isLoadingMore) {
      return;
    }

    this.isLoadingMore = true;
    const nextPage = Math.ceil(this.historyList.length / this.size);
    this.getNotificationHistory(this.segment, false, String(nextPage));

    setTimeout(() => {
      this.isLoadingMore = false;
    }, 800);
  }

  async getMaintenanceSummary(value: any): Promise<void> {
    const modal = await this.historyModalController.create({
      component: NotificationFormHistoryModalPage,
      componentProps: {
        item: JSON.stringify(value),
        from: this.segment,
      },
      showBackdrop: true,
    });
    modal.onDidDismiss().then(() => {});
    await modal.present();
  }

  async getTimeline(value: any): Promise<void> {
    const modal = await this.timelineModalController.create({
      component: NotificationTimelineModalPage,
      componentProps: {
        item: JSON.stringify(value),
      },
      showBackdrop: true,
    });
    modal.onDidDismiss().then(() => {});
    await modal.present();
  }

  nl2br(text: string): string {
    if (!text) return '';
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
