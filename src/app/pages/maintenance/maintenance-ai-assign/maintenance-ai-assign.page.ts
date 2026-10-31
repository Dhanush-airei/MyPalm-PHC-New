import {
  Component,
  OnInit,
  ViewChild,
  DestroyRef,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
@Component({
  selector: 'app-maintenance-ai-assign',
  templateUrl: './maintenance-ai-assign.page.html',
  styleUrls: ['./maintenance-ai-assign.page.scss'],
  standalone: false,
})
export class MaintenanceAiAssignPage implements OnInit {
  private destroyRef = inject(DestroyRef);
  @ViewChild('assignedtoSelect') assignedtoRef: any;

  aiForm!: FormGroup;
  params: any;

  // Notification Details
  getnotificationid = '';
  getstationname = '';
  getmachinename = '';
  getpartname = '';
  getcurrentrunninghours = '';
  getmaximumrunninghours = '';

  // Assign To Logic
  assignedtoid = '';
  assignedtovalue = '';
  assignedtoidArr: any = [];
  assignedtovalueArr: any = [];

  assignedtoArr: any[] = [];
  conditionoptionSelected = '';

  // Flags
  chargemanFlag = false;
  foremanFlag = false;
  assignedtoFlag = false;
  isDisabled = false;
  schedulechecked = 0;

  currentdate = new Date().toISOString();

  assignedtoOptions: any = {
    header: this.translate.instant(
      'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.assignto',
    ),
    cssClass: 'multiselect',
  };

  isDateTimePickerOpen = false;

  tempDateTime = '';

  minDateTime = '';

  displayScheduleDateTime = '';

  constructor(
    private platform: Platform,
    private translate: TranslateService,
    private fb: FormBuilder,
    public navParams: NavParams,
    public modalController: ModalController,
    private MaintenanceService: MaintenanceService,
    private UserContext: UserContext,
    private ToastService: ToastService,
    private LanguageService: LanguageService,
  ) {
    this.initializeForm();
    this.parseNavParams();
  }

  ngOnInit(): void {
    // Form initialization is handled in constructor
  }

  private initializeForm(): void {
    this.aiForm = this.fb.group({
      select_assignedto: [''],
      scehdule_datetime: [''],
    });
  }

  private parseNavParams(): void {
    const viewform = this.navParams.get('item');
    this.params = JSON.parse(viewform);

    this.getnotificationid = this.params.id;
    this.getstationname = this.params.stationname || '';
    this.getmachinename = this.params.machinename || '';
    this.getpartname = this.params.partdefect || '';
    this.getcurrentrunninghours = String(this.params.partcurrentrunninghours);
    this.getmaximumrunninghours = String(this.params.partmaxrunninghours);

    console.log('Notification Details:', this.params);
  }

  openAssignedTo(): void {
    this.assignedtoRef.open();
  }

  onConditionOptionChange(value: string): void {
    this.assignedtoFlag = true;
    this.conditionoptionSelected = value;

    if (this.conditionoptionSelected === 'Foreman') {
      this.chargemanFlag = false;
      this.foremanFlag = true;
      this.getAssignedTo(1);
    } else {
      this.chargemanFlag = true;
      this.foremanFlag = false;
      this.getAssignedTo(2);
    }

    console.log('Selected Condition:', this.conditionoptionSelected);
  }

  getAssignedTo(type: number): void {
    this.clearAssignedTo();

    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      desig_id: this.UserContext.designId,
      type: type,
      language: this.LanguageService.getLanguage,
    };

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

  assignedtohandleChange(event: any): void {
    const value = event.detail.value;

    if (Array.isArray(value) && value.length > 0) {
      this.assignedtoidArr = [];
      this.assignedtovalueArr = [];

      value.forEach((item: any) => {
        const parsed = JSON.parse(item);
        this.assignedtoidArr.push(parsed.userId);
        this.assignedtovalueArr.push(parsed.name);
      });
    } else {
      this.clearAssignedTo();
    }
  }

  private clearAssignedTo(): void {
    this.assignedtoidArr = [];
    this.assignedtovalueArr = [];
  }
  private formatDateTime(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
  assign(): void {
    // Validation: Condition Option Selected
    if (this.conditionoptionSelected === '') {
      this.ToastService.warning(
        this.translate.instant(
          'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.assignedtoselection',
        ),
      );
      return;
    }

    // Validation: Assigned To Selected
    if (this.assignedtovalueArr.length === 0) {
      this.ToastService.warning(
        this.translate.instant(
          'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.inchargeselection',
        ),
      );
      return;
    }

    // Validation: Schedule Date if checked
    let getDate = '';
    if (this.schedulechecked === 1) {
      const scheduleDatetime = this.aiForm.get('scehdule_datetime')?.value;

      if (!scheduleDatetime) {
        this.ToastService.warning('Scheduled Date and Time is mandatory');
        return;
      }

      getDate = this.formatDateTime(scheduleDatetime);
      console.log('Scheduled Date:', getDate);
    }

    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      workassignedto: this.assignedtoidArr.join(','),
      id: this.getnotificationid,
      language: this.LanguageService.getLanguage,
      schedule_flag: this.schedulechecked,
      schedule_datetime: getDate,
    };

    console.log('Assignment Request:', req);
    return;
    this.isDisabled = true;
    this.MaintenanceService.saveAIAssign(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          const resultdata: any = result;

          this.isDisabled = false;

          if (resultdata.httpcode == 200) {
            this.ToastService.success(
              this.translate.instant(
                'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.aiassignsuccess',
              ),
            );

            this.modalController.dismiss({
              dismissed: true,
              item: 'Submitted',
            });
          } else {
            this.ToastService.error(
              this.translate.instant(
                'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.aiassignfailed',
              ),
            );
          }
        },
        error: (err: any) => {
          console.error('saveAIAssign failed:', err);
          this.isDisabled = false;

          this.ToastService.error(
            this.translate.instant(
              'MAINTENANCEENGINEERINGNOTIFICATIONMODAL.aiassignfailed',
            ),
          );
        },
      });
  }

  isscheduleChecked(event: any): void {
    this.schedulechecked = event.detail.checked ? 1 : 0;
  }

  btn_close(): void {
    this.modalController.dismiss({
      dismissed: true,
      item: '',
    });
  }

  openDateTimePicker(): void {
    const formValue = this.aiForm.get('scehdule_datetime')?.value;

    // Existing value இருந்தால் அதை மட்டும் எடுத்துக்கொள்
    this.tempDateTime = formValue || '';

    this.minDateTime = new Date().toISOString();

    this.isDateTimePickerOpen = true;
  }
  onDateTimeChange(event: any): void {
    this.tempDateTime = event.detail.value;

    console.log('Selected:', this.tempDateTime);
  }
  confirmDateTime(): void {
    let selectedDateTime = this.tempDateTime;

    // No value selected -> use current date & time
    if (!selectedDateTime) {
      selectedDateTime = new Date().toISOString();

      console.log(
        'No date selected. Using current DateTime:',
        selectedDateTime,
      );
    } else {
      console.log('Selected DateTime:', selectedDateTime);
    }

    // Save to temp value
    this.tempDateTime = selectedDateTime;

    // Save ISO value to form
    this.aiForm.patchValue({
      scehdule_datetime: selectedDateTime,
    });

    // Display formatted value
    this.displayScheduleDateTime = this.formatDateTime(selectedDateTime);

    console.log('Final DateTime:', this.displayScheduleDateTime);

    // Close modal
    this.isDateTimePickerOpen = false;
  }

  cancelDateTime(): void {
    // Don't modify form value
    // Don't modify display value

    this.isDateTimePickerOpen = false;

    console.log('DateTime selection cancelled');
  }

  parseString(item: any): string {
    return JSON.stringify(item);
  }

  nl2br(text: string): string {
    return text.replace(/\r?\n/g, '<br />');
  }
}
