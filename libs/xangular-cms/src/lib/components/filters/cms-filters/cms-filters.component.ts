import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericFiltersComponent } from '../generic-filters/generic-filters.component';
import { CmsService } from '../../../services/cms.service';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { TranslateModule } from '@ngx-translate/core';
import { DestroyedComponent } from '../../common/destroyed/destroyed.component';
import { takeUntil } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'cms-filters',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    AccordionModule,
    GenericFiltersComponent,
  ],
  templateUrl: './cms-filters.component.html',
  styleUrl: './cms-filters.component.scss',
})
export class CmsFiltersComponent<T> extends DestroyedComponent implements OnInit {
  public isTablet: boolean = false;
  @ViewChild(GenericFiltersComponent) filterComponent!: GenericFiltersComponent;

  constructor(
    public cmsService: CmsService<T>,
    private breakpointObserver: BreakpointObserver,
  ) {
    super();
    cmsService.resetFilters$
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.resetFilters();
      });
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.breakpointObserver
      .observe(['(max-width: 1200px)'])
      .subscribe((state: BreakpointState) => {
        this.isTablet = state.matches;
      });
  }

  public applyFilters(): void {
    const filters = this.filterComponent.getFilters();
    this.cmsService.queryParams$.next(filters);
  }

  public resetFilters(): void {
    this.filterComponent.resetFilters();
    this.cmsService.queryParams$.next({});
  }
}
