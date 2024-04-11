import { NgClass } from "@angular/common";

export interface RadioGroupConfiguration {
  ngClass?: NgClass["ngClass"];
  radioButtons: RadioButtonConfiguration[];
}

export interface RadioButtonConfiguration {
  ngClass?: NgClass["ngClass"];
  label: string;
  value: string;
}
