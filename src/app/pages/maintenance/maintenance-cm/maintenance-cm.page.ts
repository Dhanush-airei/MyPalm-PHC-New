import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { ModalController, AlertController } from '@ionic/angular';
import { MaintenanceAssignPage } from '../maintenance-assign/maintenance-assign.page';
import { MaintenanceCmAcceptMultiPartPage } from '../maintenance-cm-accept-multi-part/maintenance-cm-accept-multi-part.page';
import { MaintenanceCmAcceptSinglePartPage } from '../maintenance-cm-accept-single-part/maintenance-cm-accept-single-part.page';
import { MaintenanceNotificationViewPage } from '../maintenance-notification-view/maintenance-notification-view.page';
import { MaintenanceUploadImagePopupPage } from '../maintenance-upload-image-popup/maintenance-upload-image-popup.page';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-maintenance-cm',
  templateUrl: './maintenance-cm.page.html',
  styleUrls: ['./maintenance-cm.page.scss'],
  standalone: false,
})
export class MaintenanceCmPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  @ViewChild('pageHeader')
  pageHeader!: PageHeaderComponent;

  appTitle = this.nl2br(this.UserContext.millName);
  headerActions = '2';
  showLogo = 1;
  showBackButton = 0;

  // ============ Segment ============
  tabs_segment = 'New';

  // =========================================================
  // New CM
  // =========================================================
  cmnewlistArr: any[] = [];

  newrecords = 0;
  newsize = 0;
  newtotalpage = 0;
  newcurrentPage = 1;

  /**
   * Indicates whether more records are available.
   */
  newhasMoreData = true;

  /**
   * Prevents multiple infinite-scroll API calls.
   */
  newpaginationLoading = false;

  // =========================================================
  // Pending CM
  // =========================================================
  cmpendinglistArr: any[] = [];
  pendingrecords = 0;
  pendingsize = 0;
  pendingtotalpage = 0;
  pendingcurrentPage = 1;

  /**
   * Indicates whether more records are available.
   */
  pendinghasMoreData = true;

  /**
   * Prevents multiple infinite-scroll API calls.
   */
  pendingpaginationLoading = false;

  // =========================================================
  // Common
  // =========================================================
  newnorecordflag = false;
  pendingnorecordflag = false;

  pleasewaitflag = false;

  filterTerm = '';

  isModalActive = false;
  rejectbtnflag = 0;
  constructor(
    public UserContext: UserContext,
    private translate: TranslateService,
    private LanguageService: LanguageService,
    private MaintenanceService: MaintenanceService,
    private ModalController: ModalController,
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.segmentLoad();
    this.pageHeader?.getNotificationApi();
  }

  segmentLoad() {
    if (this.tabs_segment == 'New') {
      this.getCMNewNotification(this.tabs_segment, true, '0');
    } else if (this.tabs_segment == 'Pending') {
      this.getCMPendingNotification(this.tabs_segment, true, '0');
    }
  }
  getBackgroundColor(value: any) {
    //console.log(value);

    let color;

    color = '#ffffff';

    return color;
  }

  getTextColor(status: any) {
    let color;

    if (status == '1' || status == '10') {
      color = '#ffffff';
    }

    if (status == '2') {
      color = '#000000';
    }

    return color;
  }

  getStatusTextColor(status: any) {
    let color;

    if (status == '1' || status == '10') {
      color = '#cb4335';
    }

    if (status == '2') {
      color = '#ff9f0c';
    }

    if (status == '3') {
      color = '#ff9f0c';
    }

    if (status == '4') {
      color = '#9b59b6';
    }

    if (status == '5') {
      color = '#f39c12';
    }

    if (status == '6') {
      color = '#007bb3';
    }

    if (status == '7') {
      color = '#008000';
    }

    if (status == '8') {
      color = '#616161';
    }

    if (status == '9') {
      color = '#e74c3c';
    }

    if (status == '12') {
      color = '#f36311';
    }

    return color;
  }

  geBorderColor(status: any) {
    let color;

    if (status == '') {
      color = '#ffffff';
    }

    // Good
    if (status == '0') {
      color = '#87D37C';
    }

    // Breakdown
    if (status == '1' || status == '10') {
      color = '#cb4335';
    }

    // Abnormal
    if (status == '2') {
      color = '#FF8C00';
    }

    return color;
  }

  // New CM -Starts
  getCMNewNotification(
    getcurrentsegment: string,
    pagerefresh: boolean,
    event?: any,
  ): void {
    // Prevent multiple API calls
    if (this.newpaginationLoading) {
      if (event) {
        event.target.complete();
      }

      return;
    }

    // No more records
    if (!pagerefresh && !this.newhasMoreData) {
      if (event) {
        event.target.complete();
      }

      return;
    }

    this.newpaginationLoading = true;

    // Show full-page loader only for first page
    this.pleasewaitflag = true;
    this.newnorecordflag = false;

    // -----------------------------------------
    // Refresh
    // -----------------------------------------

    if (pagerefresh) {
      this.cmnewlistArr = [];

      this.newcurrentPage = 1;

      this.newtotalpage = 0;

      this.newhasMoreData = true;
    }

    // -----------------------------------------
    // Request
    // -----------------------------------------

    const req = {
      user_id: this.UserContext.userId,

      millcode: this.UserContext.millCode,

      dept_id: this.UserContext.departmentId,

      design_id: this.UserContext.designId,

      type: 1,

      segment: getcurrentsegment,

      // IMPORTANT
      // Current page is maintained here
      page: this.newcurrentPage,

      language: this.LanguageService.getLanguage,
    };

    console.log('================================');
    console.log('CM NEW REQUEST');
    console.log('================================');

    console.log('Current Page:', this.newcurrentPage);
    console.log('Request:', req);

    this.MaintenanceService.getMaintenanceNotificationList(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),

        finalize(() => {
          this.pleasewaitflag = false;

          this.newpaginationLoading = false;

          // Complete infinite scroll AFTER API finishes
          if (event) {
            event.target.complete();
          }
        }),
      )
      .subscribe({
        next: (resultdata: any) => {
          console.log('================================');
          console.log('CM NEW RESPONSE');
          console.log('================================');

          console.log(resultdata);

          // -----------------------------------------
          // HTTP response
          // -----------------------------------------

          if (String(resultdata.httpcode) !== '200') {
            console.log('API Error:', resultdata.httpcode);

            this.newrecords = Number(resultdata.newcount) || 0;
            this.pendingrecords = Number(resultdata.pendingcount) || 0;

            if (this.cmnewlistArr.length === 0) {
              this.newnorecordflag = true;
            }

            this.newhasMoreData = false;

            return;
          }

          // -----------------------------------------
          // Counts
          // -----------------------------------------
          this.newrecords = Number(resultdata.newcount) || 0;
          this.pendingrecords = Number(resultdata.pendingcount) || 0;

          // -----------------------------------------
          // Page size
          // -----------------------------------------

          this.newsize = Number(resultdata.size) || 10;

          // -----------------------------------------
          // Total pages
          // -----------------------------------------

          this.newtotalpage = Number(resultdata.total_page) || 0;

          console.log('Page Size:', this.newsize);

          console.log('Total Pages:', this.newtotalpage);

          console.log('Current Page:', this.newcurrentPage);

          // -----------------------------------------
          // API Data
          // -----------------------------------------

          if (Array.isArray(resultdata.data) && resultdata.data.length > 0) {
            const newItems = resultdata.data.map((eachitem: any) => {
              return {
                activity: eachitem.activity,
                activityids: eachitem.activityids,
                breakdowncauses: eachitem.breakdowncauses,
                breakdowncausesid: eachitem.breakdowncausesid,
                breakdowncoding: eachitem.breakdowncoding,
                breakdowncodingid: eachitem.breakdowncodingid,
                breakdownremarks: eachitem.breakdownremarks,
                condition: eachitem.condition,
                conditionid: eachitem.conditionid,
                damages: eachitem.damages,
                damagesid: eachitem.damagesid,
                enddateandtime: eachitem.enddateandtime,
                equipment: eachitem.equipment,
                equipmentid: eachitem.equipmentid,
                equipmentname: eachitem.equipmentname,
                id: eachitem.id,
                insDate: eachitem.insDate,
                isExpanded: eachitem.isExpanded,
                isUpdateEnable: eachitem.isUpdateEnable,
                iscompleted: eachitem.iscompleted,
                machine: eachitem.machine,
                machineid: eachitem.machineid,
                machinename: eachitem.machine,
                machinereplacement: eachitem.machinereplacement,
                maintenancetype: eachitem.maintenancetype,
                maintenancetypeid: eachitem.maintenancetypeid,
                notificationno: eachitem.notificationno,
                notificationtype: eachitem.notificationtype,
                notificationtypeid: eachitem.notificationtypeid,
                orderNo: eachitem.orderNo,
                partdefect: this.nl2br(eachitem.partdefect || ''),
                partdefectid: eachitem.partdefectid,
                prNo: eachitem.prNo,
                problem: eachitem.problem,
                reason: eachitem.reason,
                remarks: eachitem.remarks,
                replacement_activityid: eachitem.replacement_activityid,
                replacement_activityname: eachitem.replacement_activityname,
                reportBy: eachitem.reportBy,
                reportById: eachitem.reportById,
                reportDatetime: eachitem.reportDatetime,
                runningHours: eachitem.runningHours,
                startdateandtime: eachitem.startdateandtime,
                stationid: eachitem.stationid,
                stationname: eachitem.stationname,
                statusId: eachitem.statusId,
                statusname: eachitem.statusname,
                teco: eachitem.teco,
                type: eachitem.type,
                typeId: eachitem.typeId,
                deny_remarks: eachitem.deny_remarks,
                priority_level: eachitem.priority_level,
                priority_id: eachitem.priority_id,
              };
            });

            // -----------------------------------------
            // Prevent duplicates
            // -----------------------------------------

            const existingIds = new Set(
              this.cmnewlistArr.map((item: any) => String(item.id)),
            );

            const uniqueItems = newItems.filter(
              (item: any) => !existingIds.has(String(item.id)),
            );

            // -----------------------------------------
            // Add records
            // -----------------------------------------
            this.cmnewlistArr.push(...uniqueItems);

            this.newnorecordflag = false;

            // -----------------------------------------
            // Check whether more pages exist
            // -----------------------------------------

            if (
              this.newtotalpage > 0 &&
              this.newcurrentPage >= this.newtotalpage
            ) {
              this.newhasMoreData = false;

              console.log('LAST PAGE REACHED');
            } else if (resultdata.data.length < this.newsize) {
              this.newhasMoreData = false;

              console.log('NO MORE DATA');
            } else {
              this.newhasMoreData = true;
            }
          } else {
            // -----------------------------------------
            // No data
            // -----------------------------------------

            if (this.cmnewlistArr.length === 0) {
              this.newnorecordflag = true;
            }

            this.newhasMoreData = false;
          }

          console.log('Loaded Records:', this.cmnewlistArr.length);

          console.log('Current Page:', this.newcurrentPage);

          console.log('Total Pages:', this.newtotalpage);

          console.log('Has More:', this.newhasMoreData);
        },

        error: (error: any) => {
          console.error('getCMNewNotification error:', error);

          if (this.cmnewlistArr.length === 0) {
            this.newnorecordflag = true;
          }

          // Allow retry
          this.newhasMoreData = true;
        },
      });
  }

  newpagination(event: any): void {
    console.log('================================');
    console.log('INFINITE SCROLL');
    console.log('================================');

    console.log('Current Page:', this.newcurrentPage);

    console.log('Total Pages:', this.newtotalpage);

    console.log('Has More:', this.newhasMoreData);

    // -----------------------------------------
    // Already loading
    // -----------------------------------------

    if (this.newpaginationLoading) {
      console.log('Already loading...');

      event.target.complete();

      return;
    }

    // -----------------------------------------
    // No more data
    // -----------------------------------------

    if (!this.newhasMoreData) {
      console.log('No more data');

      event.target.complete();

      return;
    }

    // -----------------------------------------
    // Check last page
    // -----------------------------------------

    if (this.newtotalpage > 0 && this.newcurrentPage >= this.newtotalpage) {
      console.log('Already on last page');

      this.newhasMoreData = false;

      event.target.complete();

      return;
    }

    // -----------------------------------------
    // Increment page
    // -----------------------------------------

    this.newcurrentPage++;

    console.log('Loading Page:', this.newcurrentPage);

    // -----------------------------------------
    // API
    // -----------------------------------------

    this.getCMNewNotification(this.tabs_segment, false, event);
  }
  // New CM - Ends

  // Pending CM - Starts
  getCMPendingNotification(
    getcurrentsegment: string,
    pagerefresh: boolean,
    event?: any,
  ): void {
    // Prevent multiple API calls
    if (this.pendingpaginationLoading) {
      if (event) {
        event.target.complete();
      }

      return;
    }

    // No more records
    if (!pagerefresh && !this.pendinghasMoreData) {
      if (event) {
        event.target.complete();
      }

      return;
    }

    this.pendingpaginationLoading = true;

    // Show full-page loader only for first page
    this.pleasewaitflag = true;
    this.newnorecordflag = false;

    // -----------------------------------------
    // Refresh
    // -----------------------------------------

    if (pagerefresh) {
      this.cmpendinglistArr = [];

      this.pendingcurrentPage = 1;

      this.pendingtotalpage = 0;

      this.pendinghasMoreData = true;
    }

    // -----------------------------------------
    // Request
    // -----------------------------------------

    const req = {
      user_id: this.UserContext.userId,

      millcode: this.UserContext.millCode,

      dept_id: this.UserContext.departmentId,

      design_id: this.UserContext.designId,

      type: 1,

      segment: getcurrentsegment,

      // IMPORTANT
      // Current page is maintained here
      page: this.newcurrentPage,

      language: this.LanguageService.getLanguage,
    };

    console.log('================================');
    console.log('CM PENDING REQUEST');
    console.log('================================');

    console.log('Current Page:', this.pendingcurrentPage);
    console.log('Request:', req);

    this.MaintenanceService.getMaintenanceNotificationList(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),

        finalize(() => {
          this.pleasewaitflag = false;

          this.pendingpaginationLoading = false;

          // Complete infinite scroll AFTER API finishes
          if (event) {
            event.target.complete();
          }
        }),
      )
      .subscribe({
        next: (resultdata: any) => {
          console.log('================================');
          console.log('CM PENDING RESPONSE');
          console.log('================================');

          console.log(resultdata);

          // -----------------------------------------
          // HTTP response
          // -----------------------------------------

          if (String(resultdata.httpcode) !== '200') {
            console.log('API Error:', resultdata.httpcode);

            this.newrecords = Number(resultdata.newcount) || 0;
            this.pendingrecords = Number(resultdata.pendingcount) || 0;

            if (this.cmpendinglistArr.length === 0) {
              this.pendingnorecordflag = true;
            }

            this.pendinghasMoreData = false;

            return;
          }

          // -----------------------------------------
          // Counts
          // -----------------------------------------
          this.newrecords = Number(resultdata.newcount) || 0;
          this.pendingrecords = Number(resultdata.pendingcount) || 0;

          // -----------------------------------------
          // Page size
          // -----------------------------------------

          this.pendingsize = Number(resultdata.size) || 10;

          // -----------------------------------------
          // Total pages
          // -----------------------------------------

          this.pendingtotalpage = Number(resultdata.total_page) || 0;

          console.log('Page Size:', this.pendingsize);

          console.log('Total Pages:', this.pendingtotalpage);

          console.log('Current Page:', this.pendingcurrentPage);

          // -----------------------------------------
          // API Data
          // -----------------------------------------

          if (Array.isArray(resultdata.data) && resultdata.data.length > 0) {
            const newItems = resultdata.data.map((eachitem: any) => {
              return {
                activity: eachitem.activity,
                activityids: eachitem.activityids,
                breakdowncauses: eachitem.breakdowncauses,
                breakdowncausesid: eachitem.breakdowncausesid,
                breakdowncoding: eachitem.breakdowncoding,
                breakdowncodingid: eachitem.breakdowncodingid,
                breakdownremarks: eachitem.breakdownremarks,
                condition: eachitem.condition,
                conditionid: eachitem.conditionid,
                damages: eachitem.damages,
                damagesid: eachitem.damagesid,
                enddateandtime: eachitem.enddateandtime,
                equipment: eachitem.equipment,
                equipmentid: eachitem.equipmentid,
                equipmentname: eachitem.equipmentname,
                id: eachitem.id,
                insDate: eachitem.insDate,
                isExpanded: eachitem.isExpanded,
                isUpdateEnable: eachitem.isUpdateEnable,
                iscompleted: eachitem.iscompleted,
                machine: eachitem.machine,
                machineid: eachitem.machineid,
                machinename: eachitem.machine,
                machinereplacement: eachitem.machinereplacement,
                maintenancetype: eachitem.maintenancetype,
                maintenancetypeid: eachitem.maintenancetypeid,
                notificationno: eachitem.notificationno,
                notificationtype: eachitem.notificationtype,
                notificationtypeid: eachitem.notificationtypeid,
                orderNo: eachitem.orderNo,
                partdefect: this.nl2br(eachitem.partdefect || ''),
                partdefectid: eachitem.partdefectid,
                prNo: eachitem.prNo,
                problem: eachitem.problem,
                reason: eachitem.reason,
                remarks: eachitem.remarks,
                replacement_activityid: eachitem.replacement_activityid,
                replacement_activityname: eachitem.replacement_activityname,
                reportBy: eachitem.reportBy,
                reportById: eachitem.reportById,
                reportDatetime: eachitem.reportDatetime,
                runningHours: eachitem.runningHours,
                startdateandtime: eachitem.startdateandtime,
                stationid: eachitem.stationid,
                stationname: eachitem.stationname,
                statusId: eachitem.statusId,
                statusname: eachitem.statusname,
                teco: eachitem.teco,
                type: eachitem.type,
                typeId: eachitem.typeId,
                deny_remarks: eachitem.deny_remarks,
                priority_level: eachitem.priority_level,
                priority_id: eachitem.priority_id,
              };
            });

            // -----------------------------------------
            // Prevent duplicates
            // -----------------------------------------

            const existingIds = new Set(
              this.cmpendinglistArr.map((item: any) => String(item.id)),
            );

            const uniqueItems = newItems.filter(
              (item: any) => !existingIds.has(String(item.id)),
            );

            // -----------------------------------------
            // Add records
            // -----------------------------------------
            this.cmpendinglistArr.push(...uniqueItems);

            this.pendingnorecordflag = false;

            // -----------------------------------------
            // Check whether more pages exist
            // -----------------------------------------

            if (
              this.pendingtotalpage > 0 &&
              this.pendingcurrentPage >= this.pendingtotalpage
            ) {
              this.newhasMoreData = false;

              console.log('LAST PAGE REACHED');
            } else if (resultdata.data.length < this.pendingsize) {
              this.pendinghasMoreData = false;

              console.log('NO MORE DATA');
            } else {
              this.pendinghasMoreData = true;
            }
          } else {
            // -----------------------------------------
            // No data
            // -----------------------------------------

            if (this.cmpendinglistArr.length === 0) {
              this.pendingnorecordflag = true;
            }

            this.pendinghasMoreData = false;
          }

          console.log('Loaded Records:', this.cmpendinglistArr.length);

          console.log('Current Page:', this.pendingcurrentPage);

          console.log('Total Pages:', this.pendingtotalpage);

          console.log('Has More:', this.pendinghasMoreData);
        },

        error: (error: any) => {
          console.error('getCMPendingNotification error:', error);

          if (this.cmpendinglistArr.length === 0) {
            this.pendingnorecordflag = true;
          }

          // Allow retry
          this.pendinghasMoreData = true;
        },
      });
  }

  pendingpagination(event: any): void {
    console.log('================================');
    console.log('INFINITE SCROLL');
    console.log('================================');

    console.log('Current Page:', this.pendingcurrentPage);

    console.log('Total Pages:', this.pendingtotalpage);

    console.log('Has More:', this.pendinghasMoreData);

    // -----------------------------------------
    // Already loading
    // -----------------------------------------

    if (this.pendingpaginationLoading) {
      console.log('Already loading...');

      event.target.complete();

      return;
    }

    // -----------------------------------------
    // No more data
    // -----------------------------------------

    if (!this.pendinghasMoreData) {
      console.log('No more data');

      event.target.complete();

      return;
    }

    // -----------------------------------------
    // Check last page
    // -----------------------------------------

    if (
      this.pendingtotalpage > 0 &&
      this.pendingcurrentPage >= this.pendingtotalpage
    ) {
      console.log('Already on last page');

      this.pendinghasMoreData = false;

      event.target.complete();

      return;
    }

    // -----------------------------------------
    // Increment page
    // -----------------------------------------

    this.pendingcurrentPage++;

    console.log('Loading Page:', this.pendingcurrentPage);

    // -----------------------------------------
    // API
    // -----------------------------------------

    this.getCMPendingNotification(this.tabs_segment, false, event);
  }
  // Pending CM - Ends

  segmentChanged(event: any): void {
    this.tabs_segment = event.detail.value;
    console.log(event.detail.value);
    if (event.detail.value === 'New') {
      this.getCMNewNotification('New', true, 0);
    } else if (event.detail.value === 'Pending') {
      this.getCMPendingNotification('Pending', true, 0);
    }
  }

  btn_NotificationView(value: any) {
    this.callmodalcontroller(value, 'VIEW');
  }

  btn_NotificationFormView(value: any) {
    this.callmodalcontroller(value, 'NOTIFICATIONVIEW');
  }

  btn_NotificationAssign(value: any) {
    this.callmodalcontroller(value, 'ASSIGN');
  }

  btn_NotificationAccept(value: any) {
    this.callmodalcontroller(value, 'ACCEPT');
  }

  btn_Acknowledge(value: any, rejectFlag: any) {
    this.rejectbtnflag = rejectFlag;
    this.callmodalcontroller(value, 'ACKNOWLEDGE');
  }

  btn_UploadImages(value: any) {
    this.callmodalcontroller(value, 'UPLOADIMAGES');
  }

  btn_NotificationClose(value: any) {
    this.callmodalcontroller(value, 'CLOSE');
  }

  async callmodalcontroller(value: any, type: any) {
    if (type == 'ASSIGN') {
      const modal = await this.ModalController.create({
        component: MaintenanceAssignPage,
        componentProps: {
          item: JSON.stringify(value),
          module: 'CM',
        },
        showBackdrop: true,
        backdropDismiss: false,
        cssClass: ['notification-modal'],
      });

      modal.onDidDismiss().then((modaldata) => {
        let getdata = modaldata['data']['item'];

        if (getdata != '') {
          this.segmentLoad();
        }
      });

      return await modal.present();
    }

    if (type === 'ACCEPT') {
      const partDefectIds = value.partdefectid?.split(',') ?? [];

      console.log('Parts:', partDefectIds.length);

      const component =
        partDefectIds.length > 1
          ? MaintenanceCmAcceptMultiPartPage
          : MaintenanceCmAcceptSinglePartPage;

      const modal = await this.ModalController.create({
        component,
        componentProps: {
          item: JSON.stringify(value),
          module: 'CM',
        },
        showBackdrop: true,
        backdropDismiss: false,
        cssClass: 'acknowledgement-modal',
      });

      modal.onDidDismiss().then((modaldata) => {
        const getdata = modaldata?.data?.item;

        if (getdata) {
          this.segmentLoad();
        }
      });

      await modal.present();
    }

    if (type == 'CLOSE') {
      const modal = await this.ModalController.create({
        component: MaintenanceNotificationViewPage,
        componentProps: {
          item: JSON.stringify(value),
          module: 'CM',
        },
        showBackdrop: true,
        backdropDismiss: false,
      });

      modal.onDidDismiss().then((modaldata) => {
        let getdata = modaldata['data']['item'];

        if (getdata != '') {
          this.segmentLoad();
        }
      });

      return await modal.present();
    }

    if (type == 'ACKNOWLEDGE') {
      const modal = await this.ModalController.create({
        component: MaintenanceNotificationViewPage,
        componentProps: {
          item: JSON.stringify(value),
          module: 'CM',
          rejectbtnflag: this.rejectbtnflag,
        },
        showBackdrop: true,
        backdropDismiss: false,
      });

      modal.onDidDismiss().then((modaldata) => {
        let getdata = modaldata['data']['item'];

        if (getdata != '') {
          this.segmentLoad();
        }
      });

      return await modal.present();
    }

    if (type == 'UPLOADIMAGES') {
      this.isModalActive = true;
      const modal = await this.ModalController.create({
        component: MaintenanceUploadImagePopupPage,
        componentProps: {
          item: JSON.stringify(value),
        },
        showBackdrop: true,
        backdropDismiss: false,
        cssClass: ['notification-modal-medium'],
      });

      modal.onDidDismiss().then((data) => {
        this.isModalActive = false;
      });

      return await modal.present();
    }

    if (type == 'NOTIFICATIONVIEW') {
      const modal = await this.ModalController.create({
        component: MaintenanceNotificationViewPage,
        componentProps: {
          item: JSON.stringify(value),
          module: 'CMVIEW',
        },
        showBackdrop: true,
        backdropDismiss: false,
      });

      modal.onDidDismiss().then((data) => {});

      return await modal.present();
    }
  }
  getTextColorForPriorityLevel(priorityId: any): string {
    // console.log(priorityId, typeof priorityId);
    if (priorityId == 1) {
      return '#9400D3'; // Critical
    } else if (priorityId == 2) {
      return '#cb4335'; // High
    } else if (priorityId == 3) {
      return '#008000'; // Medium
    } else if (priorityId == 4) {
      return '#03346E'; // Low
    } else {
      return '#000000';
    }
  }

  nl2br(text: string) {
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
