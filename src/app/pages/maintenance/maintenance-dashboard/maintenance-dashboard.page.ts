import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { UserProfileComponent } from 'src/app/shared/components/user-profile/user-profile.component';
import { MillProductionStatusComponent } from 'src/app/shared/components/maintenance/mill-production-status/mill-production-status.component';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-maintenance-dashboard',
  templateUrl: './maintenance-dashboard.page.html',
  styleUrls: ['./maintenance-dashboard.page.scss'],
  standalone: false,
})
export class MaintenanceDashboardPage implements OnInit {
  @ViewChild('pageHeader')
  pageHeader!: PageHeaderComponent;

  @ViewChild(UserProfileComponent)
  UserProfileComponent!: UserProfileComponent;

  @ViewChild(MillProductionStatusComponent)
  MillProductionStatusComponent!: MillProductionStatusComponent;

  appTitle = this.nl2br(this.UserContext.millName);
  headerActions = '1,2';
  showLogo = 1;
  showBackButton = 0;

  constructor(private UserContext: UserContext) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.pageHeader?.getNotificationApi();
    this.UserProfileComponent.loadUser();
    this.MillProductionStatusComponent.loadInitialData();
  }

  nl2br(text: string) {
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
