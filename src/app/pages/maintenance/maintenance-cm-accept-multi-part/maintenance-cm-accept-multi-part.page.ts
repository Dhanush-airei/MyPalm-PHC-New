import {
  Component,
  OnInit,
  DestroyRef,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  Platform,
  ModalController,
  NavParams,
  AlertController,
  IonSelect,
  IonContent,
} from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { MaintenanceActivitySearchPage } from '../maintenance-activity-search/maintenance-activity-search.page';

@Component({
  selector: 'app-maintenance-cm-accept-multi-part',
  templateUrl: './maintenance-cm-accept-multi-part.page.html',
  styleUrls: ['./maintenance-cm-accept-multi-part.page.scss'],
  standalone: false,
})
export class MaintenanceCmAcceptMultiPartPage implements OnInit {
  @ViewChild('partsSelect', { static: false }) partsRef!: IonSelect;
  @ViewChild('damagetypeSelect', { static: false }) damagetypeRef!: IonSelect;
  @ViewChild('assignedtoSelect', { static: false }) assignedtoRef!: IonSelect;

  private destroyRef = inject(DestroyRef);

  assignForm: any;

  params: any;

  maintenancetypeArr: any = [];
  damageArr: any = [];
  activityArr: any = [];
  assignedtoArr: any = [];

  // Variables
  title = '';
  module = '';

  getnotificationid = '';

  getstationid = '';
  getstationname = '';

  getmachineid = '';
  getmachinename = '';

  getbreakdownid = '';
  getbreakdownvalue = '';

  getmaintenancetypeid = '';
  getmaintenancetypevalue = '';

  partdefectname = '';
  partdefectid = '';

  getbreakdowncausesid = '';
  getbreakdowncausesvalue = '';

  getbreakdownremarksvalue = '';

  getstatusid = '';

  partid = '';
  partvalue = '';
  //partidArr = [];
  partvalueArr: any = [];

  activityid = '';
  activityvalue = '';
  machineresetvalue = '';
  machineresetflag = 0;
  activityvalidationflag = false;

  activityidArr: any = [];
  activityvalueArr: any = [];
  machineresetflagArr: any = [];

  damagetypeid = '';
  damagetypevalue = '';
  damagetypeidArr: any = [];
  damagetypevalueArr: any = [];

  assignedtoid = '';
  assignedtovalue = '';
  assignedtoidArr: any = [];
  assignedtovalueArr: any = [];

  multipartsArr: any = [];
  addnewrowArr: any = [];

  pleasewaitflag = false;
  otheractivityFlag = false;

  addDisable = false;
  saveDisable = false;

  // Ionic Select Header
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
    cssClass: 'singleselect',
  };

  public assignedtoOptions: any = {
    header: this.translate.instant(
      'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.assignto',
    ),
    cssClass: 'multiselect',
  };

  showAlert = false;
  alertmessage = '';
  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    public navParams: NavParams,
    private ModalController: ModalController,
    public UserContext: UserContext,
    private MaintenanceService: MaintenanceService,
    private LanguageService: LanguageService,
    private toastService: ToastService,
  ) {
    let viewform = navParams.get('item');
    this.params = JSON.parse(viewform);

    this.title = this.params.stationname;
    this.module = navParams.get('module');

    this.getnotificationid = this.params.id;

    this.getstationid = this.params.stationid;
    this.getstationname = this.params.stationname;

    this.getmachineid = this.params.equipmentid;
    this.getmachinename = this.params.machine;

    this.getbreakdownid = this.params.breakdowncodingid;
    this.getbreakdownvalue = this.params.breakdowncoding;

    this.getmaintenancetypeid = this.params.maintenancetypeid;
    this.getmaintenancetypevalue = this.params.maintenancetype;

    this.partdefectname = this.params.partdefect;
    this.partdefectid = this.params.partdefectid;

    this.getbreakdowncausesid = this.params.breakdowncausesid;
    this.getbreakdowncausesvalue = this.params.breakdowncauses;

    this.getbreakdownremarksvalue = this.params.breakdownremarks;

    this.getstatusid = this.params.statusId;

    this.assignForm = this.fb.group({
      select_parts: new FormControl(''),
      select_assignedto: new FormControl(''),
      txt_activityname: new FormControl('', Validators.required),
      select_damagetype: new FormControl(''),
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.getParts();
  }
  getParts() {
    let req = {
      userid: this.UserContext.userId,
      departmentid: this.UserContext.departmentId,
      designationid: this.UserContext.designId,
      millcode: this.UserContext.millCode,
      id: this.getnotificationid,
      partdefectid: this.partdefectid,
      language: this.LanguageService.getLanguage,
    };

    this.MaintenanceService.getMultiPartDefectList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response.httpcode == 200) {
            this.multipartsArr = response.data;

            this.getAssignedTo();
          } else {
            this.multipartsArr = [];

            this.getAssignedTo();
          }
        },

        error: (error: any) => {
          console.error('error:', error);
        },
      });
  }

  getAssignedTo() {
    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      desig_id: this.UserContext.designId,
      language: this.LanguageService.getLanguage,
    };

    //console.log(req);

    this.MaintenanceService.getAssignedToList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response.httpcode == 200) {
            this.assignedtoArr = response.data;

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

            this.getDamage();
          } else {
            this.assignedtoArr = [];

            this.getDamage();
          }
        },

        error: (error: any) => {
          console.error('error:', error);
        },
      });
  }

  getDamage() {
    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
    };

    this.MaintenanceService.getDamageList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response.httpcode == 200) {
            this.damageArr = response.data;

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

        error: (error: any) => {
          console.error('error:', error);
        },
      });
  }

  openParts() {
    this.partsRef.open();
  }

  partshandleChange(e: any) {
    let value = e.detail.value;

    if (value.length > 0) {
      this.partvalueArr = [];

      /*this.partidArr = [];
      this.partvalueArr = [];

      for (let i = 0; i < value.length; i++) {
        this.partidArr.push(JSON.parse(value[i]).partid);
        this.partvalueArr.push(JSON.parse(value[i]).partname);
      }

      this.partid = this.partidArr.join(",");
      this.partvalue = this.nl2br(this.partvalueArr.join(", "));*/

      this.partid = JSON.parse(value).partid;
      this.partvalue = JSON.parse(value).partname;
      this.partvalueArr.push(JSON.parse(value).partname);
    } else {
      //this.partidArr = [];
      //this.partvalueArr = [];

      this.partid = '';
      this.partvalue = '';
      this.partvalueArr = [];
    }
  }

  openDamageType() {
    this.damagetypeRef.open();
  }

  damagehandleChange(e: any) {
    let value = e.detail.value;
    if (value.length > 0) {
      this.damagetypeidArr = [];
      this.damagetypevalueArr = [];
      for (let i = 0; i < value.length; i++) {
        this.damagetypeidArr.push(JSON.parse(value[i]).id);
        this.damagetypevalueArr.push(JSON.parse(value[i]).damage);
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

  async callmodalcontroller(type: any) {
    if (type == 'Activity') {
      const activitymodal = await this.ModalController.create({
        component: MaintenanceActivitySearchPage,
        componentProps: {
          type: '0',
          station_id: this.getstationid,
          equipment_id: this.getmachineid,
        },
      });

      activitymodal.onDidDismiss().then((modeldata) => {
        let viewform = modeldata.data.data;

        if (viewform != '') {
          this.params = JSON.parse(viewform);
          if (this.params.machine_reset_flag == 1) {
            if (this.machineresetflagArr.length == 0) {
              this.activityvalidationflag = false;
            } else {
              if (this.machineresetflagArr.length > 0) {
                if (this.machineresetflagArr.includes(1)) {
                  this.activityvalidationflag = true;
                } else if (this.machineresetflagArr.includes(0)) {
                  this.activityvalidationflag = true;
                } else if (this.machineresetflagArr.includes(2)) {
                  this.activityvalidationflag = true;
                }
              }
            }
          } else {
            if (this.machineresetflagArr.length == 0) {
              this.activityvalidationflag = false;
            } else {
              if (this.machineresetflagArr.length > 0) {
                //console.log(this.machineresetflagArr.includes(1));

                if (this.machineresetflagArr.includes(1)) {
                  this.activityvalidationflag = true;
                } else {
                  this.activityvalidationflag = false;
                }
              }
            }
          }
          if (this.activityvalidationflag) {
            this.toastService.error(
              this.params.activity_name +
                this.translate.instant(
                  'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.activitynotallowed',
                ),
            );
            return;
          }

          this.activityid = this.params.activity_id;
          this.activityvalue = this.params.activity_name;
          this.machineresetflag = this.params.machine_reset_flag;

          if (this.activityid == '0') {
            if (modeldata.data.searchtext != '') {
              this.assignForm.controls.txt_activityname.setValue(
                modeldata.data.searchtext,
              );
            }

            this.otheractivityFlag = true;
          } else {
            let activity_validate = false;
            this.otheractivityFlag = false;

            this.assignForm.controls.txt_activityname.setValue('');

            if (this.activityidArr.length > 0) {
              for (let i = 0; i < this.activityidArr.length; i++) {
                if (this.activityidArr[i] == this.activityid) {
                  activity_validate = true;
                }
              }
            }

            if (!activity_validate) {
              if (this.activityid != '') {
                this.activityidArr.push(this.activityid);
              }

              if (this.activityvalue != '') {
                this.activityvalueArr.push(this.activityvalue);
              }

              this.machineresetflagArr.push(this.machineresetflag);
            } else {
              this.toastService.warning(
                this.activityvalue +
                  this.translate.instant(
                    'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.alreadyexist',
                  ),
              );
            }
          }

          this.activityid = this.activityidArr.join(',');
          this.activityvalue = this.nl2br(this.activityvalueArr.join(', '));
          this.machineresetvalue = this.machineresetflagArr.join(',');
        }
      });

      return await activitymodal.present();
    }
  }

  clear(type: any, index: number) {
    if (type == 'Activity') {
      this.activityidArr.splice(index, 1);
      this.activityvalueArr.splice(index, 1);
      this.machineresetflagArr.splice(index, 1);

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

  btn_add(type: any) {
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
      this.activityid = this.activityidArr.join(',');

      this.activityvalueArr.push(this.assignForm.value.txt_activityname);

      this.activityvalue = this.nl2br(this.activityvalueArr.join(', '));

      this.machineresetflag = 0;

      this.machineresetflagArr.push(this.machineresetflag);
      this.machineresetvalue = this.machineresetflagArr.join(',');

      this.otheractivityFlag = false;

      this.assignForm.controls.txt_activityname.setValue('');
    }
  }

  addNewRow() {
    let partexistflag = false;

    if (this.partid == '') {
      this.toastService.warning(
        this.translate.instant(
          'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.partdefectmandatory',
        ),
      );
      return;
    }

    if (this.addnewrowArr.length > 0) {
      for (let i = 0; i < this.addnewrowArr.length; i++) {
        //console.log(this.addnewrowArr[i].addpartid);
        if (this.partid == this.addnewrowArr[i].partid) {
          partexistflag = true;
        }
      }
    }

    if (partexistflag) {
      this.toastService.warning(
        this.partvalue +
          this.translate.instant('MAINTENANCEACKNOWLEDGEMODAL.alreadyexist'),
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

    if (this.activityidArr.length <= 0) {
      this.toastService.warning(
        this.translate.instant(
          'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.activitymandatory',
        ),
      );
      return;
    }

    this.addDisable = true;

    let eachreq = {
      partid: this.partid,
      part: this.partvalue,
      damagetypeid: this.damagetypeid,
      damagetype: this.damagetypevalue,
      activityid: this.activityid,
      activity: this.activityvalue,
      machineresetflag: this.machineresetvalue,
    };

    this.addnewrowArr.push(eachreq);

    console.log(this.addnewrowArr);

    if (this.addnewrowArr.length > 0) {
      this.reset_data();
    }
  }

  deleteRow(index: number) {
    this.addnewrowArr.splice(index, 1);
  }

  openAssignedTo() {
    this.assignedtoRef.open();
  }

  assignedtohandleChange(e: any) {
    let value = e.detail.value;
    if (value.length > 0) {
      this.assignedtoidArr = [];
      this.assignedtovalueArr = [];
      for (let i = 0; i < value.length; i++) {
        this.assignedtoidArr.push(JSON.parse(value[i]).userId);
        this.assignedtovalueArr.push(JSON.parse(value[i]).name);
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

  async savealert() {
    if (this.assignedtoidArr.length <= 0) {
      this.toastService.warning(
        this.translate.instant(
          'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.assigntomandatory',
        ),
      );
      return;
    }

    this.alertmessage = '';

    if (this.multipartsArr.length == this.addnewrowArr.length) {
      this.btn_save();
    } else {
      let pendingparts = this.multipartsArr.length - this.addnewrowArr.length;
      let parttext = '';

      if (pendingparts == 1) {
        parttext = ' Part';
      } else {
        parttext = ' Parts';
      }

      if (this.LanguageService.getLanguage == 'English') {
        this.alertmessage =
          pendingparts +
          parttext +
          this.translate.instant(
            'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.multiplepartalertmessage',
          );
      } else {
        this.alertmessage =
          pendingparts +
          ' bahagian' +
          this.translate.instant(
            'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.multiplepartalertmessage',
          );
      }

      // Alert message to confirm save
      this.showAlert = true;
    }
  }

  btn_save() {
    var completedFlag;

    if (this.multipartsArr.length == this.addnewrowArr.length) {
      completedFlag = 1;
    } else {
      completedFlag = 0;
    }

    this.saveDisable = true;
    this.pleasewaitflag = true;

    var req = {
      userid: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      id: this.getnotificationid,
      stationid: this.getstationid,
      equipment: this.getmachineid,
      partsarray: JSON.stringify(this.addnewrowArr),
      assignedto: this.assignedtoidArr.join(','),
      pvflag: 2,
      completedflag: completedFlag,
      language: this.LanguageService.getLanguage,
    };

    console.log(req);

    this.MaintenanceService.saveMultiplePartMaintenanceNotification(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response.httpcode == 200) {
            this.saveDisable = false;

            this.pleasewaitflag = false;

            this.toastService.success(
              this.translate.instant(
                'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.acceptsuccess',
              ),
            );

            this.ModalController.dismiss({
              dismissed: true,
              item: 'Submitted',
            });
          } else {
            this.saveDisable = false;

            this.pleasewaitflag = false;

            this.toastService.error(
              this.translate.instant(
                'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.acceptfailed',
              ),
            );
          }
        },

        error: (error: any) => {
          console.error('error:', error);
        },
      });
  }

  nl2br(text: string) {
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }

  parseString(item: any) {
    return JSON.stringify(item);
  }

  reset_data() {
    // Parts
    //this.partidArr = [];
    this.partvalueArr = [];
    this.partid = '';
    this.partvalue = '';
    this.assignForm.controls.select_parts.setValue('');

    // Damage Type
    this.damagetypeidArr = [];
    this.damagetypevalueArr = [];
    this.damagetypeid = '';
    this.damagetypevalue = '';
    this.assignForm.controls.select_damagetype.setValue('');

    // Activity
    this.activityidArr = [];
    this.activityvalueArr = [];
    this.activityid = '';
    this.activityvalue = '';
    this.machineresetflag = 0;
    this.machineresetvalue = '';
    this.machineresetflagArr = [];

    this.addDisable = false;
  }
  onConfirm() {
    this.showAlert = false;
    // save/update logic ingaye
    this.btn_save();
  }
  btn_close() {
    this.ModalController.dismiss({
      dismissed: true,
      item: '',
    });
  }
}
