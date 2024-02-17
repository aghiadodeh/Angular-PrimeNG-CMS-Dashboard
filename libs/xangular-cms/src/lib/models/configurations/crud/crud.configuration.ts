import { BaseTableConfiguration } from "./table.configuration";
import { BaseCRUDActions } from "./actions.configuration";

export interface CRUDConfiguration<T> {
    /**
     * @description remote-data resources name
     */
    endPoints: EndPoints<T>;

    /**
     * @description display base cms actions
     */
    actions?: BaseCRUDActions;

    /**
     * @description make cms-filters accordion opened by default.
     * @default true
     */
    openFilterAccordion?: boolean;

    /**
     * @description open create/update form in page or dialog
     * @default "dialog"
     */
    openFormType?: "page" | "dialog";

    tableConfiguration?: BaseTableConfiguration<T>;
}

export interface EndPoints<T> {
    index: string;
    create?: string;
    update?: (id: any) => string;
    view?: (id: any) => string;
    remove?: (id: any) => string;
    removeMultiple?: (items: T[]) => { endPoint: string, requestBody: any };
    importFile?: (file: File) => { endPoint: string, requestBody: any };
}