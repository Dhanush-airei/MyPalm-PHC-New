import {
  Component,
  OnInit,
  ViewChild,
  DestroyRef,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';

import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ProductionService } from 'src/app/shared/services/production-services/production-service/production-service';

// ✅ Import the status page class to access its static refresh$ subject
import { ProductionProcessStatusPage } from '../production-process-status/production-process-status.page';

@Component({
  selector: 'app-production-process-status-edit',
  templateUrl: './production-process-status-edit.page.html',
  styleUrls: ['./production-process-status-edit.page.scss'],
  standalone: false,
})
export class ProductionProcessStatusEditPage implements OnInit {
  @ViewChild('pageHeader')
  pageHeader!: PageHeaderComponent;

  private destroyRef = inject(DestroyRef);

  // Header Configuration
  appTitle: string = '';
  headerActions: string = '0';
  showLogo: number = 0;
  showBackButton: number = 1;

  // Form
  editStatusForm!: FormGroup;

  // User Data
  getlanguage: string = this.languageService.getLanguage;

  // Record ID (0 for add new, >0 for edit)
  processedId: number = 0;

  // ============================================
  // Processed Date State
  // ============================================
  processedDateDisplay: string = '';
  tempDate: string = '';
  isDatePickerOpen: boolean = false;
  maxDate: string = new Date().toISOString();
  saveDisable: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userContext: UserContext,
    private languageService: LanguageService,
    private productionService: ProductionService,
    private translate: TranslateService,
    private toastController: ToastController,
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.pageHeader?.getNotificationApi();
    this.loadRecordFromParams();
  }

  private loadRecordFromParams(): void {
    const getData = this.activatedRoute.snapshot.paramMap.get('item');

    if (getData === '' || getData === null || getData === undefined) {
      this.appTitle = this.translate.instant('STATUSREPORT.adddata');
      this.processedId = 0;
      this.processedDateDisplay = '';
      this.tempDate = '';

      this.editStatusForm.reset({
        processed_date: '',
        txt_ffbprocessed: '',
        txt_ffbbalance: '',
        txt_average_cage_weight: '',
        txt_dobiprocess: '',
        txt_dobitank: '',
        txt_oer: '',
        txt_mtdoer: '',
      });
    } else {
      this.appTitle = this.translate.instant('STATUSREPORT.editdata');
      const params = JSON.parse(getData);
      this.processedId = Number(params.id);

      const apiDate = params.ffb_processed_date || '';
      this.tempDate = apiDate;
      this.processedDateDisplay = this.formatDateForDisplay(apiDate);

      this.editStatusForm.patchValue({
        processed_date: this.processedDateDisplay,
        txt_ffbprocessed: params.ffb_processed || '',
        txt_ffbbalance: params.ffb_balance || '',
        txt_average_cage_weight: params.avg_cage_weight || '',
        txt_dobiprocess: params.dobi_process || '',
        txt_dobitank: params.dobi_tank || '',
        txt_oer: params.oer || '',
        txt_mtdoer: params.mtdoer || '',
      });
    }
  }

  private createForm(): void {
    this.editStatusForm = this.fb.group({
      processed_date: new FormControl(''),
      txt_ffbprocessed: new FormControl(''),
      txt_ffbbalance: new FormControl(''),
      txt_average_cage_weight: new FormControl(''),
      txt_dobiprocess: new FormControl(''),
      txt_dobitank: new FormControl(''),
      txt_oer: new FormControl(''),
      txt_mtdoer: new FormControl(''),
    });
  }

  openProcessedPicker(): void {
    if (this.processedDateDisplay) {
      const [dd, mm, yyyy] = this.processedDateDisplay.split('-');
      this.tempDate = `${yyyy}-${mm}-${dd}`;
    } else {
      const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
      const yyyy = yesterday.getFullYear();
      const mm = String(yesterday.getMonth() + 1).padStart(2, '0');
      const dd = String(yesterday.getDate()).padStart(2, '0');
      this.tempDate = `${yyyy}-${mm}-${dd}`;
    }
    this.isDatePickerOpen = true;
  }

  onDateChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (!value) return;
    this.tempDate = String(value);
  }

  onDateDismiss(): void {
    this.isDatePickerOpen = false;
    if (this.tempDate) {
      this.processedDateDisplay = this.formatDateForDisplay(this.tempDate);
      this.editStatusForm.controls['processed_date'].setValue(
        this.processedDateDisplay,
      );
    }
  }

  private formatDateForDisplay(dateStr: string): string {
    if (!dateStr) return '';
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      const [yyyy, mm, dd] = dateStr.substring(0, 10).split('-');
      return `${dd}-${mm}-${yyyy}`;
    }
    return '';
  }

  private formatDateForAPI(dateStr: string): string {
    if (!dateStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [dd, mm, yyyy] = dateStr.split('-');
      return `${yyyy}-${mm}-${dd}`;
    }
    return '';
  }

  btn_save(): void {
    if (!this.validateMandatoryFields()) return;
    if (!this.validatePercentageFields()) return;

    const apiDate = this.formatDateForAPI(this.processedDateDisplay);
    this.saveDisable = true;

    const req = {
      userid: this.userContext.userId,
      millcode: this.userContext.millCode,
      dept_id: this.userContext.departmentId,
      design_id: this.userContext.designId,
      id: this.processedId,
      processed_date: apiDate,
      ffb_processed: this.editStatusForm.value.txt_ffbprocessed,
      ffb_balance: this.editStatusForm.value.txt_ffbbalance,
      avg_cage_weight: this.editStatusForm.value.txt_average_cage_weight,
      dobi_process: this.editStatusForm.value.txt_dobiprocess,
      dobi_tank: this.editStatusForm.value.txt_dobitank,
      oil_mix: '',
      oer: this.editStatusForm.value.txt_oer,
      mtd: this.editStatusForm.value.txt_mtdoer,
      language: this.languageService.getLanguage,
    };

    console.log('Save Request:', req);

    this.productionService
      .saveProcessData(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: async (result: any) => {
          this.saveDisable = false;

          if (result?.httpcode == 200) {
            const message =
              this.processedId == 0
                ? this.translate.instant('STATUSSAVE.datasuccess')
                : this.translate.instant('STATUSSAVE.dataeditsuccess');

            await this.showToast(message);

            // ============================================
            // ✅ Trigger refresh on the status page via the
            //    static subject. This guarantees getreport()
            //    runs even if Ionic reuses the cached
            //    component instance (so ionViewWillEnter
            //    does not fire).
            // ============================================
            ProductionProcessStatusPage.refresh$.next();

            this.router.navigate(['/tabs/production-process-status'], {
              replaceUrl: true,
            });
          } else if (result?.httpcode == 401) {
            this.showToast(this.translate.instant('STATUSSAVE.alreadyexist'));
          } else {
            const message =
              this.processedId == 0
                ? this.translate.instant('STATUSSAVE.datafailed')
                : this.translate.instant('STATUSSAVE.dataeditfailed');
            this.showToast(message);
          }
        },
        error: (error: any) => {
          console.error('Save failed:', error);
          this.saveDisable = false;
          const message =
            this.processedId == 0
              ? this.translate.instant('STATUSSAVE.datafailed')
              : this.translate.instant('STATUSSAVE.dataeditfailed');
          this.showToast(message);
        },
      });
  }

  private validateMandatoryFields(): boolean {
    const avgWeight = this.editStatusForm.value.txt_average_cage_weight;
    const oer = this.editStatusForm.value.txt_oer;
    const mtd = this.editStatusForm.value.txt_mtdoer;

    if (avgWeight === '' || avgWeight === null || avgWeight === undefined) {
      this.showToast(
        this.translate.instant('STATUSSAVE.averagecageweightmandatory'),
      );
      return false;
    }
    if (oer === '' || oer === null || oer === undefined) {
      this.showToast(this.translate.instant('STATUSSAVE.oermandatory'));
      return false;
    }
    if (mtd === '' || mtd === null || mtd === undefined) {
      this.showToast(this.translate.instant('STATUSSAVE.mtdoermandatory'));
      return false;
    }
    return true;
  }

  private validatePercentageFields(): boolean {
    const v = this.editStatusForm.value;
    if (
      Number(v.txt_dobiprocess) > 100 ||
      Number(v.txt_dobitank) > 100 ||
      Number(v.txt_oer) > 100 ||
      Number(v.txt_mtdoer) > 100
    ) {
      this.showToast(
        this.translate.instant('GRADINGHOME.percentagevalidation'),
      );
      return false;
    }
    return true;
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'bottom',
    });
    await toast.present();
  }

  decimalFilter(event: any): void {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    const input = event.target.value + String.fromCharCode(event.charCode);
    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  dobiDecimalFilter(event: any): void {
    const reg = /^-?\d*(\.\d{0,3})?$/;
    const input = event.target.value + String.fromCharCode(event.charCode);
    if (!reg.test(input)) {
      event.preventDefault();
    }
  }
}
