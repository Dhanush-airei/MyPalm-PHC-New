import {
  Component,
  OnInit,
  ViewChild,
  DestroyRef,
  inject,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
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
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaintenanceMaterialSearchPage } from 'src/app/pages/maintenance/modal/maintenance-material-search/maintenance-material-search-page.page';

@Component({
  selector: 'app-maintenance-engineer-notification-modal',
  templateUrl: './maintenance-engineer-notification-modal.page.html',
  styleUrls: ['./maintenance-engineer-notification-modal.page.scss'],
  standalone: false,
})
export class MaintenanceEngineerNotificationModalPage implements OnInit {
  private destroyRef = inject(DestroyRef);
  @ViewChild('breakdowncausesSelect', { static: false })
  breakdowncausesRef!: IonSelect;
  @ViewChild('assignedtoSelect', { static: false }) assignedtoRef!: IonSelect;

  params: any;
  ffbcageflag = '';
  title = '';
  module: any;

  getstationid = '';
  getstationname = '';

  getmachineid = '';
  getmachinename = '';

  stepFlag = true;
  step1completedFlag = false;
  step2completedFlag = false;
  step3completedFlag = false;
  step4completedFlag = false;

  breakdownArr: any = [];
  maintenancetypeArr: any = [];
  breakdowncausesArr: any = [];
  activityArr: any = [];
  assignedtoArr: any = [];

  materialArr: any = [];
  norecordsflag = false;
  searching: Boolean = false;
  searchTerm: string = '';

  notificationno = '';
  breakdownid = '';
  breakdownvalue = '';

  maintenancetypeid = '';
  maintenancetypevalue = '';

  partid = '';
  partvalue = '';
  partidArr: any = [];
  partvalueArr: any = [];

  breakdowncausesid = '';
  breakdowncausesvalue = '';
  breakdowncausesidArr: any = [];
  breakdowncausesvalueArr: any = [];

  conditionoptionSelected = '';

  assignedtoid = '';
  assignedtovalue = '';
  assignedtoidArr: any = [];
  assignedtovalueArr: any = [];

  // View the details
  view_breakdown = '';
  view_maintenancetype = '';
  view_partdefect = '';
  view_breakdowncauses = '';
  view_assignto = '';

  // Ionic Select Header
  breakdownOptions: any = {
    header: this.translate.instant('SUPERVISORDASHBOARD.problem'),
    cssClass: 'multiselect',
  };

  maintenancetypeOptions: any = {
    header: this.translate.instant('SUPERVISORDASHBOARD.maintenancetype'),
    cssClass: 'multiselect',
  };

  breakdowncausesOptions: any = {
    header: this.translate.instant(
      'MAINTENANCEACKNOWLEDGEMODAL.breakdowncauses',
    ),
    cssClass: 'multiselect',
  };
  public assignedtoOptions: any = {
    header: this.translate.instant(
      'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.assignto',
    ),
    cssClass: 'multiselect',
  };
  public priorityLevelOption: any = {
    header: 'Priority Level',
    cssClass: 'multiselect',
  };
  priorityLevelArr: any = [];
  priorityId = '';
  priorityLevel = '';
  step1Form: any;

  viewFlag = false;
  breakdownFlag = false;
  chargemanFlag = false;
  foremanFlag = false;
  assignedtoFlag = false;
  confirmDisable = false;

  priorityLevelEligible = false;
  assignToEligible = false;

  size: any;
  totalpage: any;
  responsedata: any;
  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    private alertController: AlertController,
    public modalController: ModalController,
    public partmodalController: ModalController,
    private fb: FormBuilder,
    public navParams: NavParams,
    private UserContext: UserContext,
    private MaintenanceService: MaintenanceService,
    private ToastService: ToastService,
  ) {
    let viewform = navParams.get('item');
    this.params = JSON.parse(viewform);
    this.ffbcageflag = this.params.ffbcageflag;
    this.title = this.params.stationname;
    this.module = navParams.get('module');

    console.log('Param:', this.params);

    this.getstationid = this.params.stationid;
    this.getmachineid = this.params.machineid;

    this.getstationname = this.params.stationname;
    this.getmachinename = this.params.machinename;

    this.step1Form = this.fb.group({
      select_breakdown: [''],
      select_maintenancetype: [''],
      txt_partname: [''],
      select_breakdowncauses: [''],
      select_assignedto: [''],
      ta_remarks: [''],
      select_priority_level: [''],
    });

    this.initialApiGetData();
    this.checkEligibleForAssignTo();
    this.checkEligibleForPriorityLevel();
  }

  ngOnInit() {}

  getStatusColor(type: any) {
    let color;

    if (type == 'STEP1') {
      if (!this.step1completedFlag) {
        color = '#CB4335';
      } else if (this.step1completedFlag) {
        color = '#008000';
      } else {
        color = '#CB4335';
      }
    } else if (type == 'STEP2') {
      if (!this.step2completedFlag) {
        color = '#CB4335';
      } else if (this.step2completedFlag) {
        color = '#008000';
      } else {
        color = '#CB4335';
      }
    } else if (type == 'STEP3') {
      if (!this.step3completedFlag) {
        color = '#CB4335';
      } else if (this.step3completedFlag) {
        color = '#008000';
      } else {
        color = '#CB4335';
      }
    } else if (type == 'STEP4') {
      if (!this.step4completedFlag) {
        color = '#CB4335';
      } else if (this.step4completedFlag) {
        color = '#008000';
      } else {
        color = '#CB4335';
      }
    } else {
      color = '#CB4335';
    }

    return color;
  }

  breakdownhandleChange(e: any) {
    let value = e.detail.value;
    if (value.length > 0) {
      this.breakdownid = JSON.parse(value).id;
      this.breakdownvalue = JSON.parse(value).breakdownCoding;

      this.step1completedFlag = true;
      this.getStatusColor('STEP1');
    } else {
      this.breakdownid = '';
      this.breakdownvalue = '';

      this.step1completedFlag = false;
      this.getStatusColor('STEP1');
    }
  }

  maintenancetypehandleChange(e: any) {
    let value = e.detail.value;
    if (value.length > 0) {
      this.maintenancetypeid = JSON.parse(value).id;
      this.maintenancetypevalue = JSON.parse(value).maintanence_type;

      this.step2completedFlag = true;
      this.getStatusColor('STEP2');
    } else {
      this.maintenancetypeid = '';
      this.maintenancetypevalue = '';

      this.step2completedFlag = false;
      this.getStatusColor('STEP2');
    }
  }

  breakdowncauseshandleChange(e: any) {
    let value = e.detail.value;
    if (value.length > 0) {
      this.breakdowncausesidArr = [];
      this.breakdowncausesvalueArr = [];
      for (let i = 0; i < value.length; i++) {
        this.breakdowncausesidArr.push(JSON.parse(value[i]).cause_id);
        this.breakdowncausesvalueArr.push(JSON.parse(value[i]).BreakdownCause);
      }

      this.breakdowncausesid = this.breakdowncausesidArr.join(',');
      this.breakdowncausesvalue = this.nl2br(
        this.breakdowncausesvalueArr.join(', '),
      );

      if (this.materialArr.length > 0) {
        this.step4completedFlag = true;
        this.getStatusColor('STEP4');
      } else {
        this.step3completedFlag = true;
        this.getStatusColor('STEP3');
      }
    } else {
      this.breakdowncausesidArr = [];
      this.breakdowncausesvalueArr = [];
      this.breakdowncausesid = '';
      this.breakdowncausesvalue = '';

      this.step4completedFlag = false;
      this.getStatusColor('STEP4');
    }
  }

  openBreakdownCauses() {
    this.breakdowncausesRef.open();
  }

  openAssignedTo() {
    this.assignedtoRef.open();
  }

  priorityLevelChange(event: any) {
    const value = event.detail.value;
    console.log('Selected Object:', value);
    console.log('ID:', value.id);
    console.log('Priority:', value.priority);

    if (value) {
      this.priorityId = value.id;
      this.priorityLevel = value.priority;
    } else {
      this.priorityId = '';
      this.priorityLevel = '';
    }
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

  onConditionOptionChange(value: any) {
    this.assignedtoFlag = true;

    this.conditionoptionSelected = value;

    if (this.conditionoptionSelected == 'Foreman') {
      this.chargemanFlag = false;
      this.foremanFlag = true;

      this.getAssignedTo(1);
    } else {
      this.chargemanFlag = true;
      this.foremanFlag = false;

      this.getAssignedTo(2);
    }

    console.log(this.conditionoptionSelected);
  }

  getAssignedTo(value: any) {
    this.assignedtoid = '';
    this.assignedtovalue = '';
    this.assignedtoidArr = [];
    this.assignedtovalueArr = [];

    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      desig_id: this.UserContext.designId,
      type: value,
      language: this.languageService.getLanguage,
    };

    console.log('Assign to:', req);

    this.MaintenanceService.getWorkAssignedToList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          const resultdata: any = result;

          if (resultdata.httpcode == 200) {
            this.assignedtoArr = resultdata.data;

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
        error: (err: any) => {
          console.error('getWorkAssignedToList failed', err);
          this.assignedtoArr = [];
        },
      });
  }

  async callmodalcontroller(type: any) {
    if (type == 'PartDefect') {
      const partmodal = await this.partmodalController.create({
        component: MaintenanceMaterialSearchPage,
        componentProps: {
          type: '0',
          station_id: this.getstationid,
          equipment_id: this.getmachineid,
          title: this.translate.instant(
            'MAINTENANCEACKNOWLEDGEMODAL.searchpartname',
          ),
        },
      });

      partmodal.onDidDismiss().then((modeldata) => {
        let viewform = modeldata.data.data;

        if (viewform != '') {
          this.params = JSON.parse(viewform);

          this.partid = this.params.item_id;
          this.partvalue = this.params.item_name;

          if (this.partid == '0') {
            if (modeldata.data.searchtext != '') {
              this.step1Form.controls.txt_partname.setValue(
                modeldata.data.searchtext,
              );
            }
          } else {
            let part_validate = false;

            this.step1Form.controls.txt_partname.setValue('');

            if (this.partidArr.length > 0) {
              for (let i = 0; i < this.partidArr.length; i++) {
                if (this.partidArr[i] == this.partid) {
                  part_validate = true;
                }
              }
            }

            if (!part_validate) {
              if (this.partid != '') {
                this.partidArr.push(this.partid);
              }

              if (this.partvalue != '') {
                this.partvalueArr.push(this.partvalue);
              }
            } else {
              this.ToastService.warning(
                this.partvalue +
                  this.translate.instant(
                    'MAINTENANCEACKNOWLEDGEMODAL.alreadyexist',
                  ),
              );
            }
          }
          this.partvalue = this.nl2br(this.partvalueArr.join('\n'));

          if (this.partvalue.length > 0) {
            this.step3completedFlag = true;
            this.getStatusColor('STEP3');
          } else {
            if (this.partvalue.length <= 0) {
              this.step3completedFlag = false;
              this.getStatusColor('STEP3');
            }
          }
        }
      });

      return await partmodal.present();
    }
  }

  checkEligibleForAssignTo() {
    const eligibleDesignIds = [2];
    const eligible = eligibleDesignIds.includes(this.UserContext.designId);

    if (eligible) {
      this.assignToEligible = true;
    }
  }

  checkEligibleForPriorityLevel() {
    const eligibleDesignIds = [2];
    const eligible = eligibleDesignIds.includes(this.UserContext.designId);

    if (eligible) {
      this.priorityLevelEligible = true;
    }
  }

  initialApiGetData() {
    this.getNotificationNumber();
    this.getBreakdown();
    this.getMaintenancetype();
    this.getBreakDownCauses();
    this.fetchPriorityLevel();
  }

  getNotificationNumber() {
    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      language: this.languageService.getLanguage,
    };

    //console.log(req);

    this.MaintenanceService.getSequenceNumber(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          const resultdata: any = result;

          if (resultdata.httpcode == 200) {
            this.notificationno = resultdata.data[0].workorder;
          }
        },
        error: (err: any) => {
          console.error('getSequenceNumber failed', err);
        },
      });
  }

  getBreakdown(): void {
    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      type: 2,
      language: this.languageService.getLanguage,
    };

    console.log(req);

    this.MaintenanceService.getBreakdownCodingList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          if (result?.httpcode == 200) {
            this.breakdownArr = result.data.map((eachitem: any) => ({
              id: eachitem.id,
              breakdownCoding: eachitem.breakdownCoding,
              selected:
                this.breakdownid != '' && eachitem.id == this.breakdownid
                  ? 1
                  : 0,
            }));

            this.breakdownFlag = true;
          } else {
            this.breakdownArr = [];
            this.breakdownFlag = false;
          }
        },
        error: (err: any) => {
          console.error('getBreakdownCodingList failed', err);
          this.breakdownArr = [];
          this.breakdownFlag = false;
        },
      });
  }

  getMaintenancetype(): void {
    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      language: this.languageService.getLanguage,
    };

    this.MaintenanceService.getMaintenanceTypeList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          if (result?.httpcode == 200) {
            this.maintenancetypeArr = result.data.map((eachitem: any) => ({
              id: eachitem.id,
              maintanence_type: eachitem.maintanence_type,
              selected:
                this.maintenancetypeid != '' &&
                eachitem.id == this.maintenancetypeid
                  ? 1
                  : 0,
            }));
          } else {
            this.maintenancetypeArr = [];
          }
          this.loadData(true, '0', this.searching);
          this.getBreakDownCauses();
        },
        error: (err: any) => {
          console.error('getMaintenanceTypeList failed', err);
          this.maintenancetypeArr = [];
          this.getBreakDownCauses();
        },
      });
  }

  loadData(pagerefresh: Boolean, pagenum: string, search: Boolean) {
    let searchString = '';

    if (pagerefresh == true) {
      this.materialArr = [];
    } else {
    }

    if (this.searchTerm != '') {
      searchString = this.searchTerm;
    }

    if (search == true) {
      if (pagerefresh == true) {
        this.materialArr = [];
      }
      searchString = this.searchTerm;
    } else {
      if (pagerefresh == true) {
        this.materialArr = [];
      }
    }

    searchString = this.searchTerm;

    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      stationid: this.getstationid,
      locationid: this.getmachineid,
      searchtext: searchString,
      page: parseInt(pagenum) + 1,
      language: this.languageService.getLanguage,
    };

    //console.log(req);

    this.MaintenanceService.getPartList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          const resultdata: any = result;

          this.responsedata = resultdata;

          this.size = parseInt(resultdata.size);

          this.totalpage = resultdata.total_page * this.size;

          if (search == true) {
            if (pagerefresh == true) {
              this.materialArr = [];
            } else {
            }
          } else {
            if (pagerefresh == true) {
              this.materialArr = [];
            }
          }

          if (resultdata.httpcode == 200) {
            if (resultdata.partData.length > 0) {
              for (var i = 0; i < resultdata.partData.length; i++) {
                this.materialArr.push(resultdata.partData[i]);
              }

              this.norecordsflag = false;
            }
          } else {
            if (this.materialArr.length > 0) {
              this.norecordsflag = false;
            } else {
              this.norecordsflag = true;
            }
          }
        },
        error: (err: any) => {
          console.error('getPriorityLevel failed', err);
          this.priorityLevelArr = [];
        },
      });
  }

  getBreakDownCauses(): void {
    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      language: this.languageService.getLanguage,
    };

    this.MaintenanceService.getBreakDownCausesList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          if (result?.httpcode == 200) {
            this.breakdowncausesArr = result.data.map((eachitem: any) => ({
              cause_id: eachitem.cause_id,
              BreakdownCause: eachitem.BreakdownCause,
              selected:
                this.breakdowncausesid != '' &&
                eachitem.cause_id == this.breakdowncausesid
                  ? 1
                  : 0,
            }));
          } else {
            this.breakdowncausesArr = [];
          }
        },
        error: (err: any) => {
          console.error('getBreakDownCausesList failed', err);
          this.breakdowncausesArr = [];
        },
      });
  }

  fetchPriorityLevel() {
    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
    };
    console.log('Priority level Req:', req);

    this.MaintenanceService.getPriorityLevel(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          const resultdata: any = result;

          if (resultdata.httpcode == 200) {
            this.priorityLevelArr = resultdata.data;
            console.log(this.priorityLevelArr);
          } else {
            this.priorityLevelArr = [];
          }
        },
        error: (err: any) => {
          console.error('getPriorityLevel failed', err);
          this.priorityLevelArr = [];
        },
      });
  }

  // NOTE: maintenanceservice.getPriorityLevel() must return an Observable
  // (like getPartList()), not a Promise, for .pipe() to work directly here.

  btn_next() {
    if (this.step1Form.value.select_breakdown == '') {
      this.ToastService.warning(
        this.translate.instant(
          'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.problemmandatory',
        ),
      );
      return;
    }

    if (this.step1Form.value.select_maintenancetype == '') {
      this.ToastService.warning(
        this.translate.instant(
          'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.maintenancetypemandatory',
        ),
      );
      return;
    }

    if (this.materialArr.length > 0 && this.partvalueArr.length <= 0) {
      this.ToastService.warning(
        this.translate.instant(
          'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.partdefectmandatory',
        ),
      );
      return;
    }

    if (this.breakdowncausesid.length <= 0) {
      this.ToastService.warning(
        this.translate.instant(
          'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.breakdowncausesmandatory',
        ),
      );
      return;
    }

    if (this.priorityLevel == '' && this.UserContext.designId == 2) {
      this.ToastService.warning('Priority level is Mandatory');
      return;
    }

    if (this.conditionoptionSelected == '' && this.assignToEligible) {
      this.ToastService.warning(
        this.translate.instant(
          'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.assignedtoselection',
        ),
      );
      return;
    }

    if (this.assignedtovalueArr.length <= 0 && this.assignToEligible) {
      this.ToastService.warning(
        this.translate.instant(
          'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.inchargeselection',
        ),
      );
      return;
    }

    // all validation already passed above - no need to re-validate in view()/showalert()
    this.view();
    this.save();
  }

  // pure formatting now - no validation here anymore (already done in btn_next)
  view() {
    this.view_breakdown = JSON.parse(
      this.step1Form.value.select_breakdown,
    ).breakdownCoding;
    this.view_maintenancetype = JSON.parse(
      this.step1Form.value.select_maintenancetype,
    ).maintanence_type;

    if (this.materialArr.length > 0) {
      this.view_partdefect = this.partvalueArr.join(', ');
    }

    this.view_breakdowncauses = this.breakdowncausesvalueArr.join(', ');
    this.view_assignto = this.assignedtovalueArr.join(', ');
  }

  save() {
    let partid: any[] = [];
    let otherpartname: any[] = [];
    let str_partid = '';
    let str_otherpartname = '';

    if (this.materialArr.length > 0) {
      for (let i = 0; i < this.partidArr.length; i++) {
        if (this.partidArr[i] == 0) {
          otherpartname.push(this.partvalueArr[i]);
        } else {
          partid.push(this.partidArr[i]);
        }
      }

      str_partid = partid.join(',');
      str_otherpartname = otherpartname.join('~');
    }

    const req = {
      userid: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      id: 0,
      stationid: String(this.getstationid),
      equipment: String(this.getmachineid),
      problem: '',
      notificationnumber: this.notificationno,
      malfunctionstarttime: '',
      malfunctionstoptime: '',
      notificationtype: '',
      breakdown_coding: this.breakdownid,
      maintanence_type: this.maintenancetypeid,
      part_defect: str_partid,
      other_partdefectflag: '',
      other_part_name: str_otherpartname,
      damage: '',
      breakdown_cause: this.breakdowncausesidArr.join(','),
      activity: '',
      other_activity_name: '',
      operation: '',
      carryoutby: '',
      materialid: '',
      quantity: '',
      assignedto: '',
      workassignedto: this.assignedtoidArr.join(','),
      pvflag: 0,
      remarks: this.step1Form.value.ta_remarks,
      ffbcagestatus: this.ffbcageflag,
      language: this.languageService.getLanguage,
      priority_level: this.priorityId,
    };

    console.log(req);

    this.modalController.dismiss({
      dismissed: true,
      item: 'Submitted',
      notificationdata: req,
    });
  }

  clear(type: any, index: number) {
    if (type == 'Part') {
      this.partidArr.splice(index, 1);
      this.partvalueArr.splice(index, 1);

      if (this.partvalueArr.length > 0) {
        this.partvalue = this.nl2br(this.partvalueArr.join('\n'));
      } else {
        this.partid = '';
        this.partvalue = '';
        this.partidArr = [];
        this.partvalueArr = [];

        if (this.partvalue.length <= 0) {
          this.step3completedFlag = false;
          this.getStatusColor('STEP3');
        }
      }
    }
  }

  nl2br(text: string) {
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }

  parseString(item: any) {
    return JSON.stringify(item);
  }

  btn_close() {
    this.modalController.dismiss({
      dismissed: true,
      item: '',
    });
  }
}
