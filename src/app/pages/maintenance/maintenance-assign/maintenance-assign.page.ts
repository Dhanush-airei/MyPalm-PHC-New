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

@Component({
  selector: 'app-maintenance-assign',
  templateUrl: './maintenance-assign.page.html',
  styleUrls: ['./maintenance-assign.page.scss'],
  standalone: false,
})
export class MaintenanceAssignPage implements OnInit {
  private destroyRef = inject(DestroyRef);
  @ViewChild('assignedtoSelect', { static: false }) assignedtoRef!: IonSelect;
  notificationForm: any;
  getstationname = '';
  getmachinename = '';
  getbreakdownvalue = '';
  getmaintenancetypevalue = '';
  getpartdefectvalue = '';
  getbreakdowncausesvalue = '';
  getbreakdownremarksvalue = '';

  assignedtovalue = '';
  isDisabled = false;
  foremanFlag = false;
  chargemanFlag = false;
  assignedtoFlag = false;
  schedulechecked: 0 | 1 = 0;

  // Array properties
  priorityLevelArr: any[] = [];
  assignedtoArr: any[] = [];
  assignedtovalueArr: any[] = [];
  tasklistArr: any[] = [];

  assignedtoid = '';
  assignedtoidArr: any = [];

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

  priorityId = '';
  priorityLevel = '';

  params: any;
  title = '';
  module = '';
  getnotificationid = '';
  getstationid = '';
  getmachineid = '';
  getbreakdownid = '';
  getmaintenancetypeid = '';
  getpartdefectid = '';
  getbreakdowncausesid = '';
  tasklistflag = 0;
  conditionoptionSelected = '';
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

    console.log(this.module);

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
    this.getpartdefectvalue = this.nl2br(this.params.partdefect);

    this.getbreakdowncausesid = this.params.breakdowncausesid;
    this.getbreakdowncausesvalue = this.params.breakdowncauses;

    this.getbreakdownremarksvalue = this.params.breakdownremarks;

    this.notificationForm = this.fb.group({
      select_assignedto: [''],
      schdule_datetime: [''],
      select_priority_level: [''],
    });

    if (this.module == 'RoPM') {
      this.gettasklistflag();
    }
    this.fetchPriorityLevel();
  }

  ngOnInit() {}

  gettasklistflag() {
    let req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      machineid: this.getmachineid,
      part_id: this.getpartdefectid,
      stationid: this.getstationid,
    };
    console.log('Flag:', req);

    this.MaintenanceService.getPartTaskListFlag(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response.httpcode == 200) {
            this.tasklistflag = 1;
            this.gettasklist();
          } else {
            this.tasklistflag = 0;
            this.tasklistArr = [];
          }
        },

        error: (error: any) => {
          console.error('error:', error);
        },
      });
  }

  gettasklist() {
    let req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      machineid: this.getmachineid,
      part_id: this.getpartdefectid,
      stationid: this.getstationid,
    };
    console.log('Task Req:', req);

    this.MaintenanceService.getPartTaskList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response.httpcode == 200) {
            this.tasklistArr = response.data;
            console.log(this.tasklistArr);
          } else {
            this.tasklistArr = [];
          }
        },

        error: (error: any) => {
          console.error('error:', error);
        },
      });
  }

  fetchPriorityLevel() {
    let req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
    };
    console.log('Priority level Req:', req);

    this.MaintenanceService.getPriorityLevel(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response.httpcode == 200) {
            this.priorityLevelArr = response.data;
            console.log(this.priorityLevelArr);
          } else {
            this.priorityLevelArr = [];
          }
        },

        error: (error: any) => {
          console.error('error:', error);
        },
      });
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
  assignedtohandleChange(event: CustomEvent): void {
    const value = event.detail?.value ?? [];

    if (value.length > 0) {
      this.assignedtoidArr = [];
      this.assignedtovalueArr = [];

      for (const item of value) {
        const user = typeof item === 'string' ? JSON.parse(item) : item;

        this.assignedtoidArr.push(user.userId);
        this.assignedtovalueArr.push(user.name);
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
      this.foremanFlag = true;
      this.chargemanFlag = false;

      this.getAssignedTo(1);
    } else {
      this.foremanFlag = false;
      this.chargemanFlag = true;

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
      language: this.LanguageService.getLanguage,
    };

    //console.log(req);

    this.MaintenanceService.getWorkAssignedToList(req)
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
          } else {
            this.assignedtoArr = [];
          }
        },

        error: (error: any) => {
          console.error('error:', error);
        },
      });
  }

  assign() {
    let getDate = '';

    if (this.priorityLevel == '' && this.module == 'CM') {
      this.toastService.warning('Priority level is Mandatory');
      return;
    }

    if (this.conditionoptionSelected == '') {
      this.toastService.warning(
        this.translate.instant(
          'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.assignedtoselection',
        ),
      );
      return;
    }

    if (this.assignedtovalueArr.length <= 0) {
      this.toastService.warning(
        this.translate.instant(
          'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.inchargeselection',
        ),
      );
      return;
    }

    if (this.schedulechecked == 1) {
      getDate = this.getFormattedDate(
        this.notificationForm.value.schdule_datetime,
      );

      console.log('Date:', getDate);

      if (this.notificationForm.value.schdule_datetime == '') {
        this.toastService.warning('Scheduled Date and Time is mandatory');
        return;
      }
    }

    let req = {
      userid: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      assignedto: this.assignedtoidArr.join(','),
      notification_id: this.getnotificationid,
      language: this.LanguageService.getLanguage,
      schedule_flag: this.schedulechecked,
      schedule_datetime: getDate,
      priority_level: this.priorityId,
    };

    console.log(req);
    // return;
    this.isDisabled = true;
    this.MaintenanceService.saveManagerAssign(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response.httpcode == 200) {
            this.isDisabled = false;

            if (this.module == 'CM') {
              this.toastService.success(
                this.translate.instant(
                  'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.assignsuccess',
                ),
              );
            } else if (this.module == 'RoPM') {
              this.toastService.success(
                this.translate.instant(
                  'PREVENTIVEMAINTENANCEASSIGN.routineassignsuccess',
                ),
              );
            } else {
              this.toastService.success(
                this.translate.instant(
                  'PREVENTIVEMAINTENANCEASSIGN.replacementassignsuccess',
                ),
              );
            }

            this.ModalController.dismiss({
              dismissed: true,
              item: 'Submitted',
            });
          } else {
            this.isDisabled = false;

            if (this.module == 'CM') {
              this.toastService.error(
                this.translate.instant(
                  'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.assignfailed',
                ),
              );
            } else if (this.module == 'RoPM') {
              this.toastService.error(
                this.translate.instant(
                  'PREVENTIVEMAINTENANCEASSIGN.routineassignfailed',
                ),
              );
            } else {
              this.toastService.error(
                this.translate.instant(
                  'PREVENTIVEMAINTENANCEASSIGN.replacementassignfailed',
                ),
              );
            }
          }
        },

        error: (error: any) => {
          console.error('error:', error);
        },
      });
  }
  getFormattedDate(dateValue: string | Date): string {
    if (!dateValue) {
      return '';
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
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

  isscheduleChecked(event: any) {
    if (event.detail.checked) {
      this.schedulechecked = 1;
    } else {
      this.schedulechecked = 0;
    }
  }
}
