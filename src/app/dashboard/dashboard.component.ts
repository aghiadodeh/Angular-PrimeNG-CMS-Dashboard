import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavContainerComponent, NavigationItem, ThemeSwitcherComponent, ToolbarComponent } from '@xangular/cms';
import { dashboardNestedRoutes } from './dashboard.routes';

@Component({
  selector: 'angular-core-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    ToolbarComponent,
    NavContainerComponent,
    ThemeSwitcherComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent { 
  public navigationItems: NavigationItem[] = dashboardNestedRoutes.map((route: Route) => {
    const data = route.data ?? {};
    return {
      route: route.path ?? '',
      title: data['title'],
      visible: true,
    };
  });
}
