import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DividerModule } from "primeng/divider";
import { NavigationItem } from "./configurations/navigation-item.model";
import { NavigationMenuComponent } from "./components/navigation-menu/navigation-menu.component";
import { Sidebar, SidebarModule } from "primeng/sidebar";
import { NgEventBus } from "ng-event-bus";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { SidebarEvent } from "./enums/sidebar.enum";
import { TranslationService } from "../../../modules/translation/services/translation.service";

@Component({
  selector: "cms-nav-container",
  standalone: true,
  imports: [CommonModule, DividerModule, SidebarModule, NavigationMenuComponent],
  templateUrl: "./nav-container.component.html",
  styleUrl: "./nav-container.component.scss",
})
export class NavContainerComponent implements OnInit {
  @Input() logo?: string;
  @Input() navigationItems: NavigationItem[] = [];
  @ViewChild("sidebar", { static: false }) sidebar?: Sidebar;
  public sidebarVisible: boolean = false;
  public isTablet: boolean = true;
  private get navigationBar(): HTMLElement | null {
    return document.getElementById("navigationBar");
  }

  constructor(
    eventBus: NgEventBus,
    public translationService: TranslationService,
    private breakpointObserver: BreakpointObserver,
  ) {
    eventBus.on(SidebarEvent.toggle).subscribe({
      next: () => {
        if (this.isTablet) {
          this.sidebarVisible = !this.sidebarVisible;
        } else {
          this.navigationBar?.classList.toggle("inactive");
        }
      },
    });
    eventBus.on(SidebarEvent.close).subscribe({
      next: () => {
        this.sidebarVisible = false;
        this.sidebar?.hide();
      },
    });
  }

  ngOnInit(): void {
    this.breakpointObserver.observe(["(max-width: 1200px)"]).subscribe((state: BreakpointState) => {
      this.isTablet = state.matches;
    });
  }
}
