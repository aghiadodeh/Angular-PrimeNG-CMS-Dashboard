import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GenericFiltersComponent } from "../generic-filters/generic-filters.component";
import { CmsService } from "../../../services/cms.service";
import { ButtonModule } from "primeng/button";
import { AccordionModule } from "primeng/accordion";
import { TranslateModule } from "@ngx-translate/core";
import { DestroyedComponent } from "../../common/destroyed/destroyed.component";
import { takeUntil } from "rxjs";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { TranslationService } from "../../../modules/translation/services/translation.service";

@Component({
  selector: "cms-filters",
  standalone: true,
  imports: [CommonModule, TranslateModule, ButtonModule, AccordionModule, GenericFiltersComponent],
  templateUrl: "./cms-filters.component.html",
  styleUrl: "./cms-filters.component.scss",
})
export class CmsFiltersComponent<T> extends DestroyedComponent implements OnInit {
  public isTablet: boolean = false;
  @ViewChild(GenericFiltersComponent) filterComponent!: GenericFiltersComponent;

  constructor(
    public cmsService: CmsService<T>,
    private breakpointObserver: BreakpointObserver,
    public translationService: TranslationService,
  ) {
    super();
    cmsService.applyFilters$.pipe(takeUntil(this.destroyed)).subscribe(() => {
      this.applyFilters();
    });
    cmsService.resetFilters$.pipe(takeUntil(this.destroyed)).subscribe((value: boolean) => {
      this.resetFilters(value);
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.breakpointObserver.observe(["(max-width: 1200px)"]).subscribe((state: BreakpointState) => {
      this.isTablet = state.matches;
    });
  }

  public applyFilters(): void {
    this.cmsService.queryParams$.next(this.filterComponent.getFilters());
  }

  public resetFilters(value: boolean): void {
    this.filterComponent.resetFilters();
    if (value === true) this.cmsService.queryParams$.next({});
  }
}
