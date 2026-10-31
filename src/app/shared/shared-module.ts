import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// component imports
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { LanguagePopoverComponent } from './components/language-popover/language-popover.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ReceiveNewLoadComponent } from './components/production/receive-new-load/receive-new-load.component';
import { ImageSliderComponent } from './components/image-slider/image-slider.component';
import { RecentGradingRecordsComponent } from './components/production/recent-grading-records/recent-grading-records.component';
import { DateRangerPickerComponent } from './components/date-time-picker/date-ranger-picker/date-ranger-picker.component';
import { DatePickerComponent } from './components/date-time-picker/date-picker/date-picker.component';
import { WeighbridgeRecordsCardComponent } from './components/production/weighbridge-records-card/weighbridge-records-card/weighbridge-records-card.component';
import { OilLossesComponent } from './components/oil-losses/oil-losses.component';
import { ProductionDatePickerComponent } from './components/management/production-date-picker/production-date-picker.component';
import { MonthPickerComponent } from './components/date-time-picker/month-picker/month-picker.component';
import { WeekPickerComponent } from './components/date-time-picker/week-picker/week-picker.component';
import { YearPickerComponent } from './components/date-time-picker/year-picker/year-picker.component';
import { TimePickerComponent } from './components/date-time-picker/time-picker/time-picker.component';
import { MillProductionStatusComponent } from './components/maintenance/mill-production-status/mill-production-status.component';

@NgModule({
  declarations: [
    PageHeaderComponent,
    LanguagePopoverComponent,
    UserProfileComponent,
    ReceiveNewLoadComponent,
    ImageSliderComponent,
    RecentGradingRecordsComponent,
    DateRangerPickerComponent,
    DatePickerComponent,
    WeighbridgeRecordsCardComponent,
    OilLossesComponent,
    ProductionDatePickerComponent,
    MonthPickerComponent,
    WeekPickerComponent,
    YearPickerComponent,
    TimePickerComponent,
    MillProductionStatusComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    PageHeaderComponent,
    LanguagePopoverComponent,
    UserProfileComponent,
    ReceiveNewLoadComponent,
    ImageSliderComponent,
    RecentGradingRecordsComponent,
    DateRangerPickerComponent,
    DatePickerComponent,
    WeighbridgeRecordsCardComponent,
    OilLossesComponent,
    ProductionDatePickerComponent,
    MonthPickerComponent,
    WeekPickerComponent,
    YearPickerComponent,
    TimePickerComponent,
    MillProductionStatusComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
