import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { WeighbridgeService } from 'src/app/shared/services/production-services/weighbrigde-service/weighbridge-service';
import { WeighbridgeUpdateReportPage } from '../weighbridge-update-report/weighbridge-update-report.page';

@Component({
  selector: 'app-weighbridge-report',
  templateUrl: './weighbridge-report.page.html',
  styleUrls: ['./weighbridge-report.page.scss'],
  standalone: false,
})
export class WeighbridgeReportPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  appTitle = this.nl2br(this.UserContext.millName);
  showLogo = this.UserContext.designId == 10 ? 1 : 0;
  showBackButton = this.UserContext.designId != 10 ? 1 : 0;
  headerActions = '';

  reportForm!: FormGroup;
  fromDate = '';
  toDate = '';
  pleasewaitflag = false;

  gradinglistArr: any[] = [];
  totalArr: any[] = [];
  netweightflag = '';

  constructor(
    private fb: FormBuilder,
    private UserContext: UserContext,
    private LanguageService: LanguageService,
    private modalController: ModalController,
    private translate: TranslateService,
    private weighbridgeService: WeighbridgeService,
  ) {
    this.createForm();
  }

  ngOnInit() {}

  private createForm(): void {
    this.reportForm = this.fb.group({
      fromdate: [''],
      todate: [''],
    });
  }

  ionViewWillEnter() {
    this.getReport();
  }

  onDateRangeGet(event: { fromDate: string; toDate: string }): void {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;

    console.log('From Date:', this.fromDate);
    console.log('To Date:', this.toDate);

    this.getReport();
  }

  getReport() {
    var req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      language: this.LanguageService.getLanguage,
      fromdate: this.fromDate,
      todate: this.toDate,
    };

    console.log(req);
    this.pleasewaitflag = true;
    this.weighbridgeService
      .getweighbridgereportdetails(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleasewaitflag = false;
        }),
      )
      .subscribe({
        next: (response) => {
          console.log(response);
          this.fromDate = response.Fromdate;
          this.toDate = response.Todate;

          if (response.httpcode == 200) {
            this.gradinglistArr = response.data;
            this.totalArr = response.average;
            this.netweightflag = response.net_weight_flag;
          } else {
            this.gradinglistArr = [];
          }
        },
        error: (err) => {
          console.error('Failed to load report:', err);
        },
      });
  }

  /**
   * Open update modal for net weight using weighbridgepopup-modal
   */
  async openUpdateModal(value: any): Promise<void> {
    const weighbridgeModal = await this.modalController.create({
      component: WeighbridgeUpdateReportPage,
      componentProps: {
        item: JSON.stringify(value),
        module: 'REPORT',
      },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: 'weighbridgepopup-modal',
    });

    weighbridgeModal.onDidDismiss().then((modalData) => {
      const getData = modalData?.data?.item;
      if (getData) {
        // Refresh the report after update
        this.getReport();
      }
    });

    await weighbridgeModal.present();
  }

  nl2br(text: string) {
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
