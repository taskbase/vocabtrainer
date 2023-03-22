import { Component } from '@angular/core';
import { Language, LanguageService } from '../../language.service';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent {
  selectedLang = this.languageService.language;
  languages = [Language.EN, Language.DE];
  languageEnum = Language;

  constructor(private languageService: LanguageService) {}

  selectLang(lang: Language) {
    this.languageService.language.next(lang);
  }
}
