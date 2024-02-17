import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationItem } from '../../configurations/navigation-item.model';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgEventBus } from 'ng-event-bus';
import { SidebarEvent } from '../../nav-container.component';

@Component({
  selector: 'cms-navigation-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
  ],
  templateUrl: './navigation-menu.component.html',
  styleUrl: './navigation-menu.component.scss',
})
export class NavigationMenuComponent {
  @Input() navigationItems: NavigationItem[] = [];
  constructor(private eventBus: NgEventBus) {}

  public onNavigate() {
    this.eventBus.cast(SidebarEvent.close);
  }
}
