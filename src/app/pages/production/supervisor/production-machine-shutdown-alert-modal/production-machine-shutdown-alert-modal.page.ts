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
  selector: 'app-production-machine-shutdown-alert-modal',
  templateUrl: './production-machine-shutdown-alert-modal.page.html',
  styleUrls: ['./production-machine-shutdown-alert-modal.page.scss'],
  standalone: false,
})
export class ProductionMachineShutdownAlertModalPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  breakdownForm: any;

  params: any;
  module = '';
  millproductionFlag = '';
  title = '';

  breakdownArr: any[] = [];
  maintenancetypeArr: any[] = [];
  breakdowncausesArr: any[] = [];

  // Flags
  breakdownFlag = false;
  isDisabled = false;
  correctivemaintenanceraiseFlag = false;
  step1completedFlag = false;
  step2completedFlag = false;
  step3completedFlag = false;
  step4completedFlag = false;
  otherFlag = false;

  // Variables
  getstationid = '';
  getstationname = '';

  getmachineid = '';
  getmachinename = '';
  getmachinestatus = '';

  notificationno = '';
  breakdownid = '';
  breakdownvalue = '';

  maintenancetypeid = '';
  maintenancetypevalue = '';

  breakdowncausesid = '';
  breakdowncausesvalue = '';
  breakdowncausesidArr: any[] = [];
  breakdowncausesvalueArr: any[] = [];

  partid = '';
  partvalue = '';
  partidArr: any[] = [];
  partvalueArr: any[] = [];

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
    const viewform = this.navParams.get('item');
    this.params = JSON.parse(viewform);
    this.module = this.navParams.get('module');
    this.millproductionFlag = this.navParams.get('millstatus');

    this.getstationid = this.params.stationid;
    this.getstationname = this.params.stationname;

    this.getmachineid = this.params.machineid;
    this.getmachinename = this.params.machinename;
    this.getmachinestatus = this.params.machinestatus;

    console.log(this.params);

    this.title = this.getstationname;

    this.breakdownForm = this.fb.group({
      select_breakdown: new FormControl('', Validators.required),
      select_maintenancetype: new FormControl(''),
      txt_partname: new FormControl(''),
      select_breakdowncauses: new FormControl(''),
      ta_remarks: new FormControl(''),
    });

    console.log(
      `${this.correctivemaintenanceraiseFlag} correctivemaintenanceraiseFlag`,
    );
  }

  ngOnInit() {}
  ngAfterViewInit(): void {
    this.getBreakdown();
  }

  getStatusColor(type: any): string {
    const flagByStep: Record<string, boolean> = {
      STEP1: this.step1completedFlag,
      STEP2: this.step2completedFlag,
      STEP3: this.step3completedFlag,
      STEP4: this.step4completedFlag,
    };

    return flagByStep[type] ? '#008000' : '#ff0000';
  }

  getBreakdown(): void {
    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      type: this.millproductionFlag,
      machinestatus: this.getmachinestatus,
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

          this.getBreakDownCauses();
        },
        error: (err: any) => {
          console.error('getMaintenanceTypeList failed', err);
          this.maintenancetypeArr = [];
          this.getBreakDownCauses();
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

  breakdownhandleChange(e: any): void {
    const value = e.detail.value;

    if (value.length > 0) {
      this.breakdownid = JSON.parse(value).id;
      this.breakdownvalue = JSON.parse(value).breakdownCoding;

      if (this.breakdownid == '0') {
        this.step1completedFlag = false;
        this.correctivemaintenanceraiseFlag = false;
      } else {
        this.step1completedFlag = true;
        this.correctivemaintenanceraiseFlag = true;

        this.getMaintenancetype();
      }
    } else {
      this.breakdownid = '';
      this.breakdownvalue = '';

      this.step1completedFlag = false;
      this.correctivemaintenanceraiseFlag = false;
    }
  }

  onConditionOptionChange(value: any): void {
    this.breakdownid = String(value.id);
    this.breakdownvalue = value.breakdownCoding;

    if (this.breakdownid == '0') {
      this.step1completedFlag = false;
      this.correctivemaintenanceraiseFlag = false;

      if (this.millproductionFlag == '1') {
        if (this.getmachinestatus == '0') {
          this.longtimenotinusealertmessage();
        } else {
          this.shottermnotinusealert();
        }
      } else {
        this.longtimenotinusealertmessage();
      }
    } else if (this.breakdownid == '3') {
      this.step1completedFlag = false;
      this.correctivemaintenanceraiseFlag = false;

      this.longtimenotinusealertmessage();
    } else {
      this.step1completedFlag = true;
      this.correctivemaintenanceraiseFlag = true;

      this.getMaintenancetype();
    }
  }

  maintenancetypehandleChange(e: any): void {
    const value = e.detail.value;

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

  breakdowncauseshandleChange(e: any): void {
    const value = e.detail.value;

    if (value.length > 0) {
      this.breakdowncausesidArr = value.map((v: any) => JSON.parse(v).cause_id);
      this.breakdowncausesvalueArr = value.map(
        (v: any) => JSON.parse(v).BreakdownCause,
      );

      this.breakdowncausesid = this.breakdowncausesidArr.join(',');
      this.breakdowncausesvalue = this.nl2br(
        this.breakdowncausesvalueArr.join(', '),
      );

      this.step4completedFlag = true;
      this.getStatusColor('STEP4');
    } else {
      this.breakdowncausesidArr = [];
      this.breakdowncausesvalueArr = [];
      this.breakdowncausesid = '';
      this.breakdowncausesvalue = '';

      this.step4completedFlag = false;
      this.getStatusColor('STEP4');
    }
  }

  async longtimenotinusealertmessage(): Promise<void> {
    let alertmessage = '';

    if (this.getmachinestatus == '0') {
      alertmessage =
        this.translate.instant('SUPERVISORDASHBOARD.turnonmachine') +
        this.getmachinename +
        '?';
    } else {
      alertmessage =
        this.translate.instant('SUPERVISORDASHBOARD.successfullyturnoff') +
        this.getmachinename +
        '?';
    }

    const alert = await this.alertController.create({
      mode: 'md',
      header: '',
      cssClass: 'customalertmessagetwobuttons',
      message: alertmessage,
      backdropDismiss: false,
      animated: true,
      buttons: [
        {
          text: '',
          cssClass: 'cancelbutton',
          handler: () => {},
        },
        {
          text: '',
          cssClass: 'okaybutton',
          handler: () => {
            this.save('');
          },
        },
      ],
    });

    await alert.present();
  }

  async shottermnotinusealert(): Promise<void> {
    const alertmessage =
      this.translate.instant('SUPERVISORDASHBOARD.successfullyturnoff') +
      this.getmachinename +
      '?';

    const alert = await this.alertController.create({
      mode: 'md',
      header: '',
      cssClass: 'customalertmessagetwobuttons',
      message: alertmessage,
      backdropDismiss: false,
      animated: true,
      inputs: [
        {
          name: 'reason',
          type: 'textarea',
          cssClass: 'alertinput',
          placeholder:
            this.translate.instant('SUPERVISORDASHBOARD.enterremarks') +
            ' (' +
            this.translate.instant('SUPERVISORDASHBOARD.optional') +
            ')',
        },
      ],
      buttons: [
        {
          text: '',
          cssClass: 'cancelbutton',
          handler: () => {},
        },
        {
          text: '',
          handler: (data: any) => {
            this.save(data.reason !== '' ? data.reason : '');
          },
        },
      ],
    });

    await alert.present();
  }

  save(getremarks: any): void {
    let partid: any[] = [];
    let partvalue: any[] = [];
    let otherpartname: any[] = [];

    if (this.correctivemaintenanceraiseFlag) {
      if (this.breakdownid == '') {
        this.ToastService.warning(
          this.translate.instant('SUPERVISORDASHBOARD.problemmandatory'),
        );
        return;
      }

      if (this.breakdownForm.value.select_maintenancetype == '') {
        this.ToastService.warning(
          this.translate.instant(
            'MAINTENANCEACKNOWLEDGEMODAL.maintenancetypeselection',
          ),
        );
        return;
      }

      if (this.partidArr.length <= 0) {
        if (this.module === 'CM') {
          this.ToastService.warning(
            this.translate.instant(
              'MAINTENANCEACKNOWLEDGEMODAL.partdefectmandatory',
            ),
          );
        } else if (this.module === 'RoPM') {
          this.ToastService.warning(
            this.translate.instant('MAINTENANCEACKNOWLEDGEMODAL.partselection'),
          );
        } else if (this.module === 'RePM') {
          this.ToastService.warning(
            this.translate.instant(
              'MAINTENANCEACKNOWLEDGEMODAL.partreplacedselection',
            ),
          );
        } else {
          this.ToastService.warning(
            this.translate.instant('MAINTENANCEACKNOWLEDGEMODAL.partselection'),
          );
        }

        return;
      }

      if (this.breakdownForm.value.select_breakdowncauses === '') {
        this.ToastService.warning(
          this.translate.instant(
            'MAINTENANCEACKNOWLEDGEMODAL.breakdowncausesselection',
          ),
        );
        return;
      }

      // Maintenance Type
      this.maintenancetypeid = JSON.parse(
        this.breakdownForm.value.select_maintenancetype,
      ).id;

      this.maintenancetypevalue = JSON.parse(
        this.breakdownForm.value.select_maintenancetype,
      ).maintanence_type;

      // Part
      for (let i = 0; i < this.partidArr.length; i++) {
        if (this.partidArr[i] == 0) {
          otherpartname.push(this.partvalueArr[i]);
        } else {
          partid.push(this.partidArr[i]);
        }
      }

      partvalue.push(this.partvalueArr);
    } else {
      if (this.breakdownid == '') {
        this.ToastService.warning(
          this.translate.instant('SUPERVISORDASHBOARD.problemmandatory'),
        );
        return;
      }

      this.maintenancetypeid = '';
      this.maintenancetypevalue = '';

      partid = [];
      partvalue = [];
      otherpartname = [];

      this.breakdowncausesidArr = [];
      this.breakdowncausesvalueArr = [];
    }

    this.modalController.dismiss({
      dismissed: true,
      breakdown_id: this.breakdownid,
      maintenancetype_id: this.maintenancetypeid,
      part_id: partid.join(','),
      otherpart_name: otherpartname.join('~'),
      breakdowncauses_id: this.breakdowncausesidArr.join(','),
      breakdown_value: this.breakdownvalue,
      maintenancetype_value: this.maintenancetypevalue,
      breakdownremarks: this.breakdownForm.value.ta_remarks,
      notinuseremarks: getremarks,
    });
  }

  btn_add(type: any): void {
    if (type === 'Part') {
      if (this.breakdownForm.value.txt_partname === '') {
        this.ToastService.warning(
          this.translate.instant(
            'MAINTENANCEACKNOWLEDGEMODAL.partnamemandatory',
          ),
        );
        return;
      }

      this.partid = '0';

      this.partidArr.push(this.partid);
      this.partvalueArr.push(this.breakdownForm.value.txt_partname);

      this.partvalue = this.nl2br(this.partvalueArr.join('\n'));

      this.otherFlag = false;

      this.breakdownForm.controls.txt_partname.setValue('');

      this.step3completedFlag = this.partvalue.length > 0;
      this.getStatusColor('STEP3');
    }
  }

  btn_back(): void {
    this.correctivemaintenanceraiseFlag = false;

    this.getBreakdown();
  }

  btn_close(): void {
    this.modalController.dismiss({
      dismissed: true,
      item: '',
    });
  }

  async callmodalcontroller(type: any): Promise<any> {
    if (type === 'PartDefect') {
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

      partmodal.onDidDismiss().then((modeldata: any) => {
        const viewform = modeldata?.data?.data;

        if (viewform !== '' && viewform != null) {
          this.params = JSON.parse(viewform);

          this.partid = this.params.item_id;
          this.partvalue = this.params.item_name;

          if (this.partid == '0') {
            if (modeldata.data.searchtext !== '') {
              this.breakdownForm.controls.txt_partname.setValue(
                modeldata.data.searchtext,
              );
            }

            this.otherFlag = true;
          } else {
            let part_validate = false;

            this.otherFlag = false;

            this.breakdownForm.controls.txt_partname.setValue('');

            if (this.partidArr.length > 0) {
              for (let i = 0; i < this.partidArr.length; i++) {
                if (this.partidArr[i] == this.partid) {
                  part_validate = true;
                }
              }
            }

            if (!part_validate) {
              if (this.partid !== '') {
                this.partidArr.push(this.partid);
              }

              if (this.partvalue !== '') {
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

          this.step3completedFlag = this.partvalue.length > 0;
          this.getStatusColor('STEP3');
        }
      });

      return await partmodal.present();
    }
  }

  clear(type: any, index: number): void {
    if (type === 'Part') {
      this.partidArr.splice(index, 1);
      this.partvalueArr.splice(index, 1);

      if (this.partvalueArr.length > 0) {
        this.partvalue = this.nl2br(this.partvalueArr.join('\n'));
      } else {
        this.partid = '';
        this.partvalue = '';
        this.partidArr = [];
        this.partvalueArr = [];

        if (this.otherFlag) {
          this.otherFlag = false;
          this.breakdownForm.controls.txt_partname.setValue('');
        }

        this.step3completedFlag = false;
        this.getStatusColor('STEP3');
      }
    }
  }

  nl2br(text: string): string {
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }

  parseString(item: any): string {
    return JSON.stringify(item);
  }
}
