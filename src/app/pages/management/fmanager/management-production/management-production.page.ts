/* management-production.page.ts */
import {
  Component,
  OnInit,
  DestroyRef,
  inject,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ImageSliderComponent } from 'src/app/shared/components/image-slider/image-slider.component';
import { SterilizerService } from 'src/app/shared/services/production-services/sterilizer-service/sterilizer-service';
import { ProductionDatePickerComponent } from 'src/app/shared/components/management/production-date-picker/production-date-picker.component';
import { ManagementService } from 'src/app/shared/services/management-service/management-service';
import { TranslateService } from '@ngx-translate/core';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-management-production',
  templateUrl: './management-production.page.html',
  styleUrls: ['./management-production.page.scss'],
  standalone: false,
})
export class ManagementProductionPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  @ViewChild(ProductionDatePickerComponent)
  datePickerComponent!: ProductionDatePickerComponent;

  @ViewChild('pageHeader')
  pageHeader!: PageHeaderComponent;

  // Header Configuration
  appTitle: string = '';
  headerActions: string = '6,7';
  showLogo: number = 1;
  showBackButton: number = 0;

  // User Data
  userDesignation: number = 0;
  language: string = '';
  millCode: string = '';
  userId: number = 0;
  departmentId: number = 0;

  // Dates (in YYYY-MM-DD format for internal use)
  fromDate: string = '';
  toDate: string = '';

  // Counts
  productionCount: number = 0;
  productionCountLength: number = 0;
  maintenanceCount: number = 0;
  maintenanceCountLength: number = 0;
  totalCount: number = 0;

  // Flags
  noRecordsFlag: boolean = false;
  pleaseWaitFlag: boolean = false;

  // Production Data
  productionArr: any[] = [];

  // Flag to prevent multiple API calls
  private isInitialLoad: boolean = true;

  constructor(
    private router: Router,
    private modalController: ModalController,
    private userContext: UserContext,
    private languageService: LanguageService,
    private managementService: ManagementService,
    private sterilizerService: SterilizerService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
  ) {
    // Initialize user data
    this.userDesignation = this.userContext.designId || 0;
    this.language = this.languageService.getLanguage || 'English';
    this.millCode = this.userContext.millCode || '';
    this.userId = this.userContext.userId || 0;
    this.departmentId = this.userContext.departmentId || 0;

    // Set app title
    this.appTitle =
      this.userContext.designId == 1
        ? this.nl2br(this.userContext.millName)
        : this.translate.instant('GRADINGREPORT.gradingreport');
  }

  ngOnInit(): void {}

  ionViewDidEnter(): void {
    this.pageHeader?.getNotificationApi();
    // this.getNotificationCount();
    // Always load initial data to get dates from API
    this.getReport();
  }

  /**
   * Get notification counts (bell count API)
   */
  getNotificationCount(): void {
    const req = {
      userid: this.userId,
      departmentid: this.departmentId,
      design_id: this.userDesignation,
      millcode: this.millCode,
      language: this.languageService.getLanguage,
    };

    this.sterilizerService
      .getmaintenancependingcount(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response?.httpcode == 200) {
            this.productionCount = response.productioncount || 0;
            console.log('Product Count ->', this.productionCount);
            this.productionCountLength = this.productionCount.toString().length;
            this.maintenanceCount = response.maintenancecount || 0;
            this.maintenanceCountLength =
              this.maintenanceCount.toString().length;
            this.totalCount = this.productionCount + this.maintenanceCount;
          } else {
            this.resetCounts();
          }
        },
        error: () => {
          this.resetCounts();
        },
      });
  }

  /**
   * Reset counts to zero
   */
  private resetCounts(): void {
    this.productionCount = 0;
    this.productionCountLength = 1;
    this.maintenanceCount = 0;
    this.maintenanceCountLength = 1;
    this.totalCount = 0;
  }

  /**
   * Handle from date change from date picker
   */
  onFromDateChange(date: string): void {
    console.log('Parent - onFromDateChange:', date);
    this.fromDate = date;
    this.isInitialLoad = false;
  }

  /**
   * Handle to date change from date picker
   */
  onToDateChange(date: string): void {
    console.log('Parent - onToDateChange:', date);
    this.toDate = date;
    this.isInitialLoad = false;
  }

  /**
   * Handle get report event from date picker component
   */
  onDatePickerGetReport(event: { fromDate: string; toDate: string }): void {
    console.log('Parent - onDatePickerGetReport:', event);
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.isInitialLoad = false;
    this.getReport();
  }

  /**
   * Get production report data
   */
  getReport(): void {
    console.log('Parent - getReport called');
    console.log('Current fromDate:', this.fromDate);
    console.log('Current toDate:', this.toDate);

    this.productionArr = [];
    this.noRecordsFlag = false;
    this.pleaseWaitFlag = true;

    const req = {
      userid: this.userId,
      millcode: this.millCode,
      departmentid: this.departmentId,
      designationid: this.userDesignation,
      Fromdate: this.fromDate,
      Todate: this.toDate,
      language: this.languageService.getLanguage,
    };

    console.log('API Request:', req);

    this.managementService
      .getProductionData(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleaseWaitFlag = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (response: any) => {
          console.log('API Response:', response);

          // Always extract dates from response if available (even for 203/no records)
          if (response?.fromdate || response?.todate) {
            // Set dates from API response for initial load
            if (this.isInitialLoad || (!this.fromDate && !this.toDate)) {
              this.fromDate = response.fromdate || '';
              this.toDate = response.todate || '';
              this.isInitialLoad = false;

              // Update the date picker component with the new dates
              if (this.datePickerComponent) {
                this.datePickerComponent.setFromDate(this.fromDate);
                this.datePickerComponent.setToDate(this.toDate);
                this.cdr.detectChanges();
              }
            }
          }

          // Check if we have data
          if (response?.httpcode == 200 || response?.httpcode == '200') {
            // Process production data
            this.productionArr = this.processProductionData(
              response.data || [],
            );
            this.noRecordsFlag = this.productionArr.length == 0;
          } else {
            // No records found or other status
            this.productionArr = [];
            this.noRecordsFlag = true;
          }
        },
        error: (error) => {
          console.error('Error fetching production data:', error);
          this.productionArr = [];
          this.noRecordsFlag = true;
        },
      });
  }

  /**
   * Process production data and format alert data
   */
  private processProductionData(data: any[]): any[] {
    if (!data || data.length === 0) {
      return [];
    }

    const result: any[] = [];

    for (const item of data) {
      const alertData: any[] = [];

      if (item.alertdata && item.alertdata.length > 0) {
        for (const alert of item.alertdata) {
          alertData.push({
            alerttime: alert.alerttime || '',
            station: alert.station || '',
            parameters: this.nl2br(alert.parameters || ''),
            attendedby: alert.attendedby || '',
            attendedtime: alert.attendedtime || '',
            attendedstatus: alert.attendedstatus || 0,
            remarks: alert.remarks || '',
            images: alert.images || '',
          });
        }
      }

      result.push({
        start_date: item.start_date || '',
        stop_date: item.stop_date || '',
        startedby: item.startedby || '',
        alertdata: alertData,
      });
    }

    return result;
  }

  /**
   * Navigate to production alerts summary
   */
  productionAlerts(): void {
    this.router.navigate(['/management-production-summary']);
  }

  /**
   * Navigate to notification page
   */
  btnNotification(value: string): void {
    if (value == 'Production') {
      this.router.navigate(['/tabs/tabproduction']);
    } else {
      this.router.navigate(['/tabs/tabmaintenance']);
    }
  }

  /**
   * View images in modal using Swiper
   */
  async btnViewImages(images: string): Promise<void> {
    if (!images) return;

    const modal = await this.modalController.create({
      component: ImageSliderComponent,
      componentProps: {
        from: 'Alert',
        alertitem: images,
        swiperConfig: {
          initialSlide: 0,
          speed: 400,
          slidesPerView: 1,
          spaceBetween: 0,
          centeredSlides: true,
          autoplay: false,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        },
      },
      cssClass: ['image-slider-modal'],
    });

    await modal.present();
  }

  /**
   * Convert newlines to <br> tags
   */
  private nl2br(text: string): string {
    if (!text) return '';
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
