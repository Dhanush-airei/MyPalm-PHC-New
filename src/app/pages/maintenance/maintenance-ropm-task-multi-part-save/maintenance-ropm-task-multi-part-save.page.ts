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
  IonContent,
} from '@ionic/angular';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaintenanceUpdateTaskListPage } from 'src/app/pages/maintenance/maintenance-update-task-list/maintenance-update-task-list.page';

@Component({
  selector: 'app-maintenance-ropm-task-multi-part-save',
  templateUrl: './maintenance-ropm-task-multi-part-save.page.html',
  styleUrls: ['./maintenance-ropm-task-multi-part-save.page.scss'],
  standalone: false,
})
export class MaintenanceRopmTaskMultiPartSavePage
  implements OnInit, AfterViewInit
{
  private destroyRef = inject(DestroyRef);

  @ViewChild('pageTop') pageTop!: IonContent;
  @ViewChild('partsSelect', { static: false }) partsRef!: IonSelect;
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
  multipartsArr: any[] = [];
  tasklistArr: any[] = [];

  // =========================================================
  // Display Values
  // =========================================================
  title: string = '';
  module: string = '';
  getnotificationid: string = '';
  getstationid: string = '';
  getstationname: string = '';
  getmachineid: string = '';
  getmachinename: string = '';
  getactivityname: string = '';
  getstatusid: string = '';
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

  // Parts
  partid: string = '';
  partvalue: string = '';
  partidArr: string[] = [];
  partvalueArr: string[] = [];

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
  goodFlag: boolean = false;
  abnormalFlag: boolean = false;
  pleasewaitflag: boolean = false;
  confirmDisable: boolean = false;

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

  public partsOptions: any = {
    header: this.translate.instant('PREVENTIVEMAINTENANCEASSIGN.partname'),
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
  ) {
    this.platform.backButton.subscribeWithPriority(9999, () => {
      this.modalController.getTop().then((modal) => {
        if (modal != null) {
          return;
        }
      });
    });

    const viewform = navParams.get('item');
    this.params = JSON.parse(viewform);
    this.module = navParams.get('module');

    console.log('Module:', this.module);
    console.log('Params:', this.params);

    this.title = 'ID: ' + this.params.notificationno;
    this.getnotificationid = this.params.id;
    this.getstationid = this.params.stationid;
    this.getstationname = this.params.stationname;
    this.getmachineid = this.params.equipmentid;
    this.getmachinename = this.params.machine;
    this.getactivityname = this.params.replacement_activityname;
    this.getstatusid = this.params.statusId;
    this.partdefectname = this.params.partdefect;
    this.partdefectid = this.params.partdefectid;

    this.assignForm = this.fb.group({
      select_parts: new FormControl(''),
      select_assignedto: new FormControl(''),
      select_maintenancetype: new FormControl(''),
      select_damagetype: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // this.getMaintenancetype();
    this.getAssignedTo();
  }

  // =========================================================
  // API Methods
  // =========================================================

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
          this.getParts();
        },
        error: (error: any) => {
          console.error('getAssignedTo error:', error);
          this.assignedtoArr = [];
          this.getParts();
        },
      });
  }

  getParts(): void {
    const req = {
      userid: this.userContext.userId,
      departmentid: this.userContext.departmentId,
      designationid: this.userContext.designId,
      millcode: this.userContext.millCode,
      id: this.getnotificationid,
      partdefectid: this.partdefectid,
      language: this.languageService.getLanguage,
    };

    console.log('getParts Request:', req);

    this.maintenanceService
      .getMultiPartDefectList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resultdata: any) => {
          console.log('getParts Response:', resultdata);
          if (resultdata.httpcode == 200) {
            this.multipartsArr = resultdata.data || [];
          } else {
            this.multipartsArr = [];
          }
        },
        error: (error: any) => {
          console.error('getParts error:', error);
          this.multipartsArr = [];
        },
      });
  }

  /**
   * ✅ FIXED: Group the flat API response by partid.
   *
   * The API returns one entry per (part, task) pair, so the same part
   * appears multiple times (once per task). We collapse those into one
   * entry per part, with all tasks collected in `tasklistdata`.
   */
  gettasklist(): void {
    const req = {
      user_id: this.userContext.userId,
      millcode: this.userContext.millCode,
      dept_id: this.userContext.departmentId,
      design_id: this.userContext.designId,
      machineid: this.getmachineid,
      part_id: this.partid,
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
            const rawList: any[] = resultdata.data || [];

            // ---- Group by partid ----
            const groupedMap = new Map<string, any>();

            for (const row of rawList) {
              const key = String(row.partid);

              if (!groupedMap.has(key)) {
                groupedMap.set(key, {
                  partid: row.partid,
                  partname: row.partname,
                  tasklistdata: [],
                });
              }

              const partEntry = groupedMap.get(key);

              // Each row contributes its inner tasklistdata array
              // (usually 1 task per row in the API response).
              const tasksFromRow = row.tasklistdata || [];

              for (const task of tasksFromRow) {
                partEntry.tasklistdata.push({ ...task });
              }
            }

            this.tasklistArr = Array.from(groupedMap.values());

            console.log(
              'TASKLIST GROUPED:',
              JSON.stringify(this.tasklistArr, null, 2),
            );
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

  // =========================================================
  // Selection Handlers
  // =========================================================

  openParts(): void {
    this.partsRef.open();
  }

  partshandleChange(event: any): void {
    const value = event.detail.value;

    if (value && value.length > 0) {
      this.partidArr = [];
      this.partvalueArr = [];
      for (let i = 0; i < value.length; i++) {
        const parsed = JSON.parse(value[i]);
        this.partidArr.push(parsed.partid);
        this.partvalueArr.push(parsed.partname);
      }

      this.partid = this.partidArr.join(',');
      this.partvalue = this.nl2br(this.partvalueArr.join(', '));
      this.gettasklist();
    } else {
      this.partidArr = [];
      this.partvalueArr = [];
      this.partid = '';
      this.partvalue = '';
      this.gettasklist();
    }
  }

  // =========================================================
  // Maintenance Type — same shape as maintenance-update-task-list
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

  // =========================================================
  // Damage Type
  // =========================================================
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

  onConditionOptionChange(value: string): void {
    this.conditionoptionSelected = value;

    if (this.conditionoptionSelected == 'Abnormal') {
      if (this.partidArr.length > 1) {
        this.toastService.warning(
          this.translate.instant(
            'PREVENTIVEMAINTENANCEASSIGN.onepartmaximumabnormal',
          ),
        );
      }

      this.goodFlag = false;
      this.abnormalFlag = true;
      this.getMaintenancetype();
    } else {
      this.goodFlag = true;
      this.abnormalFlag = false;
    }
  }

  // =========================================================
  // Save Methods
  // =========================================================

  async savealert(): Promise<void> {
    if (
      this.conditionoptionSelected === 'Abnormal' &&
      this.partidArr.length > 1
    ) {
      this.toastService.warning(
        this.translate.instant(
          'PREVENTIVEMAINTENANCEASSIGN.onepartmaximumabnormal',
        ),
      );
      return;
    }

    if (this.partidArr.length <= 0) {
      this.toastService.warning(
        this.translate.instant('PREVENTIVEMAINTENANCEASSIGN.partnamemandatory'),
      );
      return;
    }

    if (this.assignedtoidArr.length <= 0) {
      this.toastService.warning(
        this.translate.instant('PREVENTIVEMAINTENANCEASSIGN.assigntomandatory'),
      );
      return;
    }

    for (let i = 0; i < this.tasklistArr.length; i++) {
      const eachtaskdata = this.tasklistArr[i].tasklistdata;
      for (let j = 0; j < eachtaskdata.length; j++) {
        if (eachtaskdata[j].taskcompletedflag == 0) {
          this.toastService.warning(
            this.tasklistArr[i].partname + ' task update is not completed',
          );
          return;
        }
      }
    }

    if (this.multipartsArr.length == this.partidArr.length) {
      this.btn_save();
    } else {
      const pendingparts = this.multipartsArr.length - this.partidArr.length;
      const parttext = pendingparts == 1 ? ' Part' : ' Parts';

      let alertmessage = '';
      if (this.languageService.getLanguage == 'English') {
        alertmessage =
          pendingparts +
          parttext +
          this.translate.instant(
            'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.multiplepartalertmessage',
          );
      } else {
        alertmessage =
          pendingparts +
          ' bahagian' +
          this.translate.instant(
            'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.multiplepartalertmessage',
          );
      }

      const alert = await this.alertController.create({
        mode: 'md',
        header: this.translate.instant(
          'SUPERVISORDASHBOARD.alreadybreakdownalerttitle',
        ),
        cssClass: 'customalertmessagetwobuttons',
        message: alertmessage,
        buttons: [
          {
            text: '',
            cssClass: 'cancelbutton',
            handler: () => {},
          },
          {
            text: '',
            handler: () => {
              this.btn_save();
            },
          },
        ],
      });

      await alert.present();
    }
  }

  btn_save(): void {
    if (
      this.conditionoptionSelected === 'Abnormal' &&
      this.partidArr.length > 1
    ) {
      this.toastService.warning(
        this.translate.instant(
          'PREVENTIVEMAINTENANCEASSIGN.onepartmaximumabnormal',
        ),
      );
      return;
    }

    let completedFlag: number;

    if (this.multipartsArr.length == this.partidArr.length) {
      completedFlag = 1;
    } else {
      completedFlag = 0;
    }

    this.save(completedFlag);
  }

  save(getcompletedflag: number): void {
    const partsstatus: any[] = [];
    const taskstatus: any[] = [];

    for (let i = 0; i < this.partidArr.length; i++) {
      const eachreq = {
        partid: this.partidArr[i],
        condition: '',
        maintenancetypeid: 0,
        damagetypeid: 0,
      };

      partsstatus.push(eachreq);
    }

    console.log('Grouped Tasklist:', this.tasklistArr);

    for (let i = 0; i < this.tasklistArr.length; i++) {
      const eachArr = this.tasklistArr[i].tasklistdata;

      for (let j = 0; j < eachArr.length; j++) {
        let reason = '';

        if (eachArr[j].status == 'Not Done') {
          reason = eachArr[j].reason;
        } else {
          reason = eachArr[j].remarks;
        }

        const taskeachitem = {
          partid: this.tasklistArr[i].partid,
          taskid: eachArr[j].task_id,
          condition: eachArr[j].status,
          maintenancetypeid: eachArr[j].maintenancetypeid || 0,
          damagetypeid: eachArr[j].damagetypeid || 0,
          remarks: reason,
        };

        taskstatus.push(taskeachitem);
      }
    }

    this.pageTop.scrollToTop();
    this.confirmDisable = true;
    this.pleasewaitflag = true;

    const req = {
      userid: this.userContext.userId,
      millcode: this.userContext.millCode,
      dept_id: this.userContext.departmentId,
      id: this.getnotificationid,
      stationid: this.getstationid,
      equipment: this.getmachineid,
      partsarray: JSON.stringify(partsstatus),
      assignedto: this.assignedtoidArr.join(','),
      pvflag: 0,
      completedflag: getcompletedflag,
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
          this.pleasewaitflag = false;

          if (resultdata.httpcode == 200) {
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
          this.pleasewaitflag = false;
          this.toastService.error('Something went wrong!');
        },
      });
  }

  resetdata(): void {
    this.maintenancetypeid = '';
    this.maintenancetypevalue = '';

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
    this.assignForm.controls['select_assignedto'].setValue('');
  }

  // =========================================================
  // Task Update Modal
  // =========================================================
  // After grouping, `value.partid` is unique in tasklistArr,
  // and `item.task_id` is unique inside `value.tasklistdata`.
  // We still pass `taskIndex` from the template as a defensive
  // safety net so that ALL tasks (including the second/third set
  // of the multi-part save) receive their own status correctly.
  // =========================================================

  async btn_taskupdate(
    value: any,
    item: any,
    taskIndex: number,
  ): Promise<void> {
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
      const dismissData = data?.data;
      const getdata = dismissData?.item;

      if (getdata !== 'Saved') {
        return;
      }

      const partIndex = this.tasklistArr.findIndex(
        (p: any) => String(p.partid) === String(value.partid),
      );

      if (partIndex === -1) {
        console.warn('[btn_taskupdate] Part not found:', value.partid);
        return;
      }

      // Use taskIndex directly (from template).
      // Fallback to task_id match if taskIndex is somehow out of range.
      let safeIndex = taskIndex;
      const partTasks = this.tasklistArr[partIndex].tasklistdata;

      if (
        safeIndex === undefined ||
        safeIndex === null ||
        safeIndex < 0 ||
        safeIndex >= partTasks.length ||
        String(partTasks[safeIndex].task_id) !== String(item.task_id)
      ) {
        safeIndex = partTasks.findIndex(
          (t: any) => String(t.task_id) === String(item.task_id),
        );
      }

      if (safeIndex === -1) {
        console.warn('[btn_taskupdate] Task not found:', item.task_id);
        return;
      }

      // Immutable update of the specific task row
      const updatedTaskListData = partTasks.map((t: any, idx: number) => {
        if (idx !== safeIndex) {
          return t;
        }
        return {
          ...t,
          status: dismissData.status,
          maintenancetypeid: dismissData.maintenancetypeid,
          maintenancetype: dismissData.maintenancetype,
          damagetypeid: dismissData.damagetypeid,
          damagetype: dismissData.damagetype,
          remarks: dismissData.remarks,
          reason: dismissData.reason,
          taskcompletedflag: dismissData.taskcompletedflag,
        };
      });

      // Rebuild array references to trigger change detection
      this.tasklistArr = this.tasklistArr.map((p: any, idx: number) =>
        idx === partIndex ? { ...p, tasklistdata: updatedTaskListData } : p,
      );

      this.conditionoptionSelected = dismissData.status;
      this.maintenancetypeid = dismissData.maintenancetypeid;
      this.damagetypeid = dismissData.damagetypeid;
      this.maintenancetypevalue = dismissData.maintenancetype;
      this.damagetypevalue = dismissData.damagetype;
      this.remarks = dismissData.remarks;
      this.reason = dismissData.reason;
      this.taskcompletedflag = dismissData.taskcompletedflag;
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
