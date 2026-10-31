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
  selector: 'app-maintenance-cm-accept-single-part',
  templateUrl: './maintenance-cm-accept-single-part.page.html',
  styleUrls: ['./maintenance-cm-accept-single-part.page.scss'],
  standalone: false,
})
export class MaintenanceCmAcceptSinglePartPage implements OnInit {
  private destroyRef = inject(DestroyRef);
  @ViewChild('damagetypeSelect', { static: false }) damagetypeRef!: IonSelect;
  @ViewChild('assignedtoSelect', { static: false }) assignedtoRef!: IonSelect;
  step1Form: any;

  params: any;

  title = this.translate.instant(
    'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.correctivemaintenance',
  );
  module = '';

  damageArr: any = [];
  activityArr: any = [];
  assignedtoArr: any = [];

  // Flags
  stepFlag = true;
  step1completedFlag = false;
  step2completedFlag = false;

  viewFlag = false;

  damagetypeFlag = false;
  activityFlag = false;
  otheractivityFlag = false;
  assignedtoFlag = false;

  confirmDisable = false;

  // Variables

  getnotificationid = '';
  getstationid = '';
  getstationname = '';

  getmachineid = '';
  getmachinename = '';

  getbreakdownid = '';
  getbreakdownvalue = '';

  getmaintenancetypeid = '';
  getmaintenancetypevalue = '';

  getactivityid = '';
  getactivityvalue = '';

  notificationno = '';
  breakdownid = '';
  breakdownvalue = '';

  maintenancetypeid = '';
  maintenancetypevalue = '';

  getpartdefectid = '';
  getpartdefectvalue = '';

  getbreakdowncausesid = '';
  getbreakdowncausesvalue = '';

  getbreakdownremarksvalue = '';

  damagetypeid = '';
  damagetypevalue = '';
  damagetypeidArr: any = [];
  damagetypevalueArr: any = [];

  activityid = '';
  activityvalue = '';
  machineresetvalue = '';
  machineresetflag = 0;
  activityvalidationflag = false;

  activityidArr: any = [];
  activityvalueArr: any = [];
  machineresetflagArr: any = [];

  assignedtoid = '';
  assignedtovalue = '';
  assignedtoidArr: any = [];
  assignedtovalueArr: any = [];

  // View the details
  view_activity = '';
  view_assignto = '';
  view_damage_type = '';

  // Ionic Select Header
  public maintenancetypeOptions: any = {
    header: this.translate.instant(
      'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.maintenancetype',
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

    this.title = 'ID: ' + this.params.notificationno;
    this.module = navParams.get('module');

    this.getstationid = this.params.stationid;
    this.getmachineid = this.params.machineid;

    this.getstationname = this.params.stationname;
    this.getmachinename = this.params.machinename;

    this.getnotificationid = this.params.id;
    this.getstationid = this.params.stationid;
    this.getmachineid = this.params.machineid;

    this.getbreakdownid = this.params.breakdowncodingid;
    this.getbreakdownvalue = this.params.breakdowncoding;

    this.getmaintenancetypeid = this.params.maintenancetypeid;
    this.getmaintenancetypevalue = this.params.maintenancetype;

    this.getpartdefectid = this.params.partdefectid;
    this.getpartdefectvalue = this.params.partdefect;

    this.getbreakdowncausesid = this.params.breakdowncausesid;
    this.getbreakdowncausesvalue = this.params.breakdowncauses;

    this.getbreakdownremarksvalue = this.params.breakdownremarks;

    this.step1Form = this.fb.group({
      select_breakdown: new FormControl(''),
      select_maintenancetype: new FormControl(''),
      select_damagetype: new FormControl(''),
      txt_activityname: new FormControl(''),
      select_assignedto: new FormControl('', Validators.required),
    });

    this.getDamage();
  }

  ngOnInit() {}

  getStatusColor(type: any) {
    let color;

    if (type == 'STEP1') {
      if (!this.step1completedFlag) {
        color = '#ff0000';
      } else if (this.step1completedFlag) {
        color = '#008000';
      } else {
        color = '#ff0000';
      }
    } else if (type == 'STEP2') {
      if (!this.step2completedFlag) {
        color = '#ff0000';
      } else if (this.step2completedFlag) {
        color = '#008000';
      } else {
        color = '#ff0000';
      }
    } else {
      color = '#ff0000';
    }

    return color;
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

            this.damagetypeFlag = true;

            this.getAssignedTo();
          } else {
            this.damageArr = [];

            this.damagetypeFlag = true;

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

            this.activityFlag = true;

            this.assignedtoFlag = true;
          } else {
            this.assignedtoArr = [];

            this.activityFlag = true;

            this.assignedtoFlag = false;
          }
        },

        error: (error: any) => {
          console.error('error:', error);
        },
      });
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

      this.step2completedFlag = true;
      this.getStatusColor('STEP2');
    } else {
      this.assignedtoidArr = [];
      this.assignedtovalueArr = [];
      this.assignedtoid = '';
      this.assignedtovalue = '';

      this.step2completedFlag = false;
      this.getStatusColor('STEP2');
    }
  }

  btn_next(type: any) {
    if (type == 'STEP1') {
      if (this.damagetypeidArr.length <= 0) {
        this.toastService.warning(
          this.translate.instant(
            'MAINTENANCEACKNOWLEDGEMODAL.damagetypeselection',
          ),
        );
        return;
      }

      if (this.getactivityid == '' || this.getactivityid == '0') {
        if (this.activityidArr.length <= 0) {
          this.toastService.warning(
            this.translate.instant(
              'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.activitymandatory',
            ),
          );
          return;
        }
      } else {
        this.activityidArr.push(this.getactivityid);
      }

      if (this.assignedtoArr.length <= 0) {
        this.toastService.warning(
          this.translate.instant(
            'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.assignedtoselection',
          ),
        );
        return;
      }

      this.view();
    }
  }

  btn_back() {
    this.stepFlag = true;
    this.viewFlag = false;
  }

  btn_add(type: any) {
    if (type == 'Activity') {
      if (this.step1Form.value.txt_activityname == '') {
        this.toastService.warning(
          this.translate.instant(
            'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.activitynamemandatory',
          ),
        );
        return;
      }

      this.activityid = '0';

      this.activityidArr.push(this.activityid);

      this.activityvalueArr.push(this.step1Form.value.txt_activityname);

      this.activityvalue = this.nl2br(this.activityvalueArr.join(', '));

      this.otheractivityFlag = false;

      this.step1Form.controls.txt_activityname.setValue('');

      if (this.activityvalue.length > 0) {
        this.step2completedFlag = true;
        this.getStatusColor('STEP2');
      } else {
        if (this.activityvalue.length <= 0) {
          this.step2completedFlag = false;
          this.getStatusColor('STEP2');
        }
      }
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

          console.log(this.params);

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
            this.toastService.warning(
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
              this.step1Form.controls.txt_activityname.setValue(
                modeldata.data.searchtext,
              );
            }

            this.otheractivityFlag = true;
          } else {
            let activity_validate = false;
            this.otheractivityFlag = false;

            this.step1Form.controls.txt_activityname.setValue('');

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

          if (this.activityvalue.length > 0) {
            this.step1completedFlag = true;
            this.getStatusColor('STEP1');
          } else {
            if (this.activityvalue.length <= 0) {
              this.step1completedFlag = false;
              this.getStatusColor('STEP1');
            }
          }
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

        if (this.activityvalue.length <= 0) {
          this.step1completedFlag = false;
          this.getStatusColor('STEP1');
        }
      }
    }
  }

  view() {
    this.view_damage_type = this.damagetypevalueArr.join(', ');

    if (this.getactivityid == '' || this.getactivityid == '0') {
      this.view_activity = this.activityvalueArr.join(', ');
    } else {
      this.view_activity = this.getactivityvalue;
    }

    this.view_assignto = this.assignedtovalueArr.join(', ');

    this.showalert();
  }

  async showalert() {
    if (this.view_damage_type == '') {
      this.toastService.warning(
        this.translate.instant(
          'MAINTENANCEACKNOWLEDGEMODAL.damagetypeselection',
        ),
      );
      return;
    }

    if (this.view_activity == '') {
      this.toastService.warning(
        this.translate.instant(
          'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.activitysmandatory',
        ),
      );
      return;
    }

    if (this.view_assignto == '') {
      this.toastService.warning(
        this.translate.instant(
          'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.assigntomandatory',
        ),
      );
      return;
    }

    this.save();
  }

  save() {
    var req;
    let activityid = [];
    let activityname = [];

    if (this.getactivityid == '' || this.getactivityid == '0') {
      for (let i = 0; i < this.activityidArr.length; i++) {
        if (this.activityidArr[i] == 0) {
          activityname.push(this.activityvalueArr[i]);
        } else {
          activityid.push(this.activityidArr[i]);
        }
      }
    } else {
      activityid = this.activityidArr;
    }
    console.log('done');

    if (this.getpartdefectid != '' && this.getpartdefectid != '0') {
      let partsstatus = [];

      let eachreq = {
        partid: this.getpartdefectid,
        part: this.getpartdefectvalue,
        damagetypeid: this.damagetypeid,
        damagetype: this.damagetypevalue,
        activityid: this.activityid,
        activity: this.activityvalue,
        machineresetflag: this.machineresetvalue,
      };

      partsstatus.push(eachreq);

      console.log(partsstatus);

      this.confirmDisable = true;

      req = {
        userid: this.UserContext.userId,
        millcode: this.UserContext.millCode,
        dept_id: this.UserContext.departmentId,
        id: this.getnotificationid,
        stationid: this.getstationid,
        equipment: this.getmachineid,
        partsarray: JSON.stringify(partsstatus),
        assignedto: this.assignedtoidArr.join(','),
        pvflag: 2,
        completedflag: 1,
        language: this.LanguageService.getLanguage,
      };

      console.log(req);

      this.MaintenanceService.saveMultiplePartMaintenanceNotification(req)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response: any) => {
            if (response.httpcode == 200) {
              this.confirmDisable = false;

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
              this.confirmDisable = false;

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
    } else {
      req = {
        userid: this.UserContext.userId,
        millcode: this.UserContext.millCode,
        dept_id: this.UserContext.departmentId,
        id: this.getnotificationid,
        stationid: String(this.getstationid),
        equipment: String(this.getmachineid),
        problem: '',
        notificationnumber: this.notificationno,
        malfunctionstarttime: '',
        malfunctionstoptime: '',
        notificationtype: '',
        breakdown_coding: this.breakdownid,
        maintanence_type: this.maintenancetypeid,
        part_defect: this.getpartdefectid,
        other_partdefectflag: '',
        other_part_name: '',
        damage: this.damagetypeidArr.join(','),
        breakdown_cause: this.getbreakdowncausesid,
        activity: this.activityidArr.join(','),
        other_activity_name: '',
        operation: '',
        carryoutby: '',
        materialid: '',
        quantity: '',
        assignedto: this.assignedtoidArr.join(','),
        pvflag: 0,
        remarks: '',
        ffbcagestatus: '0',
        language: this.LanguageService.getLanguage,
      };

      console.log(req);

      this.MaintenanceService.saveMaintenanceNotification(req)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response: any) => {
            if (response.httpcode == 200) {
              this.confirmDisable = false;

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
              this.confirmDisable = false;

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
  }

  btn_close() {
    this.ModalController.dismiss({
      dismissed: true,
      item: '',
    });
  }

  nl2br(text: string) {
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }

  parseString(item: any) {
    return JSON.stringify(item);
  }
}
