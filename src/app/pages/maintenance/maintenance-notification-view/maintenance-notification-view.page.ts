import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Keyboard } from '@capacitor/keyboard';
import { PluginListenerHandle } from '@capacitor/core';
import {
  IonContent,
  ModalController,
  Platform,
  NavParams,
} from '@ionic/angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { GeneralService } from 'src/app/shared/services/general-service/general-service';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import {
  FormArray,
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { MaintenanceAiViewPage } from '../maintenance-ai-view/maintenance-ai-view.page';
import { ImageSliderComponent } from 'src/app/shared/components/image-slider/image-slider.component';
import { ReplacementExtentedRunningHoursUpdatePage } from '../modal/replacement-extented-running-hours-update/replacement-extented-running-hours-update.page';

@Component({
  selector: 'app-maintenance-notification-view',
  templateUrl: './maintenance-notification-view.page.html',
  styleUrls: ['./maintenance-notification-view.page.scss'],
  standalone: false,
})
export class MaintenanceNotificationViewPage implements OnInit {
  @ViewChild(IonContent, { static: false })
  pageTop!: IonContent;

  private keyboardWillShowListener?: PluginListenerHandle;
  private destroyRef = inject(DestroyRef);

  @Input() item: any;
  @Input() module: string = '';

  private backButtonSubscription: any;

  // Variables

  // =========================================
  // Notification
  // =========================================

  generalArr: any[] = [];

  notificationstatus: string = '';
  notificationstatusid: any = '';
  notificationStatusImage = '';
  notificationno: string = '';
  stationcode: string = '';
  notificationtype: string = '';

  // =========================================
  // Maintenance Details
  // =========================================

  breakdownremarks: string = '';
  breakdowncoding: string = '';

  maintenancetype: string = '';
  maintenancetypeid: any = '';

  station: string = '';
  stationid: any = '';

  equipment: string = '';
  equipmentid: any = '';

  maximumrunninghours: any = '';
  runninghours: any = '';
  extendedmaximumrunninghours: any = '';

  partdefect: string = '';
  partdefectid: any = '';

  damage: string = '';
  damagesid: any = '';

  breakdowncauses: string = '';
  breakdowncausesid: any = '';

  remarks: string = '';
  createddatetime: any = '';
  schduleddatetime: any = '';

  currentrunninghours: any = '';

  statusid: any = '';

  reportedby: string = '';
  incharge: string = '';

  // =========================================
  // Priority
  // =========================================

  priority_level: string = '';
  priority_id: any = '';

  // =========================================
  // Images
  // =========================================
  imagesArr: string[] = [];

  // =========================================
  // Details Flags
  // =========================================

  detailsFlag: boolean = false;
  detailsnorecordFlag: boolean = false;

  repairactivitynorecordFlag: boolean = false;
  jobauthorizationnorecordFlag: boolean = false;

  // =========================================
  // Repair Activity
  // =========================================

  activity: string = '';

  partreceiveddatetime: any = '';

  activitycompletiondatetime: any = '';

  carriedoutby: string = '';

  verifiedby: string = '';

  inchargeremarks: string = '';

  // =========================================
  // Job Authorization
  // =========================================

  authorizedby: string = '';

  authorizeddatetime: any = '';

  // =========================================
  // Parts
  // =========================================

  cmpartslistArr: any[] = [];
  ropmpartslistArr: any[] = [];
  repmpartslistArr: any[] = [];

  // =========================================
  // Task
  // =========================================
  tasklistflag: number = 0;
  showtasklistonlyflag: number = 0;
  tasklistArr: any[] = [];

  // =========================================
  // Other Variables
  // =========================================

  fromscreen: string = '';

  pmflag: any = '';
  conditionid = '';
  extendrunninghoursFlag = '';
  machinereplacementFlag: string = '0';

  notificationid: any = '';
  params: any;
  remarksForm: any;
  rejectRemarksForm: any;
  isDisabled = false;

  rejectbtnflag = 0;

  imageview = '';
  modal_extendedrunninghours: any;

  constructor(
    public ModalController: ModalController,
    private platform: Platform,
    public UserContext: UserContext,
    private LanguageService: LanguageService,
    private translate: TranslateService,
    private GeneralService: GeneralService,
    private MaintenanceService: MaintenanceService,
    private toastService: ToastService,
    public navParams: NavParams,
    private fb: FormBuilder,
  ) {
    let viewform = navParams.get('item');
    this.params = JSON.parse(viewform);
    this.rejectbtnflag = navParams.get('rejectbtnflag') ?? 0;

    this.params = JSON.parse(viewform);
    this.notificationid = this.params.id;
    this.conditionid = this.params.conditionid;
    this.extendrunninghoursFlag = navParams.get('flag');
    this.machinereplacementFlag = this.params.machinereplacement;
    this.fromscreen = navParams.get('module');
    this.pmflag = this.params.pm_flag;

    this.rejectRemarksForm = this.fb.group({
      ta_remarks: new FormControl(''),
    });

    this.remarksForm = this.fb.group({
      ta_remarks: new FormControl(''),
    });
    if (this.fromscreen == 'CM' || this.fromscreen == 'CMVIEW') {
      this.priority_level =
        this.params.priority_level == '' ? '-' : this.params.priority_level;
      this.priority_id = this.params.priority_id;
    }
  }

  ngOnInit() {
    this.fromscreen = this.module;

    // 1. Set initial values
    this.setPriorityDetails();

    // 2. Call API
    this.getNotificationView();
  }

  async ionViewDidEnter(): Promise<void> {
    // -----------------------------------------
    // Prevent Android hardware back button
    // from closing the modal
    // -----------------------------------------
    this.backButtonSubscription =
      this.platform.backButton.subscribeWithPriority(9999, () => {
        // Do nothing.
        // Android hardware Back button will NOT close the modal.
        console.log('Hardware Back pressed - modal remains open');
      });

    // -----------------------------------------
    // Keyboard listener
    // -----------------------------------------

    this.keyboardWillShowListener = await Keyboard.addListener(
      'keyboardWillShow',
      () => {
        setTimeout(() => {
          const remarksElement = document.getElementById('ta_remarks');

          if (!remarksElement || !this.pageTop) {
            return;
          }

          this.pageTop.scrollToPoint(0, remarksElement.offsetTop, 300);
        }, 200);
      },
    );
  }

  private setPriorityDetails(): void {
    if (this.module !== 'CM' && this.module !== 'CMVIEW') {
      return;
    }

    this.priority_level = this.item?.priority_level?.trim() || '-';

    this.priority_id = this.item?.priority_id ?? 0;
  }

  async ionViewDidLeave(): Promise<void> {
    // Remove Android back button listener
    this.backButtonSubscription?.unsubscribe();

    // Remove keyboard listener
    await this.keyboardWillShowListener?.remove();

    this.keyboardWillShowListener = undefined;
  }

  async ngOnDestroy(): Promise<void> {
    // Remove Android back button listener
    this.backButtonSubscription?.unsubscribe();

    // Remove keyboard listener
    await this.keyboardWillShowListener?.remove();

    this.keyboardWillShowListener = undefined;
  }

  getNotificationView(): void {
    // -----------------------------------------
    // Request
    // -----------------------------------------

    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      id: this.params.id,
      language: this.LanguageService.getLanguage,
    };

    console.log('Request:', req);

    this.GeneralService.getMaintenanceNotificationView(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resultdata: any) => {
          // -----------------------------------------
          // HTTP response
          // -----------------------------------------

          console.log(resultdata);

          if (resultdata.httpcode == 200) {
            this.generalArr = resultdata?.data?.general || [];
            const data = this.generalArr[0];
            console.log('Notification View:', data);

            // -----------------------------------------
            // Basic Details
            // -----------------------------------------

            this.notificationstatus = data.statusname;
            this.notificationstatusid = String(data.statusId);
            this.setNotificationStatusImage(this.notificationstatusid);
            this.notificationno = data.notificationno;
            this.stationcode = data.stationcode;

            this.detailsFlag = false;

            // -----------------------------------------
            // Notification Type
            // -----------------------------------------

            if (
              this.fromscreen === 'RoPM' ||
              this.fromscreen === 'RoPMVIEW' ||
              this.fromscreen === 'RoPMReport'
            ) {
              if (typeof this.pmflag !== 'undefined' && this.pmflag == 1) {
                this.notificationtype = data.notificationtype + ' Maintenance';

                this.detailsFlag = true;
              } else {
                this.notificationtype = 'Routine ' + data.notificationtype;
              }
            } else if (
              this.fromscreen === 'RePM' ||
              this.fromscreen === 'RePMVIEW' ||
              this.fromscreen === 'RePMReport' ||
              this.fromscreen === 'RePMACK'
            ) {
              this.notificationtype = 'Replacement ' + data.notificationtype;
            } else {
              this.notificationtype = data.notificationtype;
            }

            // -----------------------------------------
            // Notification Details
            // -----------------------------------------

            this.breakdownremarks = data.breakdownremarks;
            this.breakdowncoding = data.breakdowncoding;

            this.maintenancetype = data.maintenancetype;
            this.maintenancetypeid = data.maintenancetypeid;

            this.station = data.stationname;
            this.stationid = data.stationid;

            this.equipment = data.equipment;
            this.equipmentid = data.equipmentid;

            this.maximumrunninghours = data.lifetimehours;
            this.runninghours = data.runningHours;

            this.extendedmaximumrunninghours = data.extendedlifetimehours;

            this.partdefect = data.partdefect;
            this.partdefectid = data.partdefectid;

            this.damage = data.damages;
            this.damagesid = data.damagesid;

            this.breakdowncauses = data.breakdowncauses;
            this.breakdowncausesid = data.breakdowncausesidnew;

            this.remarks = data.remarks;
            this.createddatetime = data.insDate;
            this.schduleddatetime = data.scheduleddatetime;

            this.currentrunninghours = data.machine_current_running_hours;

            this.statusid = data.statusId;

            this.reportedby = data.reportBy;
            this.incharge = data.incharge;

            // -----------------------------------------
            // Corrective Maintenance Priority
            // -----------------------------------------

            if (this.fromscreen === 'CM' || this.fromscreen === 'CMVIEW') {
              this.priority_level =
                data.priority_level === '' ? '-' : data.priority_level;

              this.priority_id = data.priority_id;
            }

            // -----------------------------------------
            // Images
            // -----------------------------------------

            const getimageview = data.images;

            if (getimageview) {
              this.imagesArr = getimageview.split('~');
            } else {
              this.imagesArr = [];
            }

            // -----------------------------------------
            // Part Defect
            // -----------------------------------------

            const getpartdefectidArr = (this.partdefectid || '').split(',');

            // -----------------------------------------
            // Details No Record
            // -----------------------------------------

            if (
              this.station === '' &&
              this.equipment === '' &&
              this.runninghours === '' &&
              this.partdefect === '' &&
              this.damage === '' &&
              this.breakdowncauses === '' &&
              this.remarks === '' &&
              this.createddatetime
            ) {
              this.detailsnorecordFlag = true;
            } else {
              this.detailsnorecordFlag = false;
            }

            // -----------------------------------------
            // Repair Activity
            // -----------------------------------------

            this.activity = data.activity;
            this.partreceiveddatetime = data.partreceiveddatetime;

            this.activitycompletiondatetime = data.workcompletiondatetime;

            this.carriedoutby = data.carriedoutby;
            this.verifiedby = data.verifiedby;

            this.inchargeremarks = data.closing_remarks;

            if (
              this.activity === '' &&
              this.partreceiveddatetime === '' &&
              this.activitycompletiondatetime === '' &&
              this.carriedoutby === '' &&
              this.verifiedby === ''
            ) {
              this.repairactivitynorecordFlag = true;
            } else {
              this.repairactivitynorecordFlag = false;
            }

            // -----------------------------------------
            // Job Authorization
            // -----------------------------------------

            this.authorizedby = data.authorisedBy;

            this.authorizeddatetime = data.acknowledgeddatetime;

            if (this.authorizedby === '' && this.authorizeddatetime === '') {
              this.jobauthorizationnorecordFlag = true;
            } else {
              this.jobauthorizationnorecordFlag = false;
            }

            // -----------------------------------------
            // Get Parts
            // -----------------------------------------

            if (this.machinereplacementFlag == '0') {
              // Corrective Maintenance
              if (
                (this.fromscreen === 'CM' || this.fromscreen === 'CMVIEW') &&
                getpartdefectidArr.length > 1
              ) {
                this.getParts(
                  data.stationid,
                  data.equipmentid,
                  2,
                  data.runningHours,
                  data.partdefect,
                );
              }

              // Routine PM
              else if (
                (this.fromscreen === 'RoPM' ||
                  this.fromscreen === 'RoPMVIEW') &&
                getpartdefectidArr.length > 1
              ) {
                this.getParts(
                  data.stationid,
                  data.equipmentid,
                  0,
                  data.runningHours,
                  data.partdefect,
                );
              }

              // Replacement PM
              else if (
                (this.fromscreen === 'RePM' ||
                  this.fromscreen === 'RePMVIEW') &&
                getpartdefectidArr.length > 1
              ) {
                this.getParts(
                  data.stationid,
                  data.equipmentid,
                  1,
                  data.runningHours,
                  data.partdefect,
                );
              }

              // No Part Defect
              else if (this.partdefect === '') {
                // Corrective Maintenance
                if (this.fromscreen === 'CM' || this.fromscreen === 'CMVIEW') {
                  this.getParts(
                    data.stationid,
                    data.equipmentid,
                    2,
                    data.runningHours,
                    data.partdefect,
                  );
                }

                // Routine PM
                else if (
                  this.fromscreen === 'RoPM' ||
                  this.fromscreen === 'RoPMVIEW'
                ) {
                  this.getParts(
                    data.stationid,
                    data.equipmentid,
                    0,
                    data.runningHours,
                    data.partdefect,
                  );
                }

                // Replacement PM
                else if (
                  this.fromscreen === 'RePM' ||
                  this.fromscreen === 'RePMVIEW'
                ) {
                  this.getParts(
                    data.stationid,
                    data.equipmentid,
                    1,
                    data.runningHours,
                    data.partdefect,
                  );
                }
              }
            }
          } else {
            // -----------------------------------------
            // Clear Data
            // -----------------------------------------

            this.generalArr = [];

            this.notificationstatus = '';
            this.notificationstatusid = '';
            this.notificationno = '';
            this.stationcode = '';
            this.notificationtype = '';
            this.breakdowncoding = '';
            this.maintenancetype = '';

            this.station = '';
            this.stationid = '';

            this.equipment = '';
            this.equipmentid = '';

            this.maximumrunninghours = '';
            this.runninghours = '';
            this.extendedmaximumrunninghours = '';

            this.partdefect = '';
            this.partdefectid = '';

            this.damage = '';
            this.damagesid = '';

            this.breakdowncauses = '';
            this.breakdowncausesid = '';

            this.remarks = '';
            this.createddatetime = '';

            this.activity = '';
            this.partreceiveddatetime = '';
            this.activitycompletiondatetime = '';

            this.carriedoutby = '';
            this.verifiedby = '';

            this.reportedby = '';

            this.authorizedby = '';
            this.authorizeddatetime = '';

            this.incharge = '';

            this.cmpartslistArr = [];
            this.ropmpartslistArr = [];
            this.repmpartslistArr = [];

            this.imagesArr = [];
          }
        },

        error: (error: any) => {
          if (error.name === 'TimeoutError' || error.status === 500) {
            this.toastService.error('Something went wrong...!');
          }
        },
      });
  }

  getParts(
    stationId: any,
    equipmentId: any,
    pvFlag: number,
    runningHours: any,
    partDefect: any,
  ): void {
    const req = {
      userid: this.UserContext.userId,
      departmentid: this.UserContext.departmentId,
      designationid: this.UserContext.designId,
      millcode: this.UserContext.millCode,
      id: this.params.id,
      partdefectid: this.partdefectid,
      stationid: stationId,
      equipment: equipmentId,
      pvflag: pvFlag,
      machinereplacementflag: this.machinereplacementFlag,
      language: this.LanguageService.getLanguage,
    };

    console.log('getParts Request:', req);

    this.MaintenanceService.getMultiPartDefectViewList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response?.httpcode != 200) {
            this.handlePartsError(pvFlag, runningHours, partDefect);
            return;
          }

          this.runninghours = '';
          this.partdefect = '';

          const parts = response?.data ?? [];

          this.setPartsList(pvFlag, parts);

          // Only Routine PM needs task status
          if (pvFlag === 0 && parts.length > 0) {
            this.getTaskStatus();
          }
        },

        error: (error: any) => {
          console.error('getParts API Error:', error);

          this.handlePartsError(pvFlag, runningHours, partDefect);

          if (error?.name === 'TimeoutError' || error?.status === 500) {
            this.toastService.error('Something went wrong...!');
          }
        },
      });
  }

  private setPartsList(pvFlag: number, parts: any[]): void {
    switch (pvFlag) {
      case 0:
        this.ropmpartslistArr = parts;
        break;

      case 1:
        this.repmpartslistArr = parts;
        break;

      default:
        this.cmpartslistArr = parts;
        break;
    }
  }

  private handlePartsError(
    pvFlag: number,
    runningHours: any,
    partDefect: any,
  ): void {
    this.runninghours = runningHours;
    this.partdefect = partDefect;

    this.setPartsList(pvFlag, []);
  }

  getTaskStatus(): void {
    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      machineid: this.item?.machineid || this.params?.machineid || '',
      part_id: this.item?.partdefectid || this.params?.partdefectid || '',
      stationid: this.item?.stationid || this.params?.stationid || '',
    };

    console.log('getTaskStatus - Request:', req);

    this.MaintenanceService.getPartTaskListFlag(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resultdata: any) => {
          if (resultdata?.httpcode === 200) {
            this.tasklistflag = 1;

            if (this.item?.statusId === '1' || this.item?.statusId === '10') {
              this.showtasklistonlyflag = 1;

              this.getTaskList();
            } else {
              this.showtasklistonlyflag = 0;
              this.tasklistArr = [];
            }
          } else {
            this.showtasklistonlyflag = 0;
            this.tasklistflag = 0;
            this.tasklistArr = [];
          }
        },

        error: (error: any) => {
          console.error('gettaskstatus API Error:', error);

          this.showtasklistonlyflag = 0;
          this.tasklistflag = 0;
          this.tasklistArr = [];

          if (error?.name === 'TimeoutError' || error?.status === 500) {
            this.toastService.error('Something went wrong...!');
          }
        },
      });
  }

  getTaskList(): void {
    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      machineid: this.item.machineid,
      part_id: this.item.partdefectid,
      stationid: this.item.stationid,
    };

    console.log('getTaskList Request:', req);

    this.MaintenanceService.getTaskDetails(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response?.httpcode !== 200) {
            this.tasklistArr = [];
            return;
          }

          this.tasklistArr = response?.data ?? [];

          if (!this.ropmpartslistArr?.length || !this.tasklistArr?.length) {
            return;
          }

          this.ropmpartslistArr.forEach((part: any) => {
            const taskData = this.tasklistArr.find(
              (task: any) => Number(task.partid) === Number(part.partid),
            );

            if (!taskData?.tasklistdata?.length) {
              return;
            }

            part.tasklist = taskData.tasklistdata.map((task: any) => ({
              maintenancetype: '',
              condition: '',
              damagetypeid: '',
              taskname: task.task_name,
              maintenancetypeid: '0',
              damagetype: '',
              taskid: task.task_id,
              remarks: '',
            }));
          });
        },

        error: (error: any) => {
          console.error('getTaskList API Error:', error);

          this.tasklistArr = [];

          if (error?.name === 'TimeoutError' || error?.status === 500) {
            this.toastService.error('Something went wrong...!');
          }
        },
      });
  }

  setNotificationStatusImage(statusId: any): void {
    this.notificationStatusImage =
      statusId === '1'
        ? 'assets/img/notificationcreated.png'
        : statusId === '7'
          ? 'assets/img/notificationclosed.png'
          : 'assets/img/notificationinprogress.png';
  }

  authorizenotification() {
    if (this.UserContext.designId != 2) {
      const remarks = this.remarksForm.value.ta_remarks;

      if (!remarks && remarks.trim() == '') {
        this.toastService.warning(
          this.translate.instant('SUPERVISORDASHBOARD.remarksmandatory'),
        );
        return;
      }
      this.isDisabled = true;

      let req = {
        user_id: this.UserContext.userId,
        millcode: this.UserContext.millCode,
        dept_id: this.UserContext.departmentId,
        design_id: this.UserContext.designId,
        stationid: this.stationid,
        equipment: this.equipmentid,
        maintanence_type: this.maintenancetypeid,
        part_defect: this.partdefectid,
        other_part_name: '',
        damage: this.damagesid,
        breakdown_cause: this.breakdowncausesid,
        cmflag: 0,
        id: this.notificationid,
        machinereplacementflag: this.machinereplacementFlag,
        language: this.LanguageService.getLanguage,
        remarks: this.remarksForm.value.ta_remarks,
      };

      console.log(req);

      this.MaintenanceService.formanCorrectiveMaintenanceVerify(req)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response: any) => {
            if (response.httpcode == 200) {
              this.isDisabled = false;

              this.toastService.success(
                this.translate.instant(
                  'MAINTENANCEACKNOWLEDGEMODAL.closedsuccess',
                ),
              );

              this.ModalController.dismiss({
                dismissed: true,
                item: 'Submitted',
              });
            } else {
              this.isDisabled = false;

              this.toastService.error(
                this.translate.instant(
                  'MAINTENANCEACKNOWLEDGEMODAL.closedfailed',
                ),
              );
            }
          },

          error: (error: any) => {
            console.error('error:', error);
          },
        });
    }

    if (this.UserContext.designId == 2) {
      if (this.rejectbtnflag == 1) {
        const remarks = this.rejectRemarksForm.value.ta_remarks;

        if (!remarks && remarks.trim() == '') {
          this.toastService.warning(
            this.translate.instant('SUPERVISORDASHBOARD.remarksmandatory'),
          );
          return;
        }
      }

      let extendedhourstoupdate = 1;
      let validationflag = false;
      let partsstatus = [];

      if (this.fromscreen == 'RePM') {
        for (let i = 0; i < this.repmpartslistArr.length; i++) {
          if (
            this.repmpartslistArr[i].updatebutton == 1 &&
            this.repmpartslistArr[i].extendedmaximumrunninghours == ''
          ) {
            validationflag = true;
          }
        }

        if (validationflag) {
          this.toastService.warning(
            this.translate.instant(
              'MAINTENANCENOTIFICATIONVIEW.extendhoursmandatory',
            ),
          );
          return;
        }

        if (!validationflag) {
          for (let i = 0; i < this.repmpartslistArr.length; i++) {
            if (this.repmpartslistArr[i].updatebutton == 1) {
              extendedhourstoupdate = 2;
            }

            let eachreq = {
              partid: this.repmpartslistArr[i].partid,
              replacestatus: this.repmpartslistArr[i].condition,
              lifetimerunninghours:
                this.repmpartslistArr[i].maximumrunninghours,
              currentrunninghours: this.repmpartslistArr[i].currentrunninghours,
              extendedmaxrunninghours:
                this.repmpartslistArr[i].extendedmaximumrunninghours,
              updatebutton: this.repmpartslistArr[i].updatebutton,
              notificationdetailid:
                this.repmpartslistArr[i].maintenance_notification_det_id,
            };

            partsstatus.push(eachreq);
          }
        }
      }

      let req = {
        user_id: this.UserContext.userId,
        millcode: this.UserContext.millCode,
        dept_id: this.UserContext.departmentId,
        design_id: this.UserContext.designId,
        stationid: this.stationid,
        equipment: this.equipmentid,
        maintanence_type: this.maintenancetypeid,
        part_defect: this.partdefectid,
        partsarray: JSON.stringify(partsstatus),
        other_part_name: '',
        damage: this.damagesid,
        breakdown_cause: this.breakdowncausesid,
        cmflag: 0,
        id: this.notificationid,
        extendrunninghoursflag: extendedhourstoupdate,
        machinereplacementflag: this.machinereplacementFlag,
        language: this.LanguageService.getLanguage,
        ...(this.rejectbtnflag == 1
          ? {
              deny_remarks: this.rejectRemarksForm.value.ta_remarks,
            }
          : {
              authorize_remarks: this.rejectRemarksForm.value.ta_remarks,
            }),
      };

      console.log(req);

      this.isDisabled = true;

      if (this.rejectbtnflag == 1) {
        // reject with remarks api

        this.MaintenanceService.denyWithRemarksApi(req)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (response: any) => {
              if (response.httpcode == 200) {
                this.toastService.success(
                  this.translate.instant('MAINTENANCEACKNOWLEDGEMODAL.success'),
                );

                this.ModalController.dismiss({
                  dismissed: true,
                  item: 'Submitted',
                });
              } else {
                this.toastService.error(
                  this.translate.instant('MAINTENANCEACKNOWLEDGEMODAL.failed'),
                );
              }
            },

            error: (error: any) => {
              console.error('error:', error);
            },
          });
      } else {
        // Acknowledge with remarks api

        this.MaintenanceService.updateCorrectiveMaintenanceAuthorize(req)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (response: any) => {
              if (response.httpcode == 200) {
                this.toastService.success(
                  this.translate.instant('MAINTENANCEACKNOWLEDGEMODAL.success'),
                );

                this.ModalController.dismiss({
                  dismissed: true,
                  item: 'Submitted',
                });
              } else {
                this.toastService.error(
                  this.translate.instant('MAINTENANCEACKNOWLEDGEMODAL.failed'),
                );
              }
            },

            error: (error: any) => {
              console.error('error:', error);
            },
          });
      }
    }
  }

  getTextColorForPriorityLevel(priorityId: any): string {
    // console.log(priorityId, typeof priorityId);
    if (priorityId == 1) {
      return '#9400D3'; // Critical
    } else if (priorityId == 2) {
      return '#cb4335'; // High
    } else if (priorityId == 3) {
      return '#008000'; // Medium
    } else if (priorityId == 4) {
      return '#03346E'; // Low
    } else {
      return '#000000';
    }
  }

  async callmodalcontroller(value: any) {
    const extendedrunninghoursmodal = await this.ModalController.create({
      component: ReplacementExtentedRunningHoursUpdatePage,
      componentProps: {
        station: this.station,
        machine: this.equipment,
        id: this.notificationno,
        item: JSON.stringify(value),
      },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: ['notification-modal'],
    });

    extendedrunninghoursmodal.onDidDismiss().then((modeldata) => {
      this.modal_extendedrunninghours = String(
        modeldata['data']['extendedrunninghours'],
      );

      if (this.modal_extendedrunninghours != '') {
        const index = this.repmpartslistArr.findIndex(
          (acc) => acc.partid === value.partid,
        );

        this.repmpartslistArr[index].extendedmaximumrunninghours =
          this.modal_extendedrunninghours;
      }
    });

    return await extendedrunninghoursmodal.present();
  }

  async AIView() {
    const modal = await this.ModalController.create({
      component: MaintenanceAiViewPage,
      componentProps: {
        item: JSON.stringify(this.params),
      },
      showBackdrop: true,
      backdropDismiss: false,
    });

    modal.onDidDismiss().then((modaldata) => {
      let getdata = modaldata['data']['item'];

      if (getdata != '') {
        //this.getAINewNotification(this.tabs_segment, true, "0");
      }
    });

    return await modal.present();
  }

  btn_view_images() {
    if (this.imagesArr.length > 0) {
      this.imageview = '';

      this.imageview = this.imagesArr.join('~');

      this.ViewImages(this.imageview);
    } else {
      this.imageview = '';

      if (this.imagesArr.length > 1) {
        this.toastService.error(
          this.translate.instant('HOURLYPRESSSTATIONSAVE.imagesnotfound'),
        );
      } else {
        this.toastService.error(
          this.translate.instant('HOURLYPRESSSTATIONSAVE.imagenotfound'),
        );
      }
    }
  }

  async ViewImages(images: any) {
    if (images != '') {
      const viewimagemodal = await this.ModalController.create({
        component: ImageSliderComponent,
        componentProps: {
          from: 'Alert',
          alertitem: images,
        },
      });

      viewimagemodal.onDidDismiss().then((data) => {});

      return await viewimagemodal.present();
    }
  }

  btn_close() {
    this.ModalController.dismiss({
      dismissed: true,
      item: '',
    });
  }
}
