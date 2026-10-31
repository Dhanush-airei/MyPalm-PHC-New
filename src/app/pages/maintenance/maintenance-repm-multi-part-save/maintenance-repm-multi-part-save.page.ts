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
  selector: 'app-maintenance-repm-multi-part-save',
  templateUrl: './maintenance-repm-multi-part-save.page.html',
  styleUrls: ['./maintenance-repm-multi-part-save.page.scss'],
  standalone: false,
})
export class MaintenanceRepmMultiPartSavePage implements OnInit, AfterViewInit {
  private destroyRef = inject(DestroyRef);

  @ViewChild('pageTop') pageTop!: IonContent;
  @ViewChild('partsSelect', { static: false }) partsRef!: IonSelect;
  @ViewChild('assignedtoSelect', { static: false }) assignedtoRef!: IonSelect;

  // =========================================================
  // Form
  // =========================================================
  assignForm!: FormGroup;
  params: any;

  // =========================================================
  // Arrays
  // =========================================================
  assignedtoArr: any[] = [];
  multipartsArr: any[] = [];

  // =========================================================
  // Display Values
  // =========================================================
  title: string = '';
  module: string = '';
  extendrunninghoursFlag: string = '';

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
  conditionactivitySelected: string = '';

  // Parts
  partid: string = '';
  partvalue: string = '';
  partidArr: string[] = [];
  partvalueArr: string[] = [];

  // Assigned To
  assignedtoid: string = '';
  assignedtovalue: string = '';
  assignedtoidArr: string[] = [];
  assignedtovalueArr: string[] = [];

  // =========================================================
  // Flags
  // =========================================================
  servicedFlag: boolean = false;
  replacedFlag: boolean = false;
  enableFlag: boolean = false;
  confirmDisable: boolean = false;
  pleasewaitflag: boolean = false;

  // =========================================================
  // Select Options
  // =========================================================
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
    this.partdefectname = this.params.partdefect;
    this.partdefectid = this.params.partdefectid;

    // Initialize form
    this.assignForm = this.fb.group({
      select_parts: new FormControl(''),
      select_assignedto: new FormControl(''),
      txt_extendlifetimehours: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
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

  getDetails(): void {
    const req = {
      user_id: this.userContext.userId,
      millcode: this.userContext.millCode,
      dept_id: this.userContext.departmentId,
      desig_id: this.userContext.designId,
      stationid: this.getstationid,
      equipment: this.getmachineid,
      part_id: this.partid,
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

      // If already Serviced, re-validate part count
      if (this.conditionactivitySelected == 'Serviced') {
        if (this.partidArr.length <= 1) {
          this.servicedFlag = true;
          this.replacedFlag = false;
          this.assignForm.controls['txt_extendlifetimehours'].setValue('');
          this.enableFlag = true;
          this.getDetails();
        } else {
          this.servicedFlag = true;
          this.replacedFlag = false;
          this.assignForm.controls['txt_extendlifetimehours'].setValue('');
          this.enableFlag = false;
          this.toastService.warning(
            this.translate.instant(
              'PREVENTIVEMAINTENANCEASSIGN.onepartmaximumserviced',
            ),
          );
        }
      }
    } else {
      this.partidArr = [];
      this.partvalueArr = [];
      this.partid = '';
      this.partvalue = '';
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

  onConditionActivityChange(value: string): void {
    this.conditionactivitySelected = value;

    const getpartdefectidArr = this.partdefectid.split(',');

    // Multiple part defects in notification
    if (getpartdefectidArr.length > 1) {
      if (this.conditionactivitySelected == 'Replaced') {
        if (this.partidArr.length <= 0) {
          this.toastService.warning(
            this.translate.instant(
              'PREVENTIVEMAINTENANCEASSIGN.partnamemandatory',
            ),
          );
          return;
        }

        this.servicedFlag = false;
        this.replacedFlag = true;
        this.assignForm.controls['txt_extendlifetimehours'].setValue('');
        this.enableFlag = false;
      } else {
        // Serviced
        if (this.extendrunninghoursFlag == '1') {
          if (this.partidArr.length > 1) {
            this.assignForm.controls['txt_extendlifetimehours'].setValue('');
            this.enableFlag = false;
            this.toastService.warning(
              this.translate.instant(
                'PREVENTIVEMAINTENANCEASSIGN.onepartmaximumserviced',
              ),
            );
          } else if (this.partidArr.length > 0) {
            this.servicedFlag = true;
            this.replacedFlag = false;
            this.assignForm.controls['txt_extendlifetimehours'].setValue('');
            this.enableFlag = true;
            this.getDetails();
          } else {
            this.toastService.warning(
              this.translate.instant(
                'PREVENTIVEMAINTENANCEASSIGN.partnamemandatory',
              ),
            );
            return;
          }
        } else {
          if (this.partidArr.length <= 0) {
            this.toastService.warning(
              this.translate.instant(
                'PREVENTIVEMAINTENANCEASSIGN.partnamemandatory',
              ),
            );
            return;
          }
          this.servicedFlag = true;
          this.replacedFlag = false;
          this.enableFlag = true;
          this.getDetails();
        }
      }
    } else {
      // Single part defect
      if (this.conditionactivitySelected == 'Replaced') {
        this.servicedFlag = false;
        this.replacedFlag = true;
        this.assignForm.controls['txt_extendlifetimehours'].setValue('');
        this.enableFlag = false;
      } else {
        this.servicedFlag = true;
        this.replacedFlag = false;
        this.assignForm.controls['txt_extendlifetimehours'].setValue('');
        this.enableFlag = true;
        this.getDetails();
      }
    }
  }

  // =========================================================
  // Save Methods
  // =========================================================

  async savealert(): Promise<void> {
    // Validate Parts
    if (this.partidArr.length <= 0) {
      this.toastService.warning(
        this.translate.instant('PREVENTIVEMAINTENANCEASSIGN.partnamemandatory'),
      );
      return;
    }

    // Serviced + multiple parts + extendrunninghours check
    if (
      this.conditionactivitySelected == 'Serviced' &&
      this.extendrunninghoursFlag == '1'
    ) {
      if (this.partidArr.length > 1) {
        this.toastService.warning(
          this.translate.instant(
            'PREVENTIVEMAINTENANCEASSIGN.onepartmaximumserviced',
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

    // Validate Activity
    if (this.conditionactivitySelected == '') {
      this.toastService.warning(
        this.translate.instant('PREVENTIVEMAINTENANCEASSIGN.activitymandatory'),
      );
      return;
    }

    // Validate Extend Hours for Serviced
    if (
      this.conditionactivitySelected == 'Serviced' &&
      this.extendrunninghoursFlag == '1' &&
      (this.assignForm.value.txt_extendlifetimehours == 0 ||
        this.assignForm.value.txt_extendlifetimehours == '')
    ) {
      this.toastService.warning(
        this.translate.instant(
          'PREVENTIVEMAINTENANCEASSIGN.extendhoursmandatory',
        ),
      );
      return;
    }

    // Check if all parts are selected
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
    let completedFlag: number;

    if (this.multipartsArr.length == this.partidArr.length) {
      completedFlag = 1;
    } else {
      completedFlag = 0;
    }

    if (this.conditionactivitySelected == 'Replaced') {
      this.save(completedFlag);
    } else {
      if (
        (this.assignForm.value.txt_extendlifetimehours == 0 ||
          this.assignForm.value.txt_extendlifetimehours == '') &&
        this.extendrunninghoursFlag == '1'
      ) {
        this.toastService.warning(
          this.translate.instant(
            'PREVENTIVEMAINTENANCEASSIGN.extendhoursmandatory',
          ),
        );
        return;
      }

      this.save(completedFlag);
    }
  }

  save(getcompletedflag: number): void {
    const partsstatus: any[] = [];

    if (this.conditionactivitySelected == 'Replaced') {
      for (let i = 0; i < this.partidArr.length; i++) {
        const eachreq = {
          partid: this.partidArr[i],
          replacestatus: this.conditionactivitySelected,
          lifetimerunninghours: '',
          currentrunninghours: '',
          extendedmaxrunninghours: '',
        };
        partsstatus.push(eachreq);
      }
    } else {
      for (let i = 0; i < this.partidArr.length; i++) {
        if (this.extendrunninghoursFlag == '1') {
          const eachreq = {
            partid: this.partidArr[i],
            replacestatus: this.conditionactivitySelected,
            lifetimerunninghours: this.lifetimerunninghours,
            currentrunninghours: this.currentrunninghours,
            extendedmaxrunninghours: String(
              this.assignForm.value.txt_extendlifetimehours,
            ),
          };
          partsstatus.push(eachreq);
        } else {
          const eachreq = {
            partid: this.partidArr[i],
            replacestatus: this.conditionactivitySelected,
            lifetimerunninghours: '',
            currentrunninghours: '',
            extendedmaxrunninghours: '',
          };
          partsstatus.push(eachreq);
        }
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
      pvflag: 1,
      completedflag: getcompletedflag,
      extendrunninghoursflag: this.extendrunninghoursFlag,
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
            if (this.module == 'RoPM') {
              this.toastService.success(
                this.translate.instant(
                  'PREVENTIVEMAINTENANCEASSIGN.routineacceptsuccess',
                ),
              );
            }

            if (this.module == 'RePM') {
              this.toastService.success(
                this.translate.instant(
                  'PREVENTIVEMAINTENANCEASSIGN.replacementacceptsuccess',
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

            if (this.module == 'RePM') {
              this.toastService.error(
                this.translate.instant(
                  'PREVENTIVEMAINTENANCEASSIGN.replacementacceptfailed',
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
    this.assignedtoid = '';
    this.assignedtovalue = '';
    this.assignedtoidArr = [];
    this.assignedtovalueArr = [];

    this.lifetimerunninghours = '';
    this.currentrunninghours = '';

    this.assignForm.controls['txt_extendlifetimehours'].setValue('');
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
