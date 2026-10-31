/* part-running-hours.page.ts */
import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';

@Component({
  selector: 'app-part-running-hours',
  templateUrl: './part-running-hours.page.html',
  styleUrls: ['./part-running-hours.page.scss'],
  standalone: false,
})
export class PartRunningHoursPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  // Header Configuration
  appTitle: string = this.translate.instant('MACHINERUNNINGHOURS.title');
  showLogo: number = 0;
  showBackButton: number = 1;
  headerActions: string = '';

  // User Data
  userId: number = 0;
  millCode: string = '';
  departmentId: number = 0;
  designationId: number = 0;

  // Form
  runningHoursForm: FormGroup;

  // Station
  stationArr: any[] = [];
  stationId: string = '';
  stationValue: string = '';
  defaultStation: string = '';

  // Machine
  machineArr: any[] = [];
  machineId: string = '';
  machineValue: string = '';
  defaultMachine: string = '';

  // Data Arrays
  machineRunningHoursArr: any[] = [];
  runningHoursArr: any[] = [];

  // Flags
  enableMachineFlag: boolean = false;
  noRecordsFlag: boolean = false;
  pleaseWaitFlag: boolean = false;

  // Options
  public stationOptions: any = {
    header: this.translate.instant('MACHINERUNNINGHOURS.station'),
    cssClass: 'singleselect',
  };

  public machineOptions: any = {
    header: this.translate.instant('MACHINERUNNINGHOURS.machine'),
    cssClass: 'singleselect',
  };

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private userContext: UserContext,
    private languageService: LanguageService,
    private maintenanceService: MaintenanceService,
  ) {
    // Initialize user data from UserContext
    this.userId = this.userContext.userId || 0;
    this.millCode = this.userContext.millCode || '';
    this.departmentId = this.userContext.departmentId || 0;
    this.designationId = this.userContext.designId || 0;

    // Initialize form
    this.runningHoursForm = this.fb.group({
      select_station: new FormControl('', Validators.required),
      select_machine: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  ionViewDidEnter(): void {
    this.getStationList();
  }

  /**
   * Get Station List
   */
  getStationList(): void {
    const req = {
      user_id: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      language: this.languageService.getLanguage,
    };

    console.log('getStationList Request:', req);

    this.maintenanceService
      .getStationList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          console.log('getStationList Response:', response);

          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.stationArr = response.data || [];

            // Set default station to first value
            if (this.stationArr.length > 0) {
              const firstStation = this.stationArr[0];
              this.defaultStation =
                firstStation.station_id + '~' + firstStation.station_name;
              this.stationId = String(firstStation.station_id);
              this.stationValue = firstStation.station_name;

              // Set form value
              this.runningHoursForm.patchValue({
                select_station: this.defaultStation,
              });

              // Get machines for the default station
              this.getMachineList(this.stationId);
            }
          } else {
            this.stationArr = [];
            this.defaultStation = '';
          }
        },
        error: (error) => {
          console.error('Error fetching station list:', error);
          this.stationArr = [];
          this.defaultStation = '';
        },
      });
  }

  /**
   * Handle Station Change
   */
  onStationChange(event: any): void {
    const value = event.detail.value;
    if (value && value.length > 0) {
      const splitData = value.split('~');
      this.stationId = splitData[0];
      this.stationValue = splitData[1];

      // Reset machine selection
      this.runningHoursForm.patchValue({
        select_machine: '',
      });
      this.defaultMachine = '';
      this.machineRunningHoursArr = [];
      this.runningHoursArr = [];

      this.getMachineList(this.stationId);
    } else {
      this.stationId = '';
      this.stationValue = '';
    }
  }

  /**
   * Get Machine List
   */
  getMachineList(stationId: string): void {
    const req = {
      user_id: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      stationid: stationId,
      language: this.languageService.getLanguage,
    };

    console.log('getMachineList Request:', req);

    this.maintenanceService
      .getMachineList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          console.log('getMachineList Response:', response);

          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.machineArr = response.data || [];
            this.enableMachineFlag = true;

            // Set default machine to first value
            if (this.machineArr.length > 0) {
              const firstMachine = this.machineArr[0];
              this.defaultMachine =
                firstMachine.location_id + '~' + firstMachine.location_name;
              this.machineId = String(firstMachine.location_id);
              this.machineValue = firstMachine.location_name;

              // Set form value
              this.runningHoursForm.patchValue({
                select_machine: this.defaultMachine,
              });

              // Get report for default machine
              this.getReport();
            }
          } else {
            this.machineArr = [];
            this.defaultMachine = '';
            this.enableMachineFlag = false;
          }
        },
        error: (error) => {
          console.error('Error fetching machine list:', error);
          this.machineArr = [];
          this.defaultMachine = '';
          this.enableMachineFlag = false;
        },
      });
  }

  /**
   * Handle Machine Change
   */
  onMachineChange(event: any): void {
    const value = event.detail.value;
    if (value && value.length > 0) {
      const splitData = value.split('~');
      this.machineId = splitData[0];
      this.machineValue = splitData[1];

      this.getReport();
    } else {
      this.machineId = '';
      this.machineValue = '';
    }
  }

  /**
   * Get Parts Running Hours Report
   */
  getReport(): void {
    this.machineRunningHoursArr = [];
    this.runningHoursArr = [];
    this.noRecordsFlag = false;
    this.pleaseWaitFlag = true;

    const req = {
      userid: this.userId,
      departmentid: this.departmentId,
      design_id: this.designationId,
      stationid: this.stationId,
      locationid: this.machineId,
      millcode: this.millCode,
      language: this.languageService.getLanguage,
    };

    console.log('getReport Request:', req);

    this.maintenanceService
      .getPartsRunningHoursList(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleaseWaitFlag = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          console.log('getReport Response:', response);

          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.noRecordsFlag = false;
            this.runningHoursArr = response.data || [];
            this.machineRunningHoursArr = response.machine || [];
          } else {
            this.machineRunningHoursArr = response.machine || [];
            this.runningHoursArr = [];
            this.noRecordsFlag = true;
          }
        },
        error: (error) => {
          console.error('Error fetching parts running hours:', error);
          this.machineRunningHoursArr = [];
          this.runningHoursArr = [];
          this.noRecordsFlag = true;
        },
      });
  }

  /**
   * Convert newlines to <br> tags
   */
  private nl2br(text: string): string {
    if (!text) return '';
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
