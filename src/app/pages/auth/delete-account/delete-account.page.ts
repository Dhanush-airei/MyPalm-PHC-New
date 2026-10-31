import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { AuthService } from 'src/app/shared/services/auth-service/auth-service';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.page.html',
  styleUrls: ['./delete-account.page.scss'],
  standalone: false,
})
export class DeleteAccountPage implements OnInit {
  isLoading = false;
  constructor(
    private modalController: ModalController,
    private translate: TranslateService,
    private authService: AuthService,
    private UserContext: UserContext,
    private LanguageService: LanguageService,

    private toastService: ToastService,
  ) {}

  ngOnInit() {}

  cancel(): void {
    this.modalController.dismiss();
  }

  confirmDelete(): void {
    const request = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      language: this.LanguageService.getLanguage,
    };

    console.log(request);
    this.isLoading = true;

    this.authService.deleteAccount(request).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log(response);

        if (response.httpcode == 200) {
          this.toastService.success(
            this.translate.instant('MORE.accountdeleted'),
          );
          this.modalDismiss();
        } else {
          this.toastService.error(
            this.translate.instant('MORE.accountnotdeleted'),
          );
        }
      },

      error: (error: any) => {
        console.error('Delete Account Error:', error);

        this.toastService.error(error);
        this.isLoading = false;
      },
    });
  }

  modalDismiss(): void {
    this.modalController.dismiss({
      delete: true,
    });
  }
}
