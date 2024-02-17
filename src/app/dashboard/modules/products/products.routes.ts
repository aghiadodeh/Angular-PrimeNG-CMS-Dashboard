import { Route } from '@angular/router';

export const productsRoutes: Route[] = [
    {
        path: 'products',
        loadComponent: () => import('./products.component').then(e => e.ProductsComponent),
        data: { title: 'products' },
        children: [
            {
                path: '',
                loadComponent: () => import('./modules/products-list/products-list.component').then(e => e.ProductsListComponent),
                data: { title: 'products' },
            },
            {
                path: 'view/:id',
                loadComponent: () => import('./modules/product-details/product-details.component').then(e => e.ProductDetailsComponent),
            },
        ]
    },
];