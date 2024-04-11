import { Button } from "primeng/button";
import { FileConfiguration } from "../forms/file.configuration";

export const importMimetype = ".csv, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export enum CmsActionEnum {
  create = "create",
  delete = "delete",
  deleteRows = "deleteRows",
  import = "import",
  export = "export",
  update = "update",
  view = "view",
  view_new_tab = "view_new_tab",
}

/**
 * @description display base cms actions
 */
export interface BaseCRUDActions {
  /**
   * @default true
   */
  create?: () => boolean;

  /**
   * @default false
   */
  delete?: () => boolean;

  /**
   * @default false
   */
  hide?: () => boolean;

  /**
   * @default false
   */
  import?: () => FileConfiguration;

  /**
   * @default false
   */
  selectRows?: () => boolean;

  /**
   * @default false
   */
  export?: () => boolean;
}

export interface CmsActionEvent {
  action: CmsActionEnum;
  data?: any;
}

export interface BaseRowEvent<T> {
  key: any;
  item: T;
}

export interface BaseCellEvent<T> {
  key: string;
  item: T;
}

export interface BaseTableColumnAction {
  key: any;
  label?: string;
  icon?: string;
  visible?: boolean;
  visibleFn?: () => boolean;
  severity?: Button["severity"];
}
