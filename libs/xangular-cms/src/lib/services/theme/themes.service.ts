import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.setTheme();
  }

  /**
   * emitter when theme changed by user
   */
  public themeChange$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(localStorage.getItem('dark-theme') == 'true' || false);


  public toggleTheme() {
    this.switchTheme(!this.themeChange$.value);
  }

  public switchTheme(theme: boolean) {
    localStorage.setItem('dark-theme', theme.toString());
    this.themeChange$.next(theme);
    this.setTheme();
  }

  private setTheme() {
    const isDark = this.themeChange$.value;
    const themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = `lara-${isDark ? 'dark' : 'light'}.css`;
    }
  }
}
