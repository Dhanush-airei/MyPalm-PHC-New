import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  NgZone,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Platform, ModalController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ImageSliderComponent } from 'src/app/shared/components/image-slider/image-slider.component';
import { AlertAcknowledgePage } from 'src/app/pages/production/sterilizer/alert-acknowledge/alert-acknowledge.page';
import { SterilizerService } from 'src/app/shared/services/production-services/sterilizer-service/sterilizer-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { NotificationService } from 'src/app/shared/services/notification-service/notification-service';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-sterilizer-alert',
  templateUrl: './sterilizer-alert.page.html',
  styleUrls: ['./sterilizer-alert.page.scss'],
  standalone: false,
})
export class SterilizerAlertPage implements OnInit {
  private destroyRef = inject(DestroyRef);
  private zone = inject(NgZone);

  @ViewChild('pageHeader')
  pageHeader!: PageHeaderComponent;

  // Header Configuration
  appTitle: string = this.nl2br(this.userContext.millName);
  headerActions = '2';
  showLogo = 1;
  showBackButton = 0;

  // User Data
  mill_name: string = '';
  departmentid: any = '';
  designationid: any = this.userContext.designId;
  getplatform: string = '';

  // Notification Counts
  count: number = 0;
  pendingcount: number = 0;
  pendingcountlength: number = 0;

  // Notification Arrays
  todaysnotificationArr: any[] = [];
  oldernotificationArr: any[] = [];

  // Notification Counts
  todaysnotificationcount: number = 0;
  oldernotificationcount: number = 0;

  // Flags
  todaysnotificationflag: boolean = false;
  oldernotificationflag: boolean = false;

  // Click counters
  todaysnotificationclick: number = 0;
  oldernotificationclick: number = 0;

  // Other variables
  filterstatus: string = '';
  enableflag: boolean = false;
  isDisable: boolean = false;
  currentdate: string = '';

  private isFirstLoad: boolean = true;

  constructor(
    private platform: Platform,
    private languageService: LanguageService,
    private translate: TranslateService,
    private activatedroute: ActivatedRoute,
    private alertController: AlertController,
    public modalController: ModalController,
    private router: Router,
    private userContext: UserContext,
    private sterilizerService: SterilizerService,
    private toastService: ToastService,
    private notificationService: NotificationService,
  ) {
    console.log('Designation ID -> ', this.designationid);
    this.setCurrentDate();
    this.setPlatform();

    this.activatedroute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        if (
          this.designationid == 3 ||
          this.designationid == 7 ||
          this.designationid == 8
        ) {
          this.getalert();
        } else {
          this.getNotification();
        }
      });
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.count = parseInt(localStorage.getItem('badge_count') || '0');
    if (this.isFirstLoad) {
      this.updateNotification();
    }
  }

  /**
   * Set current date in DD-MM-YYYY format
   */
  private setCurrentDate(): void {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    this.currentdate = `${day}-${month}-${year}`;
  }

  /**
   * Set platform (android/ios)
   */
  private setPlatform(): void {
    if (this.platform.is('android')) {
      this.getplatform = 'android';
    } else if (this.platform.is('ios')) {
      this.getplatform = 'ios';
    }
  }

  /**
   * Update notification data
   */
  updateNotification(): void {
    this.zone.run(() => {
      this.count = parseInt(localStorage.getItem('badge_count') || '0');

      if (
        this.designationid == 3 ||
        this.designationid == 7 ||
        this.designationid == 8
      ) {
        this.getalert();
      } else {
        this.getNotification();
      }
    });
  }

  /**
   * Navigate to notification page
   */
  btn_notification(): void {
    localStorage.setItem('badge_count', '0');
    this.updateNotification();

    if (
      this.designationid == 3 ||
      this.designationid == 7 ||
      this.designationid == 8
    ) {
      this.router.navigate(['/segregatenotification']);
    } else {
      this.getNotification();
    }
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
   * Get border color based on notification type
   */
  getBorderColor(value: string): string {
    let color = '#ffffff';

    if (value == '1')
      color = '#FF9800'; // Sterilizer
    else if (value == '2')
      color = '#03A9F4'; // Press
    else if (value == '3')
      color = '#F44336'; // Oil loss
    else if (value == '4')
      color = '#4CAF50'; // Grading
    else if (value == '6') color = '#B82E8A'; // Sensor Data

    return color;
  }

  /**
   * Get background color based on notification type
   */
  getBackgroundColor(value: string): string {
    let color = '#ffffff';

    if (value == '1')
      color = '#FFF3E0'; // Sterilizer
    else if (value == '2')
      color = '#E1F5FE'; // Press
    else if (value == '3')
      color = '#FFEBEE'; // Oil loss
    else if (value == '4')
      color = '#E8F5E9'; // Grading
    else if (value == '6') color = '#FAEBF5'; // Sensor Data

    return color;
  }

  /**
   * Get text color (always white for header)
   */
  getTextColor(value: string): string {
    return '#ffffff';
  }

  /**
   * Toggle today's notification visibility
   */
  gettodaysnotification(): void {
    this.todaysnotificationclick = this.todaysnotificationclick === 0 ? 1 : 0;
    this.oldernotificationclick = 0;

    this.todaysnotificationflag = this.todaysnotificationclick === 1;
    this.oldernotificationflag = false;
  }

  /**
   * Toggle older notification visibility
   */
  getoldernotification(): void {
    this.todaysnotificationclick = 0;
    this.oldernotificationclick = this.oldernotificationclick === 0 ? 1 : 0;

    this.todaysnotificationflag = false;
    this.oldernotificationflag = this.oldernotificationclick === 1;
  }

  /**
   * Get notifications
   */
  getNotification(): void {
    this.filterstatus = '3';

    const req = {
      userid: this.userContext.userId,
      departmentid: this.userContext.departmentId,
      designationid: this.userContext.designId,
      millcode: this.userContext.millCode,
      filter: this.filterstatus,
      language: this.languageService.getLanguage,
    };

    console.log(req);

    this.notificationService
      .getsegregatenotification(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          if (result.httpcode == 200) {
            this.todaysnotificationcount = result.todaycount;
            this.oldernotificationcount = result.oldercount;
            this.todaysnotificationArr = result.data.today;
            this.oldernotificationArr = result.data.older;
            this.enableflag = false;
          } else {
            this.todaysnotificationcount = 0;
            this.oldernotificationcount = 0;
            this.todaysnotificationArr = [];
            this.oldernotificationArr = [];
            this.enableflag = true;
          }
          this.getProductionPendingCount();
        },
        error: (err) => {
          console.error('Failed to get notifications:', err);
          this.todaysnotificationcount = 0;
          this.oldernotificationcount = 0;
          this.todaysnotificationArr = [];
          this.oldernotificationArr = [];
          this.enableflag = true;
          this.getProductionPendingCount();
        },
      });
  }

  /**
   * Get alerts
   */
  getalert(): void {
    const req = {
      userid: this.userContext.userId,
      departmentid: this.userContext.departmentId,
      millcode: this.userContext.millCode,
      filter: '4',
      language: this.languageService.getLanguage,
    };

    console.log(req);

    this.notificationService
      .getalertnotification(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          if (result.httpcode == 200) {
            this.todaysnotificationcount = result.todaycount;
            this.oldernotificationcount = result.oldercount;

            // Process today's notifications
            if (result.data.today && result.data.today.length > 0) {
              this.todaysnotificationArr = result.data.today.map(
                (item: any) => ({
                  ...item,
                  notification_text: this.nl2br(item.notification_text),
                }),
              );
            } else {
              this.todaysnotificationArr = [];
            }

            // Process older notifications
            if (result.data.older && result.data.older.length > 0) {
              this.oldernotificationArr = result.data.older.map(
                (item: any) => ({
                  ...item,
                  notification_text: this.nl2br(item.notification_text),
                }),
              );
            } else {
              this.oldernotificationArr = [];
            }

            this.enableflag = false;
          } else {
            this.todaysnotificationcount = 0;
            this.oldernotificationcount = 0;
            this.todaysnotificationArr = [];
            this.oldernotificationArr = [];
            this.enableflag = true;
          }
          this.getProductionPendingCount();
        },
        error: (err) => {
          console.error('Failed to get alerts:', err);
          this.todaysnotificationcount = 0;
          this.oldernotificationcount = 0;
          this.todaysnotificationArr = [];
          this.oldernotificationArr = [];
          this.enableflag = true;
          this.getProductionPendingCount();
        },
      });
  }

  /**
   * Handle rectify button click
   */
  btn_rectify(value: any): void {
    this.callmodalcontroller(value);
  }

  /**
   * Handle not rectify button click
   */
  async btn_notrectify(value: any): Promise<void> {
    const alertmessage = this.translate.instant('ALERTACKNOWLEDGE.reasontitle');

    const alert = await this.alertController.create({
      mode: 'md',
      header: '',
      message: alertmessage,
      cssClass: 'customalertmessagetwobuttons',
      backdropDismiss: false,
      inputs: [
        {
          name: 'reason',
          type: 'textarea',
          cssClass: 'alertinput',
          placeholder: this.translate.instant(
            'ALERTACKNOWLEDGE.reasonplaceholder',
          ),
        },
      ],
      buttons: [
        {
          text: '',
          role: 'cancel',
          handler: () => {
            // Cancel
          },
        },
        {
          text: '',
          handler: (data: any) => {
            if (data.reason && data.reason.trim() !== '') {
              this.save(data.reason, '2', value.baseid, value.id, value.type);
              return true; // Return true to close the alert
            } else {
              this.toastService.error(
                this.translate.instant('ALERTACKNOWLEDGE.reasonmandatory'),
              );
              return false; // Return false to keep the alert open
            }
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Save alert notification update
   */
  save(
    getreason: string,
    getrectifystatus: string,
    getbaseid: any,
    getid: any,
    gettype: any,
  ): void {
    const req = {
      userid: this.userContext.userId,
      departmentid: this.userContext.departmentId,
      designationid: this.userContext.designId,
      millcode: this.userContext.millCode,
      baseid: getbaseid,
      id: getid,
      type: gettype,
      rectify_status: getrectifystatus,
      remarks: getreason,
      language: this.languageService.getLanguage,
    };

    console.log(req);

    this.notificationService
      .updatealertnotification(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          this.isDisable = false;

          if (result.httpcode == 200) {
            if (getrectifystatus == '2') {
              this.toastService.success(
                this.translate.instant(
                  'ALERTACKNOWLEDGE.unabletorectifysuccess',
                ),
              );
            }
            this.getalert();
          } else {
            if (getrectifystatus == '2') {
              this.toastService.error(
                this.translate.instant(
                  'ALERTACKNOWLEDGE.unabletorectifyfailed',
                ),
              );
            }
          }
        },
        error: (err) => {
          console.error('Failed to update alert:', err);
          this.isDisable = false;
          if (getrectifystatus == '2') {
            this.toastService.error(
              this.translate.instant('ALERTACKNOWLEDGE.unabletorectifyfailed'),
            );
          }
        },
      });
  }

  /**
   * Update alert notification (mark as read)
   */
  updateAlertNotification(value: any): void {
    const req = {
      user_id: this.userContext.userId,
      millcode: this.userContext.millCode,
      id: value.id,
      filter: this.filterstatus,
      language: this.languageService.getLanguage,
    };

    this.notificationService
      .deletedasboardnotification(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          if (result.httpcode == 200) {
            if (value.rectify_status == 0) {
              this.redirectcontroller(value);
            }
          } else {
            this.toastService.error(
              this.translate.instant('SEGREGATENOTIFICATION.message'),
            );
          }
        },
        error: (err) => {
          console.error('Failed to update notification:', err);
          this.toastService.error(
            this.translate.instant('SEGREGATENOTIFICATION.message'),
          );
        },
      });
  }

  /**
   * Redirect based on notification type
   */
  redirectcontroller(value: any): void {
    if (
      this.designationid == 3 ||
      this.designationid == 7 ||
      this.designationid == 8
    ) {
      this.getalert();
    } else {
      this.getNotification();
    }

    if (value.redirect == 'HOURLY PRESS') {
      this.router.navigate(['/production-hourlypressingstation']);
    } else if (value.redirect == 'HOURLY STERILIZER') {
      this.router.navigate([
        '/production-hourlysterilizerstation',
        { item: '' },
      ]);
    } else if (value.redirect == 'HIGH OIL LOSS') {
      this.router.navigate(['/tabs/taboilloss']);
    }
  }

  /**
   * View images in modal
   */
  async btn_ViewImages(images: string): Promise<void> {
    if (images && images !== '') {
      const modal = await this.modalController.create({
        component: ImageSliderComponent,
        componentProps: {
          from: 'Alert',
          alertitem: images,
        },
        cssClass: 'image-slider-modal',
      });

      await modal.present();
    }
  }

  /**
   * Open alert acknowledge modal
   */
  async callmodalcontroller(value: any): Promise<void> {
    const modal = await this.modalController.create({
      component: AlertAcknowledgePage,
      componentProps: {
        item: JSON.stringify(value),
      },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: ['alertattend-modal'],
    });
    modal.onDidDismiss().then((data) => {
      this.getalert();
    });
    await modal.present();
  }

  /**
   * Convert newline to <br>
   */
  nl2br(text: string): string {
    if (!text) return '';
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
