import {
  Component,
  OnInit,
  DestroyRef,
  inject,
  NgZone,
  ViewChild,
} from '@angular/core';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { TranslateService } from '@ngx-translate/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { ModalController, AlertController, Platform } from '@ionic/angular';
import { MaintenanceAssignPage } from '../maintenance-assign/maintenance-assign.page';
import { MaintenanceNotificationViewPage } from '../maintenance-notification-view/maintenance-notification-view.page';
import { MaintenanceUploadImagePopupPage } from '../maintenance-upload-image-popup/maintenance-upload-image-popup.page';
import { MaintenanceRopmMultiPartSavePage } from '../maintenance-ropm-multi-part-save/maintenance-ropm-multi-part-save.page';
import { MaintenanceRopmTaskMultiPartSavePage } from '../maintenance-ropm-task-multi-part-save/maintenance-ropm-task-multi-part-save.page';
import { MaintenanceRepmMultiPartSavePage } from '../maintenance-repm-multi-part-save/maintenance-repm-multi-part-save.page';
import { MaintenancePreventiveMaintenanceTaskAssignPage } from '../maintenance-preventive-maintenance-task-assign/maintenance-preventive-maintenance-task-assign.page';
import { MaintenancePreventiveMaintenanceAssignPage } from '../maintenance-preventive-maintenance-assign/maintenance-preventive-maintenance-assign.page';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-maintenance-pm',
  templateUrl: './maintenance-pm.page.html',
  styleUrls: ['./maintenance-pm.page.scss'],
  standalone: false,
})
export class MaintenancePmPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  @ViewChild('pageHeader')
  pageHeader!: PageHeaderComponent;

  // =========================================================
  // Header Properties
  // =========================================================
  appTitle = this.nl2br(this.UserContext.millName);
  headerActions = '2';
  showLogo = 1;
  showBackButton = 0;
  designationid = this.UserContext.designId;

  // =========================================================
  // Segment Properties
  // =========================================================
  parent_segment: string = 'Routine';
  child_segment: string = 'New';

  childNewRecords = 0;
  childPendingRecords = 0;

  // Filter & Search
  filterTerm: string = '';

  // =========================================================
  // Routine New
  // =========================================================
  routinenewlistArr: any[] = [];
  routinenewrecords = 0;
  routinenewsize = 0;
  routinenewtotalpage = 0;
  routinenewcurrentPage = 1;
  routinenewhasMoreData = true;
  routinenewpaginationLoading = false;
  routinenewnorecordflag = false;

  // =========================================================
  // Routine Pending
  // =========================================================
  routinependinglistArr: any[] = [];
  routinependingrecords = 0;
  routinependingsize = 0;
  routinependingtotalpage = 0;
  routinependingcurrentPage = 1;
  routinependinghasMoreData = true;
  routinependingpaginationLoading = false;
  routinependingnorecordflag = false;

  // =========================================================
  // Replacement New
  // =========================================================
  replacementnewlistArr: any[] = [];
  replacementnewrecords = 0;
  replacementnewsize = 0;
  replacementnewtotalpage = 0;
  replacementnewcurrentPage = 1;
  replacementnewhasMoreData = true;
  replacementnewpaginationLoading = false;
  replacementnewnorecordflag = false;

  // =========================================================
  // Replacement Pending
  // =========================================================
  replacementpendinglistArr: any[] = [];
  replacementpendingrecords = 0;
  replacementpendingsize = 0;
  replacementpendingtotalpage = 0;
  replacementpendingcurrentPage = 1;
  replacementpendinghasMoreData = true;
  replacementpendingpaginationLoading = false;
  replacementpendingnorecordflag = false;

  // =========================================================
  // Common Properties
  // =========================================================
  isModalActive = false;
  rejectbtnflag = 0;
  hasMoreData: boolean = true;
  pleasewaitflag: boolean = false;
  tasklistflag = 0;
  extendrunninghoursFlag = '1';

  // Notification Badge Properties
  count = 0;
  pendingcount = 0;
  pendingcountlength = 0;
  getplatform: string = '';
  fromnotificationscreen = 0;
  notificationdata: any;

  constructor(
    public UserContext: UserContext,
    private translate: TranslateService,
    private LanguageService: LanguageService,
    private MaintenanceService: MaintenanceService,
    private ModalController: ModalController,
    private platform: Platform,
    private zone: NgZone,
  ) {
    // Detect platform
    if (this.platform.is('android')) {
      this.getplatform = 'android';
    } else if (this.platform.is('ios')) {
      this.getplatform = 'ios';
    }

    // Check for notification data
    this.checkNotificationData();
  }

  ngOnInit() {
    this.loadInitialData();
  }

  ionViewWillEnter() {
    this.pageHeader?.getNotificationApi();
    this.loadInitialData();
    this.updateNotification();
  }

  // ionViewDidEnter() {
  //   this.count = parseInt(localStorage.getItem('badge_count') || '0');
  //   this.updateNotification();
  // }

  // =========================================================
  // Notification Methods
  // =========================================================

  updateNotification() {
    this.zone.run(() => {
      this.count = parseInt(localStorage.getItem('badge_count') || '0');
      if (
        this.designationid == 2 ||
        this.designationid == 4 ||
        this.designationid == 6
      ) {
        this.getMaintenancePendingCount();
      }
    });
  }

  getMaintenancePendingCount() {
    const req = {
      userid: this.UserContext.userId,
      departmentid: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      millcode: this.UserContext.millCode,
      language: this.LanguageService.getLanguage,
    };

    this.MaintenanceService.getMaintenancePendingCount(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resultdata: any) => {
          if (resultdata.httpcode == 200) {
            this.pendingcount = resultdata.count || 0;
            this.pendingcountlength = this.pendingcount.toString().length;
          } else {
            this.pendingcount = 0;
            this.pendingcountlength = 0;
          }
        },
        error: () => {
          this.pendingcount = 0;
          this.pendingcountlength = 0;
        },
      });
  }

  checkNotificationData() {
    const notificationData = localStorage.getItem('notificationdata');
    if (notificationData && notificationData !== '') {
      this.notificationdata = notificationData;
      if (
        this.notificationdata !== 'undefined' &&
        this.notificationdata !== null
      ) {
        this.fromnotificationscreen = 1;
        localStorage.setItem('notificationdata', '');

        switch (this.notificationdata) {
          case 'ROUTINE PREVENTIVE MAINTENANCE NOTIFICATION':
            this.parent_segment = 'Routine';
            this.child_segment = 'New';
            this.loadSegmentData();
            break;
          case 'ROUTINE PREVENTIVE MAINTENANCE NOTIFICATION ACKNOWLEDGEMENT':
            this.parent_segment = 'Routine';
            this.child_segment = 'Pending';
            this.loadSegmentData();
            break;
          case 'REPLACEMENT PREVENTIVE MAINTENANCE NOTIFICATION':
            this.parent_segment = 'Replacement';
            this.child_segment = 'New';
            this.loadSegmentData();
            break;
          case 'REPLACEMENT PREVENTIVE MAINTENANCE NOTIFICATION VERIFICATION':
          case 'REPLACEMENT PREVENTIVE MAINTENANCE NOTIFICATION ACKNOWLEDGEMENT':
            this.parent_segment = 'Replacement';
            this.child_segment = 'Pending';
            this.loadSegmentData();
            break;
          default:
            this.fromnotificationscreen = 0;
        }
      }
    }
  }

  btn_notification() {
    if (this.designationid != 4 && this.designationid != 6) {
      localStorage.setItem('badge_count', '0');
      // Navigate to notification page - implement as needed
      // this.router.navigate(['/segregatenotification']);
    }
  }

  // =========================================================
  // Segment Change Methods
  // =========================================================

  parentSegmentChanged(event: any) {
    this.parent_segment = event.detail.value;
    this.filterTerm = '';
    this.hasMoreData = true;
    this.fromnotificationscreen = 0;
    this.loadSegmentData();
  }

  childSegmentChanged(event: any) {
    this.child_segment = event.detail.value;
    this.filterTerm = '';
    this.hasMoreData = true;
    this.fromnotificationscreen = 0;
    this.loadSegmentData();
  }

  // =========================================================
  // Data Loading Methods
  // =========================================================

  loadInitialData() {
    if (this.fromnotificationscreen == 0) {
      this.loadSegmentData();
    }
  }

  loadSegmentData() {
    this.pleasewaitflag = true;

    if (this.parent_segment === 'Routine') {
      if (this.child_segment === 'New') {
        this.loadRoutineNewData(this.child_segment, true);
      } else {
        this.loadRoutinePendingData(this.child_segment, true);
      }
    } else if (this.parent_segment === 'Replacement') {
      if (this.child_segment === 'New') {
        this.loadReplacementNewData(this.child_segment, true);
      } else {
        this.loadReplacementPendingData(this.child_segment, true);
      }
    }

    this.pleasewaitflag = false;
  }

  loadRoutineNewData(
    getcurrentsegment: string,
    pagerefresh: boolean,
    event?: any,
  ): void {
    if (this.routinenewpaginationLoading) {
      if (event) {
        event.target.complete();
      }
      return;
    }

    if (!pagerefresh && !this.routinenewhasMoreData) {
      if (event) {
        event.target.complete();
      }
      return;
    }

    this.routinenewpaginationLoading = true;
    this.pleasewaitflag = true;
    this.routinenewnorecordflag = false;

    if (pagerefresh) {
      this.routinenewlistArr = [];
      this.routinenewcurrentPage = 1;
      this.routinenewtotalpage = 0;
      this.routinenewhasMoreData = true;
    }

    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      fromdate: '',
      todate: '',
      segment: getcurrentsegment,
      page: this.routinenewcurrentPage,
      type: 2,
      language: this.LanguageService.getLanguage,
    };

    console.log('Routine New Request:', req);

    this.MaintenanceService.getMaintenanceNotificationList(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleasewaitflag = false;
          this.routinenewpaginationLoading = false;
          if (event) {
            event.target.complete();
          }
        }),
      )
      .subscribe({
        next: (resultdata: any) => {
          console.log('Routine New Response:', resultdata);
          if (String(resultdata.httpcode) !== '200') {
            this.childNewRecords = Number(resultdata.newcount) || 0;
            this.childPendingRecords = Number(resultdata.pendingcount) || 0;
            if (this.routinenewlistArr.length === 0) {
              this.routinenewnorecordflag = true;
            }
            this.routinenewhasMoreData = false;
            return;
          }

          this.childNewRecords = Number(resultdata.newcount) || 0;
          this.childPendingRecords = Number(resultdata.pendingcount) || 0;
          this.routinenewsize = Number(resultdata.size) || 10;
          this.routinenewtotalpage = Number(resultdata.total_page) || 0;

          if (Array.isArray(resultdata.data) && resultdata.data.length > 0) {
            const newItems = resultdata.data.map((eachitem: any) =>
              this.mapNotificationData(eachitem),
            );
            const existingIds = new Set(
              this.routinenewlistArr.map((item: any) => String(item.id)),
            );
            const uniqueItems = newItems.filter(
              (item: any) => !existingIds.has(String(item.id)),
            );

            this.routinenewlistArr.push(...uniqueItems);
            this.routinenewnorecordflag = false;

            if (
              this.routinenewtotalpage > 0 &&
              this.routinenewcurrentPage >= this.routinenewtotalpage
            ) {
              this.routinenewhasMoreData = false;
            } else if (resultdata.data.length < this.routinenewsize) {
              this.routinenewhasMoreData = false;
            } else {
              this.routinenewhasMoreData = true;
            }
          } else {
            if (this.routinenewlistArr.length === 0) {
              this.routinenewnorecordflag = true;
            }
            this.routinenewhasMoreData = false;
          }
        },
        error: (error: any) => {
          console.error('loadRoutineNewData error:', error);
          if (this.routinenewlistArr.length === 0) {
            this.routinenewnorecordflag = true;
          }
          this.routinenewhasMoreData = true;
        },
      });
  }

  loadRoutinePendingData(
    getcurrentsegment: string,
    pagerefresh: boolean,
    event?: any,
  ): void {
    if (this.routinependingpaginationLoading) {
      if (event) {
        event.target.complete();
      }
      return;
    }

    if (!pagerefresh && !this.routinependinghasMoreData) {
      if (event) {
        event.target.complete();
      }
      return;
    }

    this.routinependingpaginationLoading = true;
    this.pleasewaitflag = true;
    this.routinependingnorecordflag = false;

    if (pagerefresh) {
      this.routinependinglistArr = [];
      this.routinependingcurrentPage = 1;
      this.routinependingtotalpage = 0;
      this.routinependinghasMoreData = true;
    }

    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      fromdate: '',
      todate: '',
      segment: getcurrentsegment,
      page: this.routinependingcurrentPage,
      type: 2,
      language: this.LanguageService.getLanguage,
    };

    console.log('Routine Pending Request:', req);

    this.MaintenanceService.getMaintenanceNotificationList(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleasewaitflag = false;
          this.routinependingpaginationLoading = false;
          if (event) {
            event.target.complete();
          }
        }),
      )
      .subscribe({
        next: (resultdata: any) => {
          console.log('Routine Pending Response:', resultdata);
          if (String(resultdata.httpcode) !== '200') {
            this.childNewRecords = Number(resultdata.newcount) || 0;
            this.childPendingRecords = Number(resultdata.pendingcount) || 0;
            if (this.routinependinglistArr.length === 0) {
              this.routinependingnorecordflag = true;
            }
            this.routinependinghasMoreData = false;
            return;
          }

          this.childNewRecords = Number(resultdata.newcount) || 0;
          this.childPendingRecords = Number(resultdata.pendingcount) || 0;
          this.routinependingsize = Number(resultdata.size) || 10;
          this.routinependingtotalpage = Number(resultdata.total_page) || 0;

          if (Array.isArray(resultdata.data) && resultdata.data.length > 0) {
            const newItems = resultdata.data.map((eachitem: any) =>
              this.mapNotificationData(eachitem),
            );
            const existingIds = new Set(
              this.routinependinglistArr.map((item: any) => String(item.id)),
            );
            const uniqueItems = newItems.filter(
              (item: any) => !existingIds.has(String(item.id)),
            );

            this.routinependinglistArr.push(...uniqueItems);
            this.routinependingnorecordflag = false;

            if (
              this.routinependingtotalpage > 0 &&
              this.routinependingcurrentPage >= this.routinependingtotalpage
            ) {
              this.routinependinghasMoreData = false;
            } else if (resultdata.data.length < this.routinependingsize) {
              this.routinependinghasMoreData = false;
            } else {
              this.routinependinghasMoreData = true;
            }
          } else {
            if (this.routinependinglistArr.length === 0) {
              this.routinependingnorecordflag = true;
            }
            this.routinependinghasMoreData = false;
          }
        },
        error: (error: any) => {
          console.error('loadRoutinePendingData error:', error);
          if (this.routinependinglistArr.length === 0) {
            this.routinependingnorecordflag = true;
          }
          this.routinependinghasMoreData = true;
        },
      });
  }

  loadReplacementNewData(
    getcurrentsegment: string,
    pagerefresh: boolean,
    event?: any,
  ): void {
    if (this.replacementnewpaginationLoading) {
      if (event) {
        event.target.complete();
      }
      return;
    }

    if (!pagerefresh && !this.replacementnewhasMoreData) {
      if (event) {
        event.target.complete();
      }
      return;
    }

    this.replacementnewpaginationLoading = true;
    this.pleasewaitflag = true;
    this.replacementnewnorecordflag = false;

    if (pagerefresh) {
      this.replacementnewlistArr = [];
      this.replacementnewcurrentPage = 1;
      this.replacementnewtotalpage = 0;
      this.replacementnewhasMoreData = true;
    }

    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      fromdate: '',
      todate: '',
      segment: getcurrentsegment,
      page: this.replacementnewcurrentPage,
      type: 3,
      language: this.LanguageService.getLanguage,
    };

    console.log('Replacement New Request:', req);

    this.MaintenanceService.getMaintenanceNotificationList(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleasewaitflag = false;
          this.replacementnewpaginationLoading = false;
          if (event) {
            event.target.complete();
          }
        }),
      )
      .subscribe({
        next: (resultdata: any) => {
          console.log('Replacement New Response:', resultdata);
          if (String(resultdata.httpcode) !== '200') {
            this.childNewRecords = Number(resultdata.newcount) || 0;
            this.childPendingRecords = Number(resultdata.pendingcount) || 0;
            if (this.replacementnewlistArr.length === 0) {
              this.replacementnewnorecordflag = true;
            }
            this.replacementnewhasMoreData = false;
            return;
          }

          this.extendrunninghoursFlag = String(
            resultdata.extendedrunningkeyinflag || '1',
          );
          this.childNewRecords = Number(resultdata.newcount) || 0;
          this.childPendingRecords = Number(resultdata.pendingcount) || 0;
          this.replacementnewsize = Number(resultdata.size) || 10;
          this.replacementnewtotalpage = Number(resultdata.total_page) || 0;

          if (Array.isArray(resultdata.data) && resultdata.data.length > 0) {
            const newItems = resultdata.data.map((eachitem: any) =>
              this.mapNotificationData(eachitem),
            );
            const existingIds = new Set(
              this.replacementnewlistArr.map((item: any) => String(item.id)),
            );
            const uniqueItems = newItems.filter(
              (item: any) => !existingIds.has(String(item.id)),
            );

            this.replacementnewlistArr.push(...uniqueItems);
            this.replacementnewnorecordflag = false;

            if (
              this.replacementnewtotalpage > 0 &&
              this.replacementnewcurrentPage >= this.replacementnewtotalpage
            ) {
              this.replacementnewhasMoreData = false;
            } else if (resultdata.data.length < this.replacementnewsize) {
              this.replacementnewhasMoreData = false;
            } else {
              this.replacementnewhasMoreData = true;
            }
          } else {
            if (this.replacementnewlistArr.length === 0) {
              this.replacementnewnorecordflag = true;
            }
            this.replacementnewhasMoreData = false;
          }
        },
        error: (error: any) => {
          console.error('loadReplacementNewData error:', error);
          if (this.replacementnewlistArr.length === 0) {
            this.replacementnewnorecordflag = true;
          }
          this.replacementnewhasMoreData = true;
        },
      });
  }

  loadReplacementPendingData(
    getcurrentsegment: string,
    pagerefresh: boolean,
    event?: any,
  ): void {
    if (this.replacementpendingpaginationLoading) {
      if (event) {
        event.target.complete();
      }
      return;
    }

    if (!pagerefresh && !this.replacementpendinghasMoreData) {
      if (event) {
        event.target.complete();
      }
      return;
    }

    this.replacementpendingpaginationLoading = true;
    this.pleasewaitflag = true;
    this.replacementpendingnorecordflag = false;

    if (pagerefresh) {
      this.replacementpendinglistArr = [];
      this.replacementpendingcurrentPage = 1;
      this.replacementpendingtotalpage = 0;
      this.replacementpendinghasMoreData = true;
    }

    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      fromdate: '',
      todate: '',
      segment: getcurrentsegment,
      page: this.replacementpendingcurrentPage,
      type: 3,
      language: this.LanguageService.getLanguage,
    };

    console.log('Replacement Pending Request:', req);

    this.MaintenanceService.getMaintenanceNotificationList(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleasewaitflag = false;
          this.replacementpendingpaginationLoading = false;
          if (event) {
            event.target.complete();
          }
        }),
      )
      .subscribe({
        next: (resultdata: any) => {
          console.log('Replacement Pending Response:', resultdata);
          if (String(resultdata.httpcode) !== '200') {
            this.childNewRecords = Number(resultdata.newcount) || 0;
            this.childPendingRecords = Number(resultdata.pendingcount) || 0;
            if (this.replacementpendinglistArr.length === 0) {
              this.replacementpendingnorecordflag = true;
            }
            this.replacementpendinghasMoreData = false;
            return;
          }

          this.extendrunninghoursFlag = String(
            resultdata.extendedrunningkeyinflag || '1',
          );
          this.childNewRecords = Number(resultdata.newcount) || 0;
          this.childPendingRecords = Number(resultdata.pendingcount) || 0;
          this.replacementpendingsize = Number(resultdata.size) || 10;
          this.replacementpendingtotalpage = Number(resultdata.total_page) || 0;

          if (Array.isArray(resultdata.data) && resultdata.data.length > 0) {
            const newItems = resultdata.data.map((eachitem: any) =>
              this.mapNotificationData(eachitem),
            );
            const existingIds = new Set(
              this.replacementpendinglistArr.map((item: any) =>
                String(item.id),
              ),
            );
            const uniqueItems = newItems.filter(
              (item: any) => !existingIds.has(String(item.id)),
            );

            this.replacementpendinglistArr.push(...uniqueItems);
            this.replacementpendingnorecordflag = false;

            if (
              this.replacementpendingtotalpage > 0 &&
              this.replacementpendingcurrentPage >=
                this.replacementpendingtotalpage
            ) {
              this.replacementpendinghasMoreData = false;
            } else if (resultdata.data.length < this.replacementpendingsize) {
              this.replacementpendinghasMoreData = false;
            } else {
              this.replacementpendinghasMoreData = true;
            }
          } else {
            if (this.replacementpendinglistArr.length === 0) {
              this.replacementpendingnorecordflag = true;
            }
            this.replacementpendinghasMoreData = false;
          }
        },
        error: (error: any) => {
          console.error('loadReplacementPendingData error:', error);
          if (this.replacementpendinglistArr.length === 0) {
            this.replacementpendingnorecordflag = true;
          }
          this.replacementpendinghasMoreData = true;
        },
      });
  }

  // =========================================================
  // Helper Methods
  // =========================================================

  private mapNotificationData(eachitem: any): any {
    return {
      activity: eachitem.activity || '',
      activityids: eachitem.activityids || '',
      breakdowncauses: eachitem.breakdowncauses || '',
      breakdowncausesid: eachitem.breakdowncausesid || '',
      breakdowncoding: eachitem.breakdowncoding || '',
      breakdowncodingid: eachitem.breakdowncodingid || '',
      breakdownremarks: eachitem.breakdownremarks || '',
      condition: eachitem.condition || '',
      conditionid: eachitem.conditionid || '',
      damages: eachitem.damages || '',
      damagesid: eachitem.damagesid || '',
      enddateandtime: eachitem.enddateandtime || '',
      equipment: eachitem.equipment || '',
      equipmentid: eachitem.equipmentid || '',
      equipmentname: eachitem.equipmentname || '',
      id: eachitem.id || '',
      insDate: eachitem.insDate || '',
      isExpanded: eachitem.isExpanded || false,
      isUpdateEnable: eachitem.isUpdateEnable || false,
      iscompleted: eachitem.iscompleted || 0,
      machine: eachitem.machine || '',
      machineid:
        eachitem.machineid || eachitem.machine_id || eachitem.equipmentid || '',
      machinename: eachitem.machine || eachitem.machinename || '',
      machinereplacement: eachitem.machinereplacement || 0,
      maintenancetype: eachitem.maintenancetype || '',
      maintenancetypeid: eachitem.maintenancetypeid || '',
      notificationno: eachitem.notificationno || '',
      notificationtype: eachitem.notificationtype || '',
      notificationtypeid: eachitem.notificationtypeid || '',
      orderNo: eachitem.orderNo || '',
      partdefect: this.nl2br(eachitem.partdefect || ''),
      partdefectid: eachitem.partdefectid || '',
      pm_flag: eachitem.pm_flag || 0,
      prNo: eachitem.prNo || '',
      problem: eachitem.problem || '',
      reason: eachitem.reason || '',
      remarks: eachitem.remarks || '',
      replacement_activityid: eachitem.replacement_activityid || '',
      replacement_activityname: eachitem.replacement_activityname || '',
      reportBy: eachitem.reportBy || '',
      reportById: eachitem.reportById || '',
      reportDatetime: eachitem.reportDatetime || '',
      runningHours: eachitem.runningHours || '',
      startdateandtime: eachitem.startdateandtime || '',
      stationid: eachitem.stationid || '',
      stationname: eachitem.stationname || '',
      statusId: eachitem.statusId || '',
      statusname: eachitem.statusname || '',
      teco: eachitem.teco || '',
      type: eachitem.type || '',
      typeId: eachitem.typeId || '',
      deny_remarks: eachitem.deny_remarks || '',
      priority_level: eachitem.priority_level || '',
      priority_id: eachitem.priority_id || '',
    };
  }

  loadMoreData(event: any) {
    if (this.parent_segment === 'Routine') {
      if (this.child_segment === 'New') {
        this.routinenewcurrentPage++;
        this.loadRoutineNewData(this.child_segment, false, event);
      } else {
        this.routinependingcurrentPage++;
        this.loadRoutinePendingData(this.child_segment, false, event);
      }
    } else if (this.parent_segment === 'Replacement') {
      if (this.child_segment === 'New') {
        this.replacementnewcurrentPage++;
        this.loadReplacementNewData(this.child_segment, false, event);
      } else {
        this.replacementpendingcurrentPage++;
        this.loadReplacementPendingData(this.child_segment, false, event);
      }
    }
  }

  // =========================================================
  // Color Methods
  // =========================================================

  getBackgroundColor(breakdowncodingid: string, machineflag: any): string {
    return '#ffffff';
  }

  geBorderColor(type: any, status: any, machineflag: any, pmflag: any): any {
    let color;
    if (type == 'RoPM') {
      color = pmflag == 1 ? '#773e8e' : '#008000';
    } else {
      color = machineflag == 1 ? '#cb4335' : '#0086c2';
    }
    return color;
  }

  getTextColor(breakdowncodingid: string): string {
    const colorMap: { [key: string]: string } = {
      '1': '#000',
      '2': '#fff',
      '3': '#fff',
    };
    return colorMap[breakdowncodingid] || '#000';
  }

  getTextColorForPriorityLevel(priorityId: any): string {
    if (priorityId == 1) return '#9400D3';
    else if (priorityId == 2) return '#cb4335';
    else if (priorityId == 3) return '#008000';
    else if (priorityId == 4) return '#03346E';
    else return '#000000';
  }

  getStatusTextColor(statusId: string): string {
    const colorMap: { [key: string]: string } = {
      '1': '#cb4335',
      '2': '#ff9f0c',
      '3': '#ff9f0c',
      '4': '#9b59b6',
      '5': '#f39c12',
      '6': '#007bb3',
      '7': '#008000',
      '8': '#616161',
      '9': '#e74c3c',
      '10': '#01b800',
      '12': '#f36311',
    };
    return colorMap[statusId] || '#000000';
  }

  // =========================================================
  // Button Click Handlers
  // =========================================================

  btn_NotificationView(value: any) {
    this.callmodalcontroller(value, 'NOTIFICATIONVIEW');
  }

  btn_NotificationAssign(value: any) {
    if (value.statusId == '1') {
      this.callmodalcontroller(value, 'ASSIGN');
    }
  }

  btn_NotificationAccept(value: any, module: any) {
    if (value.statusId == 10 || value.statusId == 13 || value.statusId == 14) {
      if (module == 'RePM') {
        this.callmodalcontroller(value, 'ACCEPT');
      } else {
        this.gettasklist(value);
      }
    }
  }

  btn_NotificationClose(value: any) {
    this.callmodalcontroller(value, 'CLOSE');
  }

  /**
   * Acknowledge Notification (Approve/Deny)
   * @param value - The notification object
   * @param rejectbtnflag - '0' for Acknowledge, '1' for Deny
   */
  btn_Acknowledge(value: any, rejectbtnflag: number) {
    this.rejectbtnflag = rejectbtnflag;
    this.callmodalcontroller(value, 'ACKNOWLEDGE');
  }

  /**
   * Upload Images Button Handler
   */
  btn_UploadImages(value: any) {
    this.callmodalcontroller(value, 'UPLOADIMAGES');
  }

  /**
   * Get task list - FIXED: Properly map the value properties
   */
  gettasklist(value: any) {
    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      machineid: value.machineid,
      part_id: value.partdefectid,
      stationid: value.stationid,
    };

    console.log('gettasklist - Request:', req);

    this.MaintenanceService.getPartTaskListFlag(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log('gettasklist - Response:', response);
          this.tasklistflag = response.httpcode == 200 ? 1 : 0;
          this.callmodalcontroller(value, 'ACCEPT');
        },
        error: (err) => {
          console.error('Failed to load report:', err);
          this.tasklistflag = 0;
          this.callmodalcontroller(value, 'ACCEPT');
        },
      });
  }

  // =========================================================
  // Modal Methods - UPDATED to match older version logic
  // =========================================================

  async callmodalcontroller(value: any, type: any) {
    console.log('callmodalcontroller - type:', type, 'value:', value);

    // =========================================================
    // ASSIGN TYPE
    // =========================================================
    if (type == 'ASSIGN') {
      const module = this.parent_segment === 'Routine' ? 'RoPM' : 'RePM';

      // In older version, ASSIGN uses MaintenanceNotificationAssignPage
      // But newer version uses MaintenanceAssignPage
      const modal = await this.ModalController.create({
        component: MaintenanceAssignPage,
        componentProps: {
          item: JSON.stringify(value),
          module: module,
        },
        showBackdrop: true,
        backdropDismiss: false,
        cssClass: ['notification-modal'],
      });

      modal.onDidDismiss().then((modaldata) => {
        const getdata = modaldata['data']?.['item'];
        if (getdata && getdata != '') {
          this.refreshData();
        }
      });

      return await modal.present();
    }

    // =========================================================
    // ACCEPT TYPE - MATCHES OLDER VERSION LOGIC
    // =========================================================
    if (type == 'ACCEPT') {
      // Check if it's Routine or Replacement
      const isRoutine = this.parent_segment == 'Routine';
      const module = isRoutine ? 'RoPM' : 'RePM';

      // Check if partdefectid has multiple parts
      const isMultipart =
        value.partdefectid && value.partdefectid.split(',').length > 1;

      console.log('ACCEPT - module:', module);
      console.log('ACCEPT - isRoutine:', isRoutine);
      console.log('ACCEPT - isMultipart:', isMultipart);
      console.log('ACCEPT - tasklistflag:', this.tasklistflag);
      console.log('ACCEPT - module:', module);

      let component: any;

      if (isRoutine) {
        // ROUTINE (RoPM) Logic
        if (isMultipart) {
          // Multiple Parts
          component =
            this.tasklistflag == 0
              ? MaintenanceRopmMultiPartSavePage
              : MaintenanceRopmTaskMultiPartSavePage;
        } else {
          // Single Part
          component =
            this.tasklistflag == 0
              ? MaintenanceRopmMultiPartSavePage
              : // MaintenancePreventiveMaintenanceAssignPage
                MaintenancePreventiveMaintenanceTaskAssignPage;
        }
      } else {
        // REPLACEMENT (RePM) Logic
        if (isMultipart) {
          console.log('Replacement RePM called ->', isMultipart);
          // Multiple Parts
          component = MaintenanceRepmMultiPartSavePage;
        } else {
          console.log('Else part Replacement RePM called ->', isMultipart);
          // Single Part
          component = MaintenancePreventiveMaintenanceAssignPage;
        }
      }

      console.log('ACCEPT - Selected Component:', component.name);

      const modal = await this.ModalController.create({
        component: component,
        componentProps: {
          item: JSON.stringify(value),
          flag: this.extendrunninghoursFlag,
          module: module,
        },
        showBackdrop: true,
        backdropDismiss: false,
        cssClass: ['notification-modal'],
      });

      modal.onDidDismiss().then((modaldata: any) => {
        const getdata = modaldata['data']?.['item'];
        if (getdata && getdata != '') {
          this.refreshData();
        }
      });

      return await modal.present();
    }

    // =========================================================
    // CLOSE TYPE
    // =========================================================
    if (type == 'CLOSE') {
      const sendmodule = this.parent_segment == 'Routine' ? 'RoPM' : 'RePM';
      const modal = await this.ModalController.create({
        component: MaintenanceNotificationViewPage,
        componentProps: {
          item: JSON.stringify(value),
          module: sendmodule,
        },
        showBackdrop: true,
        backdropDismiss: false,
      });

      modal.onDidDismiss().then((modaldata) => {
        const getdata = modaldata['data']?.['item'];
        if (getdata && getdata != '') {
          this.refreshData();
        }
      });

      return await modal.present();
    }

    // =========================================================
    // ACKNOWLEDGE TYPE
    // =========================================================
    if (type == 'ACKNOWLEDGE') {
      const sendmodule = this.parent_segment == 'Routine' ? 'RoPM' : 'RePM';
      const modal = await this.ModalController.create({
        component: MaintenanceNotificationViewPage,
        componentProps: {
          item: JSON.stringify(value),
          flag: this.extendrunninghoursFlag,
          module: sendmodule,
          rejectbtnflag: this.rejectbtnflag,
        },
        showBackdrop: true,
        backdropDismiss: false,
      });

      modal.onDidDismiss().then((modaldata) => {
        const getdata = modaldata['data']?.['item'];
        if (getdata && getdata != '') {
          this.refreshData();
        }
      });

      return await modal.present();
    }

    // =========================================================
    // UPLOADIMAGES TYPE
    // =========================================================
    if (type == 'UPLOADIMAGES') {
      this.isModalActive = true;
      const modal = await this.ModalController.create({
        component: MaintenanceUploadImagePopupPage,
        componentProps: {
          item: JSON.stringify(value),
        },
        showBackdrop: true,
        backdropDismiss: false,
        cssClass: ['alertattend-modal'],
      });

      modal.onDidDismiss().then(() => {
        this.isModalActive = false;
      });

      return await modal.present();
    }

    // =========================================================
    // NOTIFICATIONVIEW TYPE
    // =========================================================
    if (type == 'NOTIFICATIONVIEW') {
      const sendmodule =
        this.parent_segment == 'Routine' ? 'RoPMVIEW' : 'RePMVIEW';
      const modal = await this.ModalController.create({
        component: MaintenanceNotificationViewPage,
        componentProps: {
          item: JSON.stringify(value),
          module: sendmodule,
        },
        showBackdrop: true,
        backdropDismiss: false,
      });

      return await modal.present();
    }
  }

  refreshData() {
    if (this.parent_segment == 'Routine') {
      if (this.child_segment == 'New') {
        this.loadRoutineNewData(this.child_segment, true);
      } else {
        this.getMaintenancePendingCount();
        this.loadRoutinePendingData(this.child_segment, true);
      }
    } else if (this.parent_segment == 'Replacement') {
      if (this.child_segment == 'New') {
        this.loadReplacementNewData(this.child_segment, true);
      } else {
        this.getMaintenancePendingCount();
        this.loadReplacementPendingData(this.child_segment, true);
      }
    }
  }

  // =========================================================
  // Utility Methods
  // =========================================================

  nl2br(text: string): string {
    return text ? text.replace(new RegExp('\r?\n', 'g'), '<br />') : '';
  }
}
