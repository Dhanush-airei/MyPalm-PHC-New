import {
  Component,
  OnInit,
  ViewChild,
  DestroyRef,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Platform,
  ModalController,
  NavParams,
  AlertController,
  IonSelect,
} from '@ionic/angular';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Services
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';

@Component({
  selector: 'app-maintenance-preventive-maintenance-assign',
  templateUrl: './maintenance-preventive-maintenance-assign.page.html',
  styleUrls: ['./maintenance-preventive-maintenance-assign.page.scss'],
  standalone: false,
})
export class MaintenancePreventiveMaintenanceAssignPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  @ViewChild('damagetypeSelect', { static: false }) damagetypeRef!: IonSelect;
  @ViewChild('assignedtoSelect', { static: false }) assignedtoRef!: IonSelect;

  // -------------------------------------------------------
  // Form
  // -------------------------------------------------------
  assignForm!: FormGroup;

  // -------------------------------------------------------
  // Params / UI state
  // -------------------------------------------------------
  params: any;
  title: string = '';
  module: string = '';
  extendrunninghoursFlag: string = '';
  machinereplacementFlag: string = '';
  viewFlag: boolean = false;
  confirmDisable: boolean = false;

  // -------------------------------------------------------
  // Notification / Equipment identifiers
  // -------------------------------------------------------
  getnotificationid: string = '';
  getstationid: string = '';
  getstationname: string = '';
  getmachineid: string = '';
  getmachinename: string = '';
  getactivityname: string = '';
  getstatusid: string = '';
  getpmflag: string = '';
  partdefectname: string = '';
  partdefectid: string = '';
  lifetimerunninghours: string = '';
  currentrunninghours: string = '';

  // -------------------------------------------------------
  // AI content
  // -------------------------------------------------------
  aicontent: SafeHtml = '';

  // -------------------------------------------------------
  // Condition / activity state
  // -------------------------------------------------------
  conditionoptionSelected: string = '';
  conditionactivitySelected: string = '';
  goodFlag: boolean = false;
  abnormalFlag: boolean = false;
  servicedFlag: boolean = false;
  replacedFlag: boolean = false;

  // -------------------------------------------------------
  // Maintenance Type
  // -------------------------------------------------------
  maintenancetypeArr: any[] = [];
  maintenancetypeid: string = '';
  maintenancetypevalue: string = '';

  // -------------------------------------------------------
  // Damage Type
  // -------------------------------------------------------
  damageArr: any[] = [];
  damagetypeid: string = '';
  damagetypevalue: string = '';
  damagetypeidArr: string[] = [];
  damagetypevalueArr: string[] = [];

  // -------------------------------------------------------
  // Assigned To
  // -------------------------------------------------------
  assignedtoArr: any[] = [];
  assignedtoid: string = '';
  assignedtovalue: string = '';
  assignedtoidArr: string[] = [];
  assignedtovalueArr: string[] = [];

  // -------------------------------------------------------
  // Ionic Select header options
  // -------------------------------------------------------
  public maintenancetypeOptions: any = {
    header: 'Maintenance Type',
    cssClass: 'multiselect',
  };

  public damagetypeOptions: any = {
    header: 'Damage Type',
    cssClass: 'multiselect',
  };

  public assignedtoOptions: any = {
    header: 'Assign To',
    cssClass: 'multiselect',
  };

  constructor(
    private platform: Platform,
    private languageService: LanguageService,
    private router: Router,
    private alertController: AlertController,
    public modalController: ModalController,
    private fb: FormBuilder,
    public navParams: NavParams,
    private maintenanceService: MaintenanceService,
    public sanitizer: DomSanitizer,
    private toastService: ToastService,
    public UserContext: UserContext,
  ) {
    // Get params from navParams
    const viewform = navParams.get('item');
    this.params = JSON.parse(viewform);
    this.module = navParams.get('module');
    this.extendrunninghoursFlag = navParams.get('flag');
    this.machinereplacementFlag = this.params.machinereplacement;

    this.title = 'ID: ' + this.params.notificationno;
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

    // Build form
    this.assignForm = this.fb.group({
      select_maintenancetype: new FormControl(''),
      select_damagetype: new FormControl([]), // multi-select → array
      txt_activityname: new FormControl(''),
      select_assignedto: new FormControl([]), // multi-select → array
      txt_extendlifetimehours: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    if (this.getpmflag == '1') {
      this.getAINotificationView();
    } else {
      this.getAssignedTo();
    }
  }

  // =========================================================
  // AI Notification
  // =========================================================
  getAINotificationView(): void {
    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      id: this.getnotificationid,
      language: this.languageService.getLanguage,
    };

    this.maintenanceService
      .getAIView(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resultdata: any) => {
          if (resultdata.httpcode == 200) {
            this.aicontent = this.sanitizer.bypassSecurityTrustHtml(
              resultdata.content,
            );
          } else {
            this.aicontent = '';
          }
          this.getAssignedTo();
        },
        error: () => {
          this.aicontent = '';
          this.getAssignedTo();
        },
      });
  }

  // =========================================================
  // Assigned To List
  // =========================================================
  getAssignedTo(): void {
    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      desig_id: this.UserContext.designId,
      language: this.languageService.getLanguage,
    };

    this.maintenanceService
      .getAssignedToList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resultdata: any) => {
          if (resultdata.httpcode == 200) {
            const rawList = resultdata.data || [];
            this.assignedtoArr = rawList.map((eachitem: any) => ({
              userId: eachitem.userId,
              name: eachitem.name,
            }));
          } else {
            this.assignedtoArr = [];
          }
        },
        error: () => {
          this.assignedtoArr = [];
        },
      });
  }

  // =========================================================
  // Maintenance Type
  // =========================================================
  maintenancetypehandleChange(e: any): void {
    const value = e.detail.value;
    if (value) {
      // Single select — value is the option object
      const parsed = typeof value == 'string' ? JSON.parse(value) : value;
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
    // Defer to next tick so the click event has fully propagated.
    setTimeout(() => {
      if (this.damagetypeRef) {
        this.damagetypeRef.open();
      } else {
        console.warn('damagetypeRef is not resolved yet');
      }
    }, 0);
  }

  damagehandleChange(e: any): void {
    const value = e.detail.value; // array of option objects (multiple=true)
    if (Array.isArray(value) && value.length > 0) {
      this.damagetypeidArr = [];
      this.damagetypevalueArr = [];
      for (const item of value) {
        const parsed = typeof item == 'string' ? JSON.parse(item) : item;
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

  // =========================================================
  // Assign To
  // =========================================================
  openAssignedTo(): void {
    // Defer to next tick so the click event has fully propagated.
    setTimeout(() => {
      if (this.assignedtoRef) {
        this.assignedtoRef.open();
      } else {
        console.warn('assignedtoRef is not resolved yet');
      }
    }, 0);
  }

  assignedtohandleChange(e: any): void {
    const value = e.detail.value; // array of option objects (multiple=true)
    if (Array.isArray(value) && value.length > 0) {
      this.assignedtoidArr = [];
      this.assignedtovalueArr = [];
      for (const item of value) {
        const parsed = typeof item == 'string' ? JSON.parse(item) : item;
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
  // Condition / Activity toggles
  // =========================================================
  onConditionOptionChange(value: string): void {
    this.conditionoptionSelected = value;

    if (value == 'Abnormal') {
      this.goodFlag = false;
      this.abnormalFlag = true;
      this.getMaintenancetype();
    } else {
      this.goodFlag = true;
      this.abnormalFlag = false;
    }
  }

  onConditionActivityChange(value: string): void {
    this.conditionactivitySelected = value;

    if (value == 'Replaced') {
      this.resetdata();
      this.servicedFlag = false;
      this.replacedFlag = true;
    } else {
      this.resetdata();
      this.servicedFlag = true;
      this.replacedFlag = false;

      if (this.extendrunninghoursFlag == '1') {
        this.getDetails();
      }
    }
  }

  // =========================================================
  // Maintenance Type list
  // =========================================================
  getMaintenancetype(): void {
    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      language: this.languageService.getLanguage,
    };

    this.maintenanceService
      .getMaintenanceTypeList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resultdata: any) => {
          if (resultdata.httpcode == 200) {
            this.maintenancetypeArr = (resultdata.data || []).map(
              (eachitem: any) => ({
                id: eachitem.id,
                maintanence_type: eachitem.maintanence_type,
              }),
            );
          } else {
            this.maintenancetypeArr = [];
          }
          this.getDamage();
        },
        error: () => {
          this.maintenancetypeArr = [];
          this.getDamage();
        },
      });
  }

  // =========================================================
  // Damage list
  // =========================================================
  getDamage(): void {
    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
    };

    this.maintenanceService
      .getDamageList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resultdata: any) => {
          if (resultdata.httpcode == 200) {
            this.damageArr = (resultdata.data || []).map((eachitem: any) => ({
              id: eachitem.id,
              damage: eachitem.damage,
            }));
          } else {
            this.damageArr = [];
          }
        },
        error: () => {
          this.damageArr = [];
        },
      });
  }

  // =========================================================
  // Part details (running hours)
  // =========================================================
  getDetails(): void {
    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      desig_id: this.UserContext.designId,
      stationid: this.getstationid,
      equipment: this.getmachineid,
      part_id: this.partdefectid,
      language: this.languageService.getLanguage,
    };

    this.maintenanceService
      .getPartsDetails(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resultdata: any) => {
          if (resultdata.httpcode == 200) {
            this.lifetimerunninghours = resultdata.lifetimehours;
            this.currentrunninghours = resultdata.machinerunninghours;
          } else {
            this.lifetimerunninghours = '0';
            this.currentrunninghours = '0';
          }
        },
        error: () => {
          this.lifetimerunninghours = '0';
          this.currentrunninghours = '0';
        },
      });
  }

  // =========================================================
  // Save / Next
  // =========================================================
  btn_next(): void {
    if (this.module == 'RoPM') {
      if (this.assignedtoidArr.length <= 0) {
        this.toastService.warning('Assignee selection is mandatory');
        return;
      }

      if (this.conditionoptionSelected == '') {
        this.toastService.warning('Condition is mandatory');
        return;
      }

      if (this.conditionoptionSelected == 'Abnormal') {
        if (this.maintenancetypeid == '') {
          this.toastService.warning('Maintenance type is mandatory');
          return;
        }

        if (this.damagetypeidArr.length <= 0) {
          this.toastService.warning('Damage type selection is mandatory');
          return;
        }
      }
    } else {
      if (this.assignedtoidArr.length <= 0) {
        this.toastService.warning('Assignee selection is mandatory');
        return;
      }

      if (this.conditionactivitySelected == '') {
        this.toastService.warning('Activity is mandatory');
        return;
      }

      if (
        this.conditionactivitySelected == 'Serviced' &&
        this.extendrunninghoursFlag == '1' &&
        (this.assignForm.value.txt_extendlifetimehours == 0 ||
          this.assignForm.value.txt_extendlifetimehours == '')
      ) {
        this.toastService.warning('Extend hours is mandatory');
        return;
      }
    }

    this.save();
  }

  // =========================================================
  // Save implementation
  // =========================================================
  private save(): void {
    if (this.machinereplacementFlag == '0') {
      this.savePartMaintenance();
    } else {
      this.saveMachineReplacement();
    }
  }

  private savePartMaintenance(): void {
    const partsstatus: any[] = [];
    let setpvflag = 0;

    if (this.goodFlag) {
      setpvflag = 0;
      partsstatus.push({
        partid: this.partdefectid,
        condition: this.conditionoptionSelected,
        maintenancetypeid: '',
        damagetypeid: '',
      });
    } else if (this.abnormalFlag) {
      setpvflag = 0;
      partsstatus.push({
        partid: this.partdefectid,
        condition: this.conditionoptionSelected,
        maintenancetypeid: String(this.maintenancetypeid),
        damagetypeid: this.damagetypeidArr.join(','),
      });
    } else if (this.replacedFlag) {
      setpvflag = 1;
      partsstatus.push({
        partid: this.partdefectid,
        replacestatus: this.conditionactivitySelected,
        lifetimerunninghours: '',
        currentrunninghours: '',
        extendedmaxrunninghours: '',
      });
    } else if (this.servicedFlag) {
      setpvflag = 1;
      partsstatus.push({
        partid: this.partdefectid,
        replacestatus: this.conditionactivitySelected,
        lifetimerunninghours:
          this.extendrunninghoursFlag == '1' ? this.lifetimerunninghours : '',
        currentrunninghours:
          this.extendrunninghoursFlag == '1' ? this.currentrunninghours : '',
        extendedmaxrunninghours:
          this.extendrunninghoursFlag == '1'
            ? String(this.assignForm.value.txt_extendlifetimehours)
            : '',
      });
    }

    this.confirmDisable = true;

    const req = {
      userid: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
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
    };

    this.maintenanceService
      .saveMultiplePartMaintenanceNotification(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resultdata: any) => {
          this.confirmDisable = false;

          if (resultdata.httpcode == 200) {
            this.showSaveSuccess();
          } else {
            this.showSaveFailed();
          }
        },
        error: () => {
          this.confirmDisable = false;
          this.showSaveFailed();
        },
      });
  }

  private saveMachineReplacement(): void {
    let machinereq: any = null;
    const setpvflag = 1;

    if (this.replacedFlag) {
      machinereq = {
        userid: this.UserContext.userId,
        millcode: this.UserContext.millCode,
        dept_id: this.UserContext.departmentId,
        id: this.getnotificationid,
        stationid: this.getstationid,
        equipment: this.getmachineid,
        replacestatus: this.conditionactivitySelected,
        assignedto: this.assignedtoidArr.join(','),
        pvflag: setpvflag,
        completedflag: 1,
        extendrunninghoursflag: this.extendrunninghoursFlag,
        machinereplacementflag: this.machinereplacementFlag,
        language: this.languageService.getLanguage,
      };
    } else if (this.servicedFlag) {
      const isExtend = this.extendrunninghoursFlag == '1';
      machinereq = {
        userid: this.UserContext.userId,
        millcode: this.UserContext.millCode,
        dept_id: this.UserContext.departmentId,
        id: this.getnotificationid,
        stationid: this.getstationid,
        equipment: this.getmachineid,
        replacestatus: this.conditionactivitySelected,
        assignedto: this.assignedtoidArr.join(','),
        lifetimerunninghours: isExtend ? this.lifetimerunninghours : '',
        currentrunninghours: isExtend ? this.currentrunninghours : '',
        extendedmaxrunninghours: isExtend
          ? String(this.assignForm.value.txt_extendlifetimehours)
          : '',
        pvflag: setpvflag,
        completedflag: 1,
        extendrunninghoursflag: this.extendrunninghoursFlag,
        machinereplacementflag: this.machinereplacementFlag,
        language: this.languageService.getLanguage,
      };
    }

    if (!machinereq) {
      return;
    }

    this.confirmDisable = true;

    this.maintenanceService
      .saveMultiplePartMaintenanceNotification(machinereq)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resultdata: any) => {
          this.confirmDisable = false;

          if (resultdata.httpcode == 200) {
            this.showSaveSuccess();
          } else {
            this.showSaveFailed();
          }
        },
        error: () => {
          this.confirmDisable = false;
          this.showSaveFailed();
        },
      });
  }

  private showSaveSuccess(): void {
    if (this.module == 'RoPM') {
      this.toastService.success(
        'Routine preventive maintenance accepted successfully',
      );
    } else {
      this.toastService.success(
        'Replacement preventive maintenance accepted successfully',
      );
    }

    this.modalController.dismiss({
      dismissed: true,
      item: 'Submitted',
    });
  }

  private showSaveFailed(): void {
    if (this.module === 'RoPM') {
      this.toastService.error(
        'Routine preventive maintenance acceptance failed',
      );
    } else {
      this.toastService.error(
        'Replacement preventive maintenance acceptance failed',
      );
    }
  }

  // =========================================================
  // Reset
  // =========================================================
  resetdata(): void {
    if (this.module == 'RoPM') {
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
      this.assignForm.controls['select_damagetype'].setValue([]); // multi-select
      this.assignForm.controls['select_assignedto'].setValue([]); // multi-select
    } else {
      this.lifetimerunninghours = '';
      this.currentrunninghours = '';

      this.assignForm.controls['txt_extendlifetimehours'].setValue('');
    }
  }

  // =========================================================
  // Back / Close
  // =========================================================
  btn_back(): void {
    this.viewFlag = false;
  }

  btn_close(): void {
    this.modalController.dismiss({
      dismissed: true,
      item: '',
    });
  }

  // =========================================================
  // Utilities
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

  /**
   * Kept for backward-compatibility. Not used in the template anymore
   * because we bind with [value]="value" (object).
   */
  parseString(item: any): string {
    return JSON.stringify(item);
  }
}
