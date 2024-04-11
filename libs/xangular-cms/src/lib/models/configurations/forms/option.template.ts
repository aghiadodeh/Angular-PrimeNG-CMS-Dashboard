import { NgClass } from "@angular/common";

export interface OptionTemplate {
  ngClass?: NgClass["ngClass"];
  imageSrc?: (item: any) => string | undefined;
}
