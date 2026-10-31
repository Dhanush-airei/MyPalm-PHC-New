import { Component, OnInit, Input, inject, DestroyRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModalController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { ProductionService } from 'src/app/shared/services/production-services/production-service/production-service';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';

@Component({
  selector: 'app-production-ffb-cage',
  templateUrl: './production-ffb-cage.page.html',
  styleUrls: ['./production-ffb-cage.page.scss'],
  standalone: false,
})
export class ProductionFfbCagePage implements OnInit {
  private destroyRef = inject(DestroyRef);
  @Input() ffbcagetotal = '';
  @Input() ffbcageinuse = '';
  @Input() ffbcagenotinuse = '';
  @Input() ffbcageunderrepair = '';
  @Input() millstatus: any;

  ffbcageForm!: FormGroup;
  constructor(
    private translate: TranslateService,
    private modalController: ModalController,
    private fb: FormBuilder,
    private UserContext: UserContext,
    private ProductionService: ProductionService,
    private LanguageService: LanguageService,
    private ToastService: ToastService,
  ) {}

  ngOnInit() {
    // @Input() values are guaranteed to be set by the time ngOnInit runs
    if (this.ffbcageinuse === '-') {
      this.ffbcageinuse = '0';
    }

    if (this.ffbcagenotinuse === '-') {
      this.ffbcagenotinuse = '0';
    }

    if (this.ffbcageunderrepair === '-') {
      this.ffbcageunderrepair = '0';
    }

    this.ffbcageForm = new FormGroup({
      txt_ffbcageinuse: new FormControl(this.ffbcageinuse),
      txt_ffbcagenotinuse: new FormControl(this.ffbcagenotinuse),
      txt_ffbcageunderipe: new FormControl(this.ffbcageunderrepair),
    });
  }
  save() {
    console.log(this.ffbcageForm.value.txt_ffbcagenotinuse);

    if (
      this.ffbcageForm.value.txt_ffbcageinuse === undefined ||
      this.ffbcageForm.value.txt_ffbcageinuse === null
    ) {
      this.ToastService.warning(
        this.translate.instant('FFBCAGES.inusemandatory'),
      );
      return false;
    }

    if (
      this.ffbcageForm.value.txt_ffbcagenotinuse === undefined ||
      this.ffbcageForm.value.txt_ffbcagenotinuse === null
    ) {
      this.ToastService.warning(
        this.translate.instant('FFBCAGES.notinusemandatory'),
      );
      return false;
    }

    if (
      this.ffbcageForm.value.txt_ffbcageunderipe === undefined ||
      this.ffbcageForm.value.txt_ffbcageunderipe === null
    ) {
      this.ToastService.warning(
        this.translate.instant('FFBCAGES.underrepairmandatory'),
      );
      return false;
    }

    const request = {
      userid: this.UserContext.userId,
      departmentid: this.UserContext.departmentId,
      designationid: this.UserContext.designId,
      millcode: this.UserContext.millCode,
      total: '0',
      inuse: this.ffbcageForm.value.txt_ffbcageinuse,
      notinuse: this.ffbcageForm.value.txt_ffbcagenotinuse,
      underrepair: this.ffbcageForm.value.txt_ffbcageunderipe,
      language: this.LanguageService.getLanguage,
    };

    console.log(request);

    this.ProductionService.saveffbcages(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          console.log('Save breakdown Response:', response);

          if (response?.httpcode == 200) {
            this.modalController.dismiss({
              dismissed: true,
              item: 'Saved',
            });
          } else {
            this.cancel();
          }
        },

        error: (error) => {
          console.error('Save breakdown Error:', error);

          this.cancel();
        },
      });

    return true;
  }

  cancel() {
    this.modalController.dismiss({
      dismissed: true,
      item: '',
    });
  }

  numberFilter(event: any) {
    const reg = /^[0-9]{0,5}$/;
    const input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }
}
