import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface Language {
  id: number;
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  file: string;
}

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly SELECTED_LANGUAGE = 'SELECTED_LANGUAGE';

  languages: Language[] = [
    {
      id: 1,
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: 'assets/img/en.png',
      file: 'English',
    },
    {
      id: 2,
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      flag: 'assets/img/congo.png',
      file: 'French',
    },
    {
      id: 3,
      code: 'ms',
      name: 'Malay',
      nativeName: 'Bahasa Melayu',
      flag: 'assets/img/malay.png',
      file: 'Malay',
    },
    {
      id: 4,
      code: 'pt',
      name: 'Portuguese',
      nativeName: 'Português',
      flag: 'assets/img/portugese.png',
      file: 'Portuguese',
    },
    {
      id: 5,
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      flag: 'assets/img/spain.png',
      file: 'Spanish',
    },
  ];

  constructor(private translate: TranslateService) {}

  /**
   * Initialize language
   * Call once from AppComponent
   */
  init(): void {
    this.translate.addLangs(this.languages.map((lang) => lang.file));
    this.translate.setDefaultLang('English');

    const selectedLanguage =
      localStorage.getItem(this.SELECTED_LANGUAGE) ?? 'English';

    this.translate.use(selectedLanguage);

    if (!localStorage.getItem(this.SELECTED_LANGUAGE)) {
      localStorage.setItem(this.SELECTED_LANGUAGE, 'English');
    }
  }

  /**
   * Change language
   */
  setLanguage(language: string): void {
    this.translate.use(language);
    localStorage.setItem(this.SELECTED_LANGUAGE, language);
  }

  /**
   * Get selected language
   */
  get getLanguage(): string {
    return localStorage.getItem(this.SELECTED_LANGUAGE) ?? 'English';
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): string {
    return this.translate.currentLang || 'English';
  }

  /**
   * Get all languages
   */
  getLanguages(): Language[] {
    return this.languages;
  }

  /**
   * Get language by code
   */
  getLanguageByCode(code: string): Language | undefined {
    return this.languages.find((lang) => lang.code === code);
  }

  /**
   * Reset to default
   */
  resetLanguage(): void {
    this.setLanguage('English');
  }
}
