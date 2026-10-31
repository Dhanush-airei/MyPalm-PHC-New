import {
  Component,
  OnInit,
  DestroyRef,
  inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';
import {
  IonDatetime,
  IonModal,
  ModalController,
  NavParams,
} from '@ionic/angular';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { SterilizerService } from 'src/app/shared/services/production-services/sterilizer-service/sterilizer-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';

@Component({
  selector: 'app-dooropenlater-update-modal',
  templateUrl: './dooropenlater-update-modal.page.html',
  styleUrls: ['./dooropenlater-update-modal.page.scss'],
  standalone: false,
})
export class DooropenlaterUpdateModalPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  @ViewChild('pickerModal') pickerModal!: IonModal;
  @ViewChild('dateTimePicker') dateTimePicker!: IonDatetime;

  @ViewChild('hiddenPickerBtn', { read: ElementRef })
  hiddenPickerBtn!: ElementRef<HTMLElement>;

  // Form
  doorOpenLaterForm!: FormGroup;

  // User Data
  getLanguage: string = '';
  userId: number = 0;
  millCode: string = '';
  departmentId: number = 0;

  // Variables
  params: any;
  isDisabled: boolean = false;

  // Date Time Picker
  minDateTime: string = '';

  /**
   * Two-way bound to <ion-datetime> via [(ngModel)]. Ionic keeps this
   * synced with the picker's value.
   */
  pickerValue: string = '';

  /**
   * Value displayed in our custom field.
   * Format: "DD-MM-YYYY HH:mm"
   */
  displayDateTime: string = '';

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private fb: FormBuilder,
    private userContext: UserContext,
    private languageService: LanguageService,
    private sterilizerService: SterilizerService,
    private toastService: ToastService,
    private translate: TranslateService,
  ) {
    this.initializeUserData();
    this.initializeParams();
    this.createForm();
  }

  ngOnInit() {
    this.seedInitialPickerValue();
  }

  private initializeUserData(): void {
    this.userId = this.userContext.userId;
    this.millCode = this.userContext.millCode;
    this.departmentId = this.userContext.departmentId;
    this.getLanguage = this.languageService.getLanguage;
  }

  private initializeParams(): void {
    const viewform = this.navParams.get('item');
    this.params = JSON.parse(viewform);

    if (this.params.door_shut_time) {
      const parsedDate = this.parseDate(this.params.door_shut_time);
      this.minDateTime = this.formatDateTimeISO(parsedDate);
    }
  }

  private createForm(): void {
    this.doorOpenLaterForm = this.fb.group({
      txt_dooropentime: new FormControl('', Validators.required),
    });
  }

  private seedInitialPickerValue(): void {
    const now = new Date();
    const nowISO = this.formatDateTimeISO(now);

    if (this.minDateTime && nowISO < this.minDateTime) {
      this.pickerValue = this.minDateTime;
    } else {
      this.pickerValue = nowISO;
    }
  }

  /**
   * Parse a date string into a Date object.
   *
   * Handles BOTH input formats used in this component:
   *   1. "DD-MM-YYYY HH:mm"      (door_shut_time from API)
   *   2. "YYYY-MM-DDTHH:mm"      (ISO from <ion-datetime>)
   *   3. "YYYY-MM-DD HH:mm"      (fallback)
   */
  private parseDate(dateStr: string): Date {
    if (!dateStr) return new Date();

    // ISO format: "YYYY-MM-DDTHH:mm[:ss]"
    if (dateStr.includes('T')) {
      const [datePart, timePartRaw] = dateStr.split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      const cleanTime = (timePartRaw || '00:00').replace(
        /Z$|[+-]\d{2}:?\d{2}$/,
        '',
      );
      const [hour, minute] = cleanTime.split(':').map(Number);
      return new Date(year, month - 1, day, hour || 0, minute || 0);
    }

    // Space-separated: could be "DD-MM-YYYY HH:mm" or "YYYY-MM-DD HH:mm"
    const parts = dateStr.split(' ');
    const dateParts = parts[0].split('-');

    let day: number,
      month: number,
      year: number,
      hour = 0,
      minute = 0;

    if (dateParts[0].length === 4) {
      // YYYY-MM-DD
      year = parseInt(dateParts[0]);
      month = parseInt(dateParts[1]) - 1;
      day = parseInt(dateParts[2]);
    } else {
      // DD-MM-YYYY
      day = parseInt(dateParts[0]);
      month = parseInt(dateParts[1]) - 1;
      year = parseInt(dateParts[2]);
    }

    if (parts.length > 1) {
      const timeParts = parts[1].split(':');
      hour = parseInt(timeParts[0]) || 0;
      minute = parseInt(timeParts[1]) || 0;
    }

    return new Date(year, month, day, hour, minute);
  }

  private formatDateTimeISO(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  private formatDisplayFromISO(iso: string): string {
    if (!iso) return '';

    const [datePart, timePartRaw] = iso.split('T');
    if (!datePart) return '';

    const [year, month, day] = datePart.split('-');
    let hours = '00';
    let minutes = '00';

    if (timePartRaw) {
      const cleanTime = timePartRaw.replace(/Z$|[+-]\d{2}:?\d{2}$/, '');
      const [h, m] = cleanTime.split(':');
      if (h !== undefined) hours = h.padStart(2, '0');
      if (m !== undefined) minutes = m.padStart(2, '0');
    }

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  /**
   * Format a Date for the API.
   *
   * Output: "YYYY-MM-DD HH:mm:00"
   * Example: new Date(2026, 9, 8, 4, 0) → "2026-10-08 04:00:00"
   *
   * This replaces the previous `moment(date).format(...)` call.
   */
  private formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:00`;
  }

  openPickerViaButton(): void {
    const host = this.hiddenPickerBtn?.nativeElement;
    if (!host) return;

    const nativeBtn =
      (host.shadowRoot?.querySelector('button') as HTMLButtonElement | null) ??
      (host.querySelector('button') as HTMLButtonElement | null);

    if (nativeBtn) {
      nativeBtn.click();
    } else {
      (host as HTMLElement).click();
    }
  }

  onDateTimeChange(event: CustomEvent): void {
    const raw = event.detail.value;

    let value = '';
    if (Array.isArray(raw)) {
      value = raw.length > 0 ? raw[0] : '';
    } else if (typeof raw === 'string') {
      value = raw;
    }

    if (!value) return;

    this.pickerValue = value;

    const display = this.formatDisplayFromISO(value);
    if (display) {
      this.displayDateTime = display;
    }

    this.doorOpenLaterForm.patchValue({
      txt_dooropentime: value,
    });
  }

  async onDateTimeConfirm(): Promise<void> {
    let finalValue = '';

    try {
      const v: any = await this.dateTimePicker?.value;
      if (typeof v === 'string' && v) {
        finalValue = v;
      } else if (Array.isArray(v) && v.length > 0) {
        finalValue = v[0];
      }
    } catch {
      finalValue = this.pickerValue;
    }

    if (!finalValue) {
      finalValue = this.pickerValue;
    }

    if (finalValue) {
      this.pickerValue = finalValue;

      const display = this.formatDisplayFromISO(finalValue);
      if (display) {
        this.displayDateTime = display;
      }

      this.doorOpenLaterForm.patchValue({
        txt_dooropentime: finalValue,
      });
    }
  }

  onDateTimeCancel(): void {
    // No-op; Ionic closes the picker automatically.
  }

  save(): void {
    const doorOpenTimeValue = this.doorOpenLaterForm.value.txt_dooropentime;

    if (!doorOpenTimeValue) {
      this.toastService.warning(
        this.translate.instant(
          'HOURLYSTERILIZATIONSTATIONSAVE.dooropentimemandatory',
        ),
      );
      return;
    }

    // Parse BOTH with the same robust parser so the comparison is correct.
    const startDate = this.parseDate(this.params.door_shut_time); // e.g. 2026-10-08 03:00
    const endDate = this.parseDate(doorOpenTimeValue); // e.g. 2026-10-08 04:00

    console.log('Validation → doorShut:', startDate, 'doorOpen:', endDate);

    if (+endDate <= +startDate) {
      this.toastService.error(
        this.translate.instant(
          'HOURLYSTERILIZATIONSTATIONSAVE.doorshutandopentimevalidation',
        ),
      );
      return;
    }

    const doorOpenTime = this.formatDateTime(endDate);

    const req = {
      userid: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      id: this.params.id,
      door_open_time: doorOpenTime,
    };

    console.log('Save Door Open Time Request:', req);

    this.isDisabled = true;

    this.sterilizerService
      .saveDoorOpenTimeLater(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isDisabled = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          if (response?.httpcode == 200) {
            this.doorOpenLaterForm.reset();
            this.pickerValue = '';
            this.displayDateTime = '';
            this.toastService.success(
              this.translate.instant('HOURLYSTERILIZATIONSTATIONSAVE.success'),
            );
            this.modalController.dismiss({
              dismissed: true,
              item: 'SAVED',
            });
          } else {
            this.toastService.error(
              this.translate.instant('HOURLYSTERILIZATIONSTATIONSAVE.failed'),
            );
          }
        },
        error: (err) => {
          console.error('Failed to save door open time:', err);
          this.toastService.error(
            this.translate.instant('HOURLYSTERILIZATIONSTATIONSAVE.failed'),
          );
        },
      });
  }

  btnClose(): void {
    this.modalController.dismiss({
      dismissed: true,
      item: '',
    });
  }
}
