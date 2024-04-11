import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavigationItem } from "../../configurations/navigation-item.model";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { NgEventBus } from "ng-event-bus";
import { SidebarEvent } from "../../enums/sidebar.enum";
import { AccordionModule } from "primeng/accordion";
import { PanelModule } from "primeng/panel";
import { TranslationService } from "../../../../../modules/translation/services/translation.service";

@Component({
  selector: "cms-navigation-menu",
  standalone: true,
  imports: [CommonModule, RouterModule, PanelModule, AccordionModule, TranslateModule],
  templateUrl: "./navigation-menu.component.html",
  styleUrl: "./navigation-menu.component.scss",
})
export class NavigationMenuComponent {
  @Input() navigationItems: NavigationItem[] = [];
  constructor(
    private eventBus: NgEventBus,
    public translationService: TranslationService,
  ) {}

  public onNavigate() {
    this.eventBus.cast(SidebarEvent.close);
  }
}
