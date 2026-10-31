import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { NotificationService } from 'src/app/shared/services/notification-service/notification-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';

@Component({
  selector: 'app-notification-reminder',
  templateUrl: './notification-reminder.page.html',
  styleUrls: ['./notification-reminder.page.scss'],
  standalone: false,
})
export class NotificationReminderPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  // Header Configuration
  appTitle: string = this.translate.instant('NOTIFICATION.remainder');
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
  filterstatus: string = '3';
  enableflag: boolean = false;
  isDisable: boolean = false;
  isModalActive: boolean = false;

  // Date
  currentdate: string = '';

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private router: Router,
    private location: Location,
    private toastService: ToastService,
  ) {
    this.setCurrentDate();
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.getNotification();
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
   * Get Notifications
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

    console.log('Reminder Request:', req);

    this.notificationService
      .getsegregatenotification(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          console.log('Reminder Response:', result);
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
          console.error('Failed to get reminders:', err);
          this.todaysnotificationcount = 0;
          this.oldernotificationcount = 0;
          this.todaysnotificationArr = [];
          this.oldernotificationArr = [];
          this.enableflag = true;
        },
      });
  }

  /**
   * Update notification (mark as read)
   */
  updateNotification(value: any): void {
    // First call the modal/redirect
    this.callModalController(value);

    // Then delete the notification
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
          if (result.httpcode != 200) {
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
   * Call Modal Controller for redirect
   */
  callModalController(value: any): void {
    // Refresh the notification list
    this.getNotification();

    // Navigate based on redirect type
    if (value.redirect == 'HOURLY PRESS') {
      this.router.navigate(['/production-hourly-press-station']);
    } else if (value.redirect == 'HOURLY STERILIZER') {
      this.router.navigate([
        '/production-hourly-sterilizer-station',
        { item: '' },
      ]);
    } else if (value.redirect == 'STERILIZER SENSOR') {
      console.log('STERILIZER SENSOR:', JSON.stringify(value));
      this.router.navigate([
        '/production-hourly-sterilizer-station',
        { item: JSON.stringify(value) },
      ]);
    } else if (value.redirect == 'HOURLY OIL LOSS') {
      this.router.navigate(['/tabs']);
    } else if (value.redirect == 'HIGH OIL LOSS') {
      this.router.navigate(['/dashboard-oilloss-predictionanalysis']);
    }
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
