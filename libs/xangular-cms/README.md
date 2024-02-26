# Angular PrimeNg CMS Dashboard
Manage repetitive CRUDs Operations with a few lines depending on [PrimeNg](https://primeng.org/) and [PrimeFlex](https://primeflex.org)

## Angular Version:
17.1.0

## Example:
[Github](https://github.com/aghiadodeh/Angular-PrimeNG-CMS-Dashboard/tree/main/example)

## Screenshots:
| | | |
|:-------------------------:|:-------------------------:|:-------------------------:|
|<img src="https://github.com/aghiadodeh/Angular-PrimeNG-CMS-Dashboard/blob/main/screenshots/Products.png?raw=true">|<img src="https://github.com/aghiadodeh/Angular-PrimeNG-CMS-Dashboard/blob/main/screenshots/Update_Product.png?raw=true">|<img src="https://github.com/aghiadodeh/Angular-PrimeNG-CMS-Dashboard/blob/main/screenshots/Delete_Products.png?raw=true">
|<img src="https://github.com/aghiadodeh/Angular-PrimeNG-CMS-Dashboard/blob/main/screenshots/Users_Custom_View.png?raw=true">|<img src="https://github.com/aghiadodeh/Angular-PrimeNG-CMS-Dashboard/blob/main/screenshots/Users_Table.png?raw=true">|<img src="https://github.com/aghiadodeh/Angular-PrimeNG-CMS-Dashboard/blob/main/screenshots/Update_User.png?raw=true">

## Features:
1. Generic Filters Builder
2. Generic Form Builder
3. Manage State
4. Caching
5. Display items with table or with custom view
6. Manage Base CRUD Actions (Create, Update, View and Delete), with ability to add custom actions
<hr />

## Installation:
```shell
npm install @x-angular/cms
```


## Setup:
CMS library use Angular [InjectionToken](https://angular.io/api/core/InjectionToken) to provide the environment configurations like `API_URL` as a dependency,
You can inject your environment configurations globally in the `src/app/app.config.ts`:
```typescript
import { CMS_CONFIGURATION } from '@x-angular/cms';
import { HttpCacheInterceptorModule } from '@ngneat/cashew';
import { DynamicDialogConfig } from "primeng/dynamicdialog";

const dialogConfig: DynamicDialogConfig = {
  width: '50vw',
  contentStyle: { overflow: 'auto' },
  breakpoints: {
    '960px': '75vw',
    '640px': '90vw',
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    ...,
    provideHttpClient(),
    {
      provide: CMS_CONFIGURATION,
      useValue: {
        CMS_API_URL: "https://www.development.com/api", // Your backend api URL
        CMS_PAGE_SIZE: 15, // default page size when get data with pagination
        DIALOG_CONFIGURATION: dialogConfig // dialog configuration for create/update entity
      },
    },
    importProvidersFrom([
      ...,
      HttpCacheInterceptorModule.forRoot(),
    ]),
  ],
};
```
```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- add prime theme here -->
    <link id="app-theme" rel="stylesheet" type="text/css" href="lara-light.css">
  </head>
  <body>
    <!-- root -->
  </body>
</html>
```
```json
// angular.json
{
  "projects": {
      // ...
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "options": {
            // ...
            "styles": [
              "src/styles.scss",
              "node_modules/@x-angular/cms/styles/prime.scss", // <-- add styles here
              "node_modules/@x-angular/cms/styles/global.scss", // <-- add styles here
              {
                "input": "node_modules/primeng/resources/themes/lara-light-blue/theme.css",  // <-- add styles here
                "bundleName": "lara-light",
                "inject": false
              },
              {
                "input": "node_modules/primeng/resources/themes/lara-dark-blue/theme.css",  // <-- add styles here
                "bundleName": "lara-dark",
                "inject": false
              }
            ]
          },
        }
      }
  }
}
```

<hr />

## Create new CRUD:
If you to create new CRUD (products CRUD) you can achieve this by:
1. Decalre Your Product Model:
```typescript
export interface Product {
    id?: number;
    title?: string;
    description?: string;
    price?: number;
    discountPercentage?: number;
    rating?: number;
    stock?: number;
    brand?: string;
    category?: string;
    thumbnail?: string;
    createdAt?: string | null;
}
```

2. Declare ***@Injecable*** Service `ProductService` which extends `CmsService` from CMS library:
```typescript
import { Injectable } from "@angular/core";
import { CmsService } from '@x-angular/cms';
import { Product } from "src/app/models/product.model";

@Injectable()
export class ProductService extends CmsService<Product> {
    constructor() {
        super();
    }

    public override crudConfiguration: CRUDConfiguration<Product> = {
        endPoints: {
            index: 'products', // <-- products resource name in the backend
            // create: 'products/new', // <-- create new product endPoint, default is same index (`products`)
            // view: (id: string) => `products/view/${id}`, // <-- find product by id, default: `products/${id}`
            // update: (id: string) => `products/update/${id}`, // <-- update product, default: `products/${id}`
            // remove: (id: string) => `products/remove/${id}`, // <-- remove product, default: `products/${id}`
        },
        tableConfiguration: {
            dataKey: 'id', // property to uniquely identify a record in data
            columns: [
                {
                    title: "ID",
                    key: "id",
                    sortKey: 'id',
                    ngStyle: {'color': 'yellow'}, // customize style
                },
                {
                    title: "name", // displayed label in the tablet header (translated by @ngx-translate)
                    key: "title", // the key you want to display from your model
                    sortKey: 'title', // sorting key which will be sent to backend in params for sorting data
                },
                {
                    title: "price",
                    key: "price",
                    sortKey: 'price'
                },
                { 
                    title: "rating", 
                    key: "rating",
                },
                { 
                    title: "createdAt", 
                    key: "createdAt"
                },
            ],
        },
    };
}
```
the `index` in `endPoints` is the products resource name in the backend, so when CmsService fetch the data it will call `${CMS_API_URL}/${endPoints.index}`, in our example it will be `https://www.development.com/api/products`

3. Declare Your ProductService in your component providers:

```typescript
// src/app/dashboard/modules/products/products.component.ts
import { Component } from '@angular/core';
import { ProductService } from './services/products.service';
import { CmsService, CmsListComponent } from '@x-angular/cms';
import { Product } from "src/app/models/product.model";

@Component({
  ...,
  standalone: true,
  imports: [
    CmsListComponent,
  ],
  providers: [
    ProductService,
    {
      provide: CmsService<Product>,
      useExisting: ProductService,
    },
  ]
})
export class ProductsComponent {}
```

```html
<!-- src/app/dashboard/modules/products/products.component.html -->
<cms-list />
```
You will see the table and paginator appear in your page
<img src="https://lh3.googleusercontent.com/fife/AGXqzDncnXnLVET_cUd-PPKWDo1fLf8pst7GckQYVjilUxFYrQIEdQNU0iRySd1JD-IEyRMajuSxYr_RxtP1ruvHWSE8mrIA5-AtjPR0aSxwLi5p-EMTc35MvZw-yR23mUx6Ts9zsYdBeLCbzpVRX7B9p96Sb7jOKSKNcDMEpuSIi67pxn8slf-oYwooGM4zF9CJGdI_XWnaiMlOvDQYudsSJjsa1MpE46uTsd2KDkfNvRn8xevVyqA42pvoO6hc8d05ODa26qAQ9jILiYpAUnRObw01Y1gu7Pwp70aBsQWBCkBhvs76nUk4BUuK2Zjfr9jOMlHkogCbD38LfvhMB8k83wELgUKx2zypkYbZX0JJw_O5-0u0CwtqJ3Y7ylt83aHIoQEVCLAOnR0oIiOR254OWO0FRMdIXqHXnE9y1NGm18ZryNhynGhrfQD_aDYV2dVp9wv2vKEDWk66I0oMx7xp4iI_NWXJsOc1OLrJvdIQftbSmqceg4Zr6Xvy6KJoBwUhD7SvKuV-LgEE0ePVivTlplzZXCy2yZrsLDl4dUX_c398e_OXFOes7wiUGAAyKlEKSfr2gGVXTptkk6chjP7zOxD10t0P9lGnxD66L0SJfRHEiv5zTZovjWFjl4H_IQOf6FyOcdWcm2SeS9BNcEafW-2rmSTOy8b_NqIGQih44GflCWMZlZ9iPt0FlVQHHtKTjG9M8iWzCeNhINRarDjZgm92ITcLaHjvwnTrs9dbKMkWU637-o2aqZfA_8bm_wFIdq6aHaSnm4Z30nrUB_6IanKsx-rcTj6eq4FvJyvTcoOk6PiLEWoirc5aetC3gRtavgpHElQa6bcToHd9_42TsmoymKmd_EGcwioYUe0-lHE9SfocOaa8cjJRuJvZby8245hWaYin9S6tYcqmlcmEYEXfGQiBWnPz8x_Za__jZYrOPyjR_kghv788XyhlA_cFX4STijUs37esyiCy-A7eREIiHFvOPbMpcBgAKvGkCwxU9cPupc9Qpny4AV9syIsrY0WlcSjUgNo9BJe3fXkdOzSn1_U8hRhrF-xyrcFMwtwXQn0o6rLPJfurbgefY2Z79G3xeerxEbFvs3BHU4t8jPGHAqPSP1R50JkG-Jx2NtqdgztKQQ44FbGDgnWrVusTmHb_IyqWoTFQOImsjtXEvprNLNpNu57uxviddnCizvFGEvbjSFtKuVT1tYl2PkQWT7h7O6qW5erBrcgfKsDBjua0WlVLvFR43bGradgikgmsumYC0PAQbtidGqfwWaCJcUTNC31lAeCXhxu58wUnifBsxPdtvj95OJoZblEgTCZZq55__g7rhqqQHA_wawwWDiu4b2FY2NAh6n2Tyho7scd3WoX87cj7QrQnky04g9xTmXryVu-qwxuqvvrBmit_CEtN8j9RIa1TxLVDSnrTV_kxkto00x5GZn1uM6pkqOU76OfatAdXuJBer9Slebn6x_2aElsNfrs-Bv23feX99XzxhzBP0pGWiumy2ZRLI0HNZM89mZfUYerNsAPcjKkjSW4S7uamMdS6gMXZrGv6Vjv-BAlHnlA8Zx51OEBmHOphm3nzGXmw3BPTW5hltnc_nFm_fT8rTYKbpcupfAS_0nqp5YhJ7AMbJxOWfcuSGzxfv7uZTecXES4=w1574-h959"/>

### Customize Table `<td>`:
You can customize any table column by passing map of `ng-template` to `cms-list`, 

**Note:** the map entry key is the same column `key` in the `tableConfiguration` columns, and the entry value is the template ref.

Let's display Product rating as rating-stars, and add to table the product image:

1. Add `templateRef: true` to rating column to tell cms-table that the rating column will be ng-template
```typescript
export class ProductService extends CmsService<Product> {
    public override crudConfiguration: CRUDConfiguration<Product> = {
        tableConfiguration: {
            // ...,
            columns: [
                {
                    title: "image", 
                    key: "thumbnail",
                    templateRef: true, // <-- add here
                },
                // ...,
                { 
                    title: "rating", 
                    key: "rating",
                    templateRef: true, // <-- add here
                },
                // ...,
            ],
        },
    };
}
```

2. Create your ng-template inside your html file and pass it to `cms-list`

```html
<cms-list [templates]="{
    'thumbnail': userImageTemplate,
    'rating': ratingImageTemplate,
}" />

<!-- product image -->
<ng-template let-product #userImageTemplate>
    <div class="product-table-image">
        <img [src]="product.thumbnail">
    </div>
</ng-template>

<!-- product rating -->
<ng-template let-product #ratingImageTemplate>
    <div class="product-table-rating">
        <!-- https://primeng.org/rating -->
        <p-rating [readonly]="true" [cancel]="false" [(ngModel)]="product.rating" />
    </div>
</ng-template>
```
<img src="https://lh3.googleusercontent.com/fife/AGXqzDmIjUow98V1w2fJCgVl8yzLk0V8THxWxqlno3UcgpnYOq7kE0P31jDO3qFbD5VfreXTY0AfPSikVnKUYMVsJc7mr6DSfxfavVzVqys7z47DwtDpy5AjIxe4Yx6xVwgGqe_TD80u4jtRxHM0hUzn0bvzwQr9ZAMxqvEvvlJVFn8cQfIraICRd4mY0lslT1xTTweulfwfT-gmW3y5JsMJKtCihtUB_4XTu2dETWj7nlJqDEcU_3pQI1aIAvpvhfvxhYct0Z5Gr2gKLndHFKm81R2eCKE8YnKQQwzrvkXcHn3qYkMbrzU0_FEt_aE-COhSHnddA9heoBdMK-eZjqrmuB_ZDVquSoojZi8_Zn6sCAL1L2kiPoRv3rC8twndsf65AB7CvlGpg-Oss6KHkWyOiRphsScC_4ptwfNl8YJzVKElGLycSEVUxgSENjCg5Ud2pfoMMW_2gje66xJmYFVpAkls5jd0mIBHsaMRxSQctJAzdJxcY97fEY7uCIT8BU14XoJbY6NulCiHk8kaI3c2Ur2dp6eR9lIC16GlDMRXU9IKI2pJQQptHuoTsjQOZELv42ixYEuk409ikjM6hS-QdF8fBa_H9QBr6d22J1geq828MlcfG92oAIJln3-v9qoYLWGzmnjnTxlLdV19FmrtBcR_j87oeVargmDD3C8jKsJkodSCo7UrHeY-GZ2W7qIBQ_GS2sEvfPszLfcINJ9qsEtOG_iBIbDm3J7qBDpPKvf7wh66Qih-MsdiOwkj88FmgdiGVBVWjxWcGPyrmEvck00wCpXf3lQvNkyamUxNW3DbOeMWAEjMq2wSO4NqLN3G13r_V7laGnfLtxUJNhHIm-aLpbbXJKEBxInXStHzerETaO93-bBVIhRB1MeF2CSYVFnsuyzZUj3tvZnhpPNg_bMNeREL9qFQRF-dI9RMLMrRKS91-EhJ1nMqD6xLulDpOdRQIEhvnblQem9hZT-3UZJr8AoBZ_AUcKX_hBscYVz5M_V2uXuQOqJ8HIsrZADoYw_MmD_VZQAEWXHE1LeCLevkYHFwOq7M7w7WM2fMw4RLobQmG4X0vad-5N62hiHkUBxG17gUiVZQLpApjAwfwRBdhvl0AQXoXOSCCrjaZW5oFHwXcuCDElFUJOokCBNNAm2duT-7oTYD7E2nsO0jwTQYaUDZHax_llTNCiQsMO1ZK0PAToORcWqDmHWlqJdAUgrJzx8kx2HaTfrD1QRWPWEvgiERsUYt5d9jW4j0ozUa98c815YI-NrY3QMu_agZ6y9swY13_vTXZ8nxF5BzD4xWTUSiAchzaMTnd3q2kD-1g2hdmXO_v3vawPflNRdP4C_tX0zA1C7OGtnOJxWb8pcLbsft1ShCMxLy_Kt3WITaOzfI3gLIEXAegZgVrd7aPgd0kT7RwyO4oIyuCcN-u7etoajKqCOgXJpapzLDxoqoaPD0uKyEcuIpnItDHBRKPN0tp_qzf2o-o4mh_oUXgvZjmei8Jx2ylYbdlaWuUlJUYvNSux-8PWY__J3cKd_1rZyaI7_G0niw5j1JRrq96rijTA2BLYLdicEmp0t51dv4ukYLIM7r9skU1uMhPNMKxZQpcuHTy2mTBTdM0HWGQt6QPq5fvpM7KRZRr89M0rYNHc1DLDBFAdE=w1574-h959"/>

### Display items in custom view instead of table:
If you want to display the fetched items in custom view, you should pass `custom` content to `cms-list` 
```html
<cms-list>
        <div class="flex flex-column pb-3" custom>
            <h1>Products</h1>
            <div class="flex flex-wrap w-full gap-3">
                @if (productService.result$ | async; as result) {
                @for (product of result.data; track product.id) {
                <div class="custom-product-card w-full">
                    <p-card class="flex flex-column w-full gap-2">
                        <img [src]="product.thumbnail" width="100%" height="200" />
                        <span>{{ product.title }}</span>
                    </p-card>
                </div>
                }
                }
            </div>
        </div>
</cms-list>
```
<hr />


### Disable cache:
```typescript
@Injectable()
export class ProductService extends CmsService<Product> {
   override withCache: boolean = false;
}
```

### Invalidate cache:
You can reset cache by call `invalidateCache` method:
```typescript
@Injectable()
export class ProductService extends CmsService<Product> {
    public doSomething(): void {
        // logic...
        this.invalidateCache();
    }
}
```

### Mapping data:
You can map your model as you wish by override `mapFetchedData` method,

In our example, We want to format the `createdAt` and round the `rating` value:
```typescript
import { DatePipe } from "@angular/common";

@Injectable()
export class ProductService extends CmsService<Product> {
    constructor(private datePipe: DatePipe) {
        super();
    }

    public override mapFetchedData = (data: Product[]): Product[] => {
        data.forEach(product => {
            product.rating = Math.round(product.rating ?? 0);
            product.createdAt = this.datePipe.transform(product.createdAt, "yyyy-MM-dd hh:mm a")
        });
        return data;
    };
}
```

### Mapping Http Response:
`CmsService` expect to receive a `BaseResponse<T>`:
```typescript
export interface BaseResponse<T> {
  message?: string;
  success?: boolean;
  data: T;
  statusCode?: number;
}
```
If your backend return a different response, You can mapping the response to `BaseResponse<T>`:
```typescript
@Injectable()
export class ProductService extends CmsService<Product> {

   override mapResponse<T>(response: HttpResponse<T>): BaseResponse<T> {
        const body: any = response ?? {};
        return {
            data: body.data,
            statusCode: body.status_code,
            success: body.status,
            message: body.msg,
        };
    }
}
```

### Manage CMS Actions visiblity:
```typescript
export const importMimetype = '.csv, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

@Injectable()
export class ProductService extends CmsService<Product> {
    public override crudConfiguration: CRUDConfiguration<Product> = {
        actions: {
            create: () => true, // currentUser.hasPermission('create-product')
            delete: () => true,
            export: () => true,
            selectRows: () => true,
            import: () => {
                return { accept: importMimetype, label: 'import' }
            },
        },
    }
}
```
```html
<cms-list>
    <!-- add view between filters and table -->
    <div class="w-full flex justify-content-between align-items-center p-3" header>
        <h1>Header</h1>
    </div>

    <!-- custom table start actions -->
    <div tableStartActions>
        <p-button severity="info" [outlined]="true">
            <span>Custom Action 1</span>
        </p-button>
    </div>

    <!-- custom table end actions -->
    <div tableEndActions>
        <p-button severity="danger" [outlined]="true" [rounded]="true">
            <span>Custom Action 2</span>
        </p-button>
    </div>
</cms-list>
```
<hr />

## Cell Action:
You can observe on some cell action by:
1. Set the column `clickable` as true in your `tableConfiguration`:
```typescript
export class ProductService extends CmsService<Product> {
    public override crudConfiguration: CRUDConfiguration<Product> = {
        tableConfiguration: {
            // ...,
            columns: [
                {
                    title: "image", 
                    key: "thumbnail",
                    templateRef: true,
                    clickable: true, // <-- add here
                },
                // ...,
            ],
        },
    };
}
```

2. Observe on Action in your component:
```typescript
export class ProductsListComponent {
  constructor(public productsService: ProductService) {
    productsService.cellAction$.subscribe((action: BaseCellEvent<Product>) => {
      const {
        key, // "thumbnail"
        item // row data
      } = action;
      console.log(action);
    });
  }
}
```

## Row Actions:
CMS library provide you with main CRUD actions View, Update and Delete, but can add any custom action as you wish.

Action Model:
```typescript
export interface BaseTableColumnAction {
    key: any; // observe emit action by this key
    label?: string;
    icon?: string; // see https://primeng.org/icons
    visible?: boolean;
    visibleFn?: () => boolean;
    severity?: 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger';
}
```

Add Actions to `cms-table`:
```typescript
@Injectable()
export class ProductService extends CmsService<Product> {
    public override crudConfiguration: CRUDConfiguration<Product> = {
        tableConfiguration: {
            // ...
            columns: [
                // ...
            ],
            actions: (item: Product) => [
                {
                    key: CmsActionEnum.view,
                    label: 'view', // translated by @ngx-translate
                    icon: 'pi pi-eye', // https://primeng.org/icons
                    severity: 'success',
                    visible: item.id != 1, // some condition
                },
                {
                    key: CmsActionEnum.update,
                    label: 'update',
                    icon: 'pi pi-pencil',
                },
                {
                    key: 'product-custom_action', // <-- custom action
                    label: 'custom_action',
                    icon: 'pi pi-bolt',
                    severity: 'info',
                },
                {
                    key: CmsActionEnum.delete,
                    label: 'delete',
                    icon: 'pi pi-trash',
                    severity: 'danger',
                },
            ],
        },
    }
}
```
**View**, **Update** and **Delete** Actions handled by `cms-list`, so no need to observe these actions from your component.
### Observe Custom Action:
You can detect when user click on `product-custom_action`:
```typescript
export class ProductsListComponent {
  constructor(productsService: ProductService) {
    productsService.rowAction$.subscribe((action: BaseRowEvent<Product>) => {
      const {
        key, // 'product-custom_action'
        item // row data
      } = action;
      console.log(action);
    });
  }
}
```
### Delete Action:
You only should decalre in your translate json file these keys:
```json
{
    "delete_confirmation": "Delete Confirmation",
    "delete_confirmation_message": "Do you want to delete this record?"
}
```

### View Action:
Call Request to find item details by `dataKey` and display it.
1. Add Route for view-details component:
```typescript
export const productsRoutes: Route[] = [
    {
        path: 'products',
        loadComponent: () => import('./products.component').then(e => e.ProductsComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./modules/products-list/products-list.component').then(e => e.ProductsListComponent),
            },
            {
                path: "view/:id", // "view-details/:id"
                loadComponent: () => import('./modules/product-details/product-details.component').then(e => e.ProductDetailsComponent),
            },
        ]
    },
];
```

2. Navigate to Specific route (optional):
default route is `view/:id` but if you want to change this value you can override `viewDetailsRoute`:
```typescript
@Injectable()
export class ProductService extends CmsService<Product> {
    override viewDetailsRoute = (item: Product) => `view-details/${item.id}`;
}
```

3. Custom `findById` server endPoint (optional):
By default find by id end-point is `${endPoints.index}/${item.id}`,

But you can override the endPoint by:
```typescript
export class ProductService extends CmsService<Product> {
    public override crudConfiguration: CRUDConfiguration<Product> = {
        endPoints: {
            index: 'products',
            view: (id: any) => `products/view/${id}`, // <-- add here
        },
    }
}
```
4. Setup Your ViewDetails Component:

`product-details.component.ts`:
```typescript
import { CmsViewDetailsComponent, ViewDetailsComponent } from '@x-angular/cms';

@Component({
  // ...,
  imports: [CmsViewDetailsComponent],
})
export class ProductDetailsComponent extends ViewDetailsComponent<Product> {
  override title = (item: Product) => item.title ?? ""; // Page title
}
```
Extending `ViewDetailsComponent` will send request to server for get item details by dataKey depending on route params. 

`product-details.component.html`:
```html
<cms-view-details [result]="result"> <!-- result is the fetched data from ViewDetailsComponent -->
    <div class="product-view-details-container" content> <!-- `content` is ng-content selector name -->
        @if (result.data$ | async; as data) {
        <div class="flex flex-column">
            <!-- Your Product layout -->
        </div>
        }
    </div>
</cms-view-details>
```

### Export Action (download file):
```typescript
@Injectable()
export class ProductService extends CmsService<Product> {
    // download file
    override exportFile(): Observable<any> {
        this.exporting$.next(true);
        return this.download(`${this.endPoints.index}/csv`, `${this.endPoints.index}-${new Date()}`, 'csv').pipe(
            finalize(() => this.exporting$.next(false)),
        );
    }
}
```

### Import Action (upload file):
```typescript
@Injectable()
export class ProductService extends CmsService<Product> {
    public override crudConfiguration: CRUDConfiguration<Product> = {
        endPoints: {
            // ...
            importFile: (file: File) => { // define import endPoint, mapping request formData
                return { endPoint: 'products/import', requestBody: { media: file }, auto: true };
            },
        },
    }
}
```

### Delete Multiple Rows:
```typescript
@Injectable()
export class ProductService extends CmsService<Product> {
    public override crudConfiguration: CRUDConfiguration<Product> = {
        endPoints: {
            // ...
            removeMultiple: (items: Product[]) => { // delete multiple rows endPoint, mapping selected rows request data
                return { endPoint: 'products/delete', requestBody: { ids: items.map(item => item.id) } };
            },
        },
    }
}
```

### Update Action (Generic Form Builder):
Update action has two types 
1. dialog
2. page

```typescript
@Injectable()
export class ProductService extends CmsService<Product> {
    public override crudConfiguration: CRUDConfiguration<Product> = {
        openFormType: 'dialog',
        // ...
    }
}
```

both types require `formSchema`


**Note**: If you didn't set `openFormType` value, the page/dialog will not open, and you should handle `rowAction$` event manually.

## Generic Form Create/Update
### Setup FormSchema:
```typescript
@Injectable()
export class ProductService extends CmsService<Product> {
    private categoryDisabled = new BehaviorSubject(true);

    public override formSchema: FormSchema<Product> = {
        ngClass: 'products-form-container flex flex-wrap gap-3 align-items-center justify-content-center xl:justify-content-start', // manage your custom styles
        parseToFormData: true, // send request as FormData
        fetchItemForUpdate: true, // fetch item by id from server before display the update form
        staticData: { /* inject static data in request body */ },
        inputs: (item?: Product) => [ // item is nullable value, in create mode it will be null and in update mode it will be the updated item
            {
                key: 'media',
                label: 'thumbnail',
                value: item?.thumbnail,
                inputType: FormInputType.image,
                validators: item ? [] : [Validators.required],
                imageConfiguration: {
                    path: item?.thumbnail,
                    type: 'rounded', // rounded/circle
                }
            },
            {
                key: 'title',
                label: 'name',
                value: item?.title,
                inputType: FormInputType.text,
                validators: [Validators.required],
            },
            {
                key: 'price',
                label: 'price',
                value: item?.price ?? 0,
                inputType: FormInputType.number,
                validators: [Validators.required, Validators.min(1)],
                numberConfiguration: {
                    currency: 'USD',
                    mode: 'currency',
                }
            },
            {
                key: 'discountPercentage',
                label: 'discountPercentage',
                value: item?.discountPercentage ?? 0,
                inputType: FormInputType.number,
                validators: [Validators.min(0)],
                numberConfiguration: {
                    suffix: '%',
                }
            },
            {
                key: 'brand',
                label: 'brand',
                value: item?.brand,
                inputType: FormInputType.dropdown,
                validators: [Validators.required],
                onChange: (value: any) => {
                    // disable the category input when brand is null
                    this.categoryDisabled.next(value == null);
                },
                dropdownConfiguration: {
                    filterBy: 'brand', // filter by object key
                    valueBy: 'id', // set formControl value with object value
                    optionLabel: 'brand', // display suggestions by option-label
                    options: [], // dropdown suggestions
                    indexFn: (items: any[]) => items.findIndex(e => e.brand == item?.brand), // dropdown default suggestion index
                    remoteDataConfiguration: { // fetch suggestions from server
                        endPoint: 'products/brands',
                        mapHttpResponse: (response: any) => response.data,
                    }
                },
            },
            {
                key: 'category',
                label: 'category',
                value: item?.category,
                inputType: FormInputType.autocomplete,
                validators: [Validators.required],
                disabled$: this.categoryDisabled, // disable the input
                autoCompleteConfiguration: {
                    filterBy: 'category',
                    valueBy: 'id',
                    optionLabel: 'category',
                    options: [],
                    dropdown: true,
                    indexFn: (items: any[]) => items.findIndex(e => e.category == item?.category),
                    remoteDataConfiguration: {
                        endPoint: 'products/categories',
                        mapHttpResponse: (response: any) => response.data,
                    }
                },
            },
        ],
    };
}
```
**Note**: Don't forget to add your routes for `openFormType: 'page'`

### FormInput Types:
- image
- file
- text
- email
- password
- number
- date
- checkbox
- triStateCheckbox
- radio
- time
- color
- dropdown
- autocomplete
- multiSelect

### Setup open form type with `page`:
1. Add your create/update routes, default: ("new", "update/:id")
2. Customize Your routes (optional):
```typescript
@Injectable()
export class ProductService extends CmsService<Product> {
    public override formSchema: FormSchema<Product> = {
        routes: { create: 'new-product', update: (item: Product) => `update-product/${item.id}` },
        // ...
    };
}
```

## Generic Filters
Decalring `filterSchema` will make `cms-filters` appears automatically.

```typescript
@Injectable()
export class ProductService extends CmsService<Product> {
    private categoryDisabled = new BehaviorSubject(true);

    // disable fetching data in cms-list ngOnInit, use this option when you want to fetch data depending on some event like filter on specific data
    override fetchDataOnInitialize: boolean = false;

    public override crudConfiguration: CRUDConfiguration<User> = {
        openFilterAccordion: false, // make filter accordion closed by default
    }

    public override filterSchema: FilterSchema = {
        inputs: [
            {
                key: 'name',
                label: 'name',
                // value: currentUser.name,
                inputType: FilterInputType.text,
            },
            {
                key: 'brand',
                label: 'brand',
                inputType: FilterInputType.dropdown,
                dropdownConfiguration: {
                    // ...,
                    onChange: (value: any) => {
                        // disable the category input when brand is null
                        this.categoryDisabled.next(value == null);
                    },
                },
            },
            {
                key: 'category',
                label: 'category',
                inputType: FilterInputType.dropdown,
                disabled$: this.categoryDisabled,
                dropdownConfiguration: // ...,
            },
        ],
        filterDto: {
            per_page: 25, // override global config
            sortKey: 'id', // sort by id
            sortDir: 'ASC', // sort ascending
        },
    };
}
```
### FilterInput Types:
- text
- email
- number
- date
- time
- search (display 🔎 icon with input)
- dropdown
- multiSelect

### Customize Generic Filters
You Can use `cms-generic-filters` instead of default `cms-filters`
```html
<cms-list>
    <!-- custom filters layout -->
    <div class="flex flex-column w-full" filters>
        <cms-generic-filters [filterSchema]="productsService.filterSchema">
            <div class="w-full flex justify-content-end align-items-center pt-3" actions>
                <!-- custom actions -->
                <p-button severity="success" [text]="true">
                    <span>{{ 'custom_action' | translate }}</span>
                </p-button>

                <!-- reset filters -->
                <p-button severity="danger" [text]="true" (onClick)="resetFilters()">
                    <span>{{ 'reset' | translate }}</span>
                </p-button>

                <!-- apply filters -->
                <p-button [text]="true" (onClick)="applyFilters()">
                    <span>{{ 'apply' | translate }}</span>
                </p-button>
            </div>
        </cms-generic-filters>
    </div>
</cms-list>
```
```typescript
import { CmsListComponent, GenericFiltersComponent } from '@x-angular/cms';

@Component({
  // ...,
  imports: [
    CmsListComponent,
    GenericFiltersComponent,
  ],
})
export class ProductsListComponent {
  @ViewChild(GenericFiltersComponent) filterComponent!: GenericFiltersComponent;
  constructor(public productsService: ProductService) {
    productsService.resetFilters$.subscribe(() => {
      this.resetFilters();
    });
  }

  // fetch data with new filters
  public applyFilters(): void {
    const filters = this.filterComponent.getFilters();
    this.productsService.queryParams$.next(filters);
  }

  // fetch data after reset filters
  public resetFilters(): void {
    this.filterComponent.resetFilters();
    this.productsService.queryParams$.next({});
  }
}
```
