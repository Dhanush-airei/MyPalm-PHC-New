import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { PressService } from 'src/app/shared/services/production-services/press-service/press-service';
import { ProductionHourlyPressStationSavePage } from 'src/app/pages/production/press/production-hourly-press-station-save/production-hourly-press-station-save.page';

@Component({
  selector: 'app-production-hourly-press-station',
  templateUrl: './production-hourly-press-station.page.html',
  styleUrls: ['./production-hourly-press-station.page.scss'],
  standalone: false,
})
export class ProductionHourlyPressStationPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  // Header Configuration
  appTitle: string = this.translate.instant('HOURLYPRESSSTATION.title');
  showLogo: number = 0;
  showBackButton: number = 1;
  headerActions: string = '';

  // Data Arrays
  pressingstationArr: any[] = [];
  levelArr: any[] = [];
  digestordrainoilflowArr: any[] = [];
  fiberflowArr: any[] = [];

  // Data Variables
  temperature: string = '';
  digestormotoramps: string = '';
  level: string = '';
  digestordrainoilflow: string = '';
  pressmotoramps: string = '';
  pressoilflow: string = '';
  hydraulicpressure: string = '';
  dilutiontemperature: string = '';
  pressdataenableflag: string = '';
  recordstatus: string = '';

  // Flags
  norecordsflag: boolean = false;

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    public modalController: ModalController,
    private alertController: AlertController,
    private userContext: UserContext,
    private pressService: PressService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.getPressingStationStatus();
  }

  /**
   * Get Pressing Station Status
   */
  getPressingStationStatus(): void {
    const req = {
      userid: this.userContext.userId,
      millcode: this.userContext.millCode,
      dept_id: this.userContext.departmentId,
      Screen: 'PRESSING',
      language: this.languageService.getLanguage,
    };

    console.log('Pressing Station Request:', req);

    this.pressService
      .getPressingStationStatus(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          console.log('Pressing Station Response:', result);

          if (result.httpcode == 200) {
            this.pressingstationArr = result.data || [];
            this.norecordsflag = false;
            this.getPercentageValue();
            // this.pressingstationArr.push({
            //   station_name: 'Press',
            //   digestordrainoilflow: 'Low',
            //   level: '75%',
            //   station_id: 13,
            //   fiberflow: '',
            //   recordstatus: '1',
            //   pressmotoramps: '1',
            //   machine_id: 149,
            //   machine_name: 'Digestor No 1 & Press No 1',
            //   title: 'DIGESTOR & PRESS NO.1',
            //   digestortitle: 'Digestor No 1',
            //   pressdataenableflag: '1',
            //   digestor_machine_id: 150,
            //   temperature: '1',
            //   presstitle: 'Press No 1',
            //   hydraulicpressure: '1',
            //   digestormotoramps: '1',
            //   status: 0,
            //   dilutiontemperature: '',
            //   pressoilflow: 'Low',
            // });
          } else {
            this.pressingstationArr = [];
            this.norecordsflag = true;
            this.getPercentageValue();
          }
        },
        error: (err) => {
          console.error('Failed to get pressing station status:', err);
          this.pressingstationArr = [];
          this.norecordsflag = true;
          this.getPercentageValue();
        },
      });
  }

  /**
   * Get Percentage Value
   */
  getPercentageValue(): void {
    const req = {
      user_id: this.userContext.userId,
      millcode: this.userContext.millCode,
      dept_id: this.userContext.departmentId,
      language: this.languageService.getLanguage,
    };

    this.pressService
      .getPercentageValue(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          if (result.httpcode == 200) {
            this.levelArr = result.data || [];
            this.getDigestorDrainPipe();
          } else {
            this.levelArr = [];
            this.getDigestorDrainPipe();
          }
        },
        error: (err) => {
          console.error('Failed to get percentage value:', err);
          this.levelArr = [];
          this.getDigestorDrainPipe();
        },
      });
  }

  /**
   * Get Digestor Drain Pipe Value
   */
  getDigestorDrainPipe(): void {
    const req = {
      user_id: this.userContext.userId,
      millcode: this.userContext.millCode,
      dept_id: this.userContext.departmentId,
      language: this.languageService.getLanguage,
    };

    this.pressService
      .getDigestorDrainPipeValue(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          if (result.httpcode == 200) {
            this.digestordrainoilflowArr = result.data || [];
            this.getFiberFlow();
          } else {
            this.digestordrainoilflowArr = [];
            this.getFiberFlow();
          }
        },
        error: (err) => {
          console.error('Failed to get digestor drain pipe:', err);
          this.digestordrainoilflowArr = [];
          this.getFiberFlow();
        },
      });
  }

  /**
   * Get Fiber Flow Value
   */
  getFiberFlow(): void {
    const req = {
      user_id: this.userContext.userId,
      millcode: this.userContext.millCode,
      dept_id: this.userContext.departmentId,
      language: this.languageService.getLanguage,
    };

    this.pressService
      .getFiberFlowValue(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          if (result.httpcode == 200) {
            this.fiberflowArr = result.data || [];
          } else {
            this.fiberflowArr = [];
          }
        },
        error: (err) => {
          console.error('Failed to get fiber flow:', err);
          this.fiberflowArr = [];
        },
      });
  }

  /**
   * Handle No Digestor/Press Alert
   */
  async nodigestorpressalert(value: any): Promise<void> {
    let alertmessage = '';

    if (value.digestortitle == '' || value.presstitle == '') {
      if (value.digestortitle == '') {
        if (value.presstitle != '') {
          alertmessage =
            this.translate.instant('HOURLYPRESSSTATION.nodigestoralert') +
            value.presstitle +
            this.translate.instant('HOURLYPRESSSTATION.kindlyadd');
        } else {
          alertmessage = this.translate.instant(
            'HOURLYPRESSSTATION.alertmessage',
          );
        }
      } else if (value.presstitle == '') {
        if (value.digestortitle != '') {
          alertmessage =
            this.translate.instant('HOURLYPRESSSTATION.nopressalert') +
            value.digestortitle +
            this.translate.instant('HOURLYPRESSSTATION.addpress');
        } else {
          alertmessage = this.translate.instant(
            'HOURLYPRESSSTATION.alertmessage',
          );
        }
      }

      const alert = await this.alertController.create({
        message: alertmessage,
        cssClass: 'customalertmessageonebuttons',
        backdropDismiss: false,
        buttons: [
          {
            text: '',
            handler: () => {},
          },
        ],
      });
      await alert.present();
    } else {
      alertmessage =
        value.machine_name +
        this.translate.instant('HOURLYPRESSSTATION.switchon') +
        value.machine_name +
        this.translate.instant('HOURLYPRESSSTATION.tryagain');

      const alert = await this.alertController.create({
        message: alertmessage,
        cssClass: 'customalertmessageonebuttons-confirm',
        backdropDismiss: false,
        buttons: [
          {
            text: '',
            handler: () => {},
          },
        ],
      });
      await alert.present();
    }
  }

  /**
   * Open Modal for Press Station Save
   */
  async callmodalcontroller(value: any): Promise<void> {
    const modal = await this.modalController.create({
      component: ProductionHourlyPressStationSavePage,
      componentProps: {
        item: value,
      },
      cssClass: 'press-station-save-modal',
    });
    modal.onDidDismiss().then((modeldata) => {
      if (modeldata && modeldata.data) {
        this.pressdataenableflag = String(
          modeldata.data['pressdataenableflag'],
        );
        if (this.pressdataenableflag == '0') {
          this.temperature = String(modeldata.data['temperature']);
          this.digestormotoramps = String(modeldata.data['digestormotoramps']);
          this.level = modeldata.data['level'];
          this.digestordrainoilflow = modeldata.data['digestordrainoilflow'];
          this.pressmotoramps = '';
          this.pressoilflow = '';
          this.hydraulicpressure = '';
          this.dilutiontemperature = '';
          this.recordstatus = String(modeldata.data['recordstatus']);
          this.pressdataenableflag = String(
            modeldata.data['pressdataenableflag'],
          );
        } else {
          this.temperature = String(modeldata.data['temperature']);
          this.digestormotoramps = String(modeldata.data['digestormotoramps']);
          this.level = modeldata.data['level'];
          this.digestordrainoilflow = modeldata.data['digestordrainoilflow'];
          this.pressmotoramps = String(modeldata.data['pressmotoramps']);
          this.pressoilflow = modeldata.data['pressoilflow'];
          this.hydraulicpressure = String(modeldata.data['hydraulicpressure']);
          this.dilutiontemperature = '';
          this.recordstatus = String(modeldata.data['recordstatus']);
          this.pressdataenableflag = String(
            modeldata.data['pressdataenableflag'],
          );
        }
        // Update the specific item in the array
        const index = this.pressingstationArr.findIndex(
          (item) => item.machine_id === value.machine_id,
        );
        if (index !== -1) {
          if (
            this.temperature &&
            this.digestormotoramps &&
            this.level &&
            this.digestordrainoilflow &&
            this.pressmotoramps &&
            this.pressoilflow &&
            this.hydraulicpressure
          ) {
            this.pressingstationArr[index].temperature = this.temperature;
            this.pressingstationArr[index].digestormotoramps =
              this.digestormotoramps;
            this.pressingstationArr[index].level = JSON.parse(
              this.level,
            ).percentage;
            this.pressingstationArr[index].digestordrainoilflow = JSON.parse(
              this.digestordrainoilflow,
            ).digestordrainpipevalue;
            this.pressingstationArr[index].pressmotoramps = this.pressmotoramps;
            this.pressingstationArr[index].pressoilflow = JSON.parse(
              this.pressoilflow,
            ).level;
            this.pressingstationArr[index].hydraulicpressure =
              this.hydraulicpressure;
            this.pressingstationArr[index].dilutiontemperature =
              this.dilutiontemperature;
            this.pressingstationArr[index].recordstatus = this.recordstatus;
            this.pressingstationArr[index].pressdataenableflag =
              this.pressdataenableflag;
          } else if (
            this.temperature &&
            this.digestormotoramps &&
            this.level &&
            this.digestordrainoilflow
          ) {
            this.pressingstationArr[index].temperature = this.temperature;
            this.pressingstationArr[index].digestormotoramps =
              this.digestormotoramps;
            this.pressingstationArr[index].level = JSON.parse(
              this.level,
            ).percentage;
            this.pressingstationArr[index].digestordrainoilflow = JSON.parse(
              this.digestordrainoilflow,
            ).digestordrainpipevalue;
            this.pressingstationArr[index].pressmotoramps = this.pressmotoramps;
            this.pressingstationArr[index].pressoilflow = this.pressoilflow;
            this.pressingstationArr[index].hydraulicpressure =
              this.hydraulicpressure;
            this.pressingstationArr[index].dilutiontemperature =
              this.dilutiontemperature;
            this.pressingstationArr[index].recordstatus = this.recordstatus;
            this.pressingstationArr[index].pressdataenableflag =
              this.pressdataenableflag;
          }
        }
      }
      console.log(this.pressingstationArr);
    });
    await modal.present();
  }

  /**
   * Parse String to JSON
   */
  parseString(item: any): string {
    return JSON.stringify(item);
  }

  /**
   * Convert newline to <br>
   */
  nl2br(text: string): string {
    if (!text) return '';
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
