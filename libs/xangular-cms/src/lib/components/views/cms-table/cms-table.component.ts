import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsService } from '../../../services/cms.service';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CmsActionsComponent } from '../cms-actions/cms-actions.component';
import { TranslateModule } from '@ngx-translate/core';
import { SortEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { BaseTableColumnAction } from '../../../models/configurations/crud/actions.configuration';
import { takeUntil } from 'rxjs';
import { PropertyKeyPipe } from '../../../pipes/property-key.pipe';
import { FunctionPipe } from '../../../pipes/function.pipe';
import { ListResponse } from '../../../models/responses/list.response';
import { DestroyedComponent } from '../../common/destroyed/destroyed.component';

@Component({
  selector: 'cms-table',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    CardModule,
    TableModule,
    ButtonModule,
    PaginatorModule,
    TooltipModule,
    OverlayPanelModule,
    CmsActionsComponent,
    PropertyKeyPipe,
    FunctionPipe,
  ],
  templateUrl: './cms-table.component.html',
  styleUrl: './cms-table.component.scss',
})
export class CmsTableComponent<T> extends DestroyedComponent implements OnInit {
  @Input() public templates: { [key: string]: TemplateRef<any> } = {};

  public actionsVisibility: boolean = false;

  private _selectedItems: T[] = [];
  public set selectedItems(items: T[]) {
    this.cmsService.selectedItems$.next(items);
    this._selectedItems = items;
  }
  public get selectedItems() {
    return this._selectedItems;
  }

  constructor(public cmsService: CmsService<T>) {
    super();
    cmsService.result$.pipe(takeUntil(this.destroyed)).subscribe((result: ListResponse<T>) => {
      // check how many action is visible
      const { data } = result;
      const { actions } = cmsService.crudConfiguration.tableConfiguration ?? {};
      if (actions) {
        this.actionsVisibility = data.some((item: T) => actions(item).find(e => e.visible != false && e.visibleFn?.() != false));
      }
    });
  }

  public customSort(event: SortEvent): void {
    const { filterSchema, refetchData$ } = this.cmsService;
    const { filterDto } = filterSchema;
    const { field, order } = event;
    const sortDir = order == -1 ? 'DESC' : 'ASC';
    if (filterDto.sortKey == field && filterDto.sortDir == sortDir) {
      return;
    }

    filterDto.page = 1;
    filterDto.sortKey = event.field;
    filterDto.sortDir = event.order == -1 ? 'DESC' : 'ASC';
    refetchData$.emit();
  }

  public emitCellAction(key: string, item: T): void {
    this.cmsService.cellAction$.emit({ key, item });
  }

  public emitRowAction(key: any, item: T): void {
    this.cmsService.rowAction$.emit({ key, item });
  }

  public visibleActionsCount(actions: BaseTableColumnAction[]): number {
    if (!actions) return 0;
    const length = actions.filter(action => action.visible != false && action.visibleFn?.() != false).length;
    return length;
  }
}