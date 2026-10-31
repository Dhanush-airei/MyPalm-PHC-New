import {
  Component,
  OnInit,
  ViewChild,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  IonSearchbar,
  ModalController,
  NavParams,
  Platform,
} from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
@Component({
  selector: 'app-maintenance-activity-search',
  templateUrl: './maintenance-activity-search.page.html',
  styleUrls: ['./maintenance-activity-search.page.scss'],
  standalone: false,
})
export class MaintenanceActivitySearchPage implements OnInit {
  @ViewChild('search', { static: false })
  search!: IonSearchbar;
  private destroyRef = inject(DestroyRef);

  activitysearchForm: any;

  activitylistArray: any = [];
  searchtext = '';
  searchTerm: string = '';

  norecordsflag = false;
  constructor(
    private translate: TranslateService,
    public navParams: NavParams,
    public modalController: ModalController,
    private MaintenanceService: MaintenanceService,
    private UserContext: UserContext,
    private ToastService: ToastService,
    private LanguageService: LanguageService,
  ) {}

  ngOnInit() {}

  ionViewDidEnter(): void {
    setTimeout(() => {
      this.search?.setFocus();
    }, 300);

    this.getActivity('');
  }
  onChangeSearchBy(): void {
    this.searchTerm = '';

    this.searchTerm = '';
  }

  getActivity(getsearchtext: string): void {
    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      searchtext: getsearchtext,
      language: this.LanguageService.getLanguage,
    };

    this.MaintenanceService.getActivityList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response.httpcode == 200) {
            this.activitylistArray = response.data ?? [];
            this.norecordsflag = this.activitylistArray.length === 0;
          } else {
            this.activitylistArray = [];
            this.norecordsflag = true;
          }
        },

        error: (error: any) => {
          console.error('error:', error);
        },
      });
  }

  ionSearchChange(event: CustomEvent): void {
    const value = event.detail?.value ?? '';

    this.searchTerm = value;

    this.getActivity(value);
  }

  getvalue(getitem: any): void {
    this.modalController.dismiss({
      dismissed: true,
      searchtext: this.searchTerm,
      data: JSON.stringify(getitem),
    });
  }

  dismiss(): void {
    this.modalController.dismiss({
      dismissed: true,
      data: '',
    });
  }
}
