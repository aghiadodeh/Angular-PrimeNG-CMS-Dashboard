import { Component } from '@angular/core';
import { ProductService } from './services/products.service';
import { CmsService } from '@x-angular/cms';
import { Product } from '../../../models/product.model';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'angular-core-products',
  standalone: true,
  imports: [
    RouterModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  providers: [
    DatePipe,
    ProductService,
    {
      provide: CmsService<Product>,
      useExisting: ProductService,
    },
  ]
})
export class ProductsComponent {}
