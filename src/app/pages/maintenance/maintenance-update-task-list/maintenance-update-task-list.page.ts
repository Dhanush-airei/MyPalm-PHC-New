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

@Component({
  selector: 'app-maintenance-update-task-list',
  templateUrl: './maintenance-update-task-list.page.html',
  styleUrls: ['./maintenance-update-task-list.page.scss'],
  standalone: false,
})
export class MaintenanceUpdateTaskListPage implements OnInit, AfterViewInit {
  private destroyRef = inject(DestroyRef);

  @ViewChild('pageTop') pageTop!: IonContent;
  @ViewChild('damagetypeSelect', { static: false }) damagetypeRef!: IonSelect;

  // =========================================================
  // Form
  // =========================================================
  assignForm!: FormGroup;
  params: any;
  valueparams: any;

  // =========================================================
  // Arrays
  // =========================================================
  maintenancetypeArr: any[] = [];
  damageArr: any[] = [];
  activityArr: any[] = [];
  assignedtoArr: any[] = [];

  // =========================================================
  // Display Values
  // =========================================================
  task: string = '';
  taskid: number = 0;
  module: string = '';
  partname: string = '';

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

  multipartsArr: any[] = [];

  // =========================================================
  // Flags
  // =========================================================
  goodFlag: boolean = false;
  abnormalFlag: boolean = false;
  reasonflag: boolean = false;
  notdoneflag: boolean = false;
  pleasewaitflag: boolean = false;
  confirmDisable: boolean = false;

  // =========================================================
  // Placeholders
  // =========================================================
  remarksplaceholder: string = 'Please Enter the Remarks(Optional)';
  reason: string = 'Please Enter the Reason';

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
    const viewvalueform = navParams.get('value');

    this.params = JSON.parse(viewform);
    this.valueparams = JSON.parse(viewvalueform);

    this.task = this.params.task_name;
    this.taskid = this.params.task_id;
    this.partname = this.valueparams.partname;

    this.module = navParams.get('module');

    console.log('Task ID:', this.taskid);

    // Set display values
    this.getnotificationid = this.params.id;
    this.getstationid = this.params.stationid;
    this.getstationname = this.params.stationname;
    this.getmachineid = this.params.equipmentid;
    this.getmachinename = this.params.machine;
    this.getactivityname = this.params.replacement_activityname;
    this.getstatusid = this.params.statusId;
    this.partdefectname = this.params.partdefect;
    this.partdefectid = this.params.partdefectid;

    // Initialize form
    this.assignForm = this.fb.group({
      select_maintenancetype: new FormControl(''),
      select_damagetype: new FormControl(''),
      ta_remarks: new FormControl(''),
      ta_reason: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  // =========================================================
  // API Methods
  // =========================================================

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

            const eachArr = [];
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
        error: (error) => {
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

            const eachArr = [];
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
        error: (error) => {
          console.error('getDamage error:', error);
          this.damageArr = [];
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

  onConditionOptionChange(value: string): void {
    this.conditionoptionSelected = value;

    if (this.conditionoptionSelected == 'Abnormal') {
      this.goodFlag = false;
      this.abnormalFlag = true;
      this.notdoneflag = false;
      this.getMaintenancetype();
    } else if (this.conditionoptionSelected == 'Not Done') {
      this.notdoneflag = true;
      this.abnormalFlag = false;
      this.goodFlag = false;
    } else {
      this.notdoneflag = false;
      this.abnormalFlag = false;
      this.goodFlag = true;
    }
  }

  // =========================================================
  // Save Methods
  // =========================================================

  async savealert(): Promise<void> {
    if (this.conditionoptionSelected == '') {
      this.toastService.warning('Status Selection is Mandatory');
      return;
    }

    this.btn_save();
  }

  btn_save(): void {
    console.log('Status:', this.conditionoptionSelected);

    if (this.conditionoptionSelected == 'Good') {
      this.modalController.dismiss({
        dismissed: true,
        status: this.conditionoptionSelected,
        maintenancetypeid: '',
        damagetypeid: '',
        maintenancetype: '',
        damagetype: '',
        remarks: this.assignForm.value.ta_remarks,
        reason: this.assignForm.value.ta_reason,
        taskcompletedflag: 1,
        item: 'Saved',
      });
    } else if (this.conditionoptionSelected == 'Not Done') {
      if (this.assignForm.value.ta_reason == '') {
        this.toastService.warning('Please enter the reason');
        return;
      }
      this.modalController.dismiss({
        dismissed: true,
        status: this.conditionoptionSelected,
        maintenancetypeid: '',
        damagetypeid: '',
        maintenancetype: '',
        damagetype: '',
        remarks: this.assignForm.value.ta_remarks,
        reason: this.assignForm.value.ta_reason,
        taskcompletedflag: 1,
        item: 'Saved',
      });
    } else {
      if (this.maintenancetypeid == '') {
        this.toastService.warning(
          this.translate.instant(
            'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.maintenancetypemandatory',
          ),
        );
        return;
      }

      if (this.damagetypeidArr.length <= 0) {
        this.toastService.warning(
          this.translate.instant(
            'MAINTENANCEACKNOWLEDGEMODAL.damagetypeselection',
          ),
        );
        return;
      }

      this.modalController.dismiss({
        dismissed: true,
        status: this.conditionoptionSelected,
        maintenancetypeid: String(this.maintenancetypeid),
        damagetypeid: this.damagetypeidArr.join(','),
        maintenancetype: String(this.maintenancetypevalue),
        damagetype: this.damagetypevalueArr.join(','),
        remarks: this.assignForm.value.ta_remarks,
        reason: this.assignForm.value.ta_reason,
        taskcompletedflag: 1,
        item: 'Saved',
      });
    }
  }

  resetdata(): void {
    this.maintenancetypeid = '';
    this.maintenancetypevalue = '';

    this.damagetypeid = '';
    this.damagetypevalue = '';
    this.damagetypeidArr = [];
    this.damagetypevalueArr = [];

    this.assignForm.controls['select_maintenancetype'].setValue('');
    this.assignForm.controls['select_damagetype'].setValue('');
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

  scrollbottom(): void {
    setTimeout(() => {
      const element = document.getElementById('ta_remarks');
      if (element) {
        this.pageTop.scrollToPoint(0, element.offsetTop, 10);
      }
    }, 300);
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
      status: this.conditionoptionSelected,
      maintenancetypeid: '',
      damagetypeid: '',
      maintenancetype: '',
      damagetype: '',
      remarks: this.assignForm.value.ta_remarks,
      reason: this.assignForm.value.ta_reason,
      taskcompletedflag: 1,
      item: 'Closed',
    });
  }
}
