import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Event,
  NavigationStart,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  Router
} from '@angular/router';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TranslationService } from '../../../modules/translation/services/translation.service';
import { ThemeService } from '../../../services/theme/themes.service';

@Component({
  selector: 'cms-app-container',
  standalone: true,
  imports: [
    ToastModule,
    CommonModule,
    BlockUIModule,
    ProgressBarModule,
    ConfirmDialogModule,
  ],
  templateUrl: './app-container.component.html',
  styleUrl: './app-container.component.scss',
  providers: [
    ConfirmationService,
  ]
})
export class AppContainerComponent {
  @Input() loading = true;
  
  constructor(
    private router: Router,
    public themeService: ThemeService,
    public translationService: TranslationService,
    primeConfig: PrimeNGConfig,
  ) { 
    primeConfig.ripple = true;
    this.subscribeRouterEvents();
  }

  /**
   * subscribe router when navigation state changed
   */
  private subscribeRouterEvents() {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart:
          this.loading = true;
          break;

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError:
          this.loading = false;
          break;
      }
    });
  }

  block() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      console.log('loading');
      
    }, 3000);
  }
}
