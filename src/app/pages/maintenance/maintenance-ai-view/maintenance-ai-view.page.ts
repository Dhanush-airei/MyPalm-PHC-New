import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { MaintenanceService } from 'src/app/shared/services/maintenance-service/maintenance-service';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { NavParams } from '@ionic/angular';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-maintenance-ai-view',
  templateUrl: './maintenance-ai-view.page.html',
  styleUrls: ['./maintenance-ai-view.page.scss'],
  standalone: false,
})
export class MaintenanceAiViewPage implements OnInit {
  private destroyRef = inject(DestroyRef);
  params: any;
  notificationid: any;
  aicontent!: SafeHtml;
  constructor(
    private translate: TranslateService,
    private modalController: ModalController,
    private fb: FormBuilder,
    private navParams: NavParams,
    private UserContext: UserContext,
    private MaintenanceService: MaintenanceService,
    private LanguageService: LanguageService,
    private ToastService: ToastService,
    private sanitizer: DomSanitizer,
  ) {
    let viewform = navParams.get('item');
    this.params = JSON.parse(viewform);
    this.notificationid = this.params.id;
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.getAINotificationView();
  }

  getAINotificationView() {
    let request = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      id: this.notificationid,
      language: this.LanguageService.getLanguage,
    };

    //console.log("req", req);

    this.MaintenanceService.getAIView(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          console.log('Response:', response);

          if (response?.httpcode == 200) {
            this.aicontent = this.sanitizer.bypassSecurityTrustHtml(
              response.content,
            );
          } else {
            this.aicontent = this.sanitizer.bypassSecurityTrustHtml(
              response.content,
            );
          }
        },

        error: (error: any) => {
          console.error('Error:', error);
        },
      });
  }

  btn_close() {
    this.modalController.dismiss({
      dismissed: true,
      item: '',
    });
  }

  nl2br(text: string) {
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }

  parseString(item: any) {
    return JSON.stringify(item);
  }
}
