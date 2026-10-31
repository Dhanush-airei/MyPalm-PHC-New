import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { PopoverController } from '@ionic/angular';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalController } from '@ionic/angular';
import { ImageSliderComponent } from 'src/app/shared/components/image-slider/image-slider.component';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { GradingService } from 'src/app/shared/services/production-services/grading-service/grading-service';
import { ScreenOrientation } from '@capacitor/screen-orientation';

@Component({
  selector: 'app-grader-report',
  templateUrl: './grader-report.page.html',
  styleUrls: ['./grader-report.page.scss'],
  standalone: false,
})
export class GraderReportPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  appTitle =
    this.UserContext.designId == 10
      ? this.nl2br(this.UserContext.millName)
      : this.translate.instant('GRADINGREPORT.gradingreport');
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
    private popoverController: PopoverController,
    private GradingService: GradingService,
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
  async ionViewWillEnter() {
    await ScreenOrientation.lock({
      orientation: 'landscape',
    });
    this.getReport();
  }

  async ionViewWillLeave() {
    await ScreenOrientation.lock({
      orientation: 'portrait',
    });
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
    this.GradingService.getGradingReport(req)
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

  async viewImages(images: string[]): Promise<void> {
    if (!images || images.length === 0) {
      return;
    }

    const modal = await this.modalController.create({
      component: ImageSliderComponent,
      componentProps: {
        from: 'Grading',
        gradingitem: images,
      },
      cssClass: 'image-slider-modal',
    });

    await modal.present();
  }

  nl2br(text: string) {
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
