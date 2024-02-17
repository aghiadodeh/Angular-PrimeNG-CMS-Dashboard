import { EventEmitter, Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, finalize, map, of } from 'rxjs';
import { FilterSchema, defaultFilterDto } from '../models/configurations/filters/filter.schema';
import { CacheBucket, HttpCacheManager, withCache } from '@ngneat/cashew';
import { FormSchema } from '../models/configurations/forms/form.schema';
import { HttpContext } from '@angular/common/http';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { CRUDConfiguration, EndPoints } from '../models/configurations/crud/crud.configuration';
import { BaseCellEvent, BaseRowEvent, CmsActionEvent } from '../models/configurations/crud/actions.configuration';
import { CMS_CONFIGURATION } from '../configurations/cms.configurations';
import { CommonHttpService } from './http/common-http.service';
import { ListResponse } from '../models/responses/list.response';
import { FormGroup } from '@angular/forms';

@Injectable()
export abstract class CmsService<T> extends CommonHttpService {
  protected primeNgConfig = inject(PrimeNGConfig);
  protected confirmationService = inject(ConfirmationService);
  protected cacheManager = inject(HttpCacheManager);
  protected cacheBucket = new CacheBucket();
  protected withCache: boolean = true;

  public get endPoints(): EndPoints<T> {
    return this.crudConfiguration.endPoints;
  }

  private get httpContext(): HttpContext | undefined {
    if (this.withCache) {
      return withCache({
        bucket: this.cacheBucket,
      });
    }
    return undefined;
  }

  public get queryParams(): object {
    return {
      ...this.queryParams$.value,
      ...this.filterSchema.filterDto,
    };
  }

  constructor(baseUrl?: string) {
    super(baseUrl ?? inject(CMS_CONFIGURATION).CMS_API_URL);
  }

  /**
   * @description remote-data resource name
   */
  public abstract crudConfiguration: CRUDConfiguration<T>;

  /**
   * @description fetch data when component initialized,
   * set `false` when you want fetch data on event (ex: filtration)
   */
  public fetchDataOnInitialize: boolean = true;

  /**
   * @description display filter-component based on @param filterSchema
   */
  public filterSchema: FilterSchema = {
    inputs: [],
    filterDto: defaultFilterDto,
  };

  /**
   * @description manage create/update form based on @param formSchema,
   */
  public abstract formSchema?: FormSchema<T> | undefined;

  /**
   * @description event emitter for display progressBar while loading data,
   * emits could be from any component, changes will be handled by cms-list
   */
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * @description event emitter for display progressBar while export data,
   * emits could be from any component, changes will be handled by cms-actions (export button)
   */
  public exporting$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * @description event emitter for display progressBar while import data,
   * emits could be from any component, changes will be handled by cms-actions (import button)
   */
  public importing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * @description observable data-holder for last fetched data.
   */
  public result$: BehaviorSubject<ListResponse<T>> = new BehaviorSubject<ListResponse<T>>({ data: [], total: 0 })

  /**
   * @description event emitter to call fetch-data method,
   * emits could be from any component, events will be handled by cms-list
   */
  public refetchData$: EventEmitter<void> = new EventEmitter<void>();

  /**
   * @description event emitter to reset all filters and re-fetch data,
   * emits could be from any component, events will be handled by cms-filters
   */
  public queryParams$: BehaviorSubject<{ [key: string]: any }> = new BehaviorSubject<{ [key: string]: any }>({});

  /**
   * @description event emitter to reset all filters and re-fetch data,
   * emits could be from any component, events will be handled by cms-filters
   */
  public resetFilters$: EventEmitter<void> = new EventEmitter<void>();

  /**
   * @description used for some action should apply on multiple items,
   * like export or delete list of items in one action
   */
  public selectedItems$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);

  /**
   * @description emit event when user click on some table actions
   */
  public rowAction$: EventEmitter<BaseRowEvent<T>> = new EventEmitter();

  /**
   * @description emit event when user click on some clickable cell
   */
  public cellAction$: EventEmitter<BaseCellEvent<T>> = new EventEmitter();

  /**
   * @description emit event for (create, import, export, delete mutliple rows)
   */
  public cmsAction$: EventEmitter<CmsActionEvent> = new EventEmitter();

  /**
   * @description view cms-actions in cms-table
   */
  public viewTableActions$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  /**
   * @description view paginator in cms-list
   */
  public viewCmsPaginatior$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  /**
   * manage remote data before display
   * @param {Array<T>} data fetched data from server/cache
   * @returns data after custom mapping
   */
  public mapFetchedData: (data: T[]) => T[] = (data: T[]) => data;

  public create<X>(data: X): Observable<T> {
    this.loading$.next(true);
    const { index, create } = this.endPoints;
    return this.post<T>(create ?? index, data).pipe(
      finalize(() => this.loading$.next(false)),
      map(response => response.data),
    );
  }

  public update<X>(id: any, data: X): Observable<T> {
    this.invalidateCache();
    this.loading$.next(true);
    const { index, update } = this.endPoints;
    const resourceName = update?.(id) ?? `${index}/${id}`;
    return this.patch<T>(resourceName, data).pipe(
      finalize(() => this.loading$.next(false)),
      map(response => response.data),
    );
  }

  public findAll(queryParams: any = {}): Observable<T[]> {
    this.loading$.next(true);
    const { index } = this.endPoints;
    return this.get<T[]>(index, {
      params: queryParams,
      context: this.httpContext,
    }).pipe(
      finalize(() => this.loading$.next(false)),
      map(response => this.mapFetchedData(response.data)),
    );
  }

  public findAllWithPagination(queryParams: any = {}): Observable<ListResponse<T>> {
    this.loading$.next(true);
    const { index } = this.endPoints;
    return this.get<ListResponse<T>>(index, {
      params: queryParams,
      context: this.httpContext,
    }).pipe(
      finalize(() => this.loading$.next(false)),
      map(response => {
        let { data, total, metadata } = response.data;
        data = this.mapFetchedData(data);
        return { data, total, metadata };
      }),
    );
  }

  public findOne(id: any,): Observable<T> {
    const { index, view } = this.endPoints;
    const resourceName = view?.(id) ?? `${index}/${id}`;
    return this.get<T>(resourceName, {
      context: this.httpContext,
    }).pipe(map(response => response.data));
  }

  override delete(id: any): Observable<any> {
    this.loading$.next(true);
    const { index, remove } = this.endPoints;
    const resourceName = remove?.(id) ?? `${index}/${id}`;
    return super.delete(resourceName).pipe(
      finalize(() => this.loading$.next(false)),
    );
  }

  /**
   * this method will not work until you override it in your service
   * @example for download csv file
   * ```
  override exportFile(): Observable<any> {
      return this.download(`${this.endPoints.index}/export-csv`, `${this.endPoints.index}-${new Date()}`, 'csv');
  }
   * ```
   */
  public exportFile(): Observable<any> {
    return of();
  }

  public importFile(file: File): Observable<any> {
    const { importFile } = this.endPoints;
    if (!importFile) {
      throw new Error('importFile endPoint is not definend, Check your endPoints');
    }
    this.importing$.next(true);
    const { endPoint, requestBody } = this.endPoints.importFile!(file);
    return this.post(endPoint, this.parseToFormData(requestBody)).pipe(
      finalize(() => {
        this.importing$.next(false);
        this.messageService.add({
          key: 'main-toast',
          severity: 'success',
          summary: 'Success',
          detail: 'File Uploaded Successfully',
        });
      }),
    );
  }

  public deleteMultiple(): Observable<any> {
    if (!this.endPoints.removeMultiple) {
      throw new Error('removeMultiple endPoint is not definend, Check your endPoints');
    }
    this.loading$.next(true);
    const { endPoint, requestBody } = this.endPoints.removeMultiple!(this.selectedItems$.value);
    return super.post(endPoint, requestBody).pipe(
      finalize(() => this.loading$.next(false)),
    );
  }

  public deleteConfirmation(accept: Function, length = 0): void {
    this.confirmationService.confirm({
      key: 'main-confirm',
      message: this.getTranslation(length == 0 ? 'delete_confirmation_message' : 'delete_multiple_confirmation_message'),
      header: this.getTranslation('delete_confirmation'),
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      accept,
    });
  }

  public invalidateCache(): void {
    this.cacheManager.delete(this.cacheBucket);
  }

  public appendItem(item: T): void {
    const value = this.result$.value ?? { data: [], total: 0 };
    const { data, total } = value;
    this.result$.next({ data: [item, ...data], total: total + 1 });
  }

  public updateItem(item: T, findIndex: (data: T[]) => number): boolean {
    const value = this.result$.value ?? { data: [], total: 0 };
    const { data, total } = value;
    const index = findIndex(data);
    if (index != -1) {
      data[index] = item;
      this.result$.next({ data, total });
    }
    return index != -1
  }

  public removeItem(findIndex: (data: T[]) => number): boolean {
    const value = this.result$.value ?? { data: [], total: 0 };
    const { data, total } = value;
    const index = findIndex(data);
    if (index != -1) {
      data.splice(index, 1);
      this.result$.next({ data, total: total - 1 });
    }
    return index != -1
  }

  public notifyFormErrors(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((control: string) => {
      if (formGroup.controls[control].invalid) {
        const { errors } = formGroup.controls[control];
        if (errors) {
          const keys = Object.keys(errors);
          const label = this.formSchema?.inputs().find(input => input.key == control)?.label;
          const key = this.getTranslation(label ?? control);
          this.messageService.add({
            key: 'main-toast',
            severity: 'error',
            summary: '',
            detail: keys.length > 0 ? `${key} ${this.getTranslation(keys[0])}` : `${key} NOT VALID`,
          });
        }
      }
    });
  }

  public getTranslation(key: string): any {
    return this.primeNgConfig.getTranslation(key);
  }

  /**
   * @description router will navigate to this route when user click on `view` action
   * @default `view/${item.id}`
   */
  public viewDetailsRoute?: (item: T) => string | undefined;
}
