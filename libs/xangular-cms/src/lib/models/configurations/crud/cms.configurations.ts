import { InjectionToken } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

export const CMS_CONFIGURATION = new InjectionToken<CMSConfiguration>("cms.CMS_CONFIGURATION");

export interface CMSConfiguration {
  CMS_API_URL: string;
  CMS_PAGE_SIZE: number;
  DIALOG_CONFIGURATION: DynamicDialogConfig<any>;
}
