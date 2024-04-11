import { NgStyle } from "@angular/common";
import { BaseTableColumnAction } from "./actions.configuration";

export interface BaseTableConfiguration<T> {
  /**
   * @description property to uniquely identify a record in data
   */
  dataKey: string;

  columns: BaseTableColumn<T>[];

  actions?: (item: T) => BaseTableColumnAction[];

  actionsDisplay?: "menu" | "row";
}

export interface BaseTableColumn<T> {
  title: string;
  key: string;
  keyFn?: (item: T) => string;
  clickable?: boolean;
  sortKey?: string;
  templateRef?: boolean;
  dateFormat?: string;
  translate?: boolean;
  intl?: boolean;
  ngStyle?: NgStyle["ngStyle"];
  ngStyleFn?: (item: T) => NgStyle["ngStyle"];
}
