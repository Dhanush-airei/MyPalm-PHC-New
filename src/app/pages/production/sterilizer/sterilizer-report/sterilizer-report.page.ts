import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Platform, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { SterilizerService } from 'src/app/shared/services/production-services/sterilizer-service/sterilizer-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { ImageSliderComponent } from 'src/app/shared/components/image-slider/image-slider.component';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-sterilizer-report',
  templateUrl: './sterilizer-report.page.html',
  styleUrls: ['./sterilizer-report.page.scss'],
  standalone: false,
})
export class SterilizerReportPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  @ViewChild('pageHeader')
  pageHeader!: PageHeaderComponent;

  // Header Configuration
  appTitle: string = '';
  headerActions = '';
  showLogo: number = 0;
  showBackButton = 0;

  // Date Related
  reportDate: string = '';
  externalDate: string = '';
  getDate: string = '';

  // Data Arrays
  sterilizerhourlyperformanceArr: any[] = [];

  // Flags
  norecordsflag: boolean = false;
  pleasewaitflag: boolean = false;
  private isFirstLoad: boolean = true;

  // Notification Counts
  count: number = 0;
  pendingcount: number = 0;
  pendingcountlength: number = 0;

  constructor(
    private platform: Platform,
    private languageService: LanguageService,
    private translate: TranslateService,
    public modalController: ModalController,
    private userContext: UserContext,
    private sterilizerService: SterilizerService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    if (this.isFirstLoad) {
      // this.isFirstLoad = false;
      this.pageHeader?.getNotificationApi();
      this.getProductionPendingCount();
      this.getReport();
    }
    if (this.userContext.designId == 8) {
      ((this.appTitle = this.nl2br(this.userContext.millName)),
        (this.headerActions = '2'));
      this.showLogo = 1;
      this.showBackButton = 0;
    } else {
      ((this.appTitle = this.translate.instant('REPORTS.sterilizationstation')),
        (this.headerActions = '0'));
      this.showLogo = 0;
      this.showBackButton = 1;
    }
  }

  /**
   * Handle date range from date picker
   */
  onDateRangeGet(event: { date: string }): void {
    this.reportDate = event.date;
    console.log('Selected Date:', this.reportDate);
    this.getReport();
  }

  /**
   * Get production pending count
   */
  getProductionPendingCount(): void {
    const req = {
      userid: this.userContext.userId,
      departmentid: this.userContext.departmentId,
      design_id: this.userContext.designId,
      millcode: this.userContext.millCode,
      language: this.languageService.getLanguage,
    };

    console.log(req);

    this.sterilizerService
      .getmaintenancependingcount(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          if (result.httpcode == 200) {
            this.pendingcount = result.count;
            this.pendingcountlength = this.pendingcount.toString().length;
          } else {
            this.pendingcount = 0;
            this.pendingcountlength = this.pendingcount.toString().length;
          }
        },
        error: (err) => {
          console.error('Failed to get pending count:', err);
          this.pendingcount = 0;
          this.pendingcountlength = this.pendingcount.toString().length;
        },
      });
  }

  /**
   * Get Sterilizer Report
   */
  getReport(): void {
    // Clear existing data
    this.sterilizerhourlyperformanceArr = [];
    this.norecordsflag = false;
    this.pleasewaitflag = true;

    // Format date for API
    if (this.reportDate != '') {
      this.getDate = this.reportDate;
    } else {
      this.getDate = '';
    }

    const req = {
      userid: this.userContext.userId,
      millcode: this.userContext.millCode,
      Fromdate: this.getDate,
      language: this.languageService.getLanguage,
    };

    console.log('Report Request:', req);

    this.sterilizerService
      .getsterilizervalue(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleasewaitflag = false;
        }),
      )
      .subscribe({
        next: (result: any) => {
          console.log('Report Response:', result);

          // If Fromdate is returned from API, update the date picker
          if (result.Fromdate) {
            this.externalDate = result.Fromdate;
            // Update the reportDate with the API returned date
            this.reportDate = result.Fromdate;
          }

          // Check for error status (202 means no data found)
          if (result.httpcode == 202 || result.httpcode == '202') {
            this.sterilizerhourlyperformanceArr = [];
            this.norecordsflag = true;
            // Don't show toast for 202 - just show "No records found" in UI
            return;
          }

          if (result.httpcode == 200) {
            this.sterilizerhourlyperformanceArr = result.data || [];
            this.norecordsflag = false;
          } else {
            this.sterilizerhourlyperformanceArr = [];
            this.norecordsflag = true;
            // Show error toast only for unexpected errors
            this.toastService.error(
              this.translate.instant('NORECORDSFOUND.norecordsfound'),
            );
          }
        },
        error: (err) => {
          console.error('Failed to get sterilizer report:', err);
          this.sterilizerhourlyperformanceArr = [];
          this.norecordsflag = true;
          this.toastService.error(
            this.translate.instant('NORECORDSFOUND.norecordsfound'),
          );
        },
      });
  }

  /**
   * View Images using ImageSliderComponent
   */
  async btn_ViewImages(
    bpvimages: string,
    p1images: string,
    p3images: string,
  ): Promise<void> {
    let imagesArr: string[] = [];

    // Combine all images
    if (bpvimages && bpvimages != '') {
      const bpvArr = bpvimages.split('~').filter((img) => img.trim() !== '');
      imagesArr = imagesArr.concat(bpvArr);
    }

    if (p1images && p1images != '') {
      const p1Arr = p1images.split('~').filter((img) => img.trim() !== '');
      imagesArr = imagesArr.concat(p1Arr);
    }

    if (p3images && p3images != '') {
      const p3Arr = p3images.split('~').filter((img) => img.trim() !== '');
      imagesArr = imagesArr.concat(p3Arr);
    }

    if (imagesArr.length > 0) {
      const modal = await this.modalController.create({
        component: ImageSliderComponent,
        componentProps: {
          from: 'Sterilisation',
          bpvitem: bpvimages,
          p1item: p1images,
          p3item: p3images,
        },
        cssClass: 'image-slider-modal',
        showBackdrop: true,
        backdropDismiss: true,
      });

      await modal.present();
    } else {
      this.toastService.error(
        this.translate.instant('HOURLYPRESSSTATIONSAVE.imagenotfound'),
      );
    }
  }

  /**
   * Convert newline to <br>
   */
  nl2br(text: string): string {
    if (!text) return '';
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
