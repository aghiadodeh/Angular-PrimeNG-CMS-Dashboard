import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ThemeService } from "../../../services/theme/themes.service";
import { RippleModule } from "primeng/ripple";

@Component({
  selector: "cms-theme-switcher",
  standalone: true,
  imports: [CommonModule, RippleModule],
  template: `
    <div pRipple class="flex" style="cursor: pointer;" (click)="toggleTheme()">
      @if (themeService.themeChange$ | async) {
        <i class="pi pi-sun" style="font-size: 1.5rem"></i>
      } @else {
        <i class="pi pi-moon" style="font-size: 1.5rem"></i>
      }
    </div>
  `,
})
export class ThemeSwitcherComponent {
  constructor(public themeService: ThemeService) {}

  public toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
