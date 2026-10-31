import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { LogoutPage } from 'src/app/pages/auth/logout/logout.page';
import { DeleteAccountPage } from 'src/app/pages/auth/delete-account/delete-account.page';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { AuthService } from 'src/app/shared/services/auth-service/auth-service';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  @ViewChild('pageHeader')
  pageHeader!: PageHeaderComponent;

  appTitle = this.nl2br(this.UserContext.millName);
  notificationCount = 25;
  headerActions = '';
  profileImage = '';
  name = '';
  designation = '';

  /**
   * Drives the Delete Account button visibility.
   *
   * Default false → hidden on first paint.
   * Set to true only when the backend's login_check === "1".
   */
  showDeleteAccountButton = false;

  isLoading = false;
  showBackButton = 1;
  showLogo = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private UserContext: UserContext,
    private LanguageService: LanguageService,
    private translate: TranslateService,
    private toastService: ToastService,
    private modalController: ModalController,
  ) {}

  ngOnInit() {}

  /**
   * Fires every time the Profile page becomes active.
   * Re-fetches the login_check flag so the Delete button
   * reflects the current backend state.
   */
  ionViewWillEnter() {
    this.fetchProfilePic();
    this.fetchUserList();
    this.deleteAccountButtonFlag(); // ← API called on every entry
    this.headerActions = '3,4';
    this.backButtonEnableCheck();
  }

  fetchProfilePic() {
    const profile = localStorage.getItem('profile');

    if (profile) {
      this.profileImage = profile;
    } else {
      this.profileImage = '../../../assets/img/supervisorreport.png';
    }
  }

  fetchUserList() {
    const userList = localStorage.getItem('userlist');

    if (userList) {
      const user = JSON.parse(userList);
      this.name = user.name || '';
      this.designation = user.designation || '';
    } else {
      this.name = '';
      this.designation = '';
    }
  }

  changePassword() {
    this.router.navigate(['/change-password']);
  }

  /**
   * Calls https://mjm.mypalm.com.my/Login_check
   *
   * Expected response:
   *   { "login_check": "0" }  → hide Delete button
   *   { "login_check": "1" }  → show Delete button
   *
   * Any error → fail closed (hide the button).
   */
  private deleteAccountButtonFlag() {
    this.authService.getLoginCheckApi().subscribe({
      next: (response: any) => {
        // Field lives at the top level of the response.
        // Use strict string comparison to match backend's "0"/"1" contract.
        this.showDeleteAccountButton = response?.login_check == '1';
      },
      error: (error) => {
        console.error('deleteAccountButtonFlag error:', error);
        this.showDeleteAccountButton = false;
      },
    });
  }

  async openLogoutModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: LogoutPage,
      cssClass: 'confirmation-modal',
      showBackdrop: true,
      backdropDismiss: false,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.logout) {
      this.logout();
    }
  }

  async openDeleteModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: DeleteAccountPage,
      cssClass: 'confirmation-modal',
      showBackdrop: true,
      backdropDismiss: false,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.delete) {
      this.logout();
    }
  }

  logout(): void {
    this.authService.logout();
  }

  backButtonEnableCheck() {
    const eligibleDesignIds = [2];
    const eligible = eligibleDesignIds.includes(this.UserContext.designId);

    if (eligible) {
      this.showBackButton = 1;
      this.showLogo = 0;
    }
  }

  nl2br(text: string) {
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
