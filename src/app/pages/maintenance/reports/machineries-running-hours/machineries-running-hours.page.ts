/* machineries-running-hours.page.ts */
import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';

@Component({
  selector: 'app-machineries-running-hours',
  templateUrl: './machineries-running-hours.page.html',
  styleUrls: ['./machineries-running-hours.page.scss'],
  standalone: false,
})
export class MachineriesRunningHoursPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  // Header Configuration
  appTitle: string = this.translate.instant('MACHINERUNNINGHOURS.title1');
  showLogo: number = 0;
  showBackButton: number = 1;
  headerActions: string = '';

  // User Data
  userId: number = 0;
  millCode: string = '';
  departmentId: number = 0;
  designationId: number = 0;

  // Date
  reportDateDisplay: string = ''; // DD-MM-YYYY format for display
  reportDateExternal: string = ''; // YYYY-MM-DD format from API
  private reportDateForAPI: string = ''; // YYYY-MM-DD format for API

  // Data Arrays
  millDetailsArr: any[] = [];
  machineriesListArr: any[] = [];
  filteredStationsArr: any[] = [];
  stationListArr: any[] = [];

  // Flags
  noRecordsFlag: boolean = false;
  pleaseWaitFlag: boolean = false;

  // Selected Station
  selectedStationId: string = '';

  constructor(
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
  }

  ngOnInit(): void {}

  ionViewDidEnter(): void {
    this.getStationList();
  }

  /**
   * Handle date selected from date picker
   */
  onDateSelected(event: { date: string }): void {
    console.log('Date selected:', event);
    // Date is in YYYY-MM-DD format from the date picker
    this.reportDateForAPI = event.date;
    // Store in DD-MM-YYYY format for display
    this.reportDateDisplay = this.formatDateFromString(event.date);
    // Reset external date to avoid overriding user selection
    this.reportDateExternal = '';

    console.log('Date selected - API format:', this.reportDateForAPI);
    console.log('Date selected - Display format:', this.reportDateDisplay);

    this.getMachineries();
  }

  /**
   * Get Station List
   */
  getStationList(): void {
    this.pleaseWaitFlag = true;

    const req = {
      user_id: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      language: this.languageService.getLanguage,
    };

    console.log('getStationList Request:', req);

    this.maintenanceService
      .getStationList(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          // this.pleaseWaitFlag = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          console.log('getStationList Response:', response);

          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.stationListArr = response.data || [];
            this.getMachineries();
          } else {
            this.stationListArr = [];
            this.getMachineries();
          }
        },
        error: (error) => {
          console.error('Error fetching station list:', error);
          this.stationListArr = [];
          this.getMachineries();
        },
      });
  }

  /**
   * Get Machineries Running Hours
   */
  getMachineries(): void {
    const fromDate = this.reportDateForAPI || '';

    this.millDetailsArr = [];
    this.machineriesListArr = [];
    this.noRecordsFlag = false;
    this.pleaseWaitFlag = true;

    const req = {
      userid: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      Fromdate: fromDate,
      design_id: this.designationId,
      language: this.languageService.getLanguage,
    };

    console.log('getMachineries Request:', req);

    this.maintenanceService
      .getMachineriesRunningHours(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleaseWaitFlag = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          console.log('getMachineries Response:', response);

          // Prefill date from API response if no date was sent
          if (!fromDate) {
            if (response?.Fromdate) {
              // Store in YYYY-MM-DD format for API
              this.reportDateForAPI = response.Fromdate;
              // Store in DD-MM-YYYY format for display
              this.reportDateDisplay = this.formatDateFromString(
                response.Fromdate,
              );
              this.reportDateExternal = response.Fromdate;
              console.log('Date prefilled from API:', this.reportDateDisplay);
            }
          }

          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.millDetailsArr = response.data?.milldata || [];
            this.machineriesListArr = response.data?.stations || [];
            this.filteredStationsArr = this.machineriesListArr;

            // Apply station filter if selected
            this.applyStationFilter();

            this.noRecordsFlag = false;
          } else {
            this.millDetailsArr = [];
            this.machineriesListArr = [];
            this.noRecordsFlag = true;
          }
        },
        error: (error) => {
          console.error('Error fetching machineries:', error);
          this.millDetailsArr = [];
          this.machineriesListArr = [];
          this.noRecordsFlag = true;
        },
      });
  }

  /**
   * Handle Station Filter Change
   */
  onStationChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedStationId = selectElement.value;
    this.applyStationFilter();
  }

  /**
   * Apply Station Filter
   */
  private applyStationFilter(): void {
    if (this.selectedStationId == '') {
      this.machineriesListArr = this.filteredStationsArr;
    } else {
      const filtered = this.filteredStationsArr.filter(
        (item) => item.stationid === parseInt(this.selectedStationId),
      );
      this.machineriesListArr = filtered;
    }
  }

  /**
   * Get Status Text Color based on statusId
   */
  getStatusTextColor(statusId: string): string {
    const status = String(statusId);
    const colorMap: { [key: string]: string } = {
      '0': '#ffffff', // Stopped
      '1': '#00ff00', // Running
      '2': '#ff9a00', // Abnormal
      '3': '#ff0000', // Breakdown
    };
    return colorMap[status] || '#ffffff';
  }

  /**
   * Format date from YYYY-MM-DD to DD-MM-YYYY
   */
  private formatDateFromString(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  /**
   * Convert newlines to <br> tags
   */
  private nl2br(text: string): string {
    if (!text) return '';
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
