import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

// Rxjs imports
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
  catchError,
  finalize,
  EMPTY,
} from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Component imports
import { LanguagePopoverComponent } from 'src/app/shared/components/language-popover/language-popover.component';

// Service imports
import { AuthService } from 'src/app/shared/services/auth-service/auth-service';
import { RoleService } from 'src/app/shared/services/role-service/role-service';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  private destroyRef = inject(DestroyRef);
  showPassword = false;
  loginForm!: FormGroup;
  isLoading = false;
  showSignupButton = false;
  estates = [
    {
      name: 'Boteka',
      endpoint: 'http://172.24.16.33:9093/',
      enable: 0,
    },
    {
      name: 'Yaligimba',
      endpoint: 'http://172.24.16.196:9093/',
      enable: 0,
    },
    {
      name: 'Lokumete',
      endpoint: 'http://172.24.16.102:9093/',
      enable: 0,
    },
    {
      name: 'Lokutu',
      endpoint: 'http://172.24.16.162:9093/',
      enable: 0,
    },
    {
      name: 'In-House',
      endpoint: 'http://103.10.78.25:9093/',
      enable: 1,
    },
  ];
  selectedEstate: any;
  showEstateSelection = false;
  displayEstate: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private navCtrl: NavController,
    private roleService: RoleService,
    private popoverController: PopoverController,
    private toastService: ToastService,
    private translate: TranslateService,
    private LanguageService: LanguageService,
  ) {
    console.log('Login constructor');
  }

  ngOnInit(): void {
    this.initializeForm();
    // this.listenMillCodeChanges();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    this.signUpButtonFlag();
    this.initializeEstate();
  }
  /**
   * Initialize Login Form
   */
  initializeForm(): void {
    this.loginForm = this.fb.nonNullable.group({
      millCode: this.fb.nonNullable.control(''),
      username: this.fb.nonNullable.control(''),
      password: this.fb.nonNullable.control(''),
    });
  }

  /**
   * Listen for Mill Code Changes
   */
  listenMillCodeChanges(): void {
    this.loginForm
      .get('millCode')
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter((value: string) => value.trim().length >= 3),
        switchMap((millCode: string) =>
          this.authService.getMillDetails({
            millcode: millCode.trim(),
            version: '',
            language: this.LanguageService.getCurrentLanguage(),
          }),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: ({ httpcode, data }) => {
          if (httpcode == 200) {
            localStorage.setItem('endpoint', data.javaapiurl);
          } else {
            localStorage.removeItem('endpoint');
          }
        },
        error: (error) => {
          console.error('Failed to fetch mill details', error);
          localStorage.removeItem('endpoint');
        },
      });
  }

  /**
   * Signup button Enable or Disable
   */
  signUpButtonFlag() {
    this.authService.getLoginCheckApi().subscribe({
      next: (response: any) => {
        this.showSignupButton = response.login_check === '1';
      },
      error: (error) => {
        console.error(error);
        this.showSignupButton = false;
      },
    });
  }

  /**
   * Initialize estate
   */
  initializeEstate(): void {
    const storedEstate = localStorage.getItem('selectedEstate');
    console.log('initializeEstate');
    if (storedEstate) {
      this.selectedEstate = JSON.parse(storedEstate);
      this.saveEstate(this.selectedEstate);
    } else {
      const defaultEstate = this.estates.find((estate) => estate.enable === 1);

      if (defaultEstate) {
        this.selectedEstate = defaultEstate;
        this.saveEstate(defaultEstate);
      }
    }

    this.setDisplayEstate();
  }

  /**
   * Estate selected by user
   */
  selectEstate(estate: any): void {
    this.selectedEstate = estate;
    this.saveEstate(estate);
    this.setDisplayEstate();
  }

  /**
   * Set estate to display
   */
  setDisplayEstate(): void {
    if (this.showEstateSelection) {
      this.displayEstate = this.selectedEstate;
    } else {
      const defaultEstate =
        this.estates.find((estate) => estate.enable === 1) || null;

      if (defaultEstate) {
        this.selectedEstate = defaultEstate;
        this.displayEstate = defaultEstate;
        this.saveEstate(defaultEstate);
      }
    }
  }

  /**
   * Save selected estate
   */
  saveEstate(estate: any): void {
    localStorage.setItem('selectedEstate', JSON.stringify(estate));
    localStorage.setItem('endpoint', estate.endpoint);
  }

  /**
   * Toggle Password Visibility
   */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Open Language Popover
   */
  async openLanguagePopover(event: Event): Promise<void> {
    const popover = await this.popoverController.create({
      component: LanguagePopoverComponent,
      event,
      arrow: false,
    });

    await popover.present();

    const { data, role } = await popover.onDidDismiss();

    if (role === 'selected' && data) {
      console.log('Selected Language:', data);

      // this.translate.use(data.code);
      // localStorage.setItem('language', data.code);
    }
  }

  /**
   * Login
   */
  async onSubmit() {
    // Millcode, Username, Password Validation
    // if (this.loginForm.get('millCode')?.value?.trim() == '') {
    //   await this.toastService.warning(
    //     this.translate.instant('LOGIN.millcodeerrortoast'),
    //   );
    //   return;
    // }

    if (this.loginForm.get('username')?.value?.trim() == '') {
      await this.toastService.warning(
        this.translate.instant('LOGIN.usernameerrortoast'),
      );
      return;
    }

    if (this.loginForm.get('password')?.value?.trim() == '') {
      await this.toastService.warning(
        this.translate.instant('LOGIN.passworderrortoast'),
      );
      return;
    }

    // Get selected language and its ID
    var selectedlanguageid = '1';
    var selectedlanguage = 'English';

    if (this.LanguageService.getCurrentLanguage() == 'English') {
      selectedlanguageid = '1';
      selectedlanguage = this.LanguageService.getCurrentLanguage();
    }

    if (this.LanguageService.getCurrentLanguage() == 'Malay') {
      selectedlanguageid = '2';
      selectedlanguage = this.LanguageService.getCurrentLanguage();
    }

    // Prepare login request payload
    const loginRequest = {
      millcode: this.loginForm.get('millCode')?.value?.trim() ?? '',
      username: this.loginForm.get('username')?.value?.trim() ?? '',
      password: this.loginForm.get('password')?.value ?? '',
      language: this.LanguageService.getCurrentLanguage(),
      languageid: selectedlanguageid,
      version: '',
    };

    console.log('Login Request', loginRequest);

    this.isLoading = true;
    this.authService
      .login(loginRequest)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response: any) => {
          console.log('Login Response:', response);
          if (response.httpcode == 200) {
            // localStorage.setItem(
            //   'USER_DETAILS',
            //   JSON.stringify(response.data)
            // );
            this.loginForm.reset();

            localStorage.setItem('userlist', JSON.stringify(response.data));

            localStorage.setItem('runninghourid', '0');

            localStorage.setItem('scheduledpopup', '');

            localStorage.setItem('profile', '');

            localStorage.setItem('notificationdata', '');

            // this.toastService.success(response.message);
            this.toastService.success(
              this.translate.instant('LOGIN.loginsuccessfully'),
            );

            // Check authorized user of dept id and design id
            const role = this.roleService.determineRole(response.data);

            // User based role redirection
            const homeRoute = this.roleService.getHomeRouteForRole(role);

            this.navCtrl.navigateRoot(homeRoute, { animated: false });
          } else {
            this.toastService.error(response.message);
          }
        },
        error: (error) => {
          console.error(error);
          this.toastService.error('Something went wrong.');
        },
      });
  }
}
