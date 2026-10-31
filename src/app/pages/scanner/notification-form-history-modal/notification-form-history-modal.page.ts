import {
  Component,
  OnInit,
  Input,
  ViewChild,
  DestroyRef,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';

import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';

@Component({
  selector: 'app-notification-form-history-modal',
  templateUrl: './notification-form-history-modal.page.html',
  styleUrls: ['./notification-form-history-modal.page.scss'],
  standalone: false,
})
export class NotificationFormHistoryModalPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  /**
   * Props passed via ModalController componentProps
   */
  @Input() item: string = ''; // JSON string of the history record
  @Input() from: string = ''; // 'CM' | 'RoPM' | 'RePM' | 'PM'

  // Header Configuration
  appTitle: string = '';
  headerActions: string = '0';
  showLogo: number = 0;
  showBackButton: number = 1;

  // User Data
  userId: number = 0;
  millCode: string = '';
  departmentId: number = 0;
  designationId: number = 0;

  // Params
  params: any;
  notificationId: string = '';
  fromScreen: string = '';
  screenName: string = '';

  // Data Arrays
  generalArr: any[] = [];
  cmPartsListArr: any[] = [];
  ropmPartsListArr: any[] = [];
  repmPartsListArr: any[] = [];

  // General Fields
  notificationStatus: string = '';
  notificationStatusId: string = '';
  notificationNo: string = '';
  notificationType: string = '';
  stationCode: string = '';
  station: string = '';
  equipment: string = '';
  reportedBy: string = '';
  breakdownRemarks: string = '';
  breakdownCoding: string = '';
  maintenanceType: string = '';
  partDefect: string = '';
  partDefectId: string = '';
  damage: string = '';
  breakdownCauses: string = '';
  remarks: string = '';
  createdDateTime: string = '';
  maximumRunningHours: string = '';
  runningHours: string = '';
  extendedMaximumRunningHours: string = '';

  // Repair Activity Fields
  activity: string = '';
  partReceivedDateTime: string = '';
  activityCompletionDateTime: string = '';
  carriedOutBy: string = '';
  verifiedBy: string = '';

  // Job Authorization Fields
  authorizedBy: string = '';
  authorizedDateTime: string = '';

  // Flags
  detailsNoRecordFlag: boolean = false;
  repairActivityNoRecordFlag: boolean = false;
  jobAuthorizationNoRecordFlag: boolean = false;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
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

  ngOnInit(): void {
    this.initializeFromInputs();
  }

  /**
   * Read the inputs (from ModalController componentProps)
   * and set the notification ID + fromScreen
   */
  private initializeFromInputs(): void {
    if (this.item) {
      try {
        this.params = JSON.parse(this.item);
        this.notificationId = this.params.id || '';
      } catch (e) {
        console.error('Failed to parse item:', e);
        this.params = null;
      }
    }

    if (this.from) {
      this.fromScreen = this.from;
    }

    // Fetch the view data
    this.getNotificationView();
  }

  /**
   * Get Notification View Data (API)
   */
  getNotificationView(): void {
    if (!this.notificationId) {
      console.warn('No notificationId to fetch');
      return;
    }

    const req = {
      user_id: this.userId,
      millcode: this.millCode,
      dept_id: this.departmentId,
      id: this.notificationId,
      language: this.languageService.getLanguage,
    };

    console.log('getNotificationView Request:', req);

    this.maintenanceService
      .getNotificationView(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          console.log('getNotificationView Response:', response);

          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.generalArr = response.data?.general || [];
            this.processGeneralData();
          } else {
            this.clearData();
          }
        },
        error: (error) => {
          console.error('Error fetching notification view:', error);
          this.clearData();
        },
      });
  }

  /**
   * Process the general response data
   */
  private processGeneralData(): void {
    if (!this.generalArr || this.generalArr.length === 0) {
      this.clearData();
      return;
    }

    const g = this.generalArr[0];

    // General
    this.notificationStatus = g.statusname || '';
    this.notificationStatusId = g.statusId || '';
    this.notificationNo = g.notificationno || '';
    this.stationCode = g.stationcode || '';

    // Notification Type
    if (this.fromScreen === 'RoPM') {
      this.notificationType = 'Routine ' + (g.notificationtype || '');
    } else if (this.fromScreen === 'RePM') {
      this.notificationType = 'Replacement ' + (g.notificationtype || '');
    } else {
      this.notificationType = g.notificationtype || '';
    }

    this.breakdownRemarks = g.breakdownremarks || '';
    this.breakdownCoding = g.breakdowncoding || '';
    this.maintenanceType = g.maintenancetype || '';

    this.station = g.stationname || '';
    this.equipment = g.equipment || '';

    this.maximumRunningHours = g.lifetimehours || '';
    this.extendedMaximumRunningHours = g.extendedlifetimehours || '';

    this.partDefectId = g.partdefectid || '';

    this.damage = g.damages || '';
    this.breakdownCauses = g.breakdowncauses || '';
    this.remarks = g.remarks || '';
    this.createdDateTime = g.insDate || '';

    this.reportedBy = g.reportBy || '';

    // Repair Activity
    this.activity = g.activity || '';
    this.partReceivedDateTime = g.partreceiveddatetime || '';
    this.activityCompletionDateTime = g.workcompletiondatetime || '';
    this.carriedOutBy = g.carriedoutby || '';
    this.verifiedBy = g.verifiedby || '';

    // Job Authorization
    this.authorizedBy = g.authorisedBy || '';
    this.authorizedDateTime = g.acknowledgeddatetime || '';

    // Set flags
    this.detailsNoRecordFlag = this.isDetailsEmpty();
    this.repairActivityNoRecordFlag = this.isRepairActivityEmpty();
    this.jobAuthorizationNoRecordFlag = this.isJobAuthorizationEmpty();

    // Handle multi-part logic
    const partDefectIds = (this.partDefectId || '').split(',');

    if (this.fromScreen === 'CM' && partDefectIds.length > 1) {
      this.getParts(
        g.stationid,
        g.equipmentid,
        2,
        g.runningHours,
        g.partdefect,
      );
    } else if (this.fromScreen === 'RoPM' && partDefectIds.length > 1) {
      this.getParts(
        g.stationid,
        g.equipmentid,
        0,
        g.runningHours,
        g.partdefect,
      );
    } else if (this.fromScreen === 'RePM' && partDefectIds.length > 1) {
      this.getParts(
        g.stationid,
        g.equipmentid,
        1,
        g.runningHours,
        g.partdefect,
      );
    } else if (this.partDefect === '') {
      // No single part defect — check per screen
      if (this.fromScreen === 'CM' || this.fromScreen === 'CMVIEW') {
        if (this.damage === '' && this.activity === '') {
          this.getParts(
            g.stationid,
            g.equipmentid,
            2,
            g.runningHours,
            g.partdefect,
          );
        } else {
          this.runningHours = g.runningHours || '';
          this.partDefect = g.partdefect || '';
        }
      } else if (this.fromScreen === 'RoPM' || this.fromScreen === 'RoPMVIEW') {
        this.getParts(
          g.stationid,
          g.equipmentid,
          0,
          g.runningHours,
          g.partdefect,
        );
      } else if (this.fromScreen === 'RePM' || this.fromScreen === 'RePMVIEW') {
        this.getParts(
          g.stationid,
          g.equipmentid,
          1,
          g.runningHours,
          g.partdefect,
        );
      }
    }
  }

  /**
   * Check if the details section is empty
   */
  private isDetailsEmpty(): boolean {
    return (
      this.station === '' &&
      this.equipment === '' &&
      this.runningHours === '' &&
      this.partDefect === '' &&
      this.damage === '' &&
      this.breakdownCauses === '' &&
      this.remarks === '' &&
      this.createdDateTime === ''
    );
  }

  /**
   * Check if the repair activity section is empty
   */
  private isRepairActivityEmpty(): boolean {
    return (
      this.activity === '' &&
      this.partReceivedDateTime === '' &&
      this.activityCompletionDateTime === '' &&
      this.carriedOutBy === '' &&
      this.verifiedBy === ''
    );
  }

  /**
   * Check if the job authorization section is empty
   */
  private isJobAuthorizationEmpty(): boolean {
    return this.authorizedBy === '' && this.authorizedDateTime === '';
  }

  /**
   * Get Multiple Parts list for a given pvflag
   *  - 0 = RoPM
   *  - 1 = RePM
   *  - 2 = CM
   */
  getParts(
    stationId: string,
    equipmentId: string,
    pvFlag: number,
    fallbackRunningHours: string,
    fallbackPartDefect: string,
  ): void {
    const req = {
      userid: this.userId,
      departmentid: this.departmentId,
      designationid: this.designationId,
      millcode: this.millCode,
      id: this.notificationId,
      partdefectid: this.partDefectId,
      stationid: stationId,
      equipment: equipmentId,
      pvflag: pvFlag,
      language: this.languageService.getLanguage,
    };

    console.log('getParts Request:', req);

    this.maintenanceService
      .getMultiPartDefectViewList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          console.log('getParts Response:', response);

          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.runningHours = '';
            this.partDefect = '';

            if (pvFlag === 0) {
              this.ropmPartsListArr = response.data || [];
            } else if (pvFlag === 1) {
              this.repmPartsListArr = response.data || [];
            } else {
              this.cmPartsListArr = response.data || [];
            }
          } else {
            // Fallback to single values
            this.runningHours = fallbackRunningHours || '';
            this.partDefect = fallbackPartDefect || '';

            if (pvFlag === 0) {
              this.ropmPartsListArr = [];
            } else if (pvFlag === 1) {
              this.repmPartsListArr = [];
            } else {
              this.cmPartsListArr = [];
            }
          }
        },
        error: (error) => {
          console.error('Error fetching parts:', error);

          this.runningHours = fallbackRunningHours || '';
          this.partDefect = fallbackPartDefect || '';

          if (pvFlag === 0) {
            this.ropmPartsListArr = [];
          } else if (pvFlag === 1) {
            this.repmPartsListArr = [];
          } else {
            this.cmPartsListArr = [];
          }
        },
      });
  }

  /**
   * Clear all data (used on error or empty response)
   */
  private clearData(): void {
    this.generalArr = [];
    this.notificationStatus = '';
    this.notificationStatusId = '';
    this.notificationNo = '';
    this.stationCode = '';
    this.notificationType = '';
    this.breakdownCoding = '';
    this.maintenanceType = '';
    this.station = '';
    this.equipment = '';
    this.runningHours = '';
    this.partDefect = '';
    this.damage = '';
    this.breakdownCauses = '';
    this.remarks = '';
    this.createdDateTime = '';
    this.activity = '';
    this.partReceivedDateTime = '';
    this.activityCompletionDateTime = '';
    this.carriedOutBy = '';
    this.verifiedBy = '';
    this.reportedBy = '';
    this.authorizedBy = '';
    this.authorizedDateTime = '';
    this.cmPartsListArr = [];
    this.ropmPartsListArr = [];
    this.repmPartsListArr = [];
  }
}
