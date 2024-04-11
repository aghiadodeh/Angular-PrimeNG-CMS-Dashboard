import { Directive, Input, OnInit, OnDestroy, ElementRef } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";

@Directive({
  selector: "[cmsCurrentLanguageTranslate]",
  standalone: true,
})
export class CurrentLanguageDirective implements OnInit, OnDestroy {
  @Input("cmsCurrentLanguageTranslate") object!: { data: any; key: string };
  private langChangeSubscription?: Subscription;

  constructor(
    private translateService: TranslateService,
    private el: ElementRef,
  ) {}

  ngOnInit(): void {
    this.updateTranslatedName();
    this.langChangeSubscription = this.translateService.onLangChange.subscribe(() => {
      this.updateTranslatedName();
    });
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  private updateTranslatedName(): void {
    const { data, key } = this.object;
    if (data) {
      const { currentLang, defaultLang } = this.translateService;
      this.el.nativeElement.textContent = data[`${key ?? "name"}${(currentLang ?? defaultLang).toUpperCase()}`];
    }
  }
}
