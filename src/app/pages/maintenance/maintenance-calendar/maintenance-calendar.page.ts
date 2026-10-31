import {
  Component,
  OnInit,
  DestroyRef,
  inject,
  NgZone,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { ScreenOrientation } from '@capacitor/screen-orientation';

@Component({
  selector: 'app-maintenance-calendar',
  templateUrl: './maintenance-calendar.page.html',
  styleUrls: ['./maintenance-calendar.page.scss'],
  standalone: false,
})
export class MaintenanceCalendarPage implements OnInit {
  @ViewChild('pageHeader')
  pageHeader!: PageHeaderComponent;

  mill_name = this.nl2br(this.UserContext.millName);
  user_id = this.UserContext.userId;
  departmentid = this.UserContext.departmentId;
  designationid = this.UserContext.designId;
  language = this.LanguageService.getLanguage;
  baseurl = this.UserContext.reportUrl;

  destroyRef = inject(DestroyRef);

  appTitle = this.nl2br(this.UserContext.millName);
  headerActions = '2';
  showLogo = 1;
  showBackButton = 0;

  count = 0;

  pendingcount = 0;
  pendingcountlength = 0;

  weburl: any = '';
  safeWebUrl: SafeUrl | string = '';
  constructor(
    private UserContext: UserContext,
    private translate: TranslateService,
    private LanguageService: LanguageService,
    private MaintenanceService: MaintenanceService,
    private zone: NgZone,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.getUrl();
  }

  async ionViewWillEnter() {
    await ScreenOrientation.lock({
      orientation: 'landscape',
    });
    this.pageHeader?.getNotificationApi();
  }

  async ionViewWillLeave() {
    await ScreenOrientation.lock({
      orientation: 'portrait',
    });
  }

  getUrl() {
    if (!this.baseurl) {
      console.warn('Base URL not available');
      return;
    }

    let formatedurl =
      this.baseurl +
      'Maintenance_planning/schedule_new?mobile=1&user_id=' +
      this.user_id +
      '&language=' +
      this.language;

    console.log('Calendar URL -> ', formatedurl);

    this.safeWebUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(formatedurl);
  }

  nl2br(text: string) {
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
