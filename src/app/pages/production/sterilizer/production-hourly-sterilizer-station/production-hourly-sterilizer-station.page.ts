/* production-hourly-sterilizer-station.page.ts */

import {
  Component,
  OnInit,
  ViewChild,
  DestroyRef,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';
import { ModalController, AlertController, IonContent } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { SterilizerService } from 'src/app/shared/services/production-services/sterilizer-service/sterilizer-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { ImageUploadService } from 'src/app/shared/services/image-upload-service/image-upload-service';
import { ImageSliderComponent } from 'src/app/shared/components/image-slider/image-slider.component';

@Component({
  selector: 'app-production-hourly-sterilizer-station',
  templateUrl: './production-hourly-sterilizer-station.page.html',
  styleUrls: ['./production-hourly-sterilizer-station.page.scss'],
  standalone: false,
})
export class ProductionHourlySterilizerStationPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  // Header Configuration
  appTitle: string = '';
  showLogo: number = 0;
  showBackButton: number = 1;
  headerActions: string = '';

  imagePaths = {
    bpvmage_path: '',
    peakimage_path: '',
  };

  // Form
  sterilizerStationForm!: FormGroup;

  // User Data
  userId: number = 0;
  millCode: string = '';
  departmentId: number = 0;
  designationId: number = 0;
  getLanguage: string = '';
  flowFlag: number = 0;

  // Data Arrays
  sterilizerArr: any[] = [];
  sensorList: any[] = [];
  bpvImagesArr: string[] = [];
  peakImagesArr: string[] = [];

  // Form Data
  cycleno: string = '';
  selectedSterilizer: string = '';
  sterilizerId: string = '';
  sterilizerName: string = '';
  notificationSensorId: number = 0;
  sensorId: number = 0;
  defaultSensorId: string = '';
  redirect: string = '';

  // View Data
  viewCycleno: string = '';
  viewSensorCycleno: string = '';
  viewDoorShutTime: string = '';
  viewDoorOpenTime: string = '';
  viewSterilizerName: string = '';
  viewBackPressureReceiver: string = '';
  viewP1Peak: string = '';
  viewP2Peak: string = '';
  viewP3Peak: string = '';

  // Flags
  uiEnableFlag: boolean = false;
  noRecordsFlag: boolean = false;
  viewFlag: boolean = false;
  doorOpenLaterFlag: boolean = false;
  bpvImageUiFlag: boolean = false;
  peakImageUiFlag: boolean = false;
  isDisabled: boolean = false;

  // Date related
  minimumDate: string = '';
  doorShutMinimumDate: string = '';
  doorOpenTimeMin: string = '';
  doorShutTimeMin: string = '';

  // Threshold values
  validationFlag: number = 0;
  backPressureValidationFlag: number = 0;
  p1ValidationFlag: number = 0;
  p2ValidationFlag: number = 0;
  p3ValidationFlag: number = 0;

  backPressureAlertTitle: string = '';
  backPressureAlertMessage: string = '';
  p1PeakAlertTitle: string = '';
  p1PeakAlertMessage: string = '';
  p2PeakAlertTitle: string = '';
  p2PeakAlertMessage: string = '';
  p3PeakAlertTitle: string = '';
  p3PeakAlertMessage: string = '';
  backPressureThresholdMin: string = '';
  backPressureThresholdMax: string = '';
  p1PeakThresholdMin: string = '';
  p1PeakThresholdMax: string = '';
  p2PeakThresholdMin: string = '';
  p2PeakThresholdMax: string = '';
  p3PeakThresholdMin: string = '';
  p3PeakThresholdMax: string = '';

  imageViewTitle: string = '';
  imageType: string = '';

  isDateTimePickerOpen: boolean = false;
  tempDateTime: string = '';
  minDateTime: string = '';
  currentPickerType: string = ''; // 'door_shut' or 'door_open'
  isDateTimeConfirmed: boolean = false; // Flag to track if user confirmed the selection

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private modalController: ModalController,
    private alertController: AlertController,
    private translate: TranslateService,
    private userContext: UserContext,
    private languageService: LanguageService,
    private sterilizerService: SterilizerService,
    private toastService: ToastService,
    private imageUploadService: ImageUploadService,
  ) {
    this.initializeUserData();
    this.initializeParams();
    this.createForm();
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.getCycleNo();
  }

  /**
   * Initialize user data from UserContext
   */
  private initializeUserData(): void {
    this.userId = this.userContext.userId;
    this.millCode = this.userContext.millCode;
    this.departmentId = this.userContext.departmentId;
    this.designationId = this.userContext.designId || 0;
    this.getLanguage = this.languageService.getLanguage;
    this.flowFlag = this.userContext.sterilizer_sensor_flag ?? 0;
    this.appTitle = this.translate.instant(
      'HOURLYSTERILIZATIONSTATIONSAVE.title',
    );
  }

  /**
   * Initialize params from ActivatedRoute
   */
  private initializeParams(): void {
    const viewForm = this.activatedRoute.snapshot.paramMap.get('item');
    if (viewForm && viewForm !== '' && viewForm !== 'null') {
      const params = JSON.parse(viewForm);
      this.notificationSensorId = params.baseid || 0;
      this.redirect = params.redirect || '';
    }
  }

  /**
   * Create form
   */
  private createForm(): void {
    this.sterilizerStationForm = this.fb.group({
      txt_cyclenumber: new FormControl('', Validators.required),
      select_sensorcyclenumber: new FormControl(''),
      txt_sensorcyclenumber: new FormControl(''),
      txt_doorshuttime: new FormControl('', Validators.required),
      txt_dooropentime: new FormControl(''),
      select_sterilizer: new FormControl(''),
      txt_backpressurereceiver: new FormControl('', Validators.required),
      txt_p1: new FormControl('', Validators.required),
      txt_p2: new FormControl('', Validators.required),
      txt_p3: new FormControl('', Validators.required),
      txt_bpvimageupload: new FormControl(''),
      txt_peakimageupload: new FormControl(''),
    });
  }

  /**
   * Parse date string to Date object
   */
  private parseDate(dateStr: string): Date {
    if (!dateStr) return new Date();

    let day: number, month: number, year: number, hour: number, minute: number;

    if (dateStr.includes('-')) {
      const parts = dateStr.split(' ');
      const dateParts = parts[0].split('-');

      if (dateParts[0].length == 4) {
        year = parseInt(dateParts[0]);
        month = parseInt(dateParts[1]) - 1;
        day = parseInt(dateParts[2]);
      } else {
        day = parseInt(dateParts[0]);
        month = parseInt(dateParts[1]) - 1;
        year = parseInt(dateParts[2]);
      }

      if (parts.length > 1) {
        const timeParts = parts[1].split(':');
        hour = parseInt(timeParts[0]);
        minute = parseInt(timeParts[1]);
      } else {
        hour = 0;
        minute = 0;
      }
    } else {
      return new Date(dateStr);
    }

    return new Date(year, month, day, hour || 0, minute || 0);
  }

  /**
   * Format date to ISO string for API (YYYY-MM-DD HH:mm:ss)
   */
  private formatDateTimeForAPI(dateInput: string | Date): string {
    if (!dateInput) return '';

    let date: Date;
    if (typeof dateInput === 'string') {
      date = this.parseDate(dateInput);
    } else {
      date = dateInput;
    }

    if (!date || isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:00`;
  }

  /**
   * Format date to ISO 8601 for ion-datetime (YYYY-MM-DDTHH:mm:ss)
   */
  private formatDateTimeForPicker(dateInput: string | Date): string {
    if (!dateInput) return '';

    let date: Date;
    if (typeof dateInput === 'string') {
      date = this.parseDate(dateInput);
    } else {
      date = dateInput;
    }

    if (!date || isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  /**
   * Format date to DD-MM-YYYY HH:mm for display
   */
  private formatDateDisplay(dateStr: string): string {
    if (!dateStr) return '';

    const ddmmRegex = /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/;
    if (ddmmRegex.test(dateStr)) {
      return dateStr;
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  /**
   * Open DateTime Picker
   */
  openDateTimePicker(type: string): void {
    this.currentPickerType = type;
    this.isDateTimeConfirmed = false;

    let currentValue = '';
    if (type === 'door_shut') {
      currentValue = this.sterilizerStationForm.value.txt_doorshuttime || '';
    } else {
      currentValue = this.sterilizerStationForm.value.txt_dooropentime || '';
    }

    if (type === 'door_shut') {
      this.minDateTime = this.doorShutMinimumDate || new Date().toISOString();
    } else {
      this.minDateTime = this.minimumDate || new Date().toISOString();
    }

    const now = new Date();

    if (currentValue) {
      const parsedDate = this.parseDate(currentValue);
      if (parsedDate && !isNaN(parsedDate.getTime())) {
        this.tempDateTime = this.formatDateTimeForPicker(parsedDate);
      } else {
        this.tempDateTime = this.formatDateTimeForPicker(now);
      }
    } else {
      this.tempDateTime = this.formatDateTimeForPicker(now);
    }

    this.isDateTimePickerOpen = true;
  }

  /**
   * DateTime changed
   */
  onDateTimeChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (!value) return;
    this.tempDateTime = value;
    this.isDateTimeConfirmed = true;
  }

  /**
   * DateTime modal dismissed
   */
  onDateTimeDismiss(): void {
    if (this.isDateTimeConfirmed && this.tempDateTime) {
      const date = new Date(this.tempDateTime);
      if (!isNaN(date.getTime())) {
        const formattedDate = this.formatDateDisplay(date.toISOString());

        if (this.currentPickerType === 'door_shut') {
          this.sterilizerStationForm.patchValue({
            txt_doorshuttime: formattedDate,
          });
          this.doorShutTimeMin = formattedDate;
          this.doorShutMinimumDate = this.calculateMinDate(formattedDate);
        } else {
          this.sterilizerStationForm.patchValue({
            txt_dooropentime: formattedDate,
          });
          this.onDoorOpenTimeChange();
        }
      }
    }

    this.isDateTimePickerOpen = false;
    this.isDateTimeConfirmed = false;
  }

  /**
   * Convert string to JSON
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

  // ========= API CALLS =========

  getCycleNo(): void {
    const req = {
      user_id: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      language: this.languageService.getLanguage,
    };

    this.sterilizerService
      .getCycleNoValue(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response?.httpcode == 200) {
            const data = response.data[0];
            this.cycleno = data.cycleno || '';

            this.doorOpenTimeMin = data.dooropentime_min || '';
            this.doorShutTimeMin = data.dooropentime_min || '';

            this.minimumDate = this.calculateMinDate(this.doorOpenTimeMin);
            this.doorShutMinimumDate = this.calculateMinDate(
              this.doorShutTimeMin,
            );

            this.p1PeakThresholdMin = data.p1peakthreshold_min || '0';
            this.p1PeakThresholdMax = data.p1peakthreshold_max || '50';
            this.p2PeakThresholdMin = data.p2peakthreshold_min || '0';
            this.p2PeakThresholdMax = data.p2peakthreshold_max || '50';
            this.p3PeakThresholdMin = data.p3peakthreshold_min || '0';
            this.p3PeakThresholdMax = data.p3peakthreshold_max || '50';

            this.p1PeakAlertTitle = data.p1peakalerttitle || 'Alert';
            this.p1PeakAlertMessage =
              data.p1peakalertmessage || 'Something went wrong...';
            this.p2PeakAlertTitle = data.p2peakalerttitle || 'Alert';
            this.p2PeakAlertMessage =
              data.p2peakalertmessage || 'Something went wrong...';
            this.p3PeakAlertTitle = data.p3peakalerttitle || 'Alert';
            this.p3PeakAlertMessage =
              data.p3peakalertmessage || 'Something went wrong...';

            this.backPressureThresholdMin =
              data.backpressurethreshold_min || '0';
            this.backPressureThresholdMax =
              data.backpressurethreshold_max || '50';
            this.backPressureAlertTitle =
              data.backpressurealerttitle || 'Alert';
            this.backPressureAlertMessage =
              data.backpressurealertmessage || 'Something went wrong...';

            this.validationFlag = data.validationflag || 0;

            this.sterilizerStationForm.patchValue({
              txt_cyclenumber: this.cycleno,
            });

            if (this.notificationSensorId !== 0) {
              this.getNotificationSterilizer();
            } else {
              this.getSterilizers();
            }
          } else {
            this.setDefaultValues();
            if (this.notificationSensorId !== 0) {
              this.getNotificationSterilizer();
            } else {
              this.getSterilizers();
            }
          }
        },
        error: (err) => {
          console.error('Failed to get cycle number:', err);
          this.setDefaultValues();
          if (this.notificationSensorId !== 0) {
            this.getNotificationSterilizer();
          } else {
            this.getSterilizers();
          }
        },
      });
  }

  private calculateMinDate(dateStr: string): string {
    if (!dateStr || dateStr == '') {
      return new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString();
    }
    const date = this.parseDate(dateStr);
    const minDate = new Date(date.getTime() - 24 * 60 * 60 * 1000);
    return this.formatDateTimeForAPI(minDate);
  }

  private setDefaultValues(): void {
    this.cycleno = '';
    this.minimumDate = new Date().toISOString();
    this.doorShutMinimumDate = new Date().toISOString();
    this.p1PeakThresholdMin = '0';
    this.p1PeakThresholdMax = '50';
    this.p2PeakThresholdMin = '0';
    this.p2PeakThresholdMax = '50';
    this.p3PeakThresholdMin = '0';
    this.p3PeakThresholdMax = '50';
    this.p1PeakAlertTitle = 'Alert';
    this.p1PeakAlertMessage = 'Something went wrong...';
    this.p2PeakAlertTitle = 'Alert';
    this.p2PeakAlertMessage = 'Something went wrong...';
    this.p3PeakAlertTitle = 'Alert';
    this.p3PeakAlertMessage = 'Something went wrong...';
    this.backPressureThresholdMin = '0';
    this.backPressureThresholdMax = '50';
    this.backPressureAlertTitle = 'Alert';
    this.backPressureAlertMessage = 'Something went wrong...';
    this.validationFlag = 0;
    this.sterilizerStationForm.patchValue({ txt_cyclenumber: '' });
  }

  getSterilizers(): void {
    const req = {
      user_id: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      language: this.languageService.getLanguage,
    };

    this.sterilizerService
      .getSterilizersValue(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response?.httpcode == 200) {
            this.sterilizerArr = response.data || [];
            this.uiEnableFlag = true;
            this.noRecordsFlag = false;

            if (this.notificationSensorId !== 0) {
              for (const item of this.sterilizerArr) {
                if (item.machine_id == parseInt(this.sterilizerId)) {
                  this.selectedSterilizer = `${this.sterilizerId}~${this.sterilizerName}`;
                  break;
                }
              }
            }

            this.getImageSettingsFlag();
          } else {
            this.sterilizerArr = [];
            this.uiEnableFlag = false;
            this.noRecordsFlag = true;
            this.getImageSettingsFlag();
          }
        },
        error: (err) => {
          console.error('Failed to get sterilizers:', err);
          this.sterilizerArr = [];
          this.uiEnableFlag = false;
          this.noRecordsFlag = true;
        },
      });
  }

  getNotificationSterilizer(): void {
    const req = {
      userid: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      design_id: this.designationId,
      sensor_id: this.notificationSensorId,
      language: this.languageService.getLanguage,
    };

    this.sterilizerService
      .getSterilizerDataDetails(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response?.httpcode == 200) {
            const data = response.data[0];
            this.sterilizerId = data.sterilizer_id || '';
            this.sterilizerName = data.sterilizer || '';

            if (data.cycleno) {
              this.sterilizerStationForm.patchValue({
                txt_cyclenumber: Number(data.cycleno),
              });
            }

            if (data.door_shut_time) {
              this.sterilizerStationForm.patchValue({
                txt_doorshuttime: data.door_shut_time,
              });
              this.doorShutTimeMin = data.door_shut_time;
              this.doorShutMinimumDate = this.calculateMinDate(
                this.doorShutTimeMin,
              );
            }

            if (data.door_open_time) {
              this.sterilizerStationForm.patchValue({
                txt_dooropentime: data.door_open_time,
              });
              this.doorOpenTimeMin = data.door_open_time;
              this.minimumDate = this.calculateMinDate(this.doorOpenTimeMin);
            }

            if (data.backpressurereceiver) {
              this.sterilizerStationForm.patchValue({
                txt_backpressurereceiver: data.backpressurereceiver,
              });
            }

            if (data.p1) {
              this.sterilizerStationForm.patchValue({ txt_p1: data.p1 });
            }
            if (data.p2) {
              this.sterilizerStationForm.patchValue({ txt_p2: data.p2 });
            }
            if (data.p3) {
              this.sterilizerStationForm.patchValue({ txt_p3: data.p3 });
            }

            this.getSterilizers();
          } else {
            this.sterilizerStationForm.patchValue({
              txt_doorshuttime: '',
              txt_dooropentime: '',
              txt_backpressurereceiver: '',
              txt_p1: '',
              txt_p2: '',
              txt_p3: '',
            });
            this.getSterilizers();
          }
        },
        error: (err) => {
          console.error('Failed to get notification sterilizer:', err);
          this.getSterilizers();
        },
      });
  }

  getImageSettingsFlag(): void {
    const req = {
      userid: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      language: this.languageService.getLanguage,
    };

    this.sterilizerService
      .getSettings(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response?.httpcode == 200) {
            const data = response.data[0];
            const bpvFlag = data.fruittypeimagesettingsflag || 0;
            const peakFlag = data.p1imagesettingsflag || 0;

            this.bpvImageUiFlag = bpvFlag == 1;
            this.peakImageUiFlag = peakFlag == 1;
          } else {
            this.bpvImageUiFlag = false;
            this.peakImageUiFlag = false;
          }
        },
        error: (err) => {
          console.error('Failed to get image settings:', err);
          this.bpvImageUiFlag = false;
          this.peakImageUiFlag = false;
        },
      });
  }

  getDoorShutTime(sterilizerId: string): void {
    const req = {
      userid: this.userId,
      millcode: this.millCode,
      departmentid: this.departmentId,
      designationid: this.designationId,
      sterilizerid: sterilizerId,
      language: this.languageService.getLanguage,
    };

    this.sterilizerService
      .getLastDoorOpenTime(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response?.httpcode == 200) {
            this.sterilizerStationForm.patchValue({
              txt_doorshuttime: '',
              txt_dooropentime: '',
            });

            this.doorShutTimeMin = response.dooropentime_min || '';
            this.doorShutMinimumDate = this.calculateMinDate(
              this.doorShutTimeMin,
            );
          } else {
            this.doorShutMinimumDate = new Date().toISOString();
          }
        },
        error: (err) => {
          console.error('Failed to get door shut time:', err);
          this.doorShutMinimumDate = new Date().toISOString();
        },
      });
  }

  getCycles(): void {
    const req = {
      userid: this.userId,
      millcode: this.millCode,
      departmentid: this.departmentId,
      designationid: this.designationId,
      machine_id: this.sterilizerId,
      language: this.languageService.getLanguage,
    };

    this.sterilizerService
      .getCyclesDetails(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response?.httpcode == 200) {
            this.sensorId = 0;
            this.sensorList = [];
            this.sterilizerStationForm.patchValue({
              txt_sensorcyclenumber: '',
              select_sensorcyclenumber: '',
            });

            if (response.data.length < 2) {
              this.sensorId = response.data[0]?.sensor_id || 0;
              this.sterilizerStationForm.patchValue({
                txt_sensorcyclenumber: response.data[0]?.cycle_no || '',
                txt_cyclenumber: response.data[0]?.cycle_no || '',
              });
            } else {
              if (response.data[0]?.sensor_id !== 0) {
                const eachReq = {
                  sensor_id: response.data[0].sensor_id,
                  cycle_no: response.data[0].cycle_no,
                };
                this.defaultSensorId = JSON.stringify(eachReq);
                if (this.defaultSensorId) {
                  this.sensorId = JSON.parse(this.defaultSensorId).sensor_id;
                }
              }
              this.sensorList = response.data;
            }

            this.getSterilizerDetails();
          } else {
            this.sensorId = 0;
            this.sensorList = [];
            this.sterilizerStationForm.patchValue({
              txt_sensorcyclenumber: '',
              select_sensorcyclenumber: '',
            });
            this.getSterilizerDetails();
          }
        },
        error: (err) => {
          console.error('Failed to get cycles:', err);
          this.sensorId = 0;
          this.sensorList = [];
          this.getSterilizerDetails();
        },
      });
  }

  getSterilizerDetails(): void {
    const req = {
      userid: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      design_id: this.designationId,
      sensor_id: this.sensorId,
      language: this.languageService.getLanguage,
    };

    this.sterilizerService
      .getSterilizerDataDetails(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response?.httpcode == 200) {
            const data = response.data[0];
            if (data.cycleno) {
              this.sterilizerStationForm.patchValue({
                txt_cyclenumber: Number(data.cycleno),
              });
            }
            if (data.door_shut_time) {
              this.sterilizerStationForm.patchValue({
                txt_doorshuttime: data.door_shut_time,
              });
            }
            if (data.door_open_time) {
              this.sterilizerStationForm.patchValue({
                txt_dooropentime: data.door_open_time,
              });
            }
            if (data.backpressurereceiver) {
              this.sterilizerStationForm.patchValue({
                txt_backpressurereceiver: data.backpressurereceiver,
              });
            }
            if (data.p1) {
              this.sterilizerStationForm.patchValue({ txt_p1: data.p1 });
            }
            if (data.p2) {
              this.sterilizerStationForm.patchValue({ txt_p2: data.p2 });
            }
            if (data.p3) {
              this.sterilizerStationForm.patchValue({ txt_p3: data.p3 });
            }
          } else {
            this.sterilizerStationForm.patchValue({
              txt_doorshuttime: '',
              txt_dooropentime: '',
              txt_backpressurereceiver: '',
              txt_p1: '',
              txt_p2: '',
              txt_p3: '',
              txt_cyclenumber: this.cycleno,
            });
          }
        },
        error: (err) => {
          console.error('Failed to get sterilizer details:', err);
        },
      });
  }

  // ========= EVENT HANDLERS =========

  onConditionSterilizer(): void {
    if (this.notificationSensorId !== 0) {
      this.notificationSensorId = 0;
    }

    const value = this.sterilizerStationForm.value.select_sterilizer;
    if (value && value.length > 0) {
      const splitData = value.split('~');
      this.sterilizerId = splitData[0];
      if (this.sterilizerId) {
        this.getDoorShutTime(this.sterilizerId);
        this.getCycles();
      }
    }
  }

  onConditionCycleChange(): void {
    const selectedValue =
      this.sterilizerStationForm.value.select_sensorcyclenumber;
    if (selectedValue) {
      const parsed = JSON.parse(selectedValue);
      this.sensorId = parsed.sensor_id || 0;
      if (this.sensorId != 0) {
        this.getSterilizerDetails();
      }
    }
  }

  onDoorOpenTimeChange(): void {
    this.doorOpenLaterFlag = false;
  }

  onConditionDoorOpenChange(value: string): void {
    if (value == 'Yes') {
      this.sterilizerStationForm.patchValue({ txt_dooropentime: '' });
      this.doorOpenLaterFlag = true;
    }
  }

  onChangeBackPressureReceiver(): void {
    const value = this.sterilizerStationForm.value.txt_backpressurereceiver;
    if (value && value > 100) {
      this.backPressureValidationFlag = 1;
    } else {
      this.backPressureValidationFlag = 0;
    }
  }

  onChangeP1(): void {
    const value = this.sterilizerStationForm.value.txt_p1;
    if (value && value > 100) {
      this.p1ValidationFlag = 1;
    } else {
      this.p1ValidationFlag = 0;
    }
  }

  onChangeP2(): void {
    const value = this.sterilizerStationForm.value.txt_p2;
    if (value && value > 100) {
      this.p2ValidationFlag = 1;
    } else {
      this.p2ValidationFlag = 0;
    }
  }

  onChangeP3(): void {
    const value = this.sterilizerStationForm.value.txt_p3;
    if (value && value > 100) {
      this.p3ValidationFlag = 1;
    } else {
      this.p3ValidationFlag = 0;
    }
  }

  // ========= IMAGE HANDLING =========

  /**
   * Image Upload
   *
   * Behavior:
   * - On success (httpcode == 200): push image path to array, update the
   *   corresponding form control text, and show a success toast with the
   *   tile name and count (e.g. "Back Pressure Receiver (BPV) Uploaded (1) image").
   * - On failure: show an error toast with "type + imageaddedfailed" message.
   */
  async imageUpload(type: string): Promise<void> {
    try {
      const result: any = await this.imageUploadService.imageUploadCommon(type);

      let resultData: any = result;
      if (resultData && typeof resultData.response === 'string') {
        try {
          resultData = JSON.parse(resultData.response);
        } catch {
          // keep as-is if parsing fails
        }
      }

      if (resultData.httpcode == 200 || resultData.httpcode === '200') {
        const imagePath = resultData.data?.uploaded_path;
        if (imagePath) {
          const uploadedMessage = this.addImageToArray(type, imagePath);
          if (uploadedMessage) {
            this.toastService.success(uploadedMessage);
          }
        }
      } else {
        this.toastService.error(
          type +
            this.translate.instant(
              'HOURLYSTERILIZATIONSTATIONSAVE.imageaddedfailed',
            ),
        );
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      this.toastService.error(
        type +
          this.translate.instant(
            'HOURLYSTERILIZATIONSTATIONSAVE.imageaddedfailed',
          ),
      );
    }
  }

  private addImageToArray(type: string, imagePath: string): string {
    if (type == 'BPV') {
      this.imagePaths.bpvmage_path = imagePath;
      this.bpvImagesArr.push(imagePath);
      return this.updateImageUploadText(
        'txt_bpvimageupload',
        this.bpvImagesArr.length,
        'HOURLYSTERILIZATIONSTATIONSAVE.backpressurereceiver',
      );
    } else if (type == 'Peak') {
      this.imagePaths.peakimage_path = imagePath;
      this.peakImagesArr.push(imagePath);
      return this.updateImageUploadText(
        'txt_peakimageupload',
        this.peakImagesArr.length,
        'HOURLYSTERILIZATIONSTATIONSAVE.peakimages',
      );
    }
    return '';
  }

  /**
   * Update image upload text based on the count and return the same text
   * so it can also be used in a toast message.
   *
   * Format: "<Tile Name> Uploaded (N) image(s)"
   */
  private updateImageUploadText(
    formControlName: string,
    count: number,
    tileTitleKey: string,
  ): string {
    const tileTitle = this.translate.instant(tileTitleKey);
    const uploaded = this.translate.instant(
      'HOURLYSTERILIZATIONSTATIONSAVE.uploded',
    );
    const image1 = this.translate.instant(
      'HOURLYSTERILIZATIONSTATIONSAVE.image1',
    );
    const image2 = this.translate.instant(
      'HOURLYSTERILIZATIONSTATIONSAVE.image2',
    );

    let text = '';
    if (count === 1) {
      text = `${tileTitle} ${uploaded}${count}${image1}`;
    } else if (count > 1) {
      text = `${tileTitle} ${uploaded}${count}${image2}`;
    }
    this.sterilizerStationForm.patchValue({ [formControlName]: text });
    return text;
  }

  /**
   * View Images using ImageSliderComponent
   */
  async btnView(type: string): Promise<void> {
    this.imageType = type;

    let imagesArr: string[] = [];
    let from: string = '';

    if (type == 'BPV') {
      if (this.bpvImagesArr.length > 0) {
        imagesArr = this.bpvImagesArr;
        from = 'BPV';
        this.imageViewTitle = this.translate.instant(
          'HOURLYSTERILIZATIONSTATIONSAVE.bpvimages',
        );
      } else {
        this.toastService.error(
          `Back Pressure Receiver (BPV) ${this.translate.instant('HOURLYSTERILIZATIONSTATIONSAVE.imagenotfound')}`,
        );
        return;
      }
    } else if (type == 'Peak') {
      if (this.peakImagesArr.length > 0) {
        imagesArr = this.peakImagesArr;
        from = 'Peak';
        this.imageViewTitle = this.translate.instant(
          'HOURLYSTERILIZATIONSTATIONSAVE.peakimages',
        );
      } else {
        this.toastService.error(
          `Peak (P1, P2, P3) ${this.translate.instant('HOURLYSTERILIZATIONSTATIONSAVE.imagenotfound')}`,
        );
        return;
      }
    }

    const modal = await this.modalController.create({
      component: ImageSliderComponent,
      componentProps: {
        from: from,
        gradingitem: imagesArr,
      },
      cssClass: 'image-slider-modal',
      showBackdrop: true,
      backdropDismiss: true,
    });

    await modal.present();
  }

  // ========= SAVE & CONFIRM =========

  saveAlert(): void {
    if (!this.sterilizerStationForm.valid) {
      this.toastService.error(
        this.translate.instant(
          'HOURLYSTERILIZATIONSTATIONSAVE.pleasefilltheform',
        ),
      );
      return;
    }

    if (this.notificationSensorId !== 0) {
      if (!this.sterilizerId) {
        this.toastService.error(
          this.translate.instant(
            'HOURLYSTERILIZATIONSTATIONSAVE.sterilizermandatory',
          ),
        );
        return;
      }
    } else {
      if (!this.sterilizerStationForm.value.select_sterilizer) {
        this.toastService.error(
          this.translate.instant(
            'HOURLYSTERILIZATIONSTATIONSAVE.sterilizermandatory',
          ),
        );
        return;
      }
    }

    const cycleNo = this.sterilizerStationForm.value.txt_cyclenumber;
    if (!Number.isInteger(Number(cycleNo))) {
      this.toastService.error(
        this.translate.instant(
          'HOURLYSTERILIZATIONSTATIONSAVE.cycleshouldbenumber',
        ),
      );
      return;
    }

    const doorShutTime = this.sterilizerStationForm.value.txt_doorshuttime;
    if (!doorShutTime) {
      this.toastService.error(
        this.translate.instant(
          'HOURLYSTERILIZATIONSTATIONSAVE.doorshuttimemandatory',
        ),
      );
      return;
    }

    if (!this.doorOpenLaterFlag) {
      const doorOpenTime = this.sterilizerStationForm.value.txt_dooropentime;
      if (!doorOpenTime) {
        this.toastService.error(
          this.translate.instant(
            'HOURLYSTERILIZATIONSTATIONSAVE.dooropentimemandatory',
          ),
        );
        return;
      }

      const startDate = this.parseDate(doorShutTime);
      const endDate = this.parseDate(doorOpenTime);

      if (endDate <= startDate) {
        this.dateValidationAlert('');
        return;
      }
    }

    if (this.validationFlag == 1) {
      if (
        this.backPressureValidationFlag == 1 ||
        this.p1ValidationFlag == 1 ||
        this.p2ValidationFlag == 1 ||
        this.p3ValidationFlag == 1
      ) {
        this.thresholdAlert();
        return;
      }
    } else {
      if (
        this.backPressureValidationFlag == 1 ||
        this.p1ValidationFlag == 1 ||
        this.p2ValidationFlag == 1 ||
        this.p3ValidationFlag == 1
      ) {
        this.toastService.error('Please enter a value within 100');
        return;
      }
    }

    this.save();
  }

  save(): void {
    if (!this.sterilizerStationForm.valid) {
      this.toastService.error(
        this.translate.instant(
          'HOURLYSTERILIZATIONSTATIONSAVE.pleasefilltheform',
        ),
      );
      return;
    }

    const cycleNo = this.sterilizerStationForm.value.txt_cyclenumber;
    const doorShutTime = this.sterilizerStationForm.value.txt_doorshuttime;
    let doorOpenTime = '';

    if (!this.doorOpenLaterFlag) {
      doorOpenTime = this.sterilizerStationForm.value.txt_dooropentime;
    }

    let sterilizerId = '';
    if (this.notificationSensorId !== 0) {
      sterilizerId = this.sterilizerId;
    } else {
      const value = this.sterilizerStationForm.value.select_sterilizer;
      if (value) {
        const splitData = value.split('~');
        sterilizerId = splitData[0];
      }
    }

    if (!sterilizerId) {
      this.toastService.error(
        this.translate.instant(
          'HOURLYSTERILIZATIONSTATIONSAVE.sterilizermandatory',
        ),
      );
      return;
    }

    if (!Number.isInteger(Number(cycleNo))) {
      this.toastService.error(
        this.translate.instant(
          'HOURLYSTERILIZATIONSTATIONSAVE.cycleshouldbenumber',
        ),
      );
      return;
    }

    this.viewCycleno = cycleNo;
    this.viewSensorCycleno =
      this.sterilizerStationForm.value.txt_sensorcyclenumber || '';

    if (doorShutTime) {
      const parsedShutDate = this.parseDate(doorShutTime);
      this.viewDoorShutTime = this.formatDateDisplay(
        parsedShutDate.toISOString(),
      );
    } else {
      this.viewDoorShutTime = '';
    }

    if (!this.doorOpenLaterFlag && doorOpenTime) {
      const parsedOpenDate = this.parseDate(doorOpenTime);
      this.viewDoorOpenTime = this.formatDateDisplay(
        parsedOpenDate.toISOString(),
      );
    } else {
      this.viewDoorOpenTime = this.translate.instant(
        'HOURLYSTERILIZATIONSTATIONSAVE.dooropenlater',
      );
    }

    this.viewSterilizerName =
      this.sterilizerName ||
      this.sterilizerStationForm.value.select_sterilizer?.split('~')[1] ||
      '';
    this.viewBackPressureReceiver =
      this.sterilizerStationForm.value.txt_backpressurereceiver;
    this.viewP1Peak = this.sterilizerStationForm.value.txt_p1;
    this.viewP2Peak = this.sterilizerStationForm.value.txt_p2;
    this.viewP3Peak = this.sterilizerStationForm.value.txt_p3;

    if (this.notificationSensorId !== 0) {
      this.sensorId = this.notificationSensorId;
    }

    this.viewFlag = true;
  }

  confirmAlert(): void {
    if (this.sterilizerStationForm.valid) {
      this.confirm();
    }
  }

  confirm(): void {
    if (!this.sterilizerStationForm.valid) {
      this.toastService.error(
        this.translate.instant(
          'HOURLYSTERILIZATIONSTATIONSAVE.pleasefilltheform',
        ),
      );
      return;
    }

    this.isDisabled = true;

    const cycleNo = this.sterilizerStationForm.value.txt_cyclenumber;
    const doorShutTime = this.sterilizerStationForm.value.txt_doorshuttime;
    let doorOpenTime = '';

    if (!this.doorOpenLaterFlag) {
      doorOpenTime = this.sterilizerStationForm.value.txt_dooropentime;
    }

    let sterilizerId = '';
    if (this.notificationSensorId !== 0) {
      sterilizerId = this.sterilizerId;
    } else {
      const value = this.sterilizerStationForm.value.select_sterilizer;
      if (value) {
        const splitData = value.split('~');
        sterilizerId = splitData[0];
      }
    }

    if (!sterilizerId) {
      this.toastService.error(
        this.translate.instant(
          'HOURLYSTERILIZATIONSTATIONSAVE.sterilizermandatory',
        ),
      );
      this.isDisabled = false;
      return;
    }

    if (!Number.isInteger(Number(cycleNo))) {
      this.toastService.error(
        this.translate.instant(
          'HOURLYSTERILIZATIONSTATIONSAVE.cycleshouldbenumber',
        ),
      );
      this.isDisabled = false;
      return;
    }

    const formattedShutTime = this.formatDateTimeForAPI(
      this.parseDate(doorShutTime),
    );
    const formattedOpenTime = doorOpenTime
      ? this.formatDateTimeForAPI(this.parseDate(doorOpenTime))
      : '';

    if (this.notificationSensorId !== 0) {
      this.sensorId = this.notificationSensorId;
    }

    const req = {
      userid: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      machineId: sterilizerId,
      status: '1',
      cycleno: cycleNo,
      door_shut_time: formattedShutTime,
      door_open_time: formattedOpenTime,
      initial_stream_admission_time: '',
      final_blow_down_time: '',
      cooking_start_time: '',
      cooking_stop_time: '',
      fruittype: '',
      backPressureReceiver:
        this.sterilizerStationForm.value.txt_backpressurereceiver,
      p1: this.sterilizerStationForm.value.txt_p1,
      p2: this.sterilizerStationForm.value.txt_p2,
      p3: this.sterilizerStationForm.value.txt_p3,
      running_user_id: localStorage.getItem('runninghourid') || '',
      date: this.formatDateTimeForAPI(new Date()),
      bpvimages: this.bpvImagesArr.join('~'),
      p1images: this.peakImagesArr.join('~'),
      language: this.languageService.getLanguage,
      sensor_id: this.sensorId,
    };

    this.sterilizerService
      .saveHourlySterilizerStation(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isDisabled = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          if (response?.httpcode == 200) {
            this.sterilizerStationForm.reset();
            this.viewFlag = false;
            this.toastService.success(
              this.translate.instant(
                'HOURLYSTERILIZATIONSTATIONSAVE.savedsuccess',
              ),
            );

            if (this.notificationSensorId != 0) {
              this.router.navigate(['tabs/sterilizer-report']);
            } else {
              this.router.navigate(['tabs/sterilizer-dashboard']);
            }
          } else {
            this.viewFlag = false;
            this.toastService.error(
              this.translate.instant(
                'HOURLYSTERILIZATIONSTATIONSAVE.savedfail',
              ),
            );
          }
        },
        error: (err) => {
          console.error('Failed to save:', err);
          this.viewFlag = false;
          this.toastService.error(
            this.translate.instant('HOURLYSTERILIZATIONSTATIONSAVE.savedfail'),
          );
        },
      });
  }

  // ========= ALERTS =========

  private async dateValidationAlert(
    previousDate: Date | string,
  ): Promise<void> {
    let dateStr = '';
    if (previousDate) {
      if (typeof previousDate == 'string') {
        dateStr = previousDate;
      } else if (previousDate instanceof Date) {
        dateStr = this.formatDateDisplay(previousDate.toISOString());
      }
    }

    const alertMessage =
      dateStr == ''
        ? this.translate.instant(
            'HOURLYSTERILIZATIONSTATIONSAVE.doorshutandopentimevalidation',
          )
        : `${this.translate.instant('HOURLYSTERILIZATIONSTATIONSAVE.datevalidationalert')} ${dateStr}`;

    const alert = await this.alertController.create({
      mode: 'md',
      header: this.translate.instant(
        'SUPERVISORDASHBOARD.alreadybreakdownalerttitle',
      ),
      cssClass: 'customalertmessageonebuttons',
      message: alertMessage,
      buttons: [{ text: '' }],
    });
    await alert.present();
  }

  private async thresholdAlert(): Promise<void> {
    let alertMessage = '';

    if (this.backPressureValidationFlag == 1) {
      alertMessage = this.backPressureAlertMessage;
    }

    if (this.p1ValidationFlag == 1) {
      alertMessage = alertMessage
        ? `${alertMessage}<br/>${this.p1PeakAlertMessage}`
        : this.p1PeakAlertMessage;
    }

    if (this.p2ValidationFlag == 1) {
      alertMessage = alertMessage
        ? `${alertMessage}<br/>${this.p2PeakAlertMessage}`
        : this.p2PeakAlertMessage;
    }

    if (this.p3ValidationFlag == 1) {
      alertMessage = alertMessage
        ? `${alertMessage}<br/>${this.p3PeakAlertMessage}`
        : this.p3PeakAlertMessage;
    }

    const alert = await this.alertController.create({
      mode: 'md',
      header: this.backPressureAlertTitle || 'Alert',
      cssClass: 'thresholdalertmessage',
      message: alertMessage,
      backdropDismiss: false,
      buttons: [
        {
          text: this.translate.instant('GENERALBUTTON.okay'),
          handler: () => {
            this.save();
          },
        },
      ],
    });
    await alert.present();
  }

  // ========= UTILITY METHODS =========

  cancelConfirm(): void {
    this.viewFlag = false;
    this.isDisabled = false;
  }

  cancel(): void {
    this.location.back();
  }

  decimalFilter(event: any): void {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    const input = event.target.value + String.fromCharCode(event.charCode);
    if (!reg.test(input)) {
      event.preventDefault();
    }
  }
}
