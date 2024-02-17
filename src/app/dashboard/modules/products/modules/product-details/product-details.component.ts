import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsViewDetailsComponent, ViewDetailsComponent } from '@xangular/cms';
import { Product } from '../../../../../models/product.model';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'angular-core-product-details',
  standalone: true,
  imports: [
    CommonModule,
    ImageModule,
    CmsViewDetailsComponent,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent extends ViewDetailsComponent<Product> {
  override title = (item: Product) => item.title ?? "";
}
