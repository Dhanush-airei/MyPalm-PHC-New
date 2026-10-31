import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { UserProfileComponent } from 'src/app/shared/components/user-profile/user-profile.component';
import { MaintenanceService } from 'src/app/shared/services/maintenance-services/maintenance-service';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProductionFfbCageMillStopPage } from 'src/app/pages/production/supervisor/production-ffb-cage-mill-stop/production-ffb-cage-mill-stop.page';
import { ProductionFfbCageMillStartPage } from 'src/app/pages/production/supervisor/production-ffb-cage-mill-start/production-ffb-cage-mill-start.page';
import { ProductionBreakdownPage } from 'src/app/pages/production/supervisor/production-breakdown/production-breakdown.page';
import { ProductionMachineShutdownAlertModalPage } from 'src/app/pages/production/supervisor/production-machine-shutdown-alert-modal/production-machine-shutdown-alert-modal.page';
import { ProductionFfbCagePage } from 'src/app/pages/production/supervisor/production-ffb-cage/production-ffb-cage.page';
import { MaintenanceEngineerNotificationModalPage } from 'src/app/pages/maintenance/modal/maintenance-engineer-notification-modal/maintenance-engineer-notification-modal.page';
import { SummaryPopupModalPage } from 'src/app/pages/maintenance/modal/summary-popup-modal/summary-popup-modal.page';

@Component({
  selector: 'app-mill-production-status',
  templateUrl: './mill-production-status.component.html',
  styleUrls: ['./mill-production-status.component.scss'],
  standalone: false,
})
export class MillProductionStatusComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  productionflag = '0';
  breakdownflag = 0;
  millstartdatetime = '';
  millstopdatetime = '';
  transactionid = '';
  mill_startdatetime = '';
  mill_stopdatetime = '';
  breakdownreason = '';

  // FFB Cages
  ffbcageenableflag = 0;
  ffbtotal = '';
  ffbinuse = '';
  ffbnotinuse = '';
  ffbunderrepair = '';

  txt_millproductionstatus = '';
  txt_millstartstop = '';
  productionalerttitle = '';
  startalertmessage = '';
  stopalertmessage = '';
  breakdownalerttitle = '';
  breakdownalertmessage = '';
  reasonplaceholder = '';
  balancecropplaceholder = '';
  reasonalerttitle = '';
  reasonalertmessage = '';
  reasonalertplaceholder = '';
  sterilizerSensorFlag = this.UserContext.sterilizerSensorFlag;
  presssensorFlag = this.UserContext.pressSensorFlag;
  pleasewaitflag = false;
  stationlistArr: any = [];

  refreshflag = 0;
  filterstationsArr: any = [];
  stationsArr: any = [];
  previoushistoryArr = [];
  welcomemessage = '';
  searchedstationid = '';
  previoushistoryuienable = false;
  dashboardForm: any;
  productioncount = 0;
  millStartAndStop = 0;

  // =========================================================
  // NEW: Production In Progress Flag & Message
  // =========================================================
  productioninprogressflag: boolean = false;
  productioninprogressmessage: string = '';

  constructor(
    public UserContext: UserContext,
    private translate: TranslateService,
    private LanguageService: LanguageService,
    private alertController: AlertController,
    private MaintenanceService: MaintenanceService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private ModalController: ModalController,
  ) {}

  ngOnInit() {
    this.dashboardForm = this.fb.group({
      select_station: [''],
    });
  }

  loadInitialData() {
    this.getStation();
    this.getProductionStatus();
    this.getProductionStationNew();
    this.eligibleMillStartAndStop();
    this.eligibleSummaryPopup();
  }

  eligibleMillStartAndStop() {
    const eligibleDesignIds = [3];
    const eligible = eligibleDesignIds.includes(this.UserContext.designId);

    if (eligible) {
      this.millStartAndStop = 1;
    }
  }

  eligibleSummaryPopup() {
    const eligibleDesignIds = [2, 3, 4, 6];
    const eligible = eligibleDesignIds.includes(this.UserContext.designId);

    if (eligible) {
      this.summaryPopup();
    }
  }

  summaryPopup() {
    const request = {
      userid: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      departmentid: this.UserContext.departmentId,
      designationid: this.UserContext.designId,
      language: this.LanguageService.getLanguage,
    };

    this.MaintenanceService.getSummaryPopupFlag(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          console.log(response);

          if (response?.httpcode != 200) {
            return;
          }

          if (response?.popup != '1') {
            return;
          }

          const scheduledPopup = localStorage.getItem('scheduledpopup');

          // First time popup
          if (!scheduledPopup) {
            localStorage.setItem('scheduledpopup', this.getCurrentHour());

            this.openSummaryModal();
            return;
          }

          // Already popup shown
          const startDate = new Date(scheduledPopup);
          const endDate = new Date();

          const hoursDifference = this.diffHours(endDate, startDate);

          console.log('Scheduled Popup:', scheduledPopup);
          console.log('Hours Difference:', hoursDifference);
          console.log('Popup Duration:', response.popupduration);

          if (hoursDifference >= Number(response.popupduration)) {
            localStorage.setItem('scheduledpopup', this.getCurrentHour());

            this.openSummaryModal();
          }
        },

        error: (err) => {
          console.error('Summary Popup API Error:', err);
        },
      });
  }

  async openSummaryModal() {
    const modal = await this.ModalController.create({
      component: SummaryPopupModalPage,
      componentProps: {},
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: ['acknowledgement-modal'],
    });

    modal.onDidDismiss().then((modeldata: any) => {});

    return await modal.present();
  }

  getStation() {
    const request = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      language: this.LanguageService.getLanguage,
    };

    this.MaintenanceService.getStations(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log(response);
          if (response.httpcode == 200) {
            this.stationlistArr = response.data;
          } else {
            this.stationlistArr = [];
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private getCurrentHour(): string {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:00:00`;
  }

  private diffHours(endDate: Date, startDate: Date): number {
    const differenceInMilliseconds = endDate.getTime() - startDate.getTime();

    return differenceInMilliseconds / (1000 * 60 * 60);
  }

  getProductionStatus() {
    const request = {
      userid: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      departmentid: this.UserContext.departmentId,
      designationid: this.UserContext.designId,
      language: this.LanguageService.getLanguage,
    };

    this.MaintenanceService.getProductionStartStopStatus(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log(response);
          if (response.httpcode == 200) {
            this.transactionid = response.data[0].id;
            this.productionflag = response.data[0].status;
            this.breakdownflag = response.data[0].breakdownflag;

            this.mill_startdatetime = response.data[0].start_date;
            this.mill_stopdatetime = response.data[0].stop_date;

            this.millstartdatetime = response.data[0].mill_start_date;
            this.millstopdatetime = response.data[0].mill_stop_date;
            this.breakdownreason = response.data[0].breakdownreason;

            this.ffbcageenableflag = response.data[0].ffbcageenableflag;
            this.ffbtotal = response.data[0].ffbcagestotal;
            this.ffbinuse = response.data[0].ffbcagesinuse;
            this.ffbnotinuse = response.data[0].ffbcagesnotinuse;
            this.ffbunderrepair = response.data[0].ffbcagesunderrepair;

            this.productionalerttitle = response.productionalerttitle;
            this.startalertmessage = response.startalertmessage;
            this.stopalertmessage = response.stopalertmessage;
            this.breakdownalerttitle = response.breakdownalerttitle;
            this.breakdownalertmessage = response.breakdownalertmessage;
            this.reasonplaceholder = response.reasonplaceholder;
            this.balancecropplaceholder = response.balancecropplaceholder;
            this.reasonalerttitle = response.reasonalerttitle;
            this.reasonalertmessage = response.reasonalertmessage;
            this.reasonalertplaceholder = response.reasonplaceholder;

            if (this.productionflag == '1') {
              this.txt_millproductionstatus = this.translate.instant(
                'MAINTENANCEDASHBOARD.inoperation',
              );

              this.txt_millstartstop = this.translate.instant(
                'MAINTENANCEDASHBOARD.millstartdatetime',
              );
            } else if (this.productionflag == '0') {
              if (this.breakdownflag == 1) {
                this.txt_millproductionstatus = this.translate.instant(
                  'MAINTENANCEDASHBOARD.stoppedoperation',
                );

                this.txt_millstartstop = this.translate.instant(
                  'MAINTENANCEDASHBOARD.stoppedbreakdownoperation',
                );
              } else {
                this.txt_millproductionstatus = this.translate.instant(
                  'MAINTENANCEDASHBOARD.stoppedoperation',
                );

                this.txt_millstartstop = this.translate.instant(
                  'MAINTENANCEDASHBOARD.millstopdatetime',
                );
              }
            }
          } else {
            this.productionflag = '0';

            this.productionalerttitle = 'Amaran';
            this.startalertmessage =
              'Dengan menekan butang hijau anda mengesahkan bahawa operasi kilang akan dimulakan.';
            this.stopalertmessage =
              'Dengan menekan butang merah anda mengesahkan bahawa operasi kilang akan diberhentikan.';
            this.breakdownalerttitle = 'Amaran';
            this.breakdownalertmessage = 'Sila masukkan sebab breakdown';
            this.reasonplaceholder = 'Sebab Kerosakan';
            this.balancecropplaceholder = 'Tanaman Imbangan';
            this.reasonalerttitle = 'Masukkan sebab';
            this.reasonalertmessage = 'Sila berikan sebab untuk menghentikan';
            this.reasonalertplaceholder = 'sebab';
          }
        },
        error: (err) => {
          console.error('Change Password Error:', err);
        },
      });
  }

  getMillBackGroundColor(status: any) {
    let color;

    if (status == '0') {
      color = '#CB4335';
    } else if (status == '1') {
      color = '#008000';
    } else {
      color = '#ff9f0c';
    }

    return color;
  }

  onChangeStation() {
    this.searchedstationid = this.dashboardForm.value.select_station;

    var item = this.filterstationsArr.filter(
      (item: any) => item.stationid === parseInt(this.searchedstationid),
    );

    if (this.searchedstationid == '') {
      this.stationsArr = this.filterstationsArr;
    } else {
      this.stationsArr = item;
    }

    console.log(this.searchedstationid);
  }

  refreshRecords() {
    this.refreshflag = 1;
    this.loadInitialData();
  }

  getProductionStationNew() {
    let req = {
      userid: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      departmentid: this.UserContext.departmentId,
      designationid: this.UserContext.designId,
      language: this.LanguageService.getLanguage,
      refresh: this.refreshflag,
    };
    this.pleasewaitflag = true;
    this.MaintenanceService.getProductionStationNew(req)
      .pipe(
        finalize(() => {
          this.pleasewaitflag = false;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => {
          console.log(response);

          // =========================================================
          // HANDLE HTTP 200 - NORMAL FLOW
          // =========================================================
          if (response.httpcode == 200) {
            // Reset the in-progress flag when we get a valid 200
            this.productioninprogressflag = false;
            this.productioninprogressmessage = '';

            if (this.refreshflag == 1) {
              this.refreshflag = 0;
            }
            this.stationsArr = response.data;

            this.filterstationsArr = this.stationsArr;
            var item = this.filterstationsArr.filter(
              (item: any) =>
                item.stationid === parseInt(this.searchedstationid),
            );

            if (this.searchedstationid == '') {
              this.stationsArr = this.filterstationsArr;
            } else {
              this.stationsArr = item;
            }
            if (this.productionflag == '1') {
              this.previoushistoryuienable = false;

              this.welcomemessage = this.translate.instant(
                'SUPERVISORDASHBOARD.productionstarted',
              );
            } else {
              this.welcomemessage = this.translate.instant(
                'SUPERVISORDASHBOARD.productionstopped',
              );

              this.previoushistoryuienable = false;
            }
          } else if (response.httpcode == 201) {
            console.log('Production Station New -> Production In Progress');

            // Set the flag to show only the centered message
            this.productioninprogressflag = true;

            // Set the message from API response, or use a default translated message
            this.productioninprogressmessage =
              response.message ||
              response.productioninprogressmessage ||
              this.translate.instant(
                'MAINTENANCEDASHBOARD.productioninprogress',
              );

            // // Clear station arrays
            // this.stationsArr = [];
            // this.filterstationsArr = [];

            // Reset refresh flag
            if (this.refreshflag == 1) {
              this.refreshflag = 0;
            }
          } else {
            // =========================================================
            // HANDLE OTHER STATUS CODES
            // =========================================================
            this.productioninprogressflag = false;
            this.productioninprogressmessage = '';

            this.stationsArr = [];

            this.filterstationsArr = this.stationsArr;

            this.pleasewaitflag = false;
          }
        },
        error: (err) => {
          console.error(err);
          this.productioninprogressflag = false;
          this.productioninprogressmessage = '';
        },
      });
  }

  async confirmStation(
    stationId: number,
    stationName: string,
    stationStatus: number,
  ): Promise<void> {
    let alertMessage = '';

    if (stationStatus === 0) {
      alertMessage =
        this.translate.instant('SUPERVISORDASHBOARD.themachineriesunder') +
        stationName +
        this.translate.instant('SUPERVISORDASHBOARD.machineoff');
    } else {
      alertMessage =
        this.translate.instant('SUPERVISORDASHBOARD.machinealert') +
        stationName +
        '?';
    }

    const alert = await this.alertController.create({
      mode: 'md',
      header: this.translate.instant('SUPERVISORDASHBOARD.machineheader'),
      message: alertMessage,
      cssClass: 'customalertmessagetwobuttons',
      backdropDismiss: false,

      buttons: [
        {
          text: '',
          role: 'cancel',
          cssClass: 'cancelbutton',
        },
        {
          text: '',
          cssClass: 'okaybutton',
          handler: () => {
            this.startStopMachines(stationId, stationName, stationStatus);
          },
        },
      ],
    });

    await alert.present();
  }

  startStopMachines(
    stationId: any,
    stationName: any,
    stationStatus: any,
  ): void {
    const productionStatus = Number(stationStatus) == 0 ? 1 : 0;

    const request = {
      userid: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      departmentid: this.UserContext.departmentId,
      designationid: this.UserContext.designId,
      productionstatus: productionStatus,
      stationid: stationId,
      language: this.LanguageService.getLanguage,
    };

    this.pleasewaitflag = true;

    this.MaintenanceService.machineryStartStop(request)
      .pipe(
        finalize(() => {
          this.pleasewaitflag = false;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response: any) => {
          if (response?.httpcode == 200) {
            const message =
              productionStatus === 1
                ? stationName +
                  this.translate.instant(
                    'SUPERVISORDASHBOARD.startedsuccessfully',
                  )
                : stationName +
                  this.translate.instant(
                    'SUPERVISORDASHBOARD.stoppedsuccessfully',
                  );

            this.toastService.success(message);
            this.getProductionStationNew();
          } else {
            this.toastService.error(
              this.translate.instant(
                'SUPERVISORDASHBOARD.productionstartfailed',
              ),
            );
          }
        },

        error: (error: any) => {
          console.error('Start/Stop production station error:', error);

          this.toastService.error(
            this.translate.instant('SUPERVISORDASHBOARD.productionstartfailed'),
          );
        },
      });
  }

  btn_Action(stationid: string, stationname: string, item: any): void {
    if (this.UserContext.designId == 3) {
      if (item.breakdownstatus == 0) {
        this.popupmodalcontroller(stationid, stationname, item);
      } else {
        this.alreadybreakdownalert(stationid, stationname, item);
      }
    } else {
      if (item.breakdownstatus != 0) {
        this.toastService.warning(
          this.translate.instant('SUPERVISORDASHBOARD.machineisunderbreakdown'),
        );
        return;
      }

      this.openMachineBreaKDownModal(item);
    }
  }

  async popupmodalcontroller(
    getstationid: any,
    getstationname: any,
    value: any,
  ): Promise<any> {
    const modal = await this.ModalController.create({
      component: ProductionMachineShutdownAlertModalPage,
      componentProps: {
        item: JSON.stringify(value),
        stationid: getstationid,
        stationname: getstationname,
        millstatus: this.productionflag,
        module: 'CM',
      },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: ['acknowledgement-modal'],
    });

    modal.onDidDismiss().then((modeldata: any) => {
      const {
        breakdown_id: breakdownid,
        maintenancetype_id: maintenancetypeid,
        part_id: partid,
        otherpart_name: otherpartname,
        breakdowncauses_id: breakdowncauses,
        breakdownremarks,
        notinuseremarks,
      } = modeldata?.data ?? {};

      if (
        breakdownid !== undefined &&
        maintenancetypeid !== undefined &&
        partid !== undefined &&
        breakdowncauses !== undefined
      ) {
        this.problemalertmessage(
          getstationid,
          getstationname,
          value,
          breakdownid,
          maintenancetypeid,
          partid,
          otherpartname,
          breakdowncauses,
          breakdownremarks,
          notinuseremarks,
        );
      }
    });

    return await modal.present();
  }

  async problemalertmessage(
    station_id: any,
    station_name: any,
    value: any,
    breakdown_id: any,
    maintenancetype_id: any,
    part_id: any,
    otherpart_name: any,
    breakdown_causes: any,
    breakdown_remarks: any,
    notinuse_remarks: any,
  ): Promise<void> {
    if (breakdown_id == 1 || breakdown_id == 2) {
      const alertmessage =
        this.translate.instant(
          'SUPERVISORDASHBOARD.correctivemaintenancecreated',
        ) + value.machinename;

      const alert = await this.alertController.create({
        mode: 'md',
        header: this.translate.instant('SUPERVISORDASHBOARD.reportsubmitted'),
        cssClass: 'customalertmessageonebuttons',
        message: alertmessage,
        backdropDismiss: false,
        buttons: [
          {
            text: '',
            handler: () => {
              this.updateMachineStatus(
                station_id,
                station_name,
                value,
                breakdown_id,
                maintenancetype_id,
                part_id,
                otherpart_name,
                breakdown_causes,
                breakdown_remarks,
                notinuse_remarks,
              );
            },
          },
        ],
      });

      await alert.present();
    } else if (breakdown_id == 0 || breakdown_id == 3) {
      this.updateMachineStatus(
        station_id,
        station_name,
        value,
        breakdown_id,
        maintenancetype_id,
        part_id,
        otherpart_name,
        breakdown_causes,
        breakdown_remarks,
        notinuse_remarks,
      );
    }
  }

  updateMachineStatus(
    stationid: any,
    stationname: any,
    item: any,
    getproblem: any,
    getmaintenancetype: any,
    getpart: any,
    getotherpartname: any,
    getbreakdowncauses: any,
    getbreakdownremarks: any,
    getnotinuseremarks: any,
  ): void {
    const currentmachinestatus = item.machinestatus == 0 ? 1 : 0;
    const settype = this.productionflag == '1' ? '1' : '6';

    this.pleasewaitflag = true;

    const req = {
      userid: this.UserContext.userId,
      departmentid: this.UserContext.departmentId,
      designationid: this.UserContext.designId,
      millcode: this.UserContext.millCode,
      stationid: item.stationid,
      machineid: item.machineid,
      machinestatus: Number(currentmachinestatus),
      reason: getproblem,
      maintenancetype: getmaintenancetype,
      part_defect: getpart,
      other_part_name: getotherpartname,
      breakdown_cause: getbreakdowncauses,
      remarks: getbreakdownremarks,
      notinuseremarks: getnotinuseremarks,
      language: this.LanguageService.getLanguage,
      type: settype,
      ffbcagestatus: item.ffbcageflag,
      millstatus: this.productionflag,
    };

    console.log(req);

    this.MaintenanceService.saveMachineStatus(req)
      .pipe(
        finalize(() => {
          this.pleasewaitflag = false;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response: any) => {
          if (response?.httpcode == 200) {
            this.refreshFFBStatus();
            this.getProductionStationNew();
          } else if (response?.httpcode == 401) {
            this.alreadybreakdownalert(stationid, stationname, item);
          }
        },
        error: (err: any) => {
          console.error('saveMachineStatus failed', err);
          this.alreadybreakdownalert(stationid, stationname, item);
        },
      });
  }

  refreshFFBStatus() {
    let request = {
      userid: this.UserContext.userId,
      departmentid: this.UserContext.departmentId,
      designationid: this.UserContext.designId,
      millcode: this.UserContext.millCode,
      language: this.LanguageService.getLanguage,
    };

    this.MaintenanceService.getProductionStartStopStatus(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log(response);
          if (response.httpcode == 200) {
            this.ffbtotal = response.data[0].ffbcagestotal;
            this.ffbinuse = response.data[0].ffbcagesinuse;
            this.ffbnotinuse = response.data[0].ffbcagesnotinuse;
            this.ffbunderrepair = response.data[0].ffbcagesunderrepair;
          } else {
            this.ffbtotal = '';
            this.ffbinuse = '';
            this.ffbnotinuse = '';
            this.ffbunderrepair = '';
          }
          this.getProductionStationNew();
        },
        error: (err) => {
          console.error('Change Password Error:', err);
        },
      });
  }

  async alreadybreakdownalert(
    stationid: any,
    stationname: any,
    item: any,
  ): Promise<void> {
    const machine = item.machinename;
    const alertmessage =
      machine +
      this.translate.instant(
        'SUPERVISORDASHBOARD.alreadybreakdownalertmessage',
      );

    const alert = await this.alertController.create({
      mode: 'md',
      header: this.translate.instant(
        'SUPERVISORDASHBOARD.alreadybreakdownalerttitle',
      ),
      cssClass: 'customalertmessageonebuttons',
      message: alertmessage,
      buttons: [
        {
          text: '',
          handler: () => {
            //console.log("Confirm Okay");
          },
        },
      ],
    });

    await alert.present();
  }

  async openMachineBreaKDownModal(value: any) {
    const modal = await this.ModalController.create({
      component: MaintenanceEngineerNotificationModalPage,
      componentProps: {
        item: JSON.stringify(value),
        module: 'MAINTENANCE',
      },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: ['acknowledgement-modal'],
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    const getdata = data?.item;
    const notificationdata = data?.notificationdata;
    console.log('notificationdata');
    console.log(notificationdata);
    if (getdata != '') {
      this.correctivemaintenanceAlert(notificationdata, value);
    }
  }

  async correctivemaintenanceAlert(notificationvalue: any, value: any) {
    console.log(notificationvalue);
    var alertmessage =
      this.translate.instant(
        'SUPERVISORDASHBOARD.correctivemaintenancecreated',
      ) + value.machinename;

    const alert = await this.alertController.create({
      mode: 'md',
      header: this.translate.instant('SUPERVISORDASHBOARD.reportsubmitted'),
      cssClass: 'customalertmessageonebuttons',
      message: alertmessage,
      backdropDismiss: false,
      buttons: [
        {
          text: '',
          handler: () => {
            this.createCorrectiveMaintenance(notificationvalue);
          },
        },
      ],
    });

    await alert.present();
  }

  createCorrectiveMaintenance(value: any) {
    this.pleasewaitflag = true;

    var req = {
      userid: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      id: 0,
      stationid: value.stationid,
      equipment: value.equipment,
      problem: '',
      notificationnumber: value.notificationnumber,
      malfunctionstarttime: '',
      malfunctionstoptime: '',
      notificationtype: '',
      breakdown_coding: value.breakdown_coding,
      maintanence_type: value.maintanence_type,
      part_defect: value.part_defect,
      other_partdefectflag: '',
      other_part_name: value.other_part_name,
      damage: '',
      breakdown_cause: value.breakdown_cause,
      activity: '',
      other_activity_name: '',
      operation: '',
      carryoutby: '',
      materialid: '',
      quantity: '',
      assignedto: '',
      workassignedto: value.workassignedto,
      pvflag: 0,
      remarks: value.remarks,
      ffbcagestatus: value.ffbcagestatus,
      language: this.LanguageService.getLanguage,
      priority_level: value.priority_level,
    };

    console.log(req);

    this.MaintenanceService.saveMaintenanceNotification(req)
      .pipe(
        finalize(() => {
          this.pleasewaitflag = false;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response: any) => {
          if (response?.httpcode == 200) {
            this.getProductionStationNew();
          } else {
            this.toastService.error(
              this.translate.instant(
                'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.failed',
              ),
            );
          }
          this.loadInitialData();
        },
        error: (err: any) => {
          console.error('saveMaintenanceNotification failed', err);
          this.toastService.error(
            this.translate.instant(
              'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.failed',
            ),
          );
          this.loadInitialData();
        },
      });
  }

  getBackGroundColor(machinestatus: any, breakdownstatus: any) {
    let color;

    if (machinestatus == '0') {
      if (breakdownstatus == '0') {
        color = '#4d4d4d';
      } else {
        color = '#CB4335';
      }
    } else if (machinestatus == '1') {
      color = '#008000';
    } else if (machinestatus == '2') {
      color = '#ff9f0c';
    } else {
      color = '#4d4d4d';
    }

    return color;
  }

  getStatusTextColor(status: any) {
    let color;
    if (status == '1') {
      color = '#ffffff';
    } else if (status == '0') {
      color = '#ffffff';
    } else {
      color = '#000000';
    }

    return color;
  }

  async ffbcageModalController() {
    const modal = await this.ModalController.create({
      component: ProductionFfbCagePage,
      componentProps: {
        ffbcagetotal: this.ffbtotal,
        ffbcageinuse: this.ffbinuse,
        ffbcagenotinuse: this.ffbnotinuse,
        ffbcageunderrepair: this.ffbunderrepair,
        millstatus: this.productionflag,
      },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: ['ffbcagepopup-modal'],
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    const getdata = data?.item;

    if (getdata != '') {
      this.loadInitialData();
    }
  }

  confirmProduction(value: any) {
    let alertmessage = '';

    console.log('ffbcageenableflag', this.ffbcageenableflag);
    console.log('value', value);

    if (this.ffbcageenableflag == 1) {
      if (value == 0) {
        this.ffbcagemodalcontroller_millstart();
      } else {
        this.ffbcagemodalcontroller_millstop();
      }
    } else {
      if (value == 0) {
        alertmessage = this.startalertmessage;
      } else {
        alertmessage = this.stopalertmessage;
      }

      this.alertController
        .create({
          mode: 'md',
          message: alertmessage,
          cssClass: 'millstartstopalertmessagetwobuttons',
          backdropDismiss: false,
          buttons: [
            {
              text: '',
              cssClass: 'cancelbutton',
              handler: () => {
                //console.log("Cancel");
              },
            },
            {
              text: '',
              handler: (data: any) => {
                this.startstopProduction('');
              },
            },
          ],
        })
        .then((res) => {
          res.present();
        });
    }
  }

  async ffbcagemodalcontroller_millstart() {
    const modal = await this.ModalController.create({
      component: ProductionFfbCageMillStartPage,
      componentProps: {
        title: this.stopalertmessage,
        millstatus: this.productionflag,
      },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: ['ffbcagepopup-millstop-modal'],
    });

    modal.onDidDismiss().then((modalData) => {
      const getData = modalData?.data?.item;

      console.log(getData);

      if (getData != '') {
        this.startstopProduction('');
      }
    });

    await modal.present();
  }

  async ffbcagemodalcontroller_millstop() {
    const modal = await this.ModalController.create({
      component: ProductionFfbCageMillStopPage,
      componentProps: {
        title: this.stopalertmessage,
        millstatus: this.productionflag,
      },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: ['ffbcagepopup-millstop-modal'],
    });

    modal.onDidDismiss().then((modalData) => {
      const getData = modalData?.data?.item;

      console.log(getData);

      if (getData != '') {
        this.startstopProduction('');
      }
    });

    await modal.present();
  }

  saveFFBCages(
    gettotal: any,
    getinuse: any,
    getnotinuse: any,
    getunderrepair: any,
    refresh: any,
  ) {
    var req = {
      userid: this.UserContext.userId,
      departmentid: this.UserContext.departmentId,
      designationid: this.UserContext.designId,
      millcode: this.UserContext.millCode,
      total: gettotal,
      inuse: getinuse,
      notinuse: getnotinuse,
      underrepair: getunderrepair,
      language: this.LanguageService.getLanguage,
      isrefresh: refresh,
    };

    console.log(req);

    this.MaintenanceService.saveffbcages(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          const resultdata: any = result;

          if (resultdata.httpcode == 200) {
            if (refresh == 1) {
              this.startstopProduction('');
            } else {
              this.getProductionStatus();
            }
          } else {
            if (refresh == 1) {
              this.startstopProduction('');
            } else {
              this.getProductionStatus();
            }
          }
        },

        error: (error) => {
          console.error('Save FFB Cages Error:', error);
        },
      });
  }

  startstopProduction(getbalancecrop: any) {
    if (this.productionflag == '0' || this.productionflag == '') {
      this.productioncount = 1;
    }

    if (this.productionflag == '1') {
      this.productioncount = 0;
    }

    this.pleasewaitflag = true;

    var req = {
      userid: this.UserContext.userId,
      departmentid: this.UserContext.departmentId,
      designationid: this.UserContext.designId,
      millcode: this.UserContext.millCode,
      productionstatus: this.productioncount,
      balanceCrop: getbalancecrop,
      language: this.LanguageService.getLanguage,
    };

    console.log(req);

    this.MaintenanceService.startstopProduction(req)
      .pipe(
        finalize(() => {
          this.pleasewaitflag = false;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result: any) => {
          const resultdata: any = result;

          if (resultdata.httpcode == 200) {
            this.getProductionStationNew();
            if (this.productioncount == 1) {
              this.toastService.success(
                this.translate.instant(
                  'SUPERVISORDASHBOARD.productionstartedsuccessfully',
                ),
              );
            } else {
              this.toastService.success(
                this.translate.instant(
                  'SUPERVISORDASHBOARD.productionstoppedsuccessfully',
                ),
              );
            }

            this.getProductionStatus();
          } else {
            this.toastService.error(
              this.translate.instant(
                'SUPERVISORDASHBOARD.productionstartfailed',
              ),
            );

            this.pleasewaitflag = false;
          }
        },

        error: (error: any) => {
          console.error('Start/Stop Production Error:', error);
          this.pleasewaitflag = false;
        },
      });
  }

  async breakdownalert() {
    let alertmessage = this.breakdownalertmessage;

    const modal = await this.ModalController.create({
      component: ProductionBreakdownPage,
      componentProps: {
        title: this.breakdownalerttitle,
        message: alertmessage,
        placeholder: this.reasonplaceholder,
      },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: ['ffbcagepopup-millstop-modal'],
    });

    modal.onDidDismiss().then((modalData) => {
      const getData = modalData?.data?.item;

      console.log(getData);

      if (getData != '') {
        this.startstopProduction('');
      }
      this.getProductionStationNew();
    });

    await modal.present();
  }

  saveBreakDown(getreason: any, getbalancecrop: any) {
    const req = {
      user_id: this.UserContext.userId,
      departmentid: this.UserContext.departmentId,
      designationid: this.UserContext.designId,
      millcode: this.UserContext.millCode,
      remarks: getreason,
      balanceCrop: getbalancecrop,
      language: this.LanguageService.getLanguage,
    };

    this.MaintenanceService.saveBreakDownStatus(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          const resultdata: any = result;

          if (resultdata.httpcode == 200) {
            this.toastService.success(
              this.translate.instant(
                'SUPERVISORDASHBOARD.breakdownsavedsuccessfully',
              ),
            );

            this.getProductionStatus();
          } else {
            this.toastService.error(
              this.translate.instant(
                'SUPERVISORDASHBOARD.breakdownsavingfailed',
              ),
            );
          }
        },

        error: (error) => {
          console.error('Save Breakdown Status Error:', error);
        },
      });
  }
}
