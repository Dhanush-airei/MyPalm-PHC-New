import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Keyboard } from '@capacitor/keyboard';
import { PluginListenerHandle } from '@capacitor/core';
import {
  IonContent,
  ModalController,
  Platform,
  NavParams,
} from '@ionic/angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { GeneralService } from 'src/app/shared/services/general-service/general-service';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import {
  FormArray,
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { MaintenanceAiViewPage } from '../maintenance-ai-view/maintenance-ai-view.page';
import { ImageSliderComponent } from 'src/app/shared/components/image-slider/image-slider.component';
import { LoadingController } from '@ionic/angular';
import { ImageUploadService } from 'src/app/shared/services/image-upload-service/image-upload-service';

@Component({
  selector: 'app-maintenance-upload-image-popup',
  templateUrl: './maintenance-upload-image-popup.page.html',
  styleUrls: ['./maintenance-upload-image-popup.page.scss'],
  standalone: false,
})
export class MaintenanceUploadImagePopupPage implements OnInit {
  private destroyRef = inject(DestroyRef);
  params: any;
  alertattendForm: any;

  title = '';
  getid = '';
  alertmessage = '';
  notificationtext = '';
  selectedlanguage = '';
  norecordflag = false;
  isDisable = false;

  imagetype = '';
  imageview = '';

  imagePaths = {
    attendimage_path: '',
  };

  attendimagesArr: any = [];

  dataArr: any = [];
  constructor(
    public ModalController: ModalController,
    private platform: Platform,
    public UserContext: UserContext,
    private LanguageService: LanguageService,
    private translate: TranslateService,
    private GeneralService: GeneralService,
    private MaintenanceService: MaintenanceService,
    private toastService: ToastService,
    public navParams: NavParams,
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private imageUploadService: ImageUploadService,
  ) {
    let viewform = navParams.get('item');
    this.params = JSON.parse(viewform);

    console.log(this.params);

    this.title = this.params.notificationno;
    this.getid = this.params.id;

    this.alertattendForm = this.fb.group({
      txt_attendimageupload: new FormControl(''),
    });
  }

  ngOnInit() {}
  btn_view() {
    if (this.attendimagesArr.length > 0) {
      this.imageview = '';

      this.imageview = this.attendimagesArr.join('~');

      this.ViewImages(this.imageview);
    } else {
      this.imageview = '';

      if (this.attendimagesArr.length > 1) {
        this.toastService.error(
          this.translate.instant('HOURLYPRESSSTATIONSAVE.imagesnotfound'),
        );
      } else {
        this.toastService.error(
          this.translate.instant('HOURLYPRESSSTATIONSAVE.imagenotfound'),
        );
      }
    }
  }
  async ViewImages(attendimages: any) {
    if (attendimages != '') {
      const viewimagemodal = await this.ModalController.create({
        component: ImageSliderComponent,
        componentProps: {
          from: 'Alert',
          alertitem: attendimages,
        },
      });

      viewimagemodal.onDidDismiss().then((data) => {});

      return await viewimagemodal.present();
    }
  }

  async imageUpload(type: string) {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'circular',
      backdropDismiss: false, // user tap panni close panna mudiyathu
    });

    await loading.present();

    try {
      const result: any = await this.imageUploadService.imageUploadCommon(type);
      console.log(result);
      if (result.httpcode == 200) {
        this.imagePaths.attendimage_path = result.data.uploaded_path;

        this.attendimagesArr.push(this.imagePaths.attendimage_path);

        if (this.attendimagesArr.length == 1) {
          this.alertattendForm.controls.txt_attendimageupload.setValue(
            this.translate.instant('HOURLYPRESSSTATIONSAVE.uploded') +
              this.attendimagesArr.length +
              this.translate.instant('HOURLYPRESSSTATIONSAVE.image1'),
          );
        } else if (this.attendimagesArr.length > 1) {
          this.alertattendForm.controls.txt_attendimageupload.setValue(
            this.translate.instant('HOURLYPRESSSTATIONSAVE.uploded') +
              this.attendimagesArr.length +
              this.translate.instant('HOURLYPRESSSTATIONSAVE.image2'),
          );
        } else {
          this.alertattendForm.controls.txt_attendimageupload.setValue('');
        }
      } else {
        this.toastService.error(
          this.translate.instant('HOURLYPRESSSTATIONSAVE.imageaddedfailed'),
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      await loading.dismiss();
    }
  }

  btn_save() {
    if (this.getid == '') {
      this.toastService.warning(
        this.translate.instant('ALERTACKNOWLEDGE.idmandatory'),
      );
      return;
    }

    if (this.attendimagesArr.length <= 0) {
      this.toastService.warning(
        this.translate.instant('ALERTACKNOWLEDGE.attendimagemandatory'),
      );
      return;
    }

    this.save();
  }
  save() {
    var req = {
      userid: this.UserContext.userId,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      millcode: this.UserContext.millCode,
      id: this.getid,
      images: this.attendimagesArr.join('~'),
      language: this.LanguageService.getLanguage,
    };

    console.log(req);

    this.MaintenanceService.uploadNotificationImages(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log(response);
          if (response.httpcode == 200) {
            this.isDisable = false;

            this.toastService.success(
              this.translate.instant('ALERTACKNOWLEDGE.uploadsuccess'),
            );

            this.btn_close();
          } else {
            this.isDisable = false;

            this.toastService.error(
              this.translate.instant('ALERTACKNOWLEDGE.uploadfailed'),
            );
          }
        },
        error: (err) => {
          console.error('Failed to load report:', err);
        },
      });
  }
  btn_close() {
    this.ModalController.dismiss({
      dismissed: true,
      item: '',
    });
  }
}
