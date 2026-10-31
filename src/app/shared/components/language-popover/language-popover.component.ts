import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

// Service imports
import { LanguageService } from 'src/app/shared/services/language-service/language-service';

@Component({
  selector: 'app-language-popover',
  templateUrl: './language-popover.component.html',
  styleUrls: ['./language-popover.component.scss'],
  standalone: false,
})
export class LanguagePopoverComponent implements OnInit {
  selectedLanguage = '';
  languages: any[] = [];
  constructor(
    private popoverController: PopoverController,
    private LanguageService: LanguageService,
  ) {}

  ngOnInit() {
    this.getlanguage();
    this.selectedLanguage = this.LanguageService.getLanguage;
  }

  getlanguage() {
    this.languages = this.LanguageService.getLanguages();
    console.log(this.languages);
  }
  selectLanguage(language: any): void {
    this.selectedLanguage = language.code;
    this.LanguageService.setLanguage(language.file);
    this.popoverController.dismiss(language, 'selected');
  }
}
