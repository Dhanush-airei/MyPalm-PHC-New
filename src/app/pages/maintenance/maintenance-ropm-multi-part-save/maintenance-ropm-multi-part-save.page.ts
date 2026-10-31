import {
  Component,
  OnInit,
  ViewChild,
  DestroyRef,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  selector: 'app-maintenance-ropm-multi-part-save',
  templateUrl: './maintenance-ropm-multi-part-save.page.html',
  styleUrls: ['./maintenance-ropm-multi-part-save.page.scss'],
  standalone: false,
})
export class MaintenanceRopmMultiPartSavePage implements OnInit {
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
    public UserContext: UserContext,
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
    let viewform = navParams.get('item');
    this.params = JSON.parse(viewform);
    this.module = navParams.get('module');

    console.log('Module:', this.module);
    console.log('Params:', this.params);

    // Set display values
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

    // Initialize form
    this.assignForm = this.fb.group({
      select_parts: new FormControl(''),
      select_assignedto: new FormControl(''),
      select_maintenancetype: new FormControl(''),
      select_damagetype: new FormControl(''),
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.getAssignedTo();
  }

  // =========================================================
  // API Methods
  // =========================================================

  getAssignedTo() {
    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      desig_id: this.UserContext.designId,
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

            let eachArr = [];
            for (let i = 0; i < this.assignedtoArr.length; i++) {
              let eachitem = this.assignedtoArr[i];
              let eachreq = {
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
        error: (error) => {
          console.error('getAssignedTo error:', error);
          this.assignedtoArr = [];
          this.getParts();
        },
      });
  }

  getParts() {
    const req = {
      userid: this.UserContext.userId,
      departmentid: this.UserContext.departmentId,
      designationid: this.UserContext.designId,
      millcode: this.UserContext.millCode,
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
        error: (error) => {
          console.error('getParts error:', error);
          this.multipartsArr = [];
        },
      });
  }

  getMaintenancetype() {
    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
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

            let eachArr = [];
            for (let i = 0; i < this.maintenancetypeArr.length; i++) {
              let eachitem = this.maintenancetypeArr[i];
              let eachreq = {
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

  getDamage() {
    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
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

            let eachArr = [];
            for (let i = 0; i < this.damageArr.length; i++) {
              let eachitem = this.damageArr[i];
              let eachreq = {
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

  openParts() {
    this.partsRef.open();
  }

  partshandleChange(event: any) {
    let value = event.detail.value;

    if (value && value.length > 0) {
      this.partidArr = [];
      this.partvalueArr = [];
      for (let i = 0; i < value.length; i++) {
        let parsed = JSON.parse(value[i]);
        this.partidArr.push(parsed.partid);
        this.partvalueArr.push(parsed.partname);
      }

      this.partid = this.partidArr.join(',');
      this.partvalue = this.nl2br(this.partvalueArr.join(', '));
    } else {
      this.partidArr = [];
      this.partvalueArr = [];
      this.partid = '';
      this.partvalue = '';
    }
  }

  maintenancetypehandleChange(event: any) {
    let value = event.detail.value;

    if (value && value.length > 0) {
      let parsed = JSON.parse(value);
      this.maintenancetypeid = parsed.id;
      this.maintenancetypevalue = parsed.maintanence_type;
    } else {
      this.maintenancetypeid = '';
      this.maintenancetypevalue = '';
    }
  }

  openDamageType() {
    this.damagetypeRef.open();
  }

  damagehandleChange(event: any) {
    let value = event.detail.value;

    if (value && value.length > 0) {
      this.damagetypeidArr = [];
      this.damagetypevalueArr = [];
      for (let i = 0; i < value.length; i++) {
        let parsed = JSON.parse(value[i]);
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

  openAssignedTo() {
    this.assignedtoRef.open();
  }

  assignedtohandleChange(event: any) {
    let value = event.detail.value;

    if (value && value.length > 0) {
      this.assignedtoidArr = [];
      this.assignedtovalueArr = [];
      for (let i = 0; i < value.length; i++) {
        let parsed = JSON.parse(value[i]);
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

  onConditionOptionChange(value: string) {
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

  async savealert() {
    // Validate Parts
    if (this.partidArr.length <= 0) {
      this.toastService.warning(
        this.translate.instant('PREVENTIVEMAINTENANCEASSIGN.partnamemandatory'),
      );
      return;
    }

    // Validate Abnormal + Multiple Parts
    if (this.conditionoptionSelected == 'Abnormal') {
      if (this.partidArr.length > 1) {
        this.toastService.warning(
          this.translate.instant(
            'PREVENTIVEMAINTENANCEASSIGN.onepartmaximumabnormal',
          ),
        );
        return;
      }
    }

    // Validate Assigned To
    if (this.assignedtoidArr.length <= 0) {
      this.toastService.warning(
        this.translate.instant('PREVENTIVEMAINTENANCEASSIGN.assigntomandatory'),
      );
      return;
    }

    // Validate Condition
    if (this.conditionoptionSelected == '') {
      this.toastService.warning(
        this.translate.instant('MAINTENANCEACCEPTMODAL.conditionmandatory'),
      );
      return;
    }

    // Check if all parts are selected
    if (this.multipartsArr.length == this.partidArr.length) {
      this.btn_save();
    } else {
      let pendingparts = this.multipartsArr.length - this.partidArr.length;
      let parttext = pendingparts == 1 ? ' Part' : ' Parts';

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

  btn_save() {
    let completedFlag;

    if (this.multipartsArr.length == this.partidArr.length) {
      completedFlag = 1;
    } else {
      completedFlag = 0;
    }

    if (this.conditionoptionSelected == 'Good') {
      this.save(completedFlag);
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

      this.save(completedFlag);
    }
  }

  save(getcompletedflag: number) {
    let partsstatus = [];

    if (this.conditionoptionSelected == 'Good') {
      for (let i = 0; i < this.partidArr.length; i++) {
        let eachreq = {
          partid: this.partidArr[i],
          condition: this.conditionoptionSelected,
          maintenancetypeid: '',
          damagetypeid: '',
        };
        partsstatus.push(eachreq);
      }
    } else {
      for (let i = 0; i < this.partidArr.length; i++) {
        let eachreq = {
          partid: this.partidArr[i],
          condition: this.conditionoptionSelected,
          maintenancetypeid: String(this.maintenancetypeid),
          damagetypeid: this.damagetypeidArr.join(','),
        };
        partsstatus.push(eachreq);
      }
    }

    this.pageTop.scrollToTop();
    this.confirmDisable = true;
    this.pleasewaitflag = true;

    const req = {
      userid: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      id: this.getnotificationid,
      stationid: this.getstationid,
      equipment: this.getmachineid,
      partsarray: JSON.stringify(partsstatus),
      assignedto: this.assignedtoidArr.join(','),
      pvflag: 0,
      completedflag: getcompletedflag,
      language: this.languageService.getLanguage,
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
            let successMessage = '';
            if (this.module == 'RoPM') {
              successMessage = this.translate.instant(
                'PREVENTIVEMAINTENANCEASSIGN.routineacceptsuccess',
              );
            }
            if (this.module == 'RePM') {
              successMessage = this.translate.instant(
                'PREVENTIVEMAINTENANCEASSIGN.replacementacceptsuccess',
              );
            }

            this.toastService.success(successMessage);

            this.modalController.dismiss({
              dismissed: true,
              item: 'Submitted',
            });
          } else {
            let errorMessage = '';
            if (this.module == 'RoPM') {
              errorMessage = this.translate.instant(
                'PREVENTIVEMAINTENANCEASSIGN.routineacceptfailed',
              );
            }
            if (this.module == 'RePM') {
              errorMessage = this.translate.instant(
                'PREVENTIVEMAINTENANCEASSIGN.replacementacceptfailed',
              );
            }

            this.toastService.error(errorMessage);
          }
        },
        error: (error) => {
          console.error('save error:', error);
          this.confirmDisable = false;
          this.pleasewaitflag = false;
          this.toastService.error('Something went wrong!');
        },
      });
  }

  resetdata() {
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
  // Utility Methods
  // =========================================================

  numberFilter(event: any) {
    const reg = /^[1-9][0-9]{0,5}$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

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

  btn_close() {
    this.modalController.dismiss({
      dismissed: true,
      item: '',
    });
  }
}
