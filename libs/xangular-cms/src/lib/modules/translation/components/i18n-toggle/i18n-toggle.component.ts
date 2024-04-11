import { Component } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { TranslationService } from "../../services/translation.service";
import { OverlayPanelModule } from "primeng/overlaypanel";

@Component({
  selector: "cms-i18n-toggle",
  templateUrl: "./i18n-toggle.component.html",
  styleUrls: ["./i18n-toggle.component.scss"],
  standalone: true,
  imports: [ButtonModule, OverlayPanelModule],
})
export class I18nToggleComponent {
  constructor(public translationService: TranslationService) {}
}
