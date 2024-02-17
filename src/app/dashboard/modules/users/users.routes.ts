import { Route } from '@angular/router';

export const usersRoutes: Route[] = [
    {
        path: 'users',
        loadComponent: () => import('./users.component').then(e => e.UsersComponent),
        data: { title: 'users' },
        children: [
            {
                path: '',
                loadComponent: () => import('./modules/users-list/users-list.component').then(e => e.UsersListComponent),
                data: { title: 'users' },
            },
            {
                path: 'new',
                loadComponent: () => import('./modules/user-create/user-create.component').then(e => e.UserCreateComponent),
            },
            {
                path: 'update/:id',
                loadComponent: () => import('./modules/user-update/user-update.component').then(e => e.UserUpdateComponent),
            },
            {
                path: 'view/:id',
                loadComponent: () => import('./modules/user-details/user-details.component').then(e => e.UserDetailsComponent),
            },
        ],
    },
];