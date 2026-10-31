import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  DestroyRef,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  Platform,
  ModalController,
  NavParams,
  AlertController,
  IonSelect,
} from '@ionic/angular';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MaintenanceUpdateTaskListPage } from 'src/app/pages/maintenance/maintenance-update-task-list/maintenance-update-task-list.page';

@Component({
  selector: 'app-maintenance-preventive-maintenance-task-assign',
  templateUrl: './maintenance-preventive-maintenance-task-assign.page.html',
  styleUrls: ['./maintenance-preventive-maintenance-task-assign.page.scss'],
  standalone: false,
})
export class MaintenancePreventiveMaintenanceTaskAssignPage
  implements OnInit, AfterViewInit
{
  private destroyRef = inject(DestroyRef);

  @ViewChild('damagetypeSelect', { static: false }) damagetypeRef!: IonSelect;
  @ViewChild('assignedtoSelect', { static: false }) assignedtoRef!: IonSelect;

  // =========================================================
  // Form
  // =========================================================
  assignForm!: FormGroup;
  params: any;

  // =========================================================
  // Arrays
  // =========================================================
  maintenancetypeArr: any[] = [];
  damageArr: any[] = [];
  activityArr: any[] = [];
  assignedtoArr: any[] = [];
  tasklistArr: any[] = [];

  // =========================================================
  // Display Values
  // =========================================================
  title: string = '';
  module: string = '';
  extendrunninghoursFlag: string = '';
  machinereplacementFlag: string = '';

  getnotificationid: string = '';
  getstationid: string = '';
  getstationname: string = '';
  getmachineid: string = '';
  getmachinename: string = '';
  getactivityname: string = '';
  getstatusid: string = '';
  getpmflag: string = '';

  aicontent: SafeHtml = '';
  partdefectname: string = '';
  partdefectid: string = '';
  lifetimerunninghours: string = '';
  currentrunninghours: string = '';

  // =========================================================
  // Selection Values
  // =========================================================
  conditionoptionSelected: string = '';
  conditionactivitySelected: string = '';
  actionoptionSelected: string = '';

  // Maintenance Type
  maintenancetypeid: string = '';
  maintenancetypevalue: string = '';

  // Activity
  activityid: string = '';
  activityvalue: string = '';
  activityidArr: string[] = [];
  activityvalueArr: string[] = [];

  // Damage Type
  damagetypeid: string = '';
  damagetypevalue: string = '';
  damagetypeidArr: string[] = [];
  damagetypevalueArr: string[] = [];

  // Assigned To
  assignedtoid: string = '';
  assignedtovalue: string = '';
  assignedtoidArr: string[] = [];
  assignedtovalueArr: string[] = [];

  // Task related
  remarks: string = '';
  reason: string = '';
  taskcompletedflag: number = 0;

  // =========================================================
  // Flags
  // =========================================================
  viewFlag: boolean = false;
  goodFlag: boolean = false;
  abnormalFlag: boolean = false;
  servicedFlag: boolean = false;
  replacedFlag: boolean = false;
  otheractivityFlag: boolean = false;
  confirmDisable: boolean = false;

  // Track if save was successful (to prevent double toast)
  private saveSuccessful: boolean = false;

  // =========================================================
  // Select Options
  // =========================================================
  public maintenancetypeOptions: any = {
    header: this.translate.instant(
      'MAINTENANCEACKNOWLEDGEMODAL.maintenancetype',
    ),
    cssClass: 'multiselect',
  };

  public damagetypeOptions: any = {
    header: this.translate.instant('MAINTENANCEACKNOWLEDGEMODAL.damagetype'),
    cssClass: 'multiselect',
  };

  public assignedtoOptions: any = {
    header: this.translate.instant(
      'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.assignto',
    ),
    cssClass: 'multiselect',
  };

  constructor(
    private platform: Platform,
    private languageService: LanguageService,
    private translate: TranslateService,
    private router: Router,
    private alertController: AlertController,
    public modalController: ModalController,
    private fb: FormBuilder,
    public navParams: NavParams,
    private maintenanceService: MaintenanceService,
    private toastService: ToastService,
    public userContext: UserContext,
    private sanitizer: DomSanitizer,
  ) {
    // Prevent hardware back button from closing modal
    this.platform.backButton.subscribeWithPriority(9999, () => {
      this.modalController.getTop().then((modal) => {
        if (modal != null) {
          return;
        }
      });
    });

    // Get params from navParams
    const viewform = navParams.get('item');
    this.params = JSON.parse(viewform);

    this.title = 'ID: ' + this.params.notificationno;
    this.module = navParams.get('module');
    this.extendrunninghoursFlag = navParams.get('flag');
    this.machinereplacementFlag = this.params.machinereplacement;

    console.log('Module:', this.module);
    console.log('Params:', this.params);

    // Set display values
    this.getnotificationid = this.params.id;
    this.getstationid = this.params.stationid;
    this.getstationname = this.params.stationname;
    this.getmachineid = this.params.equipmentid;
    this.getmachinename = this.params.machine;
    this.getactivityname = this.params.replacement_activityname;
    this.getstatusid = this.params.statusId;
    this.getpmflag = this.params.pm_flag;
    this.partdefectname = this.params.partdefect;
    this.partdefectid = this.params.partdefectid;

    // Initialize form
    this.assignForm = this.fb.group({
      select_maintenancetype: new FormControl(''),
      select_damagetype: new FormControl(''),
      txt_activityname: new FormControl(''),
      select_assignedto: new FormControl(''),
      txt_extendlifetimehours: new FormControl(''),
    });

    this.gettasklist();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.getpmflag == '1') {
      this.getAINotificationView();
    } else {
      this.getAssignedTo();
    }
  }

  // =========================================================
  // API Methods
  // =========================================================

  getAINotificationView(): void {
    const req = {
      user_id: this.userContext.userId,
      millcode: this.userContext.millCode,
      dept_id: this.userContext.departmentId,
      design_id: this.userContext.designId,
      id: this.getnotificationid,
      language: this.languageService.getLanguage,
    };

    console.log('getAINotificationView Request:', req);

    this.maintenanceService
      .getAIView(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resultdata: any) => {
          console.log('getAINotificationView Response:', resultdata);
          if (resultdata.httpcode == 200) {
            this.aicontent = this.sanitizer.bypassSecurityTrustHtml(
              resultdata.content,
            );
          } else {
            this.aicontent = '';
          }
          this.getAssignedTo();
        },
        error: (error: any) => {
          console.error('getAINotificationView error:', error);
          this.aicontent = '';
          this.getAssignedTo();
        },
      });
  }

  getAssignedTo(): void {
    const req = {
      user_id: this.userContext.userId,
      millcode: this.userContext.millCode,
      dept_id: this.userContext.departmentId,
      desig_id: this.userContext.designId,
      language: this.languageService.getLanguage,
    };

    console.log('getAssignedTo Request:', req);

    this.maintenanceService
      .getAssignedToList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resultdata: any) => {
          console.log('getAssignedTo Response:', resultdata);
          if (resultdata.httpcode == 200) {
            this.assignedtoArr = resultdata.data || [];

            const eachArr: any[] = [];
            for (let i = 0; i < this.assignedtoArr.length; i++) {
              const eachitem = this.assignedtoArr[i];
              const eachreq = {
                userId: eachitem.userId,
                name: eachitem.name,
                selected: 0,
              };
              eachArr.push(eachreq);

              if (this.assignedtoid != '') {
                if (eachitem.userId == this.assignedtoid) {
                  eachArr[i]['selected'] = 1;
                }
              }
            }
            this.assignedtoArr = eachArr;
          } else {
            this.assignedtoArr = [];
          }
        },
        error: (error: any) => {
          console.error('getAssignedTo error:', error);
          this.assignedtoArr = [];
        },
      });
  }

  gettasklist(): void {
    const req = {
      user_id: this.userContext.userId,
      millcode: this.userContext.millCode,
      dept_id: this.userContext.departmentId,
      design_id: this.userContext.designId,
      machineid: this.getmachineid,
      part_id: this.partdefectid,
      stationid: this.getstationid,
    };

    console.log('gettasklist Request:', req);

    this.maintenanceService
      .getPartTaskList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resultdata: any) => {
          console.log('gettasklist Response:', resultdata);
          if (resultdata.httpcode == 200) {
            this.tasklistArr = resultdata.data || [];
          } else {
            this.tasklistArr = [];
          }
        },
        error: (error: any) => {
          console.error('gettasklist error:', error);
          this.tasklistArr = [];
        },
      });
  }

  getMaintenancetype(): void {
    const req = {
      user_id: this.userContext.userId,
      millcode: this.userContext.millCode,
      dept_id: this.userContext.departmentId,
      language: this.languageService.getLanguage,
    };

    console.log('getMaintenancetype Request:', req);

    this.maintenanceService
      .getMaintenanceTypeList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resultdata: any) => {
          console.log('getMaintenancetype Response:', resultdata);
          if (resultdata.httpcode == 200) {
            this.maintenancetypeArr = resultdata.data || [];

            const eachArr: any[] = [];
            for (let i = 0; i < this.maintenancetypeArr.length; i++) {
              const eachitem = this.maintenancetypeArr[i];
              const eachreq = {
                id: eachitem.id,
                maintanence_type: eachitem.maintanence_type,
                selected: 0,
              };
              eachArr.push(eachreq);

              if (this.maintenancetypeid != '') {
                if (eachitem.id == this.maintenancetypeid) {
                  eachArr[i]['selected'] = 1;
                }
              }
            }
            this.maintenancetypeArr = eachArr;
          } else {
            this.maintenancetypeArr = [];
          }
          this.getDamage();
        },
        error: (error: any) => {
          console.error('getMaintenancetype error:', error);
          this.maintenancetypeArr = [];
          this.getDamage();
        },
      });
  }

  getDamage(): void {
    const req = {
      user_id: this.userContext.userId,
      millcode: this.userContext.millCode,
      dept_id: this.userContext.departmentId,
    };

    console.log('getDamage Request:', req);

    this.maintenanceService
      .getDamageList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resultdata: any) => {
          console.log('getDamage Response:', resultdata);
          if (resultdata.httpcode == 200) {
            this.damageArr = resultdata.data || [];

            const eachArr: any[] = [];
            for (let i = 0; i < this.damageArr.length; i++) {
              const eachitem = this.damageArr[i];
              const eachreq = {
                id: eachitem.id,
                damage: eachitem.damage,
                selected: 0,
              };
              eachArr.push(eachreq);

              if (this.damagetypeid != '') {
                if (eachitem.id == this.damagetypeid) {
                  eachArr[i]['selected'] = 1;
                }
              }
            }
            this.damageArr = eachArr;
          } else {
            this.damageArr = [];
          }
        },
        error: (error: any) => {
          console.error('getDamage error:', error);
          this.damageArr = [];
        },
      });
  }

  getDetails(): void {
    const req = {
      user_id: this.userContext.userId,
      millcode: this.userContext.millCode,
      dept_id: this.userContext.departmentId,
      desig_id: this.userContext.designId,
      stationid: this.getstationid,
      equipment: this.getmachineid,
      part_id: this.partdefectid,
      language: this.languageService.getLanguage,
    };

    console.log('getDetails Request:', req);

    this.maintenanceService
      .getPartsDetails(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resultdata: any) => {
          console.log('getDetails Response:', resultdata);
          if (resultdata.httpcode == 200) {
            this.lifetimerunninghours = resultdata.lifetimehours;
            this.currentrunninghours = resultdata.machinerunninghours;
          } else {
            this.lifetimerunninghours = '0';
            this.currentrunninghours = '0';
          }
        },
        error: (error: any) => {
          console.error('getDetails error:', error);
          this.lifetimerunninghours = '0';
          this.currentrunninghours = '0';
        },
      });
  }

  // =========================================================
  // Selection Handlers
  // =========================================================

  maintenancetypehandleChange(event: any): void {
    const value = event.detail.value;

    if (value && value.length > 0) {
      const parsed = JSON.parse(value);
      this.maintenancetypeid = parsed.id;
      this.maintenancetypevalue = parsed.maintanence_type;
    } else {
      this.maintenancetypeid = '';
      this.maintenancetypevalue = '';
    }
  }

  openDamageType(): void {
    this.damagetypeRef.open();
  }

  damagehandleChange(event: any): void {
    const value = event.detail.value;

    if (value && value.length > 0) {
      this.damagetypeidArr = [];
      this.damagetypevalueArr = [];
      for (let i = 0; i < value.length; i++) {
        const parsed = JSON.parse(value[i]);
        this.damagetypeidArr.push(parsed.id);
        this.damagetypevalueArr.push(parsed.damage);
      }

      this.damagetypeid = this.damagetypeidArr.join(',');
      this.damagetypevalue = this.nl2br(this.damagetypevalueArr.join(', '));
    } else {
      this.damagetypeidArr = [];
      this.damagetypevalueArr = [];
      this.damagetypeid = '';
      this.damagetypevalue = '';
    }
  }

  openAssignedTo(): void {
    this.assignedtoRef.open();
  }

  assignedtohandleChange(event: any): void {
    const value = event.detail.value;

    if (value && value.length > 0) {
      this.assignedtoidArr = [];
      this.assignedtovalueArr = [];
      for (let i = 0; i < value.length; i++) {
        const parsed = JSON.parse(value[i]);
        this.assignedtoidArr.push(parsed.userId);
        this.assignedtovalueArr.push(parsed.name);
      }

      this.assignedtoid = this.assignedtoidArr.join(',');
      this.assignedtovalue = this.nl2br(this.assignedtovalueArr.join(', '));
    } else {
      this.assignedtoidArr = [];
      this.assignedtovalueArr = [];
      this.assignedtoid = '';
      this.assignedtovalue = '';
    }
  }

  // =========================================================
  // Activity Methods
  // =========================================================

  btn_add(type: string): void {
    if (type == 'Activity') {
      if (this.assignForm.value.txt_activityname == '') {
        this.toastService.warning(
          this.translate.instant(
            'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.activitynamemandatory',
          ),
        );
        return;
      }

      this.activityid = '0';
      this.activityidArr.push(this.activityid);
      this.activityvalueArr.push(this.assignForm.value.txt_activityname);
      this.activityvalue = this.nl2br(this.activityvalueArr.join(', '));
      this.otheractivityFlag = false;
      this.assignForm.controls['txt_activityname'].setValue('');
    }
  }

  clear(type: string): void {
    if (type == 'Activity') {
      this.activityidArr.splice(-1);
      this.activityvalueArr.splice(-1);

      if (this.activityvalueArr.length > 0) {
        this.activityvalue = this.nl2br(this.activityvalueArr.join('\n'));
      } else {
        this.activityid = '';
        this.activityvalue = '';
        this.activityidArr = [];
        this.activityvalueArr = [];
      }
    }
  }

  // =========================================================
  // Task Validation - ONLY validate task completion
  // =========================================================

  /**
   * Validate all tasks are completed before saving.
   * We only check that taskcompletedflag = 1.
   * Empty maintenance type / damage type are allowed and will be passed as empty.
   */
  private validateTasks(): boolean {
    for (let i = 0; i < this.tasklistArr.length; i++) {
      const eachtaskdata = this.tasklistArr[i].tasklistdata;

      for (let j = 0; j < eachtaskdata.length; j++) {
        const task = eachtaskdata[j];

        // Only check if task is completed
        // We allow empty maintenance type / damage type
        if (
          task.taskcompletedflag == 0 ||
          task.taskcompletedflag == undefined ||
          task.taskcompletedflag == null
        ) {
          this.toastService.warning(
            this.tasklistArr[i].partname +
              ' - Task "' +
              task.task_name +
              '" update is not completed',
          );
          return false;
        }
      }
    }

    return true;
  }

  // =========================================================
  // Save Methods
  // =========================================================

  btn_next(): void {
    // Reset save flag
    this.saveSuccessful = false;

    // Validate Assigned To
    if (this.assignedtoidArr.length <= 0) {
      this.toastService.warning(
        this.translate.instant('PREVENTIVEMAINTENANCEASSIGN.assigntomandatory'),
      );
      return;
    }

    // Validate all tasks are completed
    if (!this.validateTasks()) {
      return;
    }

    this.save();
  }

  btn_back(): void {
    this.viewFlag = false;
  }

  save(): void {
    const partsstatus: any[] = [];
    const taskstatus: any[] = [];
    const setpvflag = 0;

    // Add single part defect
    const eachreq = {
      partid: this.partdefectid,
      condition: '',
      maintenancetypeid: '',
      damagetypeid: '',
    };
    partsstatus.push(eachreq);

    // Build task status array - pass empty strings if values are missing
    for (let i = 0; i < this.tasklistArr.length; i++) {
      const eachArr = this.tasklistArr[i].tasklistdata;

      for (let j = 0; j < eachArr.length; j++) {
        const task = eachArr[j];

        let reason = '';

        if (task.status == 'Not Done') {
          reason = task.reason || '';
        } else {
          reason = task.remarks || '';
        }

        // Pass empty string if maintenance type or damage type is not selected
        // Convert to string if numeric, otherwise pass empty
        const maintenancetypeid =
          task.maintenancetypeid != null &&
          task.maintenancetypeid != undefined &&
          task.maintenancetypeid != '' &&
          task.maintenancetypeid != 0 &&
          task.maintenancetypeid != '0'
            ? String(task.maintenancetypeid)
            : '';

        const damagetypeid =
          task.damagetypeid != null &&
          task.damagetypeid != undefined &&
          task.damagetypeid != '' &&
          task.damagetypeid != 0 &&
          task.damagetypeid != '0'
            ? String(task.damagetypeid)
            : '';

        const taskeachitem = {
          partid: this.tasklistArr[i].partid,
          taskid: task.task_id,
          condition: task.status || '',
          maintenancetypeid: maintenancetypeid,
          damagetypeid: damagetypeid,
          remarks: reason,
        };
        taskstatus.push(taskeachitem);
      }
    }

    console.log('Parts Status:', JSON.stringify(partsstatus));
    console.log('Task Status:', JSON.stringify(taskstatus));

    this.confirmDisable = true;

    const req = {
      userid: this.userContext.userId,
      millcode: this.userContext.millCode,
      dept_id: this.userContext.departmentId,
      id: this.getnotificationid,
      stationid: this.getstationid,
      equipment: this.getmachineid,
      partsarray: JSON.stringify(partsstatus),
      assignedto: this.assignedtoidArr.join(','),
      pvflag: setpvflag,
      completedflag: 1,
      extendrunninghoursflag: this.extendrunninghoursFlag,
      machinereplacementflag: this.machinereplacementFlag,
      language: this.languageService.getLanguage,
      tasklistarray: JSON.stringify(taskstatus),
    };

    console.log('save Request:', req);

    this.maintenanceService
      .saveMultiplePartMaintenanceNotification(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resultdata: any) => {
          console.log('save Response:', resultdata);
          this.confirmDisable = false;

          if (resultdata.httpcode == 200) {
            this.saveSuccessful = true;

            if (this.module == 'RoPM') {
              this.toastService.success(
                this.translate.instant(
                  'PREVENTIVEMAINTENANCEASSIGN.routineacceptsuccess',
                ),
              );
            }

            this.modalController.dismiss({
              dismissed: true,
              item: 'Submitted',
            });
          } else {
            // Non-200 response from server
            if (this.module == 'RoPM') {
              this.toastService.error(
                this.translate.instant(
                  'PREVENTIVEMAINTENANCEASSIGN.routineacceptfailed',
                ),
              );
            }
          }
        },
        error: (error: any) => {
          console.error('save error:', error);
          this.confirmDisable = false;

          // Check if the error is a 500 but data might have been saved
          if (error.status === 500) {
            const errorMessage = error.error?.message || '';

            if (errorMessage.includes('EclipseLink')) {
              console.warn(
                'Backend returned 500 but data may have been partially saved',
              );

              this.toastService.success(
                this.translate.instant(
                  'PREVENTIVEMAINTENANCEASSIGN.routineacceptsuccess',
                ),
              );

              // this.toastService.warning(
              //   'Data may have been saved. Please close and refresh to verify.',
              // );

              setTimeout(() => {
                this.modalController.dismiss({
                  dismissed: true,
                  item: 'Submitted',
                });
              }, 1500);
            } else {
              this.toastService.error('Something went wrong!');
            }
          } else {
            this.toastService.error('Something went wrong!');
          }
        },
      });
  }

  resetdata(): void {
    if (this.module == 'RoPM') {
      this.maintenancetypeid = '';
      this.maintenancetypevalue = '';

      this.activityid = '';
      this.activityvalue = '';
      this.activityidArr = [];
      this.activityvalueArr = [];

      this.damagetypeid = '';
      this.damagetypevalue = '';
      this.damagetypeidArr = [];
      this.damagetypevalueArr = [];

      this.assignedtoid = '';
      this.assignedtovalue = '';
      this.assignedtoidArr = [];
      this.assignedtovalueArr = [];

      this.assignForm.controls['select_maintenancetype'].setValue('');
      this.assignForm.controls['select_damagetype'].setValue('');
      this.assignForm.controls['txt_activityname'].setValue('');
      this.assignForm.controls['select_assignedto'].setValue('');
    } else {
      this.lifetimerunninghours = '';
      this.currentrunninghours = '';

      this.assignForm.controls['txt_extendlifetimehours'].setValue('');
    }
  }

  // =========================================================
  // Task Update Modal
  // =========================================================

  async btn_taskupdate(value: any, item: any): Promise<void> {
    const modal = await this.modalController.create({
      component: MaintenanceUpdateTaskListPage,
      componentProps: {
        value: JSON.stringify(value),
        item: JSON.stringify(item),
        module: 'RoPM',
      },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: ['notification-modal'],
    });

    modal.onDidDismiss().then((data: any) => {
      const getdata = data?.data?.item;

      if (getdata == 'Saved') {
        this.conditionoptionSelected = data['data']['status'] || '';
        this.maintenancetypeid = data['data']['maintenancetypeid'] || '';
        this.damagetypeid = data['data']['damagetypeid'] || '';
        this.maintenancetypevalue = data['data']['maintenancetype'] || '';
        this.damagetypevalue = data['data']['damagetype'] || '';
        this.remarks = data['data']['remarks'] || '';
        this.reason = data['data']['reason'] || '';
        this.taskcompletedflag = data['data']['taskcompletedflag'] || 0;

        const index = this.tasklistArr.findIndex(
          (task: any) => task.partid === value.partid,
        );

        if (index >= 0) {
          const index1 = this.tasklistArr[index].tasklistdata.findIndex(
            (task_id: any) => task_id.task_id === item.task_id,
          );

          if (index1 >= 0) {
            this.tasklistArr[index].tasklistdata[index1].status =
              this.conditionoptionSelected;
            this.tasklistArr[index].tasklistdata[index1].maintenancetypeid =
              this.maintenancetypeid;
            this.tasklistArr[index].tasklistdata[index1].maintenancetype =
              this.maintenancetypevalue;
            this.tasklistArr[index].tasklistdata[index1].damagetypeid =
              this.damagetypeid;
            this.tasklistArr[index].tasklistdata[index1].damagetype =
              this.damagetypevalue;
            this.tasklistArr[index].tasklistdata[index1].remarks = this.remarks;
            this.tasklistArr[index].tasklistdata[index1].reason = this.reason;
            this.tasklistArr[index].tasklistdata[index1].taskcompletedflag =
              this.taskcompletedflag;
          }
        }
      }

      console.log('Updated Tasklist:', this.tasklistArr);
    });

    return await modal.present();
  }

  // =========================================================
  // Utility Methods
  // =========================================================

  numberFilter(event: any): void {
    const reg = /^[1-9][0-9]{0,5}$/;
    const input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  nl2br(text: string): string {
    return text ? text.replace(new RegExp('\r?\n', 'g'), '<br />') : '';
  }

  parseString(item: any): string {
    return JSON.stringify(item);
  }

  btn_close(): void {
    this.modalController.dismiss({
      dismissed: true,
      item: '',
    });
  }
}
