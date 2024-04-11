import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ToolbarModule } from "primeng/toolbar";
import { ButtonModule } from "primeng/button";
import { NgEventBus } from "ng-event-bus";
import { SidebarEvent } from "../nav-container/enums/sidebar.enum";

@Component({
  selector: "cms-toolbar",
  standalone: true,
  imports: [CommonModule, ToolbarModule, ButtonModule],
  templateUrl: "./toolbar.component.html",
  styleUrl: "./toolbar.component.scss",
})
export class ToolbarComponent {
  @Input() withIcon: boolean = true;

  constructor(private eventBus: NgEventBus) {}

  public toggleMenu(): void {
    this.eventBus.cast(SidebarEvent.toggle);
  }
}
