import { Component, OnInit, Input, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';

@Component({
  selector: 'app-notification-timeline-modal',
  templateUrl: './notification-timeline-modal.page.html',
  styleUrls: ['./notification-timeline-modal.page.scss'],
  standalone: false,
})
export class NotificationTimelineModalPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  appTitle: string = this.translate.instant('TIMELINEHISTORY.title');
  headerActions: string = '0';
  showLogo: number = 0;
  showBackButton: number = 1;

  @Input() item: string = '';

  userId: number = 0;
  millCode: string = '';

  params: any;
  notificationId: string = '';

  historyList: any[] = [];
  maintenanceNotificationNo: string = '';

  enableFlag: boolean = false;

  private readonly fallbackImage = 'assets/img/DefaultImage.png';

  constructor(
    private translate: TranslateService,
    private router: Router,
    private modalController: ModalController,
    private userContext: UserContext,
    private languageService: LanguageService,
    private maintenanceService: MaintenanceService,
  ) {
    this.userId = this.userContext.userId || 0;
    this.millCode = this.userContext.millCode || '';
  }

  ngOnInit(): void {
    this.initializeFromInputs();
  }

  ionViewWillEnter(): void {
    this.callAPI();
  }

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
  }

  callAPI(): void {
    this.getNotificationHistory();
  }

  getBorderColor(type: any): string {
    const t = String(type);
    switch (t) {
      case '1':
        return '#e74c3c';
      case '2':
        return '#ffff00';
      case '3':
        return '#3498db';
      case '4':
        return '#9b59b6';
      case '5':
        return '#f39c12';
      case '6':
        return '#a52a2a';
      case '7':
        return '#1abb9c';
      case '8':
        return '#616161';
      case '9':
        return '#e74c3c';
      case '10':
        return '#c71585';
      default:
        return '#ededed';
    }
  }

  /**
   * Normalize the image URL.
   * - Keep http:// as-is (do NOT upgrade to https).
   * - Cache-bust optional; strip whitespace.
   * - If empty -> return fallback asset.
   */
  private normalizeImageUrl(raw: any): string {
    if (raw === null || raw === undefined) return this.fallbackImage;
    const url = String(raw).trim();
    if (url === '') return this.fallbackImage;

    // If it's already an absolute http/https/data URL, return it unchanged.
    if (/^(https?:|data:)/i.test(url)) {
      return url;
    }

    // If it's a relative path returned by the API, prefix the API host.
    // Adjust the base if your images live on a different host than the API.
    if (url.startsWith('/')) {
      return `http://103.10.78.25:9093${url}`;
    }

    return url;
  }

  /** Fallback handler when the <img> fails to load. */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img && img.src.indexOf(this.fallbackImage) === -1) {
      img.src = this.fallbackImage;
    }
  }

  getNotificationHistory(): void {
    if (!this.notificationId) {
      console.warn('No notificationId to fetch');
      this.historyList = [];
      this.enableFlag = true;
      return;
    }

    const req = {
      userId: this.userId,
      millcode: this.millCode,
      id: this.notificationId,
      language: this.languageService.getLanguage,
    };

    console.log('getNotificationTimelineScanDetails Request:', req);

    this.maintenanceService
      .getNotificationTimelineScanDetails(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          console.log('getNotificationTimelineScanDetails Response:', response);

          if (response?.httpcode == 200) {
            const details = response?.data?.details || [];

            this.historyList = details.map((item: any) => ({
              ...item,
              userimage: this.normalizeImageUrl(item?.userimage),
            }));

            this.maintenanceNotificationNo =
              response?.data?.notificationno || '';
            this.enableFlag = this.historyList.length === 0;
          } else {
            this.historyList = [];
            this.maintenanceNotificationNo = '';
            this.enableFlag = true;
          }
        },
        error: (error) => {
          console.error('Error fetching notification timeline:', error);
          this.historyList = [];
          this.maintenanceNotificationNo = '';
          this.enableFlag = true;
        },
      });
  }
}
