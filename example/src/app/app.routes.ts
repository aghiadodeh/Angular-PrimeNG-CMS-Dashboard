import { Route } from '@angular/router';
import { dashboardRoutes } from './dashboard/dashboard.routes';

export const appRoutes: Route[] = [
    ...dashboardRoutes,
];
