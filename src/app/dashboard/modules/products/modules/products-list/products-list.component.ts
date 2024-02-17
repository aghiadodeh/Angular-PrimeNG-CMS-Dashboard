import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseRowEvent, CmsListComponent } from '@xangular/cms';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/products.service';
import { Product } from '../../../../../models/product.model';
import { DestroyedComponent } from '@xangular/cms';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'angular-core-products-list',
  standalone: true,
  imports: [
    CommonModule,
    RatingModule,
    FormsModule,
    CmsListComponent,
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent extends DestroyedComponent {
  constructor(productsService: ProductService) {
    super();
    productsService.rowAction$
      .pipe(takeUntil(this.destroyed))
      .subscribe((action: BaseRowEvent<Product>) => {
        console.log(action);
      });
  }
}
