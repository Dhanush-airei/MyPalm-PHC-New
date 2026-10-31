import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { UserProfileComponent } from 'src/app/shared/components/user-profile/user-profile.component';
import { RecentGradingRecordsComponent } from 'src/app/shared/components/production/recent-grading-records/recent-grading-records.component';

@Component({
  selector: 'app-grader-dashboard',
  templateUrl: './grader-dashboard.page.html',
  styleUrls: ['./grader-dashboard.page.scss'],
  standalone: false,
})
export class GraderDashboardPage implements OnInit {
  @ViewChild(UserProfileComponent)
  UserProfileComponent!: UserProfileComponent;

  @ViewChild(RecentGradingRecordsComponent)
  RecentGradingRecordsComponent!: RecentGradingRecordsComponent;

  @ViewChild(IonContent)
  content!: IonContent;

  appTitle = this.nl2br(this.UserContext.millName);
  headerActions = '';
  showLogo = 1;
  showBackButton = 0;
  showNewLoad = false;
  constructor(private UserContext: UserContext) {}

  ngOnInit() {}

  toggleNewLoad(): void {
    this.showNewLoad = !this.showNewLoad;
  }

  ionViewWillEnter() {
    this.showNewLoad = false;
    this.UserProfileComponent.loadUser();
    this.RecentGradingRecordsComponent.initializeApiCall();
  }

  refreshLatestGraderRecords(data: any) {
    if (data.refresh) {
      this.showNewLoad = false;
      this.RecentGradingRecordsComponent.initializeApiCall();
      this.goToTop();
    }
    // console.log('parent function is called');
  }

  async goToTop(): Promise<void> {
    await this.content.scrollToTop(300);
  }
  nl2br(text: string) {
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
