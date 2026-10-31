import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  DestroyRef,
  inject,
} from '@angular/core';
import { Location } from '@angular/common';
import { NavController, ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { Output, EventEmitter } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { AuthService } from 'src/app/shared/services/auth-service/auth-service';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';

// Dynamic header content
import { HeaderAction } from 'src/app/shared/enum/header-action.enum';

// language translation popup
import { LanguagePopoverComponent } from 'src/app/shared/components/language-popover/language-popover.component';

import { Router } from '@angular/router';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  standalone: false,
})
export class PageHeaderComponent implements OnInit, OnChanges {
  private destroyRef = inject(DestroyRef);
  @Input() showBackButton: number = 0;
  @Input() notificationBackButton: number = 0;

  @Input() showLogo: number = 1;

  @Input() appTitle = this.nl2br(this.UserContext.millName);

  // Pass values like: "1,2,3"
  @Input() actions = '';

  notificationCount = 0;
  maintenanceCount = 0;

  productionCount = 0;

  @Input() showMaintenanceLogo: number = 0;
  @Input() showProductionLogo: number = 0;

  HeaderAction = HeaderAction;

  selectedActions: number[] = [];

  infopage = '';

  constructor(
    private authService: AuthService,
    private location: Location,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private popoverController: PopoverController,
    private UserContext: UserContext,
    private LanguageService: LanguageService,
    private router: Router,
    private MaintenanceService: MaintenanceService,
  ) {}

  ngOnInit() {
    // this.userManual();
    console.log(this.selectedActions);
  }

  ionViewDidEnter() {
    this.fetchHeaderActionApi();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedActions = this.actions
      ? this.actions.split(',').map(Number)
      : [];

    console.log(this.selectedActions);
    this.fetchHeaderActionApi();
  }

  hasAction(action: HeaderAction): boolean {
    return this.selectedActions.includes(action);
  }

  fetchHeaderActionApi() {
    if (
      this.selectedActions.includes(2) ||
      this.selectedActions.includes(6) ||
      this.selectedActions.includes(7)
    ) {
      this.getNotificationApi(); // Your API call
    }
  }

  getNotificationApi() {
    const req = {
      userid: this.UserContext.userId,
      departmentid: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      millcode: this.UserContext.millCode,
      language: this.LanguageService.getLanguage,
    };

    this.MaintenanceService.getMaintenancePendingCount(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resultdata: any) => {
          if (resultdata.httpcode == 200) {
            this.notificationCount = resultdata.count;
            this.maintenanceCount = resultdata.maintenancecount;
            this.productionCount = resultdata.productioncount;
          } else {
            this.notificationCount = 0;
            this.maintenanceCount = 0;
            this.productionCount = 0;
          }
        },
        error: () => {
          this.notificationCount = 0;
          this.maintenanceCount = 0;
          this.productionCount = 0;
        },
      });
  }

  getNotificationCount(): string {
    if (this.notificationCount <= 0) {
      return '';
    }

    if (this.notificationCount <= 99) {
      return this.notificationCount.toString();
    }

    return '99+';
  }

  getMaintenanceCount(): string {
    if (this.maintenanceCount <= 0) {
      return '';
    }

    if (this.maintenanceCount <= 99) {
      return this.maintenanceCount.toString();
    }

    return '99+';
  }

  getProductionCount(): string {
    if (this.productionCount <= 0) {
      return '';
    }

    if (this.productionCount <= 99) {
      return this.productionCount.toString();
    }

    return '99+';
  }

  async openLanguagePopover(event: Event): Promise<void> {
    const popover = await this.popoverController.create({
      component: LanguagePopoverComponent,
      event,
      arrow: false,
    });

    await popover.present();

    const { data, role } = await popover.onDidDismiss();

    if (role === 'selected' && data) {
      console.log('Selected Language:', data);

      // this.translate.use(data.code);
      // localStorage.setItem('language', data.code);
    }
  }

  // userManual() {
  //   var req = {
  //     user_id: this.UserContext.userId,
  //     millcode: this.UserContext.millCode,
  //     dept_id: this.UserContext.departmentId,
  //     design_id: this.UserContext.designId,
  //     language: this.LanguageService.getLanguage,
  //   };
  //   this.authService.userManual(req).subscribe({
  //     next: (res: any) => {
  //       console.log(res);

  //       if (res.httpcode === 200 && res.data?.length) {
  //         this.infopage = res.data[0].link;
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Failed to fetch user manual:', err);
  //     },
  //   });
  // }

  async goBack() {
    console.log('back');
    // Check if a modal is open
    const topModal = await this.modalCtrl.getTop();

    if (topModal) {
      await topModal.dismiss();
      return;
    }

    // Normal page navigation
    if (window.history.length > 0) {
      console.log('History back length ->', window.history.length);
      this.location.back();
    } else {
      console.log('Else part History back length ->', window.history.length);
      this.navCtrl.navigateRoot('/tabs'); // Change to your home page
    }
  }

  async goBackNotification() {
    console.log('back');
    this.navCtrl.navigateRoot('/tabs');
  }

  nl2br(text: string) {
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }

  testClick() {
    console.log('test click');
  }

  /**
   * Navigate to QR Code Scan Page
   */
  btnQrCodeScanView(): void {
    this.router.navigate(['/qrcodescanner']);
    console.log('QR Code Scan Button click');
  }

  /**
   * Navigate to Notification Page
   *
   */
  btnNotificationView(): void {
    const designId = Number(this.UserContext.designId);

    // Foreman (4) and Chargeman (6) → block navigation
    if (designId == 4 || designId == 6) {
      console.log(
        `Notification click ignored — designation Id: ${designId} cannot navigate.`,
      );
      return;
    }

    this.router.navigate(['/notification-view']);
    console.log('Notification Button click');
  }

  /**
   * Navigate to Maintenance Page
   */
  btnMaintenanceView(): void {
    this.router.navigate(['/tabs/management-maintenance']);
    console.log('Maintenance Button click');
  }

  /**
   * Navigate to Production Page
   */
  btnProductionView(): void {
    this.router.navigate(['/tabs/management-production']);
    console.log('Production Button click');
  }
}
