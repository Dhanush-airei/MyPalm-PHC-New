import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  ModalController,
  AlertController,
  NavParams,
  LoadingController,
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { PressService } from 'src/app/shared/services/production-services/press-service/press-service';
import { ImageUploadService } from 'src/app/shared/services/image-upload-service/image-upload-service';
import { ImageSliderComponent } from 'src/app/shared/components/image-slider/image-slider.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-production-hourly-press-station-save',
  templateUrl: './production-hourly-press-station-save.page.html',
  styleUrls: ['./production-hourly-press-station-save.page.scss'],
  standalone: false,
})
export class ProductionHourlyPressStationSavePage implements OnInit {
  private destroyRef = inject(DestroyRef);

  // Header Configuration
  appTitle: string = this.translate.instant('HOURLYPRESSSTATION.title');
  showLogo: number = 0;
  showBackButton: number = 1;
  headerActions: string = '';
  pressstationForm: any;

  levelArr: any = [];
  temperatureArr: any = [];
  digestordrainoilflowArr: any = [];
  fiberflowArr: any = [];
  hydraulicpressureArr: any = [];
  pressureampsArr: any = [];
  digestorampsArr: any = [];

  machinename = '';
  presstitle = '';
  digestortitle = '';
  pressingstationid = '';
  digestorstationid = '';
  pressingstationstatus = '';

  observationtime = new Date().toISOString();

  isDisabled = false;
  viewFlag = false;

  temperatureimagesettingsflag = 0;
  motorimagesettingsflag = 0;
  levelimagesettingsflag = 0;
  drainageimagesettingsflag = 0;
  pressmotorimagesettingsflag = 0;
  pressfibreflowimagesettingsflag = 0;
  presshydraulicpressureimagesettingsflag = 0;

  temperatureimageuiflag = false;
  motorimageuiflag = false;
  levelimageuiflag = false;
  drainageimageuiflag = false;
  pressmotorimageuiflag = false;
  pressfibreflowimageuiflag = false;
  presshydraulicpressureimageuiflag = false;

  temperatureimageviewFlag = false;
  motorimageviewFlag = false;
  levelimageviewFlag = false;
  drainageimageviewFlag = false;
  pressmotorimageviewFlag = false;
  pressfibreflowimageviewFlag = false;
  presshydraulicpressureimageviewFlag = false;

  imagetype = '';
  imageviewtitle = '';

  /*Variable to for to View entered Data*/
  view_observationtime = '';
  view_temperature = '';
  view_digestormotoramps = '';
  view_level = '';
  view_digestordrainoilflow = '';
  view_pressmotoramps = '';
  view_fiberflow = '';
  view_hydraulicpressure = '';
  view_dilutiontemperature = '';

  imagePaths = {
    temperatureimage_path: '',
    motorimage_path: '',
    levelimage_path: '',
    drainageimage_path: '',
    pressmotorimage_path: '',
    pressfibreflowimage_path: '',
    presshydraulicpressureimage_path: '',
  };

  temperatureimagesArr: any = [];
  motorimagesArr: any = [];
  levelimagesArr: any = [];
  drainageimagesArr: any = [];
  pressmotorimagesArr: any = [];
  pressfibreflowimagesArr: any = [];
  presshydraulicpressureimagesArr: any = [];
  remarksForm: any;

  isTimeModalOpen: boolean = false;
  tempTime: string = '';
  currentTime: string = '';
  selectedTime: string = '';
  constructor(
    public languageService: LanguageService,
    private translate: TranslateService,
    public modalController: ModalController,
    private alertController: AlertController,
    private userContext: UserContext,
    private pressService: PressService,
    private toastService: ToastService,
    public navParams: NavParams,
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private imageUploadService: ImageUploadService,
  ) {
    let params = this.navParams.get('item');

    this.machinename = params.machine_name;
    this.presstitle = params.presstitle;
    this.digestortitle = params.digestortitle;
    this.pressingstationid = params.machine_id;
    this.digestorstationid = params.digestor_machine_id;
    this.pressingstationstatus = params.status;

    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    // Current time - HH:mm
    this.tempTime = `${hours}:${minutes}`;

    this.pressstationForm = this.fb.group({
      txt_observationtime: [this.tempTime],
      txt_temperature: ['', Validators.required],
      txt_digestormotoramps: ['', Validators.required],
      select_level: ['', Validators.required],
      select_digestordrainoilflow: ['', Validators.required],
      txt_pressmotoramps: [''],
      select_fiberflow: [''],
      txt_hydraulicpressure: [''],
      // IMAGE UPLOAD CONTROLS
      txt_temperatureimageupload: [''],
      txt_motorimageupload: [''],
      txt_levelimageupload: [''],
      txt_drainageimageupload: [''],
      txt_pressmotorimageupload: [''],
      txt_pressfibreflowimageupload: [''],
      txt_presshydraulicpressureimageupload: [''],
    });

    // ============================================
    // REMARKS FORM
    // ============================================

    this.remarksForm = this.fb.group({
      ta_remarks: [''],
      ta_copyRemarks: [''],
    });
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.getImageSettingsFlag();
  }

  async imageUpload(type: string): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'circular',
      backdropDismiss: false,
    });

    await loading.present();

    try {
      // Existing API
      const result: any = await this.imageUploadService.imageUploadCommon(type);

      console.log('Image Upload Response:', result);

      let resultdata: any = result;

      // Existing API response is JSON string
      if (typeof resultdata?.response === 'string') {
        resultdata = JSON.parse(resultdata.response);
      }

      console.log('Parsed Upload Response:', resultdata);

      // =================================================
      // SUCCESS
      // =================================================

      if (resultdata?.httpcode == 200) {
        const uploadedPath = resultdata?.data?.uploaded_path;

        console.log('Uploaded Path:', uploadedPath);

        if (!uploadedPath) {
          console.error('Uploaded path not found');
          return;
        }

        // =================================================
        // TEMPERATURE
        // =================================================

        if (type === 'Temperature') {
          this.imagePaths.temperatureimage_path = uploadedPath;

          this.temperatureimagesArr.push(uploadedPath);

          this.pressstationForm
            .get('txt_temperatureimageupload')
            ?.setValue(
              this.translate.instant('HOURLYPRESSSTATIONSAVE.uploded') +
                this.temperatureimagesArr.length +
                this.translate.instant(
                  this.temperatureimagesArr.length === 1
                    ? 'HOURLYPRESSSTATIONSAVE.image1'
                    : 'HOURLYPRESSSTATIONSAVE.image2',
                ),
            );
        }

        // =================================================
        // MOTOR
        // =================================================
        else if (type === 'Motor') {
          this.imagePaths.motorimage_path = uploadedPath;

          this.motorimagesArr.push(uploadedPath);

          this.pressstationForm
            .get('txt_motorimageupload')
            ?.setValue(
              this.translate.instant('HOURLYPRESSSTATIONSAVE.uploded') +
                this.motorimagesArr.length +
                this.translate.instant(
                  this.motorimagesArr.length === 1
                    ? 'HOURLYPRESSSTATIONSAVE.image1'
                    : 'HOURLYPRESSSTATIONSAVE.image2',
                ),
            );
        }

        // =================================================
        // LEVEL
        // =================================================
        else if (type === 'Level') {
          this.imagePaths.levelimage_path = uploadedPath;

          this.levelimagesArr.push(uploadedPath);

          this.pressstationForm
            .get('txt_levelimageupload')
            ?.setValue(
              this.translate.instant('HOURLYPRESSSTATIONSAVE.uploded') +
                this.levelimagesArr.length +
                this.translate.instant(
                  this.levelimagesArr.length === 1
                    ? 'HOURLYPRESSSTATIONSAVE.image1'
                    : 'HOURLYPRESSSTATIONSAVE.image2',
                ),
            );
        }

        // =================================================
        // DRAINAGE
        // =================================================
        else if (type === 'Drainage') {
          this.imagePaths.drainageimage_path = uploadedPath;

          this.drainageimagesArr.push(uploadedPath);

          this.pressstationForm
            .get('txt_drainageimageupload')
            ?.setValue(
              this.translate.instant('HOURLYPRESSSTATIONSAVE.uploded') +
                this.drainageimagesArr.length +
                this.translate.instant(
                  this.drainageimagesArr.length === 1
                    ? 'HOURLYPRESSSTATIONSAVE.image1'
                    : 'HOURLYPRESSSTATIONSAVE.image2',
                ),
            );
        }

        // =================================================
        // PRESS MOTOR
        // =================================================
        else if (type === 'PressMotor') {
          this.imagePaths.pressmotorimage_path = uploadedPath;

          this.pressmotorimagesArr.push(uploadedPath);

          this.pressstationForm
            .get('txt_pressmotorimageupload')
            ?.setValue(
              this.translate.instant('HOURLYPRESSSTATIONSAVE.uploded') +
                this.pressmotorimagesArr.length +
                this.translate.instant(
                  this.pressmotorimagesArr.length === 1
                    ? 'HOURLYPRESSSTATIONSAVE.image1'
                    : 'HOURLYPRESSSTATIONSAVE.image2',
                ),
            );
        }

        // =================================================
        // PRESS FIBRE FLOW
        // =================================================
        else if (type === 'PressFibreFlow') {
          this.imagePaths.pressfibreflowimage_path = uploadedPath;

          this.pressfibreflowimagesArr.push(uploadedPath);

          this.pressstationForm
            .get('txt_pressfibreflowimageupload')
            ?.setValue(
              this.translate.instant('HOURLYPRESSSTATIONSAVE.uploded') +
                this.pressfibreflowimagesArr.length +
                this.translate.instant(
                  this.pressfibreflowimagesArr.length === 1
                    ? 'HOURLYPRESSSTATIONSAVE.image1'
                    : 'HOURLYPRESSSTATIONSAVE.image2',
                ),
            );
        }

        // =================================================
        // PRESS HYDRAULIC PRESSURE
        // =================================================
        else if (type === 'PressHydraulicPressure') {
          this.imagePaths.presshydraulicpressureimage_path = uploadedPath;

          this.presshydraulicpressureimagesArr.push(uploadedPath);

          this.pressstationForm
            .get('txt_presshydraulicpressureimageupload')
            ?.setValue(
              this.translate.instant('HOURLYPRESSSTATIONSAVE.uploded') +
                this.presshydraulicpressureimagesArr.length +
                this.translate.instant(
                  this.presshydraulicpressureimagesArr.length === 1
                    ? 'HOURLYPRESSSTATIONSAVE.image1'
                    : 'HOURLYPRESSSTATIONSAVE.image2',
                ),
            );
        }

        console.log('Image uploaded successfully:', type);
      }

      // =================================================
      // FILE TOO LARGE
      // =================================================
      else if (resultdata?.httpcode === 413) {
        this.toastService.error(
          resultdata?.status || 'Image size is too large',
        );
      }

      // =================================================
      // OTHER ERROR
      // =================================================
      else {
        console.error('Image Upload Failed:', resultdata);

        this.toastService.error(
          type +
            this.translate.instant('HOURLYPRESSSTATIONSAVE.imageaddedfailed'),
        );
      }
    } catch (error) {
      console.error('Image upload error:', error);

      // this.toastService.error('Image upload failed');
    } finally {
      await loading.dismiss();
    }
  }

  cancel() {
    this.modalController.dismiss({
      dismissed: true,
      item: '',
    });
  }

  cancelconfirm() {
    this.viewFlag = false;

    this.isDisabled = false;
  }
  imageviewcancel() {
    if (this.imagetype == 'Temperature') {
      this.temperatureimageviewFlag = false;
    }

    if (this.imagetype == 'Motor') {
      this.motorimageviewFlag = false;
    }

    if (this.imagetype == 'Level') {
      this.levelimageviewFlag = false;
    }

    if (this.imagetype == 'Drainage') {
      this.drainageimageviewFlag = false;
    }

    if (this.imagetype == 'PressMotor') {
      this.pressmotorimageviewFlag = false;
    }

    if (this.imagetype == 'PressFibreFlow') {
      this.pressfibreflowimageviewFlag = false;
    }

    if (this.imagetype == 'PressHydraulicPressure') {
      this.presshydraulicpressureimageviewFlag = false;
    }
  }
  decimalFilter(event: any) {
    const reg = /^\d+(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  btn_view(type: string): void {
    const imageConfig: any = {
      Temperature: {
        images: this.temperatureimagesArr,
        title: this.translate.instant('HOURLYPRESSSTATION.temperature'),
      },
      Motor: {
        images: this.motorimagesArr,
        title: this.translate.instant('IMAGESLIDER.motorimage'),
      },
      Level: {
        images: this.levelimagesArr,
        title: this.translate.instant('IMAGESLIDER.levelimage'),
      },
      Drainage: {
        images: this.drainageimagesArr,
        title: this.translate.instant('IMAGESLIDER.digestorimage'),
      },
      PressMotor: {
        images: this.pressmotorimagesArr,
        title: this.translate.instant('IMAGESLIDER.pressmotorimage'),
      },
      PressFibreFlow: {
        images: this.pressfibreflowimagesArr,
        title: 'Fibre Flow',
      },
      PressHydraulicPressure: {
        images: this.presshydraulicpressureimagesArr,
        title: this.translate.instant('IMAGESLIDER.hydraulicpressureimage'),
      },
    };

    const config = imageConfig[type];

    if (config?.images?.length) {
      this.imageviewtitle = config.title;
      this.viewImages(config.images);
    }
  }
  async viewImages(images: string[]): Promise<void> {
    if (!images?.length) {
      return;
    }

    var title =
      this.languageService.getLanguage == 'English'
        ? `${this.imageviewtitle} ${this.translate.instant('HOURLYPRESSSTATIONSAVE.images')}`
        : `${this.translate.instant('HOURLYPRESSSTATIONSAVE.images')} ${this.imageviewtitle}`;

    console.log(`title ${title}`);
    const modal = await this.modalController.create({
      component: ImageSliderComponent,
      componentProps: {
        from: 'Press',
        headerTitle: title,
        pressitem: images,
      },
      cssClass: 'image-slider-modal',
    });

    await modal.present();
  }
  parseString(item: any) {
    return JSON.stringify(item);
  }
  confirm() {
    if (this.pressstationForm.valid) {
      // if (this.motorimagesArr.length <= 0) {
      //   this.toastService.warning(
      //     this.translate.instant(
      //       'HOURLYPRESSSTATIONSAVE.digestorimagemandatory',
      //     ),
      //   );
      //   return;
      // }

      // if (this.pressstationForm.value.txt_pressmotoramps == '') {
      //   this.toastService.warning(
      //     this.translate.instant('HOURLYPRESSSTATIONSAVE.pressmotormandatory'),
      //   );
      //   return;
      // }

      // if (this.pressstationForm.value.select_fiberflow == '') {
      //   this.toastService.warning(
      //     this.translate.instant('HOURLYPRESSSTATIONSAVE.fibreflowmandatory'),
      //   );
      //   return;
      // }

      // if (this.pressstationForm.value.txt_hydraulicpressure == '') {
      //   this.toastService.warning(
      //     this.translate.instant(
      //       'HOURLYPRESSSTATIONSAVE.hydraulicpressuremandatory',
      //     ),
      //   );
      //   return;
      // }

      // if (this.pressmotorimagesArr.length <= 0) {
      //   this.toastService.warning(
      //     this.translate.instant(
      //       'HOURLYPRESSSTATIONSAVE.pressmotorimagemandatory',
      //     ),
      //   );
      //   return;
      // }

      // if (this.pressfibreflowimagesArr.length <= 0) {
      //   this.toastService.warning(
      //     this.translate.instant(
      //       'HOURLYPRESSSTATIONSAVE.fibreflowimagemandatory',
      //     ),
      //   );
      //   return;
      // }

      const date = new Date(this.pressstationForm.value.txt_observationtime);

      this.view_observationtime = date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      });

      this.view_temperature = this.pressstationForm.value.txt_temperature;

      this.view_digestormotoramps =
        this.pressstationForm.value.txt_digestormotoramps;

      this.view_level = JSON.parse(
        this.pressstationForm.value.select_level,
      ).percentage;

      this.view_digestordrainoilflow = JSON.parse(
        this.pressstationForm.value.select_digestordrainoilflow,
      ).digestordrainpipevalue;

      this.view_pressmotoramps = this.pressstationForm.value.txt_pressmotoramps;
      this.view_fiberflow = JSON.parse(
        this.pressstationForm.value.select_fiberflow,
      ).level;
      this.view_hydraulicpressure =
        this.pressstationForm.value.txt_hydraulicpressure;

      this.viewFlag = true;
    } else {
      this.viewFlag = false;

      this.toastService.warning(
        this.translate.instant('HOURLYPRESSSTATIONSAVE.pleasefilltheform'),
      );
    }
  }

  /**
   * Open Time Modal
   */
  openTimeModal() {
    this.tempTime = this.pressstationForm.get('txt_observationtime')?.value;
    this.isTimeModalOpen = true;
  }

  /**
   * Close Time Modal
   */
  closeTimeModal(): void {
    this.isTimeModalOpen = false;
  }

  /**
   * Time changed
   */
  onTimeChange(event: any) {
    this.tempTime = event.detail.value;

    this.pressstationForm.patchValue({
      txt_observationtime: this.tempTime,
    });
  }

  /**
   * Time modal dismissed
   */
  onTimeDismiss(): void {
    if (this.tempTime) {
      this.selectedTime = this.tempTime;
    }
    this.isTimeModalOpen = false;
  }

  /**
   * Get current time in HH:mm format
   */
  private getCurrentTime(): string {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  getImageSettingsFlag() {
    //this.imageuiflag = true;

    const req = {
      userid: this.userContext.userId,
      millcode: this.userContext.millCode,
      dept_id: this.userContext.departmentId,
      language: this.languageService.getLanguage,
    };

    this.pressService
      .getSettings(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          if (result.httpcode == 200) {
            this.temperatureimagesettingsflag =
              result.data[0].temperatureimagesettingsflag;
            this.motorimagesettingsflag = result.data[0].motorimagesettingsflag;
            this.levelimagesettingsflag = result.data[0].levelimagesettingsflag;
            this.drainageimagesettingsflag =
              result.data[0].drainageimagesettingsflag;

            this.pressmotorimagesettingsflag =
              result.data[0].pressmotorimagesettingsflag;
            this.pressfibreflowimagesettingsflag =
              result.data[0].pressfibreflowimagesettingsflag;
            this.presshydraulicpressureimagesettingsflag =
              result.data[0].presshydraulicpressureimagesettingsflag;
          } else {
            this.temperatureimagesettingsflag = 0;
            this.motorimagesettingsflag = 0;
            this.levelimagesettingsflag = 0;
            this.drainageimagesettingsflag = 0;
            this.pressmotorimagesettingsflag = 0;
            this.pressfibreflowimagesettingsflag = 0;
            this.presshydraulicpressureimagesettingsflag = 0;
          }
          this.getPercentageValue();
        },
        error: (err) => {
          console.error('Failed to get value:', err);
          this.temperatureimagesettingsflag = 0;
          this.motorimagesettingsflag = 0;
          this.levelimagesettingsflag = 0;
          this.drainageimagesettingsflag = 0;
          this.pressmotorimagesettingsflag = 0;
          this.pressfibreflowimagesettingsflag = 0;
          this.presshydraulicpressureimagesettingsflag = 0;
        },
      });
  }

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

  save() {
    const observation_time = this.pressstationForm.value.txt_observationtime;

    const now = new Date();

    const getcurrentdate =
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ` +
      `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    var data_pressmotoramps = this.pressstationForm.value.txt_pressmotoramps;
    var data_fiberflow = this.pressstationForm.value.select_fiberflow;
    var data_hydraulicpressure =
      this.pressstationForm.value.txt_hydraulicpressure;

    var req = {
      userid: this.userContext.userId,
      millcode: this.userContext.millCode,
      dept_id: this.userContext.departmentId,
      machineId: this.pressingstationid,
      digestor_machine_id: this.digestorstationid,
      status: this.pressingstationstatus,
      observationtime: observation_time,

      temperature: this.pressstationForm.value.txt_temperature,
      digestorMotorAmp: this.pressstationForm.value.txt_digestormotoramps,
      diegestorDrainOilLow: JSON.parse(
        this.pressstationForm.value.select_digestordrainoilflow,
      ).id,
      level: JSON.parse(this.pressstationForm.value.select_level).id,

      pressMotorAmp: data_pressmotoramps,
      fiberFlow: JSON.parse(data_fiberflow).id,
      hydralicPressure: data_hydraulicpressure,

      dilutionTemperature: '',
      running_user_id: localStorage.getItem('runninghourid'),
      date: getcurrentdate,
      temperatureimages: this.temperatureimagesArr.join('~'),
      motorimages: this.motorimagesArr.join('~'),
      levelimages: this.levelimagesArr.join('~'),
      drainageimages: this.drainageimagesArr.join('~'),
      pressmotorimages: this.pressmotorimagesArr.join('~'),
      pressfibreflowimages: this.pressfibreflowimagesArr.join('~'),
      presshydraulicpressureimages:
        this.presshydraulicpressureimagesArr.join('~'),
      language: this.languageService.getLanguage,
      newflow: '1',
      remarks: this.remarksForm.value.ta_remarks,
    };

    console.log(req);

    this.isDisabled = true;
    this.pressService
      .saveHourlyPressingStation(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isDisabled = false;
        }),
      )
      .subscribe({
        next: (result: any) => {
          if (result.httpcode == 200) {
            this.toastService.success(
              this.translate.instant('HOURLYPRESSSTATIONSAVE.savedsuccess'),
            );

            this.modalController.dismiss({
              dismissed: true,
              observationtime: observation_time,
              level: this.pressstationForm.value.select_level,
              temperature: this.pressstationForm.value.txt_temperature,
              digestormotoramps:
                this.pressstationForm.value.txt_digestormotoramps,
              digestordrainoilflow:
                this.pressstationForm.value.select_digestordrainoilflow,

              pressmotoramps: data_pressmotoramps,
              pressoilflow: data_fiberflow,
              hydraulicpressure: data_hydraulicpressure,

              recordstatus: '1',
              pressdataenableflag: 1,
            });
          } else {
            this.toastService.error(
              this.translate.instant('HOURLYPRESSSTATIONSAVE.savedfail'),
            );
          }
        },
        error: (err) => {
          console.error('Failed to get fiber flow:', err);
          this.fiberflowArr = [];
        },
      });
  }
}
