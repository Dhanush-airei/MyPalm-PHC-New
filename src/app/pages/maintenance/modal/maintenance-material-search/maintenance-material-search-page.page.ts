import {
  Component,
  OnInit,
  ViewChild,
  DestroyRef,
  inject,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  Platform,
  ModalController,
  NavParams,
  AlertController,
  IonSelect,
  IonContent,
} from '@ionic/angular';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maintenance-material-search-page',
  templateUrl: './maintenance-material-search-page.page.html',
  styleUrls: ['./maintenance-material-search-page.page.scss'],
  standalone: false,
})
export class MaintenanceMaterialSearchPage implements OnInit {
  private destroyRef = inject(DestroyRef);
  materialsearchForm: any;

  materialArr: any[] = [];
  searching = false;
  searchTerm = '';
  type = '';
  stationid = '';
  equipmentid = '';
  statusid = '';
  title = '';
  size: any;
  totalpage: any;
  responsedata: any;

  norecordsflag = false;

  constructor(
    private languageService: LanguageService,
    private fb: FormBuilder,
    public modalController: ModalController,
    public navParams: NavParams,
    private MaintenanceService: MaintenanceService,
    private router: Router,
    private UserContext: UserContext,
  ) {
    this.type = navParams.get('type');
    this.stationid = navParams.get('station_id');
    this.equipmentid = navParams.get('equipment_id');

    const statusId = navParams.get('status_id');
    if (statusId !== undefined && statusId !== null) {
      this.statusid = statusId;
    }

    const navTitle = navParams.get('title');
    if (navTitle !== undefined && navTitle !== null) {
      this.title = navTitle;
    }

    this.materialsearchForm = this.fb.group({
      select_searchby: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  ionViewDidEnter(): void {
    this.loadData(true, '0', this.searching);
  }

  loadData(pagerefresh: any, pagenum: any, search: any): void {
    if (pagerefresh === true) {
      this.materialArr = [];
    }

    const searchString = this.searchTerm;

    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      stationid: this.stationid,
      locationid: this.equipmentid,
      searchtext: searchString,
      page: parseInt(pagenum) + 1,
      language: this.languageService.getLanguage,
    };

    console.log(req);

    this.MaintenanceService.getPartList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          const resultdata: any = result;
          this.responsedata = resultdata;

          this.size = parseInt(resultdata.size);
          this.totalpage = resultdata.total_page * this.size;

          if (pagerefresh === true) {
            this.materialArr = [];
          }

          if (resultdata.httpcode == 200) {
            if (resultdata.partData.length > 0) {
              this.materialArr.push(...resultdata.partData);
              this.norecordsflag = false;
            }
          } else {
            this.norecordsflag = this.materialArr.length <= 0;
          }
        },
        error: (err: any) => {
          console.error('getPartList failed', err);
          this.norecordsflag = this.materialArr.length <= 0;
        },
      });
  }

  _ionchange(event: any): void {
    const val = event.detail.value;

    if (val && val.trim() !== '') {
      this.searching = true;
      this.searchTerm = val;
    } else {
      this.searching = false;
      this.searchTerm = '';
    }

    this.loadData(true, '0', this.searching);
  }

  getvalue(getitem: any): void {
    this.modalController.dismiss({
      dismissed: true,
      searchtext: this.searchTerm,
      data: JSON.stringify(getitem),
    });
  }

  pagination(event: any): void {
    setTimeout(() => {
      if (this.materialArr.length === this.totalpage / this.size) {
        event.target.complete();
        return;
      }

      event.target.complete();

      const z = Math.ceil(this.materialArr.length / this.size);

      if (this.materialArr.length < this.totalpage) {
        this.loadData(false, String(z), this.searching);
      }
    }, 500);
  }

  gettextColor(status: any): string {
    const colorByStatus: Record<string, string> = {
      '1': '#006426',
      '0': '#b91818',
    };

    return colorByStatus[String(status)] ?? '#000000';
  }

  dismiss(): void {
    this.modalController.dismiss({
      dismissed: true,
      searchtext: '',
      data: '',
    });
  }
}
