import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { UserProfileComponent } from 'src/app/shared/components/user-profile/user-profile.component';
import { WeighbridgeRecordsCardComponent } from 'src/app/shared/components/production/weighbridge-records-card/weighbridge-records-card/weighbridge-records-card.component';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-weighbridge-home',
  templateUrl: './weighbridge-home.page.html',
  styleUrls: ['./weighbridge-home.page.scss'],
  standalone: false,
})
export class WeighbridgeHomePage implements OnInit {
  @ViewChild(UserProfileComponent)
  UserProfileComponent!: UserProfileComponent;

  @ViewChild(WeighbridgeRecordsCardComponent)
  WeighbridgeRecordsCardComponent!: WeighbridgeRecordsCardComponent;

  @ViewChild(IonContent)
  content!: IonContent;

  @ViewChild('pageHeader')
  pageHeader!: PageHeaderComponent;

  // Form
  reportForm!: FormGroup;

  // Header Configuration
  appTitle: string = '';
  headerActions: string = '2';
  showLogo: number = 1;
  showBackButton: number = 0;
  showNewLoad: boolean = false;

  // Date tracking
  date: string = '';
  userSelectedDate: string = ''; // Track user-selected date separately
  refreshTrigger: number = 0; // Trigger for refreshing records

  constructor(
    private fb: FormBuilder,
    private UserContext: UserContext,
  ) {
    // Setup header
    this.appTitle = this.nl2br(this.UserContext.millName || '');

    // Create form
    this.createForm();
  }

  ngOnInit() {}

  /**
   * Create form with date control
   */
  private createForm(): void {
    this.reportForm = this.fb.group({
      date: [''],
    });
  }

  toggleNewLoad(): void {
    this.showNewLoad = !this.showNewLoad;
  }

  ionViewWillEnter() {
    this.pageHeader?.getNotificationApi();
    this.showNewLoad = false;
    this.UserProfileComponent.loadUser();
    // Initialize with current date
    this.WeighbridgeRecordsCardComponent.initializeApiCall();
  }

  refreshLatestWeighbridgeRecords(data: any) {
    if (data.refresh) {
      this.showNewLoad = false;
      this.WeighbridgeRecordsCardComponent.initializeApiCall();
      this.goToTop();
    }
  }

  async goToTop(): Promise<void> {
    await this.content.scrollToTop(300);
  }

  /**
   * Handle date selection from date picker
   */
  onDateRecordsGet(event: { date: string }): void {
    // Store user-selected date
    this.userSelectedDate = event.date;
    this.date = event.date;

    console.log('User selected date:', this.date);

    // Increment refresh trigger to force reload
    this.refreshTrigger++;

    // Pass the selected date to the records card
    this.WeighbridgeRecordsCardComponent.selectedDate = this.date;
    this.WeighbridgeRecordsCardComponent.refreshTrigger = this.refreshTrigger;

    // The records card will handle clearing and loading new data via ngOnChanges
  }

  /**
   * Handle date update from weighbridge records card (from API)
   */
  onDateUpdate(event: string): void {
    // Only update if user hasn't selected a date
    if (!this.userSelectedDate) {
      this.date = event;
      console.log('Date updated from API:', this.date);
    } else {
      console.log(
        'Using user-selected date, ignoring API date:',
        this.userSelectedDate,
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
