import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Location } from '@angular/common';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { NotificationService } from 'src/app/shared/services/notification-service/notification-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { ImageSliderComponent } from 'src/app/shared/components/image-slider/image-slider.component';
import { AlertAcknowledgePage } from 'src/app/pages/production/sterilizer/alert-acknowledge/alert-acknowledge.page';

@Component({
  selector: 'app-notification-alert',
  templateUrl: './notification-alert.page.html',
  styleUrls: ['./notification-alert.page.scss'],
  standalone: false,
})
export class NotificationAlertPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  // Header Configuration
  appTitle: string = this.translate.instant('NOTIFICATION.alerts');
  headerActions: string = '';
  showLogo: number = 0;
  showBackButton: number = 1;

  // User Data
  userContext = inject(UserContext);
  designationid: number = this.userContext.designId;
  departmentid: number = this.userContext.departmentId;

  // Notification Arrays
  todaysnotificationArr: any[] = [];
  oldernotificationArr: any[] = [];

  // Counts
  todaysnotificationcount: number = 0;
  oldernotificationcount: number = 0;

  // Flags
  todaysnotificationflag: boolean = false;
  oldernotificationflag: boolean = false;
  todaysnotificationclick: number = 0;
  oldernotificationclick: number = 0;
  filterstatus: string = '4';
  enableflag: boolean = false;
  isDisable: boolean = false;
  isModalActive: boolean = false;

  // Date
  currentdate: string = '';

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private alertController: AlertController,
    public modalController: ModalController,
    private router: Router,
    private location: Location,
    private toastService: ToastService,
  ) {
    this.setCurrentDate();
    this.loadNotifications();
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.loadNotifications();
  }

  /**
   * Load notifications based on designation
   */
  private loadNotifications(): void {
    const alertDesignations = [2, 7, 8];
    if (alertDesignations.includes(this.designationid)) {
      this.getAlert();
    } else {
      this.getNotification();
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
   * Get Alert Notifications
   */
  getAlert(): void {
    const req = {
      userid: this.userContext.userId,
      departmentid: this.userContext.departmentId,
      designationid: this.userContext.designId,
      millcode: this.userContext.millCode,
      filter: '4',
      language: this.languageService.getLanguage,
    };

    console.log('Alert Request:', req);

    this.notificationService
      .getalertnotification(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          console.log('Alert Response:', result);
          if (result.httpcode == 200) {
            this.todaysnotificationcount = result.todaycount || 0;
            this.oldernotificationcount = result.oldercount || 0;

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
        },
        error: (err) => {
          console.error('Failed to get alerts:', err);
          this.todaysnotificationcount = 0;
          this.oldernotificationcount = 0;
          this.todaysnotificationArr = [];
          this.oldernotificationArr = [];
          this.enableflag = true;
        },
      });
  }

  /**
   * Get General Notifications
   */
  getNotification(): void {
    const req = {
      userid: this.userContext.userId,
      departmentid: this.userContext.departmentId,
      designationid: this.userContext.designId,
      millcode: this.userContext.millCode,
      filter: this.filterstatus,
      language: this.languageService.getLanguage,
    };

    console.log('Notification Request:', req);

    this.notificationService
      .getsegregatenotification(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          console.log('Notification Response:', result);
          if (result.httpcode == 200) {
            this.todaysnotificationcount = result.todaycount || 0;
            this.oldernotificationcount = result.oldercount || 0;
            this.todaysnotificationArr = result.data.today || [];
            this.oldernotificationArr = result.data.older || [];
            this.enableflag = false;
          } else {
            this.todaysnotificationcount = 0;
            this.oldernotificationcount = 0;
            this.todaysnotificationArr = [];
            this.oldernotificationArr = [];
            this.enableflag = true;
          }
        },
        error: (err) => {
          console.error('Failed to get notifications:', err);
          this.todaysnotificationcount = 0;
          this.oldernotificationcount = 0;
          this.todaysnotificationArr = [];
          this.oldernotificationArr = [];
          this.enableflag = true;
        },
      });
  }

  /**
   * Handle rectify button click
   */
  btn_rectify(value: any): void {
    this.alertModalController(value);
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
              return true;
            } else {
              this.toastService.error(
                this.translate.instant('ALERTACKNOWLEDGE.reasonmandatory'),
              );
              return false;
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

    console.log('Save Request:', req);

    this.notificationService
      .updatealertnotification(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          this.isDisable = false;

          if (result.httpcode == 200) {
            this.toastService.success(
              this.translate.instant('ALERTACKNOWLEDGE.acknowledgementsuccess'),
            );
            this.getAlert();
          } else {
            this.toastService.error(
              this.translate.instant('ALERTACKNOWLEDGE.acknowledgementfailed'),
            );
          }
        },
        error: (err) => {
          console.error('Failed to update alert:', err);
          this.isDisable = false;
          this.toastService.error(
            this.translate.instant('ALERTACKNOWLEDGE.acknowledgementfailed'),
          );
        },
      });
  }

  /**
   * Update notification (mark as read)
   */
  updateNotification(value: any): void {
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
            this.callModalController(value);
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
   * View Images using ImageSliderComponent
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
   * Call Modal Controller for redirect
   */
  callModalController(value: any): void {
    if (this.designationid == 2 || this.designationid == 8) {
      this.getAlert();
    } else {
      this.getNotification();
    }

    if (value.redirect == 'HIGH OIL LOSS') {
      this.router.navigate(['/production-oilloss']);
    }
  }

  /**
   * Open Alert Acknowledge Modal
   */
  async alertModalController(value: any): Promise<void> {
    this.isModalActive = true;

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
      this.isModalActive = false;
      this.getAlert();
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

  /**
   * Go back to previous page
   */
  back(): void {
    this.location.back();
  }
}
