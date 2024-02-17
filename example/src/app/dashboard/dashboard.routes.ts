import { Route } from '@angular/router';
import { usersRoutes } from './modules/users/users.routes';
import { productsRoutes } from './modules/products/products.routes';

export const dashboardNestedRoutes: Route[] = [
    ...usersRoutes,
    ...productsRoutes,
];

export const dashboardRoutes: Route[] = [
    {
        path: '',
        loadComponent: () => import('./dashboard.component').then(e => e.DashboardComponent),
        children: [
            ...dashboardNestedRoutes,
            {
                path: '**',
                redirectTo: 'users',
                pathMatch: 'full',
            }
        ],
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
    }
];