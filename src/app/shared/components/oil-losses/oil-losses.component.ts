import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { OilLossRecommendationModalPage } from 'src/app/pages/management/fmanager/oil-loss-recommendation-modal/oil-loss-recommendation-modal.page';
import { ManagementService } from '../../services/management-service/management-service';

@Component({
  selector: 'app-oil-losses',
  templateUrl: './oil-losses.component.html',
  styleUrls: ['./oil-losses.component.scss'],
  standalone: false,
})
export class OilLossesComponent implements OnInit {
  @ViewChild('swiper') swiperRef!: ElementRef;

  @Input() reportDate: string = '';
  @Output() dataLoaded = new EventEmitter<any>();

  // Data properties
  pressdataArr: any[] = [];
  oillossesArr: any[] = [];
  generalArr: any[] = [];

  // UI state flags (matching older version)
  title: string = '';
  note: string = '';
  isLoading: boolean = false;
  hasData: boolean = false;
  didInit: boolean = false;
  norecordsflag: boolean = false;
  pleasewaitflag: boolean = false;
  noRecordsFlag: boolean = false; // Keeping for backward compatibility

  // Language
  getLanguage: string = 'English';

  // History flag
  historyflag: number = 0;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private modalController: ModalController,
    private userContext: UserContext,
    private languageService: LanguageService,
    private managementService: ManagementService,
    private toastService: ToastService,
  ) {
    this.getLanguage = this.languageService.getLanguage || 'English';
  }

  ngOnInit() {
    // Don't load data here, wait for parent to call initializeApiCall
  }

  /**
   * Initialize API call - Called from parent page
   */
  initializeApiCall() {
    this.historyflag = 1;
    this.loadData();
  }

  /**
   * Load oil losses data from API
   */
  loadData() {
    this.pressdataArr = [];
    this.oillossesArr = [];
    this.norecordsflag = false;
    this.noRecordsFlag = false;
    this.isLoading = true;
    this.hasData = false;
    this.pleasewaitflag = true;

    const req = {
      userid: this.userContext.userId,
      millcode: this.userContext.millCode,
      Fromdate: '',
      language: this.languageService.getLanguage || this.getLanguage,
    };

    console.log('Oil Losses Request:', req);

    this.managementService
      .getOillossesvalues(req)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.pleasewaitflag = false;
        }),
      )
      .subscribe({
        next: (result: any) => {
          console.log('Oil Losses Response:', result);

          this.generalArr = result;
          this.oillossesArr = result.data || [];
          this.title = result.heading || '';
          this.note = result.para || '';

          if (result.httpcode == 200 && this.oillossesArr.length > 0) {
            // Process press data
            this.pressdataArr = [];
            for (let i = 0; i < this.oillossesArr.length; i++) {
              if (this.oillossesArr[i].pressdata) {
                for (
                  let j = 0;
                  j < this.oillossesArr[i].pressdata.length;
                  j++
                ) {
                  this.pressdataArr.push(this.oillossesArr[i].pressdata[j]);
                }
              }
            }

            this.hasData = this.pressdataArr.length > 0;
            this.norecordsflag = false;
            this.noRecordsFlag = false;
            this.didInit = true;

            console.log('Press data Arr:', this.pressdataArr.length);
          } else {
            this.hasData = false;
            this.norecordsflag = true;
            this.noRecordsFlag = true;
            this.didInit = true;

            // // If no records found, show toast message
            // if (result.status) {
            //   this.toastService.info(result.status);
            // }
          }

          this.dataLoaded.emit(this.hasData);

          // Handle history flag refresh
          if (this.historyflag == 1) {
            setTimeout(() => {
              this.historyflag = 0;
              this.refreshData();
            }, 1000);
          }
        },
        error: (error) => {
          console.error('Error loading oil losses data:', error);
          this.hasData = false;
          this.norecordsflag = true;
          this.noRecordsFlag = true;
          this.didInit = true;
          this.dataLoaded.emit(false);
          this.toastService.error(
            error?.error?.message || 'Failed to load oil losses data.',
          );
        },
      });
  }

  /**
   * Refresh data (called after history navigation)
   */
  refreshData() {
    if (this.reportDate) {
      this.loadData();
    }
  }

  /**
   * Handle slide change event
   */
  onSlideChange(event: any) {
    // Handle slide change if needed
  }

  /**
   * Get background color based on level value
   */
  getBackgroundColor(value: number): string {
    return value === 0 ? '#008000' : '#ff6060';
  }

  /**
   * Navigate to history page
   */
  navigateToHistory() {
    this.historyflag = 1;

    // Get the current date from the component
    let dateToPass = '';

    // Check if we have a report date
    if (this.reportDate) {
      // If reportDate is in YYYY-MM-DD format, convert to DD-MM-YYYY for URL
      if (/^\d{4}-\d{2}-\d{2}$/.test(this.reportDate)) {
        const parts = this.reportDate.split('-');
        dateToPass = `${parts[2]}-${parts[1]}-${parts[0]}`;
      } else {
        // If already in DD-MM-YYYY format, use as is
        dateToPass = this.reportDate;
      }
    } else {
      // If no date, use today's date in DD-MM-YYYY format
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      dateToPass = `${day}-${month}-${year}`;
    }

    console.log('Navigating to history with date:', dateToPass);

    // Navigate with the date parameter
    this.router.navigate(['/oil-losses-new', { reportdate: dateToPass }]);
  }

  /**
   * Open modal for reasons or recommendations
   */
  async openModal(item: any, type: string) {
    console.log('Type:', type);
    const modal = await this.modalController.create({
      component: OilLossRecommendationModalPage,
      componentProps: {
        item: JSON.stringify(item),
        type: type,
      },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: ['owneroiloss-modal'],
    });

    await modal.present();
  }
}
