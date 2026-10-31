import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';

import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-production-ffb-cage-mill-stop',
  templateUrl: './production-ffb-cage-mill-stop.page.html',
  styleUrls: ['./production-ffb-cage-mill-stop.page.scss'],
  standalone: false,
})
export class ProductionFfbCageMillStopPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  // --------------------------------------------------
  // Form
  // --------------------------------------------------

  ffbcageForm: any;

  // --------------------------------------------------
  // Page Variables
  // --------------------------------------------------

  gettitle = '';
  getMillStatus = '';

  cycleId = '';
  cycleValue = '';

  cycleIdArr: Array<number | string> = [];
  cycleValueArr: string[] = [];

  carryForwardCyclesArr: any[] = [];

  // --------------------------------------------------
  // Select Options
  // --------------------------------------------------

  carryForwardCyclesOptions = {
    header: this.translate.instant('PRODUCTIONDETAILS.sterilizer'),
    cssClass: 'multiselect',
  };

  constructor(
    private translate: TranslateService,
    private modalController: ModalController,
    private fb: FormBuilder,
    private navParams: NavParams,
    private UserContext: UserContext,
    private MaintenanceService: MaintenanceService,
    private LanguageService: LanguageService,
    private ToastService: ToastService,
  ) {
    this.initializeModalData();
    this.initializeForm();

    this.getSterilizers();
  }

  // --------------------------------------------------
  // Lifecycle
  // --------------------------------------------------

  ngOnInit(): void {}

  // --------------------------------------------------
  // Initialization
  // --------------------------------------------------

  private initializeModalData(): void {
    this.gettitle = this.navParams.get('title') ?? '';

    this.getMillStatus = this.navParams.get('millstatus') ?? '';
  }

  private initializeForm(): void {
    this.ffbcageForm = this.fb.group({
      txt_ffbcageinuse: [''],
      txt_ffbcagenotinuse: [''],
      txt_ffbcageunderipe: [''],
      txt_processcycles: [''],
      select_carryforwardcycles: [''],
      txt_estimatedffbbalance: [''],
    });
  }

  // --------------------------------------------------
  // Carry Forward Cycle
  // --------------------------------------------------

  carryForwardCyclesHandleChange(event: any): void {
    const selectedValues = event?.detail?.value ?? [];

    console.log(selectedValues);

    if (!selectedValues.length) {
      this.resetCycleValues();
      return;
    }

    this.cycleIdArr = [];
    this.cycleValueArr = [];

    for (const value of selectedValues) {
      const cycle = JSON.parse(value) as any;

      this.cycleIdArr.push(cycle.machine_id);
      this.cycleValueArr.push(cycle.machine_name);
    }

    this.cycleId = this.cycleIdArr.join(',');

    this.cycleValue = this.nl2br(this.cycleValueArr.join(', '));
  }

  private resetCycleValues(): void {
    this.cycleIdArr = [];
    this.cycleValueArr = [];

    this.cycleId = '';
    this.cycleValue = '';
  }

  // --------------------------------------------------
  // Get Sterilizers
  // --------------------------------------------------

  private getSterilizers(): void {
    const request = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      type: 1,
      language: this.LanguageService.getLanguage,
    };

    console.log('Get Sterilizers Request:', request);

    this.MaintenanceService.getSterilizersValue(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          console.log('Get Sterilizers Response:', response);

          if (response?.httpcode === 200) {
            this.carryForwardCyclesArr = response?.data ?? [];
          } else {
            this.carryForwardCyclesArr = [];
          }
        },

        error: (error: any) => {
          console.error('Get Sterilizers Error:', error);

          this.carryForwardCyclesArr = [];
        },
      });
  }

  // --------------------------------------------------
  // Save
  // --------------------------------------------------

  save(): void {
    const formValue = this.ffbcageForm.getRawValue();

    if (!formValue.txt_ffbcageinuse?.toString().trim()) {
      this.ToastService.warning(
        this.translate.instant('FFBCAGES.inusemandatory'),
      );

      return;
    }

    if (!formValue.txt_ffbcagenotinuse?.toString().trim()) {
      this.ToastService.warning(
        this.translate.instant('FFBCAGES.notinusemandatory'),
      );

      return;
    }

    if (!formValue.txt_ffbcageunderipe?.toString().trim()) {
      this.ToastService.warning(
        this.translate.instant('FFBCAGES.underrepairmandatory'),
      );

      return;
    }
    // ----------------------------------------------
    // Carry Forward Cycle Validation
    // ----------------------------------------------

    if (this.cycleIdArr.length > 0) {
      for (const cycleId of this.cycleIdArr) {
        if (cycleId == 0) {
          if (this.cycleIdArr.length === 1) {
            break;
          }

          this.ToastService.warning(
            this.translate.instant('PRODUCTIONDETAILS.nocycles'),
          );

          return;
        }
      }
    }

    // ----------------------------------------------
    // Request
    // ----------------------------------------------

    const request = {
      userid: this.UserContext.userId,
      departmentid: this.UserContext.departmentId,
      designationid: this.UserContext.designId,
      millcode: this.UserContext.millCode,

      total: '0',

      inuse: formValue.txt_ffbcageinuse,

      notinuse: formValue.txt_ffbcagenotinuse,

      underrepair: formValue.txt_ffbcageunderipe,

      language: this.LanguageService.getLanguage,

      isrefresh: '1',

      type: '',

      maintenance_notification_id: '',

      total_process_cycle: 0,

      total_forward_cycle: 0,

      estimate_ffb_balance: 0,
    };

    console.log('Save FFB Cage Request:', request);

    // ----------------------------------------------
    // API Call
    // ----------------------------------------------

    this.MaintenanceService.saveffbcages(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          console.log('Save FFB Cage Response:', response);

          if (response?.httpcode == 200) {
            this.modalController.dismiss({
              dismissed: true,
              item: 'Saved',
            });
          } else {
            this.cancel();
          }
        },

        error: (error) => {
          console.error('Save FFB Cage Error:', error);

          this.cancel();
        },
      });
  }

  // --------------------------------------------------
  // Cancel
  // --------------------------------------------------

  cancel(): void {
    this.modalController.dismiss({
      dismissed: true,
      item: '',
    });
  }

  // --------------------------------------------------
  // Number Filter
  // --------------------------------------------------

  numberFilter(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;

    const currentValue = inputElement.value ?? '';

    const pressedKey = event.key;

    const inputValue = currentValue + pressedKey;

    const regex = /^[0-9]{0,5}$/;

    if (!regex.test(inputValue)) {
      event.preventDefault();
    }
  }

  // --------------------------------------------------
  // Decimal Filter
  // --------------------------------------------------

  decimalFilter(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;

    const currentValue = inputElement.value ?? '';

    const pressedKey = event.key;

    const inputValue = currentValue + pressedKey;

    const regex = /^-?\d*(\.\d{0,2})?$/;

    if (!regex.test(inputValue)) {
      event.preventDefault();
    }
  }

  // --------------------------------------------------
  // Utility
  // --------------------------------------------------

  nl2br(text: string): string {
    return text.replace(/\r?\n/g, '<br />');
  }

  parseString(item: any): string {
    return JSON.stringify(item);
  }
}
