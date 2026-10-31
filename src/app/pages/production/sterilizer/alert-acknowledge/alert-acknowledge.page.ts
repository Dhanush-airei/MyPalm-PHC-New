import {
  Component,
  OnInit,
  ViewChild,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  Platform,
  ModalController,
  NavParams,
  IonContent,
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ImageUploadService } from 'src/app/shared/services/image-upload-service/image-upload-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ImageSliderComponent } from 'src/app/shared/components/image-slider/image-slider.component';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { SterilizerService } from 'src/app/shared/services/production-services/sterilizer-service/sterilizer-service';
import { NotificationService } from 'src/app/shared/services/notification-service/notification-service';

@Component({
  selector: 'app-alert-acknowledge',
  templateUrl: './alert-acknowledge.page.html',
  styleUrls: ['./alert-acknowledge.page.scss'],
  standalone: false,
})
export class AlertAcknowledgePage implements OnInit {
  private destroyRef = inject(DestroyRef);

  @ViewChild('pageTop') pageTop!: IonContent;

  // Form
  alertattendForm!: FormGroup;

  // Alert Data
  params: any;
  title: string = '';
  getbaseid: string = '';
  getid: string = '';
  gettype: string = '';
  alertmessage: string = '';
  notificationtext: string = '';
  selectedlanguage: string = '';
  norecordflag: boolean = false;
  isDisable: boolean = false;

  // Image Data
  imagetype: string = '';
  imageview: string = '';
  imagePaths: any = {
    attendimage_path: '',
  };
  attendimagesArr: string[] = [];
  dataArr: any[] = [];

  constructor(
    private platform: Platform,
    private languageService: LanguageService,
    private translate: TranslateService,
    private fb: FormBuilder,
    public navParams: NavParams,
    public modalController: ModalController,
    private imgUpload: ImageUploadService,
    private toastService: ToastService,
    private userContext: UserContext,
    private sterilizerService: SterilizerService,
    private notificationService: NotificationService,
  ) {
    this.selectedlanguage = this.languageService.getLanguage;

    // Handle back button for modal
    this.platform.backButton.subscribeWithPriority(9999, () => {
      this.modalController.getTop().then((modal) => {
        if (modal != null) {
          return;
        }
      });
    });

    // Get params from navParams
    let viewform = navParams.get('item');
    this.params = JSON.parse(viewform);

    this.title = this.params.title;
    this.getbaseid = this.params.baseid;
    this.getid = this.params.id;
    this.gettype = this.params.type;

    // Initialize form
    this.alertattendForm = this.fb.group({
      txt_attendimageupload: new FormControl(''),
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.getAlertDetails();
  }

  /**
   * Get alert details from API
   */
  getAlertDetails(): void {
    const req = {
      userid: this.userContext.userId,
      departmentid: this.userContext.departmentId,
      designationid: this.userContext.designId,
      millcode: this.userContext.millCode,
      baseid: this.getbaseid,
      id: this.getid,
      type: this.gettype,
      language: this.languageService.getLanguage,
    };

    this.sterilizerService
      .getalertdetails(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          if (result.httpcode == 200) {
            this.notificationtext = this.nl2br(
              result.data[0].notification_text,
            );
            this.alertmessage = '';
            this.norecordflag = false;
          } else if (result.httpcode == 401) {
            this.notificationtext = this.nl2br(
              result.data[0].notification_text,
            );
            this.alertmessage = result.message;
            this.norecordflag = false;
          } else {
            this.alertmessage = '';
            this.norecordflag = true;
          }
        },
        error: (err) => {
          console.error('Failed to get alert details:', err);
          this.alertmessage = '';
          this.norecordflag = true;
        },
      });
  }

  /**
   * Upload image - FIXED
   */
  async imageUpload(type: string): Promise<void> {
    try {
      const result: any = await this.imgUpload.imageUploadCommon(type);

      // The result is already a parsed JSON object from the HTTP response
      if (result.httpcode == 200 || result.httpcode === '200') {
        if (type == 'Attend') {
          this.imagePaths.attendimage_path = result.data.uploaded_path;
          this.attendimagesArr.push(this.imagePaths.attendimage_path);

          // updateImageUploadText() returns the same text that is set on
          // the form control, so we can reuse it for the toast.
          const uploadedMessage = this.updateImageUploadText();
          if (uploadedMessage) {
            this.toastService.success(`${type} ${uploadedMessage}`);
          }
        }
      } else {
        this.toastService.error(
          this.translate.instant('HOURLYPRESSSTATIONSAVE.imageaddedfailed'),
        );
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      this.toastService.error(
        this.translate.instant('HOURLYPRESSSTATIONSAVE.imageaddedfailed'),
      );
    }
  }

  /**
   * Update the image upload form field text and return the same text so it
   * can also be reused in a success toast.
   *
   * 1 image  -> "<uploaded>1<image1>"   e.g. "Uploaded (1) image"
   * >1 image -> "<uploaded>N<image2>"   e.g. "Uploaded (2) images"
   * 0 images -> ""
   */
  private updateImageUploadText(): string {
    const uploaded = this.translate.instant('HOURLYPRESSSTATIONSAVE.uploded');
    const image1 = this.translate.instant('HOURLYPRESSSTATIONSAVE.image1');
    const image2 = this.translate.instant('HOURLYPRESSSTATIONSAVE.image2');

    let text = '';
    if (this.attendimagesArr.length == 1) {
      text = `${uploaded}${this.attendimagesArr.length}${image1}`;
    } else if (this.attendimagesArr.length > 1) {
      text = `${uploaded}${this.attendimagesArr.length}${image2}`;
    }
    this.alertattendForm.controls['txt_attendimageupload'].setValue(text);
    return text;
  }

  /**
   * View images
   */
  btn_view(type: string): void {
    this.imagetype = type;

    if (this.imagetype == 'Attend') {
      if (this.attendimagesArr.length > 0) {
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
  }

  /**
   * Save button click handler
   */
  btn_save(): void {
    // if (this.getbaseid == '') {
    //   this.toastService.error(
    //     this.translate.instant('ALERTACKNOWLEDGE.baseidmandatory'),
    //   );
    //   return;
    // }

    // if (this.getid == '') {
    //   this.toastService.error(
    //     this.translate.instant('ALERTACKNOWLEDGE.idmandatory'),
    //   );
    //   return;
    // }

    // if (this.gettype == '') {
    //   this.toastService.error(
    //     this.translate.instant('ALERTACKNOWLEDGE.typemandatory'),
    //   );
    //   return;
    // }

    // if (this.attendimagesArr.length <= 0) {
    //   this.toastService.error(
    //     this.translate.instant('ALERTACKNOWLEDGE.attendimagemandatory'),
    //   );
    //   return;
    // }

    this.save();
  }

  /**
   * Save alert notification
   */
  save(): void {
    const req = {
      userid: this.userContext.userId,
      departmentid: this.userContext.departmentId,
      designationid: this.userContext.designId,
      millcode: this.userContext.millCode,
      baseid: this.getbaseid,
      id: this.getid,
      type: this.gettype,
      rectify_status: '1',
      remarks: '',
      images: this.attendimagesArr.join('~'),
      language: this.languageService.getLanguage,
    };

    this.notificationService
      .updatealertnotification(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          this.isDisable = false;

          if (result.httpcode == 200) {
            this.toastService.success(
              this.translate.instant('ALERTACKNOWLEDGE.attendsuccess'),
            );
            this.btn_close();
          } else {
            this.toastService.error(
              this.translate.instant('ALERTACKNOWLEDGE.attendfailed'),
            );
          }
        },
        error: (err) => {
          console.error('Failed to update alert:', err);
          this.isDisable = false;
          this.toastService.error(
            this.translate.instant('ALERTACKNOWLEDGE.attendfailed'),
          );
        },
      });
  }

  /**
   * Close modal
   */
  btn_close(): void {
    this.modalController.dismiss({
      dismissed: true,
      item: '',
    });
  }

  /**
   * View images in modal using ImageSliderComponent
   */
  async ViewImages(attendimages: string): Promise<void> {
    if (attendimages && attendimages !== '') {
      const viewimagemodal = await this.modalController.create({
        component: ImageSliderComponent,
        componentProps: {
          from: 'Alert',
          alertitem: attendimages,
        },
        cssClass: 'image-slider-modal',
      });

      await viewimagemodal.present();
    }
  }

  /**
   * Convert newline to <br>
   */
  nl2br(text: string): string {
    if (!text) return '';
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
