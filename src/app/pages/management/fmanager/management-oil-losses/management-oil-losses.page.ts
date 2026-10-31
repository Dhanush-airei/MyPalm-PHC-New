import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { ViewChild } from '@angular/core';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { OilLossesComponent } from 'src/app/shared/components/oil-losses/oil-losses.component';
import { SterilizerService } from 'src/app/shared/services/production-services/sterilizer-service/sterilizer-service';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-management-oil-losses',
  templateUrl: './management-oil-losses.page.html',
  styleUrls: ['./management-oil-losses.page.scss'],
  standalone: false,
})
export class ManagementOilLossesPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  @ViewChild(OilLossesComponent)
  OilLossesComponent!: OilLossesComponent;

  @ViewChild('pageHeader')
  pageHeader!: PageHeaderComponent;

  appTitle = this.nl2br(this.UserContext.millName);
  headerActions = this.userContext.designId == 9 ? '2' : '6,7';
  showLogo = 1;
  showBackButton = 0;
  showNewLoad = false;
  // showMaintenanceLogo = 1;
  // showProductionLogo = 1;

  // Counts
  productionCount: number = 0;
  productionCountLength: number = 0;
  maintenanceCount: number = 0;
  maintenanceCountLength: number = 0;
  notificationCount: number = 0;
  notificationCountLength: number = 0;

  constructor(
    private UserContext: UserContext,
    private sterilizerService: SterilizerService,
    private userContext: UserContext,
    private languageService: LanguageService,
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.pageHeader?.getNotificationApi();
    // this.getProductionPendingCount();
    this.OilLossesComponent.initializeApiCall();
  }

  onDataLoaded(hasData: boolean) {
    console.log('Oil losses data loaded:', hasData);
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
            this.productionCount = result.productioncount || 0;
            console.log('Product Count ->', this.productionCount);
            this.productionCountLength = this.productionCount.toString().length;
            this.maintenanceCount = result.maintenancecount || 0;
            console.log('Maintenance Count ->', this.maintenanceCount);
            this.maintenanceCountLength =
              this.maintenanceCount.toString().length;
            this.notificationCount = result.count;
            this.notificationCountLength =
              this.notificationCount.toString().length;
          } else {
            this.notificationCount = 0;
            this.notificationCountLength =
              this.notificationCount.toString().length;
          }
        },
        error: (err) => {
          console.error('Failed to get pending count:', err);
          this.notificationCount = 0;
          this.notificationCountLength =
            this.notificationCount.toString().length;
        },
      });
  }

  nl2br(text: string) {
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
