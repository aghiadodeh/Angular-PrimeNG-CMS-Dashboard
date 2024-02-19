import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { AppContainerComponent, TranslationService, PageTitleService } from '@x-angular/cms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    AppContainerComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    ConfirmationService,
  ],
})
export class AppComponent {
  public translate = signal(false);

  constructor(
    public translateService: TranslationService,
    public pageTitleService: PageTitleService,
    primeNgConfig: PrimeNGConfig,
  ) { 
    pageTitleService.setPrefix("Angular CMS dashboard");
    primeNgConfig.translationObserver.subscribe(() => {
      this.translate.set(true);
    });
  }
}
