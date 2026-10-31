import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { DestroyRef, inject } from '@angular/core';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';
import { ImageSliderComponent } from 'src/app/shared/components/image-slider/image-slider.component';
import { MaintenanceAiViewPage } from '../../maintenance-ai-view/maintenance-ai-view.page';

@Component({
  selector: 'app-popup-notification-view',
  templateUrl: './popup-notification-view.page.html',
  styleUrls: ['./popup-notification-view.page.scss'],
  standalone: false,
})
export class PopupNotificationViewPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  // =========================================
  // User Data
  // =========================================
  userId: number = 0;
  millCode: string = '';
  departmentId: number = 0;
  designationId: number = 0;

  // =========================================
  // Params
  // =========================================
  params: any;
  notificationid: string = '';
  fromscreen: string = '';
  screenname: string = '';

  // =========================================
  // Data Arrays
  // =========================================
  generalArr: any[] = [];
  cmpartslistArr: any[] = [];
  ropmpartslistArr: any[] = [];
  repmpartslistArr: any[] = [];
  imagesArr: string[] = [];

  // =========================================
  // General Fields
  // =========================================
  notificationstatus: string = '';
  notificationstatusid: string = '';
  notificationno: string = '';
  notificationtype: string = '';
  stationcode: string = '';
  station: string = '';
  stationid: string = '';
  equipment: string = '';
  equipmentid: string = '';
  reportedby: string = '';
  breakdownremarks: string = '';
  breakdowncoding: string = '';
  maintenancetype: string = '';
  maintenancetypeid: string = '';
  partdefect: string = '';
  partdefectid: string = '';
  damage: string = '';
  damagesid: string = '';
  breakdowncauses: string = '';
  breakdowncausesid: string = '';
  remarks: string = '';
  createddatetime: string = '';
  schduleddatetime: string = '';
  activity: string = '';
  carriedoutby: string = '';
  verifiedby: string = '';
  partreceiveddatetime: string = '';
  activitycompletiondatetime: string = '';
  authorizedby: string = '';
  authorizeddatetime: string = '';
  maximumrunninghours: string = '';
  currentrunninghours: string = '';
  extendedmaximumrunninghours: string = '';
  incharge: string = '';
  statusid: string = '';
  inchargeremarks: string = '';

  // =========================================
  // Priority
  // =========================================
  priority_id: any = 0;
  priority_level: string = '';

  // =========================================
  // Flags
  // =========================================
  enableDetailsFlag: boolean = false;
  detailsNoRecordFlag: boolean = false;
  repairActivityNoRecordFlag: boolean = false;
  jobAuthorizationNoRecordFlag: boolean = false;
  tasklistflag: number = 0;
  showtasklistonlyflag: number = 0;

  constructor(
    private translate: TranslateService,
    private userContext: UserContext,
    private languageService: LanguageService,
    private maintenanceService: MaintenanceService,
    private modalController: ModalController,
    private navParams: NavParams,
  ) {
    // Initialize user data from UserContext
    this.userId = this.userContext.userId || 0;
    this.millCode = this.userContext.millCode || '';
    this.departmentId = this.userContext.departmentId || 0;
    this.designationId = this.userContext.designId || 0;

    // Get params from navParams
    const viewform = this.navParams.get('item');
    this.params = JSON.parse(viewform);
    this.fromscreen = this.navParams.get('module');
    this.screenname = this.navParams.get('screen');

    console.log('Params:', this.params);

    // Set notification ID based on screen
    if (
      this.screenname !== undefined &&
      this.screenname !== null &&
      this.screenname == 'Abnormal'
    ) {
      this.notificationid = this.params.maintenance_notification_id;
    } else if (
      this.screenname !== undefined &&
      this.screenname !== null &&
      this.screenname == 'Predictive'
    ) {
      this.notificationid = this.params.notification_id;
    } else {
      this.notificationid = this.params.id;
    }
  }

  ngOnInit(): void {
    this.getNotificationView();
  }

  // =========================================================
  // API — Notification View
  // =========================================================
  getNotificationView(): void {
    const req = {
      user_id: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      id: this.notificationid,
      language: this.languageService.getLanguage,
    };

    console.log('getNotificationView Request:', req);

    this.maintenanceService
      .getNotificationView(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          console.log('getNotificationView Response:', response);

          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.generalArr = response.data?.general || [];
            this.processGeneralData(response.data);
            this.getMultiPartDefectViewList();
          } else {
            this.clearData();
          }
        },
        error: (error) => {
          console.error('Error fetching notification view:', error);
          this.clearData();
        },
      });
  }

  // =========================================================
  // Priority colour mapping
  // =========================================================
  getTextColorForPriorityLevel(priorityId: any): string {
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

  // =========================================================
  // Process General Data from API Response
  // =========================================================
  processGeneralData(data: any): void {
    const general = data.general[0] || {};

    this.notificationstatus = general.statusname || '';
    this.notificationstatusid = general.statusId || '';
    this.notificationno = general.notificationno || '';
    this.stationcode = general.stationcode || '';
    this.enableDetailsFlag = false;

    // Notification type
    if (
      this.fromscreen == 'RoPM' ||
      this.fromscreen == 'RoPMVIEW' ||
      this.fromscreen == 'RoPMReport'
    ) {
      if (
        this.screenname !== undefined &&
        this.screenname !== null &&
        this.screenname == 'Predictive'
      ) {
        this.notificationtype = general.notificationtype + ' Maintenance';
        this.enableDetailsFlag = true;
      } else {
        this.notificationtype = 'Routine ' + general.notificationtype;
      }
    } else if (
      this.fromscreen == 'RePM' ||
      this.fromscreen == 'RePMVIEW' ||
      this.fromscreen == 'RePMReport' ||
      this.fromscreen == 'RePMACK'
    ) {
      this.notificationtype = 'Replacement ' + general.notificationtype;
    } else {
      this.notificationtype = general.notificationtype || '';
    }

    this.breakdownremarks = general.breakdownremarks || '';
    this.breakdowncoding = general.breakdowncoding || '';
    this.maintenancetype = general.maintenancetype || '';
    this.maintenancetypeid = general.maintenancetypeid || '';
    this.station = general.stationname || '';
    this.stationid = general.stationid || '';
    this.equipment = general.equipment || '';
    this.equipmentid = general.equipmentid || '';
    this.maximumrunninghours = general.lifetimehours || '';
    this.currentrunninghours = general.machine_current_running_hours || '';
    this.extendedmaximumrunninghours = general.extendedlifetimehours || '';
    this.partdefectid = general.partdefectid || '';
    this.damage = general.damages || '';
    this.damagesid = general.damagesid || '';
    this.breakdowncauses = general.breakdowncauses || '';
    this.breakdowncausesid = general.breakdowncausesidnew || '';
    this.remarks = general.remarks || '';
    this.createddatetime = general.insDate || '';
    this.schduleddatetime = general.scheduleddatetime || '';
    this.statusid = general.statusId || '';
    this.reportedby = general.reportBy || '';
    this.incharge = general.incharge || '';

    // --------------------------------------------
    // Priority Level (Corrective Maintenance)
    // --------------------------------------------
    const rawPriority = (general.priority_level ?? '').toString().trim();
    this.priority_level = rawPriority !== '' ? rawPriority : '-';
    this.priority_id = general.priority_id ?? 0;

    // Images
    const getimageview = general.images || '';
    this.imagesArr = getimageview != '' ? getimageview.split('~') : [];

    // Activity fields
    this.activity = general.activity || '';
    this.partreceiveddatetime = general.partreceiveddatetime || '';
    this.activitycompletiondatetime = general.workcompletiondatetime || '';
    this.carriedoutby = general.carriedoutby || '';
    this.verifiedby = general.verifiedby || '';
    this.inchargeremarks = general.closing_remarks || '';

    // Authorization fields
    this.authorizedby = general.authorisedBy || '';
    this.authorizeddatetime = general.acknowledgeddatetime || '';

    // Part defect (base fallback)
    this.partdefect = general.partdefect || '';

    // Flags
    this.detailsNoRecordFlag = this.isDetailsEmpty();
    this.repairActivityNoRecordFlag = this.isRepairActivityEmpty();
    this.jobAuthorizationNoRecordFlag = this.isJobAuthorizationEmpty();
  }

  // =========================================================
  // Empty checks
  // =========================================================
  isDetailsEmpty(): boolean {
    return (
      this.station == '' &&
      this.equipment == '' &&
      this.currentrunninghours == '' &&
      this.partdefect == '' &&
      this.damage == '' &&
      this.breakdowncauses == '' &&
      this.remarks == '' &&
      this.createddatetime == ''
    );
  }

  isRepairActivityEmpty(): boolean {
    return (
      this.activity == '' &&
      this.partreceiveddatetime == '' &&
      this.activitycompletiondatetime == '' &&
      this.carriedoutby == '' &&
      this.verifiedby == ''
    );
  }

  isJobAuthorizationEmpty(): boolean {
    return this.authorizedby == '' && this.authorizeddatetime == '';
  }

  // =========================================================
  // API — Multi Part Defect View
  // =========================================================
  getMultiPartDefectViewList(): void {
    const getstationid = this.stationid || '0';
    const getequipmentid = this.equipmentid || '0';
    const getrunninghours = this.currentrunninghours || '';
    const getpartdefect = this.partdefect || '';

    let pvflag = 0;

    if (this.fromscreen == 'CM' || this.fromscreen == 'CMVIEW') {
      pvflag = 2;
    } else if (this.fromscreen == 'RoPM' || this.fromscreen == 'RoPMVIEW') {
      pvflag = 0;
    } else if (this.fromscreen == 'RePM' || this.fromscreen == 'RePMVIEW') {
      pvflag = 1;
    }

    const req = {
      userid: this.userId,
      departmentid: this.departmentId,
      designationid: this.designationId,
      millcode: this.millCode,
      id: this.notificationid,
      partdefectid: this.partdefectid,
      stationid: getstationid,
      equipment: getequipmentid,
      pvflag: pvflag,
      language: this.languageService.getLanguage,
    };

    console.log('getMultiPartDefectViewList Request:', req);

    this.maintenanceService
      .getMultiPartDefectViewList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          console.log('getMultiPartDefectViewList Response:', response);

          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.currentrunninghours = '';
            this.partdefect = '';

            if (pvflag == 0) {
              this.ropmpartslistArr = response.data || [];
              if (this.ropmpartslistArr.length > 0) {
                this.getTaskStatus();
              }
            } else if (pvflag == 1) {
              this.repmpartslistArr = response.data || [];
            } else {
              this.cmpartslistArr = response.data || [];
            }
          } else {
            this.currentrunninghours = getrunninghours;
            this.partdefect = getpartdefect;

            if (pvflag == 0) {
              this.ropmpartslistArr = [];
            } else if (pvflag == 1) {
              this.repmpartslistArr = [];
            } else {
              this.cmpartslistArr = [];
            }
          }
        },
        error: (error) => {
          console.error('Error fetching multi part defect view:', error);
          this.currentrunninghours = getrunninghours;
          this.partdefect = getpartdefect;
        },
      });
  }

  // =========================================================
  // API — Task Status
  // =========================================================
  getTaskStatus(): void {
    let machineid: string;

    if (this.screenname == 'Corrective') {
      machineid = this.params.machineid || this.params.equipmentid || '';
    } else if (this.screenname == 'Preventive') {
      machineid = this.params.equipmentid || '';
    } else {
      machineid = this.params.machineid || '';
    }

    const req = {
      user_id: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      design_id: this.designationId,
      machineid: machineid,
      part_id: this.params.partdefectid || '',
      stationid: this.params.stationid || '',
    };

    console.log('getTaskStatus Request:', req);

    this.maintenanceService
      .getPartTaskListFlag(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          console.log('getTaskStatus Response:', response);
          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.tasklistflag = 1;
            if (this.params.statusId == '1' || this.params.statusId == '10') {
              this.showtasklistonlyflag = 1;
              this.getTaskList();
            } else {
              this.showtasklistonlyflag = 0;
            }
          } else {
            this.showtasklistonlyflag = 0;
            this.tasklistflag = 0;
          }
        },
        error: (error) => {
          console.error('Error fetching task status:', error);
          this.showtasklistonlyflag = 0;
          this.tasklistflag = 0;
        },
      });
  }

  // =========================================================
  // API — Task List
  // =========================================================
  getTaskList(): void {
    let machineid: string;

    if (this.screenname == 'Corrective') {
      machineid = this.params.machineid || this.params.equipmentid || '';
    } else if (this.screenname == 'Preventive') {
      machineid = this.params.equipmentid || '';
    } else {
      machineid = this.params.machineid || '';
    }

    const req = {
      user_id: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      design_id: this.designationId,
      machineid: machineid,
      part_id: this.params.partdefectid || '',
      stationid: this.params.stationid || '',
    };

    console.log('getTaskList Request:', req);

    this.maintenanceService
      .getPartTaskList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          console.log('getTaskList Response:', response);
          if (response?.httpcode == 200 || response?.httpcode == '200') {
            const tasklistArr = response.data || [];

            if (this.ropmpartslistArr.length > 0 && tasklistArr.length > 0) {
              for (
                let i = 0;
                i < this.ropmpartslistArr.length && i < tasklistArr.length;
                i++
              ) {
                if (
                  Number(this.ropmpartslistArr[i].partid) ==
                  Number(tasklistArr[i].partid)
                ) {
                  const eachitem = tasklistArr[i].tasklistdata || [];
                  const taskList: any[] = [];

                  for (let j = 0; j < eachitem.length; j++) {
                    taskList.push({
                      maintenancetype: '',
                      condition: '',
                      damagetypeid: '',
                      taskname: eachitem[j].task_name || '',
                      maintenancetypeid: '0',
                      damagetype: '',
                      taskid: eachitem[j].task_id || '',
                      remarks: '',
                    });
                  }

                  this.ropmpartslistArr[i].tasklist = taskList;
                }
              }
            }
          }
        },
        error: (error) => {
          console.error('Error fetching task list:', error);
        },
      });
  }

  // =========================================================
  // Clear all data
  // =========================================================
  clearData(): void {
    this.generalArr = [];
    this.notificationstatus = '';
    this.notificationstatusid = '';
    this.notificationno = '';
    this.stationcode = '';
    this.notificationtype = '';
    this.breakdowncoding = '';
    this.maintenancetype = '';
    this.station = '';
    this.stationid = '';
    this.equipment = '';
    this.equipmentid = '';
    this.maximumrunninghours = '';
    this.currentrunninghours = '';
    this.extendedmaximumrunninghours = '';
    this.partdefect = '';
    this.partdefectid = '';
    this.damage = '';
    this.damagesid = '';
    this.breakdowncauses = '';
    this.breakdowncausesid = '';
    this.remarks = '';
    this.createddatetime = '';
    this.activity = '';
    this.partreceiveddatetime = '';
    this.activitycompletiondatetime = '';
    this.carriedoutby = '';
    this.verifiedby = '';
    this.reportedby = '';
    this.authorizedby = '';
    this.authorizeddatetime = '';

    // Priority reset
    this.priority_id = 0;
    this.priority_level = '';

    this.cmpartslistArr = [];
    this.ropmpartslistArr = [];
    this.repmpartslistArr = [];
    this.imagesArr = [];
  }

  // =========================================================
  // Images
  // =========================================================
  async btnViewImages(): Promise<void> {
    if (this.imagesArr.length > 0) {
      const imageview = this.imagesArr.join('~');

      const modal = await this.modalController.create({
        component: ImageSliderComponent,
        componentProps: {
          from: 'Alert',
          alertitem: imageview,
        },
        cssClass: 'image-slider-modal',
      });

      await modal.present();
    }
  }

  // =========================================================
  // AI View
  // =========================================================
  async aiView(): Promise<void> {
    console.log('AI View clicked for notification:', this.notificationid);

    const modal = await this.modalController.create({
      component: MaintenanceAiViewPage,
      componentProps: {
        item: JSON.stringify(this.params),
      },
      showBackdrop: true,
      backdropDismiss: false,
    });
    await modal.present();
  }

  // =========================================================
  // Close Modal
  // =========================================================
  btnClose(): void {
    this.modalController.dismiss({
      dismissed: true,
      item: '',
    });
  }
}
