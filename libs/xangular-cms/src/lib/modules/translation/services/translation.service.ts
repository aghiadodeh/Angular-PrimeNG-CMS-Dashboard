import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Direction } from '@angular/cdk/bidi';
import { DOCUMENT } from '@angular/common';
import { PrimeNGConfig } from 'primeng/api';

export interface LanguageData {
  value: string,
  label: string
}

@Injectable({ providedIn: 'root' })
export class TranslationService {
  /**
   * Supported languages
   * if you want add new language go to src\assets\i18n\
   * and add new `lang.json` file
   */
  public availabeLanguages: LanguageData[] = [
    {
      value: 'en',
      label: 'English'
    },
    {
      value: 'ar',
      label: 'العربية'
    },
  ];

  /**
   * default app language
   */
  get defaultLanguage(): string {
    return localStorage.getItem('langauge') || this.availabeLanguages[0].value;
  }

  get default(): LanguageData {
    return this.availabeLanguages.find(el => el.value == this.defaultLanguage) || this.availabeLanguages[0];
  }

  /**
   * emitter when language change by user
   */
  public languageChange$: BehaviorSubject<String> = new BehaviorSubject<String>(this.defaultLanguage);

  /**
   * change app direction `ltr` or `rtl`
   */
  public langDir$: BehaviorSubject<Direction> = new BehaviorSubject<Direction>('ltr');

  constructor(
    private primeConfig: PrimeNGConfig,
    public translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang(this.defaultLanguage);
    this.translate.getTranslation(this.defaultLanguage).subscribe(data => {
      this.primeConfig.setTranslation(data);
    });

    if (this.defaultLanguage == "ar") this.langDir$.next('rtl');

    this.document.documentElement.lang = this.defaultLanguage;
  }

  /**
   * Change app language.
   *
   * @param {string} language should be the same name of one of json files at src\assets\i18n\.
   */
  public switchLanguage(language: string) {
    // Change app language
    localStorage.setItem('langauge', language)
    this.translate.use(language);
    this.languageChange$.next(language);
    this.translate.getTranslation(language).subscribe(data => {
      this.primeConfig.setTranslation(data);
    });

    // change Layout Direction
    const langDir: Direction = language == "ar" ? "rtl" : "ltr";
    if (langDir != this.langDir$.value) {
      this.langDir$.next(langDir);
      this.document.documentElement.lang = language;
    }
  }

  public get(key: string): Observable<any> {
    return this.translate.get(key);
  }
}

