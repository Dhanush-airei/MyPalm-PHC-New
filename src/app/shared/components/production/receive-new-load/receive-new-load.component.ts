import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';

import { GraderVehicleSearchPage } from 'src/app/pages/production/grader/grader-vehicle-search/grader-vehicle-search.page';
import { GraderSupplierSearchPage } from 'src/app/pages/production/grader/grader-supplier-search/grader-supplier-search.page';
import { ImageSliderComponent } from 'src/app/shared/components/image-slider/image-slider.component';

import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { ImageUploadService } from 'src/app/shared/services/image-upload-service/image-upload-service';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { GradingService } from 'src/app/shared/services/production-services/grading-service/grading-service';

@Component({
  selector: 'app-receive-new-load',
  templateUrl: './receive-new-load.component.html',
  styleUrls: ['./receive-new-load.component.scss'],
  standalone: false,
})
export class ReceiveNewLoadComponent implements OnInit {
  @Output() buttonClick = new EventEmitter<any>();
  form!: FormGroup;
  showManualSupplier = false;
  showManualVehicle = false;
  supplierId = 0;
  vehicleId = 0;

  imageUrl: string | undefined;

  imagePaths: string = '';
  hardbunchesimagesArr: string[] = [];
  isLoading = false;
  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private UserContext: UserContext,
    private LanguageService: LanguageService,
    private translate: TranslateService,
    private toastService: ToastService,
    private loadingController: LoadingController,
    private imageUploadService: ImageUploadService,
    private GradingService: GradingService,
  ) {
    this.form = this.fb.group({
      vehicle_no: ['', [Validators.required]],
      supplier_name: ['', [Validators.required]],
      hardbunches: ['', [Validators.required]],
      underripebunches: ['', [Validators.required]],
      ripeness: ['', [Validators.required]],
      overdue: ['', [Validators.required]],
      loosefruits: ['', [Validators.required]],
    });
  }

  ngOnInit() {}

  async openSupplierSearch() {
    const modal = await this.modalController.create({
      component: GraderSupplierSearchPage,
      cssClass: 'app-search-modal',
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (!data) {
      return;
    }

    if (data.type === 'selected') {
      console.log(data);
      this.supplierId = data.id;
      this.form.patchValue({
        supplier_name: data.supplier_name,
      });
    }

    if (data.type === 'manual') {
      this.showManualSupplier = true;

      this.supplierId = 0;

      this.form.patchValue({
        supplier_name: data.supplier_name,
      });
    }
  }

  async openVehicleSearch() {
    const modal = await this.modalController.create({
      component: GraderVehicleSearchPage,
      cssClass: 'app-search-modal',
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (!data) {
      return;
    }

    if (data.type === 'selected') {
      this.showManualVehicle = false;

      this.vehicleId = Number(data.id);

      this.form.patchValue({
        vehicle_no: data.vehicle_no,
      });
    }

    if (data.type === 'manual') {
      this.showManualVehicle = true;

      this.vehicleId = 0;

      this.form.patchValue({
        vehicle_no: data.vehicle_no,
      });
    }
  }

  alphanumberFilter(event: any) {
    const reg = /^[a-zA-Z0-9\s]{0,15}$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,1})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  backToSelectSupplier() {
    this.showManualSupplier = false;

    this.form.patchValue({
      supplier_name: '',
    });
  }

  backToSelectVehicleNo() {
    this.showManualVehicle = false;

    this.form.patchValue({
      vehicle_no: '',
    });
  }

  formatDecimal(controlName: string): void {
    const control = this.form.get(controlName);

    if (!control) {
      return;
    }

    const value = control.value;

    if (value === null || value === undefined || value === '') {
      return;
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return;
    }

    control.setValue(numericValue.toFixed(1));
  }

  async imageUpload(type: string) {
    const loading = await this.loadingController.create({
      message: 'Uploading image...',
      spinner: 'circular',
      backdropDismiss: false, // user tap panni close panna mudiyathu
    });

    await loading.present();

    try {
      const result: any = await this.imageUploadService.imageUploadCommon(type);
      console.log(result);
      if (result.httpcode == 200) {
        if (type == 'HB') {
          this.imagePaths = result.data.uploaded_path;

          this.hardbunchesimagesArr.push(this.imagePaths);
        }
      } else if (result.httpcode == 413) {
        this.toastService.error(result.status);
      } else {
        console.log('Upload Failed');
      }
    } catch (error) {
      console.log(error);
    } finally {
      await loading.dismiss();
    }
  }

  showImages() {
    this.viewImages(this.hardbunchesimagesArr);
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

  onSubmit() {
    if (!this.form.valid) {
      this.toastService.warning(
        this.translate.instant('GENERALBUTTON.pleasefilltheform'),
      );
      return;
    }

    if (
      this.form.value.hardbunches > 100 ||
      this.form.value.underripebunches > 100 ||
      this.form.value.ripeness > 100 ||
      this.form.value.overdue > 100 ||
      this.form.value.loosefruits > 100
    ) {
      this.toastService.warning(
        this.translate.instant('GRADINGHOME.percentagevalidation'),
      );
      return;
    }

    var req = {
      userid: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      id: 0,
      language: this.LanguageService.getLanguage,
      // supplier_id: this.form.value.supplier_name,
      supplier_id: this.supplierId,
      vehicle_no: this.form.value.vehicle_no,
      vehicle_id: this.showManualVehicle == true ? 0 : this.vehicleId,
      hard_bunch_percent: this.form.value.hardbunches,
      under_ripe_bunch_percent: this.form.value.underripebunches,
      ripeness_percent: this.form.value.ripeness,
      overdue_percent: this.form.value.overdue,
      loose_fruit_percent: this.form.value.loosefruits,
      hard_bunches_image: this.hardbunchesimagesArr.join('~'),
    };

    console.log(req);
    this.isLoading = true;

    this.GradingService.saveGrading(req)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: (value) => {
          if (value.httpcode == 200) {
            this.toastService.success(
              this.translate.instant('GRADINGHOME.receivedloadsuccessfully'),
            );

            this.form.reset();
            this.hardbunchesimagesArr = [];
            this.refreshLatestGraderRecords();
          } else {
            this.toastService.error(
              this.translate.instant('GRADINGHOME.receivedloadfailed'),
            );
          }
        },

        error: (err) => {
          console.error('Grading save failed:', err);
          this.toastService.error(
            err?.error?.message || 'Something went wrong.',
          );
        },
      });
  }

  refreshLatestGraderRecords() {
    this.buttonClick.emit({
      refresh: true,
    });
  }
}
