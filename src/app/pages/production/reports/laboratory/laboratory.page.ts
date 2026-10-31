import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ScreenOrientation } from '@capacitor/screen-orientation';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';

@Component({
  selector: 'app-laboratory',
  templateUrl: './laboratory.page.html',
  styleUrls: ['./laboratory.page.scss'],
  standalone: false,
})
export class LaboratoryPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  // Header Configuration
  appTitle: string = this.translate.instant('DEPARTMENTS.Laboratory');
  showLogo: number = 0;
  showBackButton: number = 1;
  headerActions: string = '';

  // User Data
  userId: number = 0;
  departmentId: number = 0;
  designationId: number = 0;
  language: string = '';
  baseUrl: string = '';

  // Web URL
  webUrl: string = '';
  safeWebUrl: SafeUrl | string = '';

  constructor(
    private translate: TranslateService,
    private userContext: UserContext,
    private languageService: LanguageService,
    private sanitizer: DomSanitizer,
  ) {
    // Initialize user data from UserContext
    this.userId = this.userContext.userId || 0;
    this.departmentId = this.userContext.departmentId || 0;
    this.designationId = this.userContext.designId || 0;
    this.language = this.languageService.getLanguage || 'English';
    this.baseUrl = this.userContext.reportUrl || '';
  }

  ngOnInit(): void {
    // Optionally load URL on init as well
    this.getUrl();
  }

  async ionViewWillEnter(): Promise<void> {
    // Lock screen to landscape orientation
    await ScreenOrientation.lock({
      orientation: 'landscape',
    });

    // Refresh URL when view enters
    this.getUrl();
  }

  async ionViewWillLeave(): Promise<void> {
    // Lock screen back to portrait orientation
    await ScreenOrientation.lock({
      orientation: 'portrait',
    });
  }

  /**
   * Get the web URL for the iframe
   */
  getUrl(): void {
    // if (!this.baseUrl) {
    //   console.warn('Base URL not available');
    //   return;
    // }

    // Format the URL with query parameters
    const formattedUrl = `${this.baseUrl}Lab_dashboard/dashboard_new?mobile=1&user_id=${this.userId}&language=${this.language}`;

    console.log('Laboratory URL:', formattedUrl);

    this.webUrl = formattedUrl;

    // Optional: Sanitize the URL
    this.safeWebUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(formattedUrl);
  }

  /**
   * Convert newlines to <br> tags
   */
  private nl2br(text: string): string {
    if (!text) return '';
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }

  /**
   * Reload iframe if needed
   */
  reloadIframe(): void {
    this.getUrl();
    // Force reload by refreshing the URL
    const currentUrl = this.webUrl;
    this.webUrl = '';
    setTimeout(() => {
      this.webUrl = currentUrl;
    }, 100);
  }
}
