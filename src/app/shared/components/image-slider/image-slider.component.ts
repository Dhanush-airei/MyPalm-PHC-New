import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

export interface SliderImage {
  image: string;
  title: string;
}

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss'],
  standalone: false,
})
export class ImageSliderComponent implements OnInit {
  /**
   * From Screen (Grading, Press, BPV, Peak, Sterilisation, Alert, etc.)
   */
  @Input() from = '';

  /**
   * Generic input - used by Grading, Press, Alert
   * Accepts either a string (split by '~') or an array
   */
  @Input() gradingitem: string | string[] = '';

  /**
   * Alert item
   */
  @Input() alertitem: string | string[] = '';

  /**
   * Press-specific inputs (kept for backward compatibility)
   */
  @Input() temperatureitem: string | string[] = '';
  @Input() motoritem: string | string[] = '';
  @Input() levelitem: string | string[] = '';
  @Input() digestoritem: string | string[] = '';
  @Input() pressmotoritem: string | string[] = '';
  @Input() fibreflowitem: string | string[] = '';
  @Input() hydraulicpressureitem: string | string[] = '';

  /**
   * Sterilisation-specific inputs (kept for backward compatibility)
   */
  @Input() bpvitem: string | string[] = '';
  @Input() p1item: string | string[] = '';
  @Input() p3item: string | string[] = '';

  /**
   * Images
   */
  imagesArr: SliderImage[] = [];
  temperatureimages: any = [];
  motorimages: any = [];
  levelimages: any = [];
  digestorimages: any = [];
  pressmotorimages: any = [];
  fibreflowimages: any = [];
  hydraulicpressureimages: any = [];

  bpvimages: any = [];
  p1images: any = [];
  p3images: any = [];

  /**
   * Swiper Config
   */
  swiperOptions = {
    slidesPerView: 1,
    spaceBetween: 10,
    centeredSlides: true,
    navigation: true,
    pagination: {
      clickable: true,
    },
    zoom: true,
  };

  showBackButton = 1;
  showLogo = 0;
  appTitle = this.translate.instant('IMAGESLIDER.viewimage');
  headerActions = '';

  constructor(
    private modalController: ModalController,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    console.log('ImageSliderComponent - from:', this.from);
    this.loadImages();
  }

  /**
   * Load Images
   */
  loadImages(): void {
    if (this.from === 'Grading' || this.from === 'GradingReport') {
      this.loadGradingImages();
      return;
    }

    if (this.from === 'Press') {
      this.loadPressImages();
      return;
    }

    if (this.from === 'BPV' || this.from === 'Peak') {
      this.loadSterilizerImages();
      return;
    }

    if (this.from === 'Sterilisation') {
      this.loadSterilisationImages();
      return;
    }

    if (this.from === 'Alert') {
      this.loadAlertImages();
      return;
    }

    console.log('loadImages - unknown from:', this.from);
  }

  /**
   * Load Alert Images
   */
  private loadAlertImages(): void {
    const source = this.alertitem || this.gradingitem;
    const imageArray = this.convertToArray(source as string | string[]);

    if (imageArray.length === 0) {
      console.log('No images found for Alert');
      return;
    }

    const titlePrefix = this.translate.instant('IMAGESLIDER.image');

    imageArray.forEach((image: string, index: number) => {
      this.imagesArr.push({
        image: image,
        title: titlePrefix + ' ' + (index + 1),
      });
    });
  }

  /**
   * Load Sterilizer Images (BPV & Peak)
   */
  private loadSterilizerImages(): void {
    const imageArray = this.convertToArray(
      this.gradingitem as string | string[],
    );

    if (imageArray.length === 0) {
      console.log('No images found for', this.from);
      return;
    }

    let titlePrefix = '';
    if (this.from === 'BPV') {
      titlePrefix = this.translate.instant(
        'HOURLYSTERILIZATIONSTATIONSAVE.bpvimages',
      );
    } else if (this.from === 'Peak') {
      titlePrefix = this.translate.instant(
        'HOURLYSTERILIZATIONSTATIONSAVE.peakimages',
      );
    }

    imageArray.forEach((image: string, index: number) => {
      this.imagesArr.push({
        image: image,
        title: titlePrefix + ' ' + (index + 1),
      });
    });
  }

  /**
   * Grading Images
   */
  private loadGradingImages(): void {
    const imageArray = this.convertToArray(
      this.gradingitem as string | string[],
    );

    imageArray.forEach((image: string, index: number) => {
      this.imagesArr.push({
        image: image,
        title: this.translate.instant('IMAGESLIDER.image') + ' ' + (index + 1),
      });
    });
  }

  /**
   * Press Images
   * Supports BOTH:
   *  - Single combined array via `gradingitem`
   *  - Separate named inputs (temperatureitem, motoritem, etc.)
   */
  private loadPressImages(): void {
    // ---- Case 1: Combined array passed via gradingitem ----
    const combined = this.convertToArray(this.gradingitem as string | string[]);

    if (combined.length > 0) {
      combined.forEach((image: string, index: number) => {
        this.imagesArr.push({
          image: image,
          title:
            this.translate.instant('IMAGESLIDER.image') + ' ' + (index + 1),
        });
      });
      return;
    }

    // ---- Case 2: Separate named inputs (legacy behavior) ----
    this.temperatureimages = this.convertToArray(this.temperatureitem);
    this.motorimages = this.convertToArray(this.motoritem);
    this.levelimages = this.convertToArray(this.levelitem);
    this.digestorimages = this.convertToArray(this.digestoritem);
    this.pressmotorimages = this.convertToArray(this.pressmotoritem);
    this.fibreflowimages = this.convertToArray(this.fibreflowitem);
    this.hydraulicpressureimages = this.convertToArray(
      this.hydraulicpressureitem,
    );

    this.addImages(
      this.temperatureimages,
      this.translate.instant('IMAGESLIDER.temperatureimage'),
    );
    this.addImages(
      this.motorimages,
      this.translate.instant('IMAGESLIDER.motorimage'),
    );
    this.addImages(
      this.levelimages,
      this.translate.instant('IMAGESLIDER.levelimage'),
    );
    this.addImages(
      this.digestorimages,
      this.translate.instant('IMAGESLIDER.digestorimage'),
    );
    this.addImages(
      this.pressmotorimages,
      this.translate.instant('IMAGESLIDER.pressmotorimage'),
    );
    this.addImages(
      this.fibreflowimages,
      this.translate.instant('IMAGESLIDER.fibreflowimage'),
    );
    this.addImages(
      this.hydraulicpressureimages,
      this.translate.instant('IMAGESLIDER.hydraulicpressureimage'),
    );
  }

  /**
   * Sterilisation Images
   */
  private loadSterilisationImages(): void {
    this.bpvimages = this.convertToArray(this.bpvitem);
    this.p1images = this.convertToArray(this.p1item);
    this.p3images = this.convertToArray(this.p3item);

    this.addImages(
      this.bpvimages,
      this.translate.instant('IMAGESLIDER.bpvimage'),
    );
    this.addImages(
      this.p1images,
      this.translate.instant('IMAGESLIDER.peakimage'),
    );
    this.addImages(
      this.p3images,
      this.translate.instant('IMAGESLIDER.p3image'),
    );
  }

  /**
   * Convert Image Data
   */
  private convertToArray(data: string | string[] | null | undefined): string[] {
    if (!data) {
      return [];
    }

    if (Array.isArray(data)) {
      return data
        .map((item) => (item ?? '').toString().trim())
        .filter((item) => item !== '');
    }

    return data
      .toString()
      .split('~')
      .map((item) => item.trim())
      .filter((item) => item !== '');
  }

  /**
   * Add Images
   */
  private addImages(images: string[], title: string): void {
    images.forEach((image) => {
      this.imagesArr.push({
        image,
        title,
      });
    });
  }

  /**
   * Modal Close
   */
  dismiss(): void {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
