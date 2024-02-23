import { Component, Input, OnDestroy, OnInit, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsService } from '../../../services/cms.service';
import { finalize, skip, takeUntil } from 'rxjs';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { CRUDConfiguration } from '../../../models/configurations/crud/crud.configuration';
import { CmsFiltersComponent } from '../../filters/cms-filters/cms-filters.component';
import { CmsTableComponent } from '../cms-table/cms-table.component';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { TranslateModule } from '@ngx-translate/core';
import { PaginatorState, PaginatorModule } from 'primeng/paginator';
import { BaseRowEvent, CmsActionEnum, CmsActionEvent } from '../../../models/configurations/crud/actions.configuration';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CmsDialogCreateComponent } from '../../dialogs/cms-dialog-create/cms-dialog-create.component';
import { CmsDialogUpdateComponent } from '../../dialogs/cms-dialog-update/cms-dialog-update.component';
import { CMS_CONFIGURATION } from '../../../configurations/cms.configurations';
import { DestroyedComponent } from '../../common/destroyed/destroyed.component';
import { ListResponse } from '../../../models/responses/list.response';

@Component({
  selector: 'cms-list',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    ButtonModule,
    ToolbarModule,
    PaginatorModule,
    FileUploadModule,
    ProgressBarModule,
    CmsTableComponent,
    CmsFiltersComponent,
  ],
  templateUrl: './cms-list.component.html',
  styleUrl: './cms-list.component.scss',
  providers: [
    DialogService,
  ],
})
export class CmsListComponent<T> extends DestroyedComponent implements OnInit, OnDestroy {
  @Input() public templates: { [key: string]: TemplateRef<any> } = {};
  public first: number = 0;
  public CMS_CONFIGURATION = inject(CMS_CONFIGURATION);
  public pageSize = this.CMS_CONFIGURATION.CMS_PAGE_SIZE;
  public configuration: CRUDConfiguration<T> = this.cmsService.crudConfiguration;
  private ref: DynamicDialogRef | undefined;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public cmsService: CmsService<T>,
    private primeNGConfig: PrimeNGConfig,
    private dialogService: DialogService,
  ) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();

    const { fetchDataOnInitialize, queryParams$, refetchData$, rowAction$, cmsAction$ } = this.cmsService;

    // refetch data with same filters
    refetchData$.pipe(takeUntil(this.destroyed)).subscribe(() => {
      this.fetchData();
    });

    // fetch data with new filters
    queryParams$.pipe(skip(1), takeUntil(this.destroyed)).subscribe(() => {
      this.cmsService.filterSchema.filterDto.page = 1;
      this.fetchData();
    });

    // subscribe on table row actions (ex: view, update, delete)
    rowAction$.pipe(takeUntil(this.destroyed)).subscribe((event: BaseRowEvent<T>) => {
      this.onRowAction(event);
    });

    // subscribe on cms actions (ex: create, import, export, delete multiple rows)
    cmsAction$.pipe(takeUntil(this.destroyed)).subscribe((event: CmsActionEvent) => {
      this.onCmsAction(event);
    });

    if (fetchDataOnInitialize != false) {
      this.fetchData();
    }
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }

  private fetchData(): void {
    const { filterSchema } = this.cmsService;
    const { filterDto } = filterSchema;
    const { page, per_page } = filterDto;

    if (filterDto.pagination != false && !filterDto.per_page) {
      filterDto.per_page = this.pageSize;
      this.cmsService.filterSchema.filterDto = filterDto;
    }
    this.first = ((page ?? 1) - 1) * (per_page ?? this.pageSize);

    if (filterSchema.filterDto.pagination ?? true) {
      this.cmsService.findAllWithPagination(this.cmsService.queryParams).subscribe({
        next: (result: ListResponse<T>) => {
          this.cmsService.result$.next(result);
        }
      });
    } else {
      this.cmsService.findAll(this.cmsService.queryParams).subscribe({
        next: (result: T[]) => {
          this.cmsService.result$.next({ data: result, total: result.length });
        }
      });
    }
  }

  public onPageChange(event: PaginatorState): void {
    const { page, rows } = event;
    const { filterDto } = this.cmsService.filterSchema;
    if ((page ?? 0) + 1 == filterDto.page && rows == filterDto.per_page) {
      return;
    }
    filterDto.page = (page ?? 0) + 1;
    filterDto.per_page = rows;
    this.cmsService.filterSchema.filterDto = filterDto;
    this.fetchData();
  }

  /**
   * @description handle cms action events (ex: create, import, export, delete multiple rows)
   */
  public onCmsAction(event: CmsActionEvent): void {
    const { action, data } = event;
    switch (action) {
      case CmsActionEnum.create:
        this.newItem();
        break;
      case CmsActionEnum.import:
        this.cmsService.importFile(data).subscribe();
        break;
      case CmsActionEnum.export:
        this.exportFile();
        break;
      case CmsActionEnum.deleteRows:
        this.deleteRows();
        break;
    }
  }

  /**
   * @description handle table row action events (ex: view, update, delete)
   */
  public onRowAction(event: BaseRowEvent<T>): void {
    const { key, item } = event;

    switch (key) {
      case CmsActionEnum.view:
        this.viewItem(item, false);
        break;
      case CmsActionEnum.view_new_tab:
        this.viewItem(item, true);
        break;
      case CmsActionEnum.update:
        this.updateItem(item);
        break;
      case CmsActionEnum.delete:
        this.deleteItem(item);
        break;
    }
  }

  /**
   * @returns the unique identify property
   */
  public id(item: T): any {
    const { tableConfiguration } = this.cmsService.crudConfiguration;
    const { dataKey } = tableConfiguration ?? {}
    if (dataKey && item[dataKey]) return item[dataKey];

    return item['_id'] ?? item["id"];
  }

  /**
   * navigate to create screen/dialog
   */
  public newItem(): void {
    const { formSchema, crudConfiguration } = this.cmsService;
    const { openFormType } = crudConfiguration;
    if (openFormType == 'page') {
      // navigate to create page
      const url = this.cmsService.formSchema?.routes?.create ?? 'new';
      this.router.navigate([url], { relativeTo: this.activatedRoute });
    } else if (openFormType == 'dialog') {
      // open create dialog
      const title = formSchema?.title?.();
      this.ref = this.dialogService.open(CmsDialogCreateComponent<T>, {
        header: title ? this.primeNGConfig.getTranslation(title) : undefined,
        ...this.CMS_CONFIGURATION.DIALOG_CONFIGURATION,
      });
      this.ref.onClose.subscribe((result: T | undefined) => {
        if (result) {
          this.refreshData();
        }
      });
    }
  }

  /**
   * navigate to view-details page by item id
   */
  public viewItem(item: T, newTab: boolean): void {
    const url = this.cmsService.viewDetailsRoute?.(item) ?? `view/${this.id(item)}`;
    if (newTab) {
      window.open(`${window.location.href}/${url}`, '_blank');
    } else {
      this.router.navigate([url], { relativeTo: this.activatedRoute });
    }
  }

  public updateItem(item: T): void {
    const { crudConfiguration, formSchema } = this.cmsService;
    if (!formSchema) return;

    const { openFormType } = crudConfiguration;
    if (openFormType == 'page') {
      // navigate to update page
      const url = formSchema.routes?.update?.(item) ?? `update/${this.id(item)}`;
      this.router.navigate([url], { relativeTo: this.activatedRoute });
    } else if (openFormType == 'dialog') {
      // open update dialog
      const title = formSchema?.title?.(item);
      this.ref = this.dialogService.open(CmsDialogUpdateComponent<T>, {
        header: title,
        ...this.CMS_CONFIGURATION.DIALOG_CONFIGURATION,
        data: { item, id: this.id(item) },
      });
      this.ref.onClose.subscribe((result: T | undefined) => {
        if (result) {
          this.cmsService.updateItem(result, (data) => data.findIndex(e => this.id(e) == this.id(item)));
          this.cmsService.invalidateCache();
        }
      });
    }
  }

  public deleteItem(item: T): void {
    this.cmsService.deleteConfirmation(() => {
      this.cmsService.delete(this.id(item)).subscribe({
        next: () => {
          this.refreshData();
        }
      });
    });
  }

  public deleteRows(): void {
    const { selectedItems$ } = this.cmsService;
    const { value } = selectedItems$;
    if (value.length == 0) return;

    this.cmsService.deleteConfirmation(() => {
      this.cmsService.deleteMultiple().subscribe({
        next: () => {
          this.refreshData();
        }
      });
    }, value.length);
  }

  public exportFile(): void {
    const { exporting$ } = this.cmsService;
    exporting$.next(true)
    this.cmsService.exportFile()
      .pipe(finalize(() => exporting$.next(false)))
      .subscribe();
  }

  public refreshData(): void {
    const { refetchData$, filterSchema } = this.cmsService;
    this.cmsService.invalidateCache();
    filterSchema.filterDto.page = 1;
    refetchData$.emit();
  }
}
