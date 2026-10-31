import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';

import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { AuthService } from 'src/app/shared/services/auth-service/auth-service';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: false,
})
export class ChangePasswordPage implements OnInit {
  @ViewChild(PageHeaderComponent)
  pageHeader!: PageHeaderComponent;
  appTitle = this.translate.instant('MORE.changepassword');
  showBackButton = 1;
  showLogo = 0;
  headerActions = '3,4';

  // showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  changePasswordForm!: FormGroup;
  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private UserContext: UserContext,
    private LanguageService: LanguageService,
    private fb: FormBuilder,
    private router: Router,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.translate.onLangChange.subscribe(() => {
      this.translate.get('MORE.changepassword').subscribe((res) => {
        this.appTitle = res;
      });
    });
  }

  private initializeForm(): void {
    this.changePasswordForm = this.fb.group({
      // oldPassword: [''],
      newPassword: [''],
      confirmPassword: [''],
    });
  }

  savePassword(): void {
    const payload = this.changePasswordForm.getRawValue();

    // New Password Validation
    if (!payload.newPassword?.trim()) {
      this.toastService.warning(
        this.translate.instant('CHANGEPASSWORD.newpasswordwarning'),
      );
      return;
    }

    // Confirm Password Validation
    if (!payload.confirmPassword?.trim()) {
      this.toastService.warning(
        this.translate.instant('CHANGEPASSWORD.confirmpasswordwarning'),
      );
      return;
    }

    // Password Match Validation
    if (payload.newPassword !== payload.confirmPassword) {
      this.changePasswordForm
        .get('confirmPassword')
        ?.setErrors({ passwordMismatch: true });

      this.toastService.warning(this.translate.instant('CHANGEPASSWORD.error'));
      return;
    }

    const request = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      language: this.LanguageService.getLanguage,
      password: payload.newPassword,
      confirmpassword: payload.confirmPassword,
    };

    console.log(request);
    this.isLoading = true;
    this.authService.changePassword(request).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log(response);

        if (response.httpcode == 200) {
          this.toastService.success(
            this.translate.instant('CHANGEPASSWORD.updatedsuccessfully'),
          );
          this.goBack();
        } else {
          this.toastService.error(
            this.translate.instant('CHANGEPASSWORD.updatefailed'),
          );
        }
      },

      error: (error: any) => {
        console.error('Change Password Error:', error);

        this.toastService.error(error);
        this.isLoading = false;
      },
    });
  }

  logout(): void {
    const selectedEstate = localStorage.getItem('selectedEstate');
    const language = localStorage.getItem('SELECTED_LANGUAGE');
    const endpoint = localStorage.getItem('endpoint');

    localStorage.clear();

    if (selectedEstate) {
      localStorage.setItem('selectedEstate', selectedEstate);
    }

    if (language) {
      localStorage.setItem('SELECTED_LANGUAGE', language);
    }

    if (endpoint) {
      localStorage.setItem('endpoint', endpoint);
    }

    this.router.navigateByUrl('/login');
  }
  goBack(): void {
    this.pageHeader?.goBack();
  }
}
