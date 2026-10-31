import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: false,
})
export class UserProfileComponent implements OnInit {
  userName = '';
  eligibleProfile = false;
  constructor(
    private router: Router,
    private UserContext: UserContext,
    private LanguageService: LanguageService,
    private translate: TranslateService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    const user = localStorage.getItem('userlist');

    if (user) {
      this.userName = JSON.parse(user).name;
    }
    this.eligibleProfileCheck();
  }

  eligibleProfileCheck() {
    const eligibleDesignIds = [1, 2, 3];
    this.eligibleProfile = eligibleDesignIds.includes(
      this.UserContext.designId,
    );
  }

  openProfile() {
    this.router.navigate(['/profile']);
  }
}
