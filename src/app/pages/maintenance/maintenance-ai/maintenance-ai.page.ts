import {
  Component,
  OnInit,
  DestroyRef,
  inject,
  signal,
  computed,
  ViewChild,
} from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
  catchError,
  finalize,
  EMPTY,
} from 'rxjs';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Platform,
  AlertController,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { MaintenanceAiAssignPage } from '../maintenance-ai-assign/maintenance-ai-assign.page';
import { MaintenanceAiAcceptMultiPartPage } from '../maintenance-ai-accept-multi-part/maintenance-ai-accept-multi-part.page';
import { MaintenanceAiAcceptSinglePartPage } from '../maintenance-ai-accept-single-part/maintenance-ai-accept-single-part.page';
import { MaintenanceAiClosePage } from '../maintenance-ai-close/maintenance-ai-close.page';

import { MaintenanceAiAcknowledgePage } from '../maintenance-ai-acknowledge/maintenance-ai-acknowledge.page';
import { MaintenanceAiViewPage } from '../maintenance-ai-view/maintenance-ai-view.page';
import { MaintenanceAiRejectPage } from '../maintenance-ai-reject/maintenance-ai-reject.page';
import { MaintenanceUploadImagePopupPage } from '../maintenance-upload-image-popup/maintenance-upload-image-popup.page';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-maintenance-ai',
  templateUrl: './maintenance-ai.page.html',
  styleUrls: ['./maintenance-ai.page.scss'],
  standalone: false,
})
export class MaintenanceAiPage implements OnInit {
  @ViewChild('pageHeader')
  pageHeader!: PageHeaderComponent;

  appTitle = this.nl2br(this.UserContext.millName);
  headerActions = '2';
  showLogo = 1;
  showBackButton = 0;

  private destroyRef = inject(DestroyRef);

  // ============ Signals ============
  tabs_segment = 'New';
  ainewlistArr: any[] = [];
  aipendinglistArr: any[] = [];
  newrecords = 0;
  pendingrecords = 0;

  newsize = 0;
  pendingsize = 0;

  newtotalpage = 0;
  pendingtotalpage = 0;

  newnorecordflag = false;
  pendingnorecordflag = false;

  pleasewaitflag = false;

  filterTerm = '';
  newpaginationLoading = false;
  newtotalRecords: number = 0;
  constructor(
    public UserContext: UserContext,
    private translate: TranslateService,
    private ModalController: ModalController,
    private LanguageService: LanguageService,
    private MaintenanceService: MaintenanceService,
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.refreshData();
    this.pageHeader?.getNotificationApi();
  }

  refreshData() {
    if (this.tabs_segment == 'New') {
      this.getAINewNotification(this.tabs_segment, true, '0');
    } else if (this.tabs_segment == 'Pending') {
      this.getAIPendingNotification(this.tabs_segment, true, '0');
    }
  }

  segmentChanged(event: any): void {
    this.tabs_segment = event.detail.value;
    console.log(event.detail.value);
    if (event.detail.value === 'New') {
      this.getAINewNotification('New', true, 0);
    } else if (event.detail.value === 'Pending') {
      this.getAIPendingNotification('Pending', true, 0);
    }
  }

  // ============ Load New Records ============

  getAINewNotification(
    getcurrentsegment: string,
    pagerefresh: boolean,
    pagenum: any,
    event?: any,
  ): void {
    this.newnorecordflag = false;
    this.pleasewaitflag = true;

    if (pagerefresh) {
      this.ainewlistArr = [];
    }

    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      segment: getcurrentsegment,
      page: Number(pagenum) + 1,
      language: this.LanguageService.getLanguage,
    };

    console.log('New Request:', req);

    this.MaintenanceService.getAINotificationList(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleasewaitflag = false;
        }),
      )
      .subscribe({
        next: (resultdata: any) => {
          console.log('New Response:', resultdata);

          if (!resultdata) {
            if (event) event.target.complete();
            this.newpaginationLoading = false;
            return;
          }

          // Store size and total records from API response
          this.newsize = parseInt(resultdata.size, 10);
          this.newtotalRecords = resultdata.recordcount; // Use recordcount from API
          this.newtotalpage = Number(resultdata.total_page);

          if (String(resultdata.httpcode) === '200') {
            this.newrecords = resultdata.newcount;
            this.pendingrecords = resultdata.pendingcount;

            if (Array.isArray(resultdata.data) && resultdata.data.length > 0) {
              for (let i = 0; i < resultdata.data.length; i++) {
                const eachitem = resultdata.data[i];

                const eachreq = {
                  reason: eachitem.reason,
                  breakdowncausesid: eachitem.breakdowncausesid,
                  damagesid: eachitem.damagesid,
                  type: eachitem.type,
                  breakdownremarks: eachitem.breakdownremarks,
                  notificationno: eachitem.notificationno,
                  partdefectid: eachitem.partdefectid,
                  problem: eachitem.problem,
                  activityids: eachitem.activityids,
                  id: eachitem.id,
                  ai_id: eachitem.ai_id,
                  notificationtypeid: eachitem.notificationtypeid,
                  reportDatetime: eachitem.reportDatetime,
                  reportBy: eachitem.reportBy,
                  isExpanded: eachitem.isExpanded,
                  orderNo: eachitem.orderNo,
                  insDate: eachitem.insDate,
                  isUpdateEnable: eachitem.isUpdateEnable,
                  enddateandtime: eachitem.enddateandtime,
                  equipmentname: eachitem.equipmentname,
                  partdefect: this.nl2br(eachitem.partdefect),
                  equipment: eachitem.equipment,
                  statusname: eachitem.statusname,
                  teco: eachitem.teco,
                  stationname: eachitem.stationname,
                  reportById: eachitem.reportById,
                  maintenancetype: eachitem.maintenancetype,
                  condition: eachitem.condition,
                  statusId: eachitem.statusId,
                  notificationtype: eachitem.notificationtype,
                  maintenancetypeid: eachitem.maintenancetypeid,
                  typeId: eachitem.typeId,
                  stationid: eachitem.stationid,
                  breakdowncoding: eachitem.breakdowncoding,
                  activity: eachitem.activity,
                  damages: eachitem.damages,
                  breakdowncauses: eachitem.breakdowncauses,
                  iscompleted: eachitem.iscompleted,
                  machineid: eachitem.machineid,
                  prNo: eachitem.prNo,
                  machinename: eachitem.machine,
                  machinereplacement: eachitem.machinereplacement,
                  breakdowncodingid: eachitem.breakdowncodingid,
                  runningHours: eachitem.runningHours,
                  replacement_activityname: eachitem.replacement_activityname,
                  startdateandtime: eachitem.startdateandtime,
                  equipmentid: eachitem.equipmentid,
                  conditionid: eachitem.conditionid,
                  machine: eachitem.machine,
                  replacement_activityid: eachitem.replacement_activityid,
                  remarks: eachitem.remarks,
                  pm_flag: eachitem.pm_flag,
                  partcurrentrunninghours: eachitem.part_current_running_hours,
                  partmaxrunninghours: eachitem.part_max_running_hours,
                };

                this.ainewlistArr.push(eachreq);
              }

              this.newnorecordflag = false;
            } else {
              if (this.ainewlistArr.length === 0) {
                this.newnorecordflag = true;
              }
            }
          }

          if (event) {
            event.target.complete();
          }

          this.newpaginationLoading = false;
        },

        error: (error: any) => {
          console.error('getAINewNotification error:', error);
          this.pleasewaitflag = false;
          this.newpaginationLoading = false;

          if (event) {
            event.target.complete();
          }
        },
      });
  }

  // Simple pagination - checks if we have more data
  newpagination(event: any): void {
    console.log('infinite scroll');
    // Prevent duplicate calls
    if (this.newpaginationLoading || this.pleasewaitflag) {
      event.target.complete();
      return;
    }

    // If we've loaded all records, disable infinite scroll
    if (this.ainewlistArr.length >= this.newtotalRecords) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }

    // Load next page
    const currentPage = Math.ceil(this.ainewlistArr.length / this.newsize);
    this.newpaginationLoading = true;
    this.getAINewNotification(this.tabs_segment, false, currentPage, event);
  }

  // ============ Load Pending Records ============
  getAIPendingNotification(
    getcurrentsegment: string,
    pagerefresh: boolean,
    pagenum: any,
  ): void {
    this.pendingnorecordflag = false;
    this.pleasewaitflag = true;

    if (pagerefresh) {
      this.aipendinglistArr = [];
    }

    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      segment: getcurrentsegment,
      page: Number(pagenum) + 1,
      language: this.LanguageService.getLanguage,
    };

    console.log('Pending Request:', req);

    this.MaintenanceService.getAINotificationList(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleasewaitflag = false;
        }),
      )
      .subscribe({
        next: (resultdata: any) => {
          if (!resultdata) {
            return;
          }

          console.log('Pending Response:', resultdata);

          // Counts
          this.newrecords = resultdata.newcount ?? 0;

          this.pendingrecords = resultdata.pendingcount ?? 0;

          // Pagination
          this.pendingsize = Number(resultdata.size ?? 0);

          this.pendingtotalpage =
            Number(resultdata.total_page ?? 0) * this.pendingsize;

          // Success
          if (resultdata.httpcode == 200) {
            if (resultdata.transformedData.length > 0) {
              if (resultdata.data.length > 0) {
                for (var i = 0; i < resultdata.data.length; i++) {
                  let eachitem = resultdata.data[i];
                  let eachreq = {
                    reason: eachitem.reason,
                    breakdowncausesid: eachitem.breakdowncausesid,
                    damagesid: eachitem.damagesid,
                    type: eachitem.type,
                    breakdownremarks: eachitem.breakdownremarks,
                    notificationno: eachitem.notificationno,
                    partdefectid: eachitem.partdefectid,
                    problem: eachitem.problem,
                    activityids: eachitem.activityids,
                    id: eachitem.id,
                    ai_id: eachitem.ai_id,
                    notificationtypeid: eachitem.notificationtypeid,
                    reportDatetime: eachitem.reportDatetime,
                    reportBy: eachitem.reportBy,
                    isExpanded: eachitem.isExpanded,
                    orderNo: eachitem.orderNo,
                    insDate: eachitem.insDate,
                    isUpdateEnable: eachitem.isUpdateEnable,
                    enddateandtime: eachitem.enddateandtime,
                    equipmentname: eachitem.equipmentname,
                    partdefect: this.nl2br(eachitem.partdefect),
                    equipment: eachitem.equipment,
                    statusname: eachitem.statusname,
                    teco: eachitem.teco,
                    stationname: eachitem.stationname,
                    reportById: eachitem.reportById,
                    maintenancetype: eachitem.maintenancetype,
                    condition: eachitem.condition,
                    statusId: eachitem.statusId,
                    notificationtype: eachitem.notificationtype,
                    maintenancetypeid: eachitem.maintenancetypeid,
                    typeId: eachitem.typeId,
                    stationid: eachitem.stationid,
                    breakdowncoding: eachitem.breakdowncoding,
                    activity: eachitem.activity,
                    damages: eachitem.damages,
                    breakdowncauses: eachitem.breakdowncauses,
                    iscompleted: eachitem.iscompleted,
                    machineid: eachitem.machineid,
                    prNo: eachitem.prNo,
                    machinename: eachitem.machine,
                    machinereplacement: eachitem.machinereplacement,
                    breakdowncodingid: eachitem.breakdowncodingid,
                    runningHours: eachitem.runningHours,
                    replacement_activityname: eachitem.replacement_activityname,
                    startdateandtime: eachitem.startdateandtime,
                    equipmentid: eachitem.equipmentid,
                    conditionid: eachitem.conditionid,
                    machine: eachitem.machine,
                    replacement_activityid: eachitem.replacement_activityid,
                    remarks: eachitem.remarks,
                    pm_flag: eachitem.pm_flag,
                    partcurrentrunninghours:
                      eachitem.part_current_running_hours,
                    partmaxrunninghours: eachitem.part_max_running_hours,
                  };

                  this.aipendinglistArr.push(eachreq);
                }
              }
            }
          } else {
            this.aipendinglistArr = [];
            this.pendingnorecordflag = true;
          }
        },

        error: (err: any) => {
          console.error('Subscription Error:', err);

          this.pendingnorecordflag = true;
        },
      });
  }

  getBackgroundColor(value: any) {
    let color;

    color = '#ffffff';

    return color;
  }

  geBorderColor(status: any) {
    let color;

    color = '#4a9d9c';

    return color;
  }

  getTextColor(status: any) {
    let color;

    color = '#ffffff';

    return color;
  }

  getStatusTextColor(status: any) {
    let color;

    if (status == '1' || status == '10' || status == '13') {
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

  btn_NotificationView(value: any) {
    this.callmodalcontroller(value, 'VIEW');
  }

  btn_NotificationReject(value: any) {
    this.callmodalcontroller(value, 'REJECT');
  }

  btn_NotificationAssign(value: any) {
    this.callmodalcontroller(value, 'ASSIGN');
  }

  btn_NotificationAccept(value: any) {
    this.callmodalcontroller(value, 'ACCEPT');
  }

  btn_Acknowledge(value: any) {
    this.callmodalcontroller(value, 'ACKNOWLEDGE');
  }

  btn_UploadImages(value: any) {
    this.callmodalcontroller(value, 'UPLOADIMAGES');
  }

  btn_NotificationClose(value: any) {
    this.callmodalcontroller(value, 'CLOSE');
  }

  async callmodalcontroller(value: any, type: any) {
    console.log(value);
    if (type == 'ASSIGN') {
      const modal = await this.ModalController.create({
        component: MaintenanceAiAssignPage,
        componentProps: {
          item: JSON.stringify(value),
        },
        showBackdrop: true,
        backdropDismiss: false,
        cssClass: ['notification-modal'],
      });

      modal.onDidDismiss().then((modaldata) => {
        let getdata = modaldata['data']['item'];

        if (getdata != '') {
          this.getAINewNotification(this.tabs_segment, true, '0');
        }
      });

      return await modal.present();
    } else if (type == 'ACCEPT') {
      var getpartdefectidArr = value.partdefectid.split(',');

      if (getpartdefectidArr.length > 1) {
        const modal = await this.ModalController.create({
          component: MaintenanceAiAcceptMultiPartPage,
          componentProps: {
            item: JSON.stringify(value),
          },
          showBackdrop: true,
          backdropDismiss: false,
          cssClass: ['notification-modal'],
        });

        modal.onDidDismiss().then((modaldata) => {
          let getdata = modaldata['data']['item'];

          if (getdata != '') {
            this.refreshData();
          }
        });

        return await modal.present();
      } else {
        const modal = await this.ModalController.create({
          component: MaintenanceAiAcceptSinglePartPage,
          componentProps: {
            item: JSON.stringify(value),
          },
          showBackdrop: true,
          backdropDismiss: false,
          cssClass: ['notification-modal'],
        });

        modal.onDidDismiss().then((modaldata) => {
          let getdata = modaldata['data']['item'];

          if (getdata != '') {
            this.refreshData();
          }
        });

        return await modal.present();
      }
    } else if (type == 'REJECT') {
      const modal = await this.ModalController.create({
        component: MaintenanceAiRejectPage,
        componentProps: {
          title: value.machinename,
          alertmessage: this.translate.instant(
            'CORRECTIVEMAINTENACE.airejectalertmessage',
          ),
          item: JSON.stringify(value),
        },
        showBackdrop: true,
        backdropDismiss: false,
        cssClass: ['ffbcagepopup-millstop-modal'],
      });

      modal.onDidDismiss().then((modaldata) => {
        let getdata = modaldata['data']['item'];

        if (getdata != '') {
          //this.getAINewNotification(this.tabs_segment, true, "0");
        }
      });

      return await modal.present();
    } else if (type == 'CLOSE') {
      const modal = await this.ModalController.create({
        component: MaintenanceAiClosePage,
        componentProps: {
          item: JSON.stringify(value),
          module: 'RoPM',
        },
        showBackdrop: true,
        backdropDismiss: false,
      });

      modal.onDidDismiss().then((modaldata) => {
        let getdata = modaldata['data']['item'];

        if (getdata != '') {
          this.refreshData();
        }
      });

      return await modal.present();
    } else if (type == 'UPLOADIMAGES') {
      const modal = await this.ModalController.create({
        component: MaintenanceUploadImagePopupPage,
        componentProps: {
          item: JSON.stringify(value),
        },
        showBackdrop: true,
        backdropDismiss: false,
        cssClass: ['alertattend-modal'],
      });

      modal.onDidDismiss().then((data) => {});

      return await modal.present();
    } else if (type == 'ACKNOWLEDGE') {
      const modal = await this.ModalController.create({
        component: MaintenanceAiAcknowledgePage,
        componentProps: {
          item: JSON.stringify(value),
          module: 'RoPM',
        },
        showBackdrop: true,
        backdropDismiss: false,
      });

      modal.onDidDismiss().then((modaldata) => {
        let getdata = modaldata['data']['item'];

        if (getdata != '') {
          this.refreshData();
        }
      });

      return await modal.present();
    } else {
      const modal = await this.ModalController.create({
        component: MaintenanceAiViewPage,
        componentProps: {
          item: JSON.stringify(value),
        },
        showBackdrop: true,
        backdropDismiss: false,
      });

      modal.onDidDismiss().then((modaldata) => {
        let getdata = modaldata['data']['item'];

        if (getdata != '') {
          //this.getAINewNotification(this.tabs_segment, true, "0");
        }
      });

      return await modal.present();
    }
  }

  pendingpagination(event: any) {
    setTimeout(() => {
      if (this.aipendinglistArr.length == this.pendingtotalpage) {
        event.target.complete();
        return;
      }

      event.target.complete();

      var z = Math.ceil(this.aipendinglistArr.length / this.pendingsize);

      if (this.aipendinglistArr.length < this.pendingtotalpage) {
        this.getAIPendingNotification(this.tabs_segment, false, String(z));
      }
    }, 500);
  }

  nl2br(text: string) {
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
