import { Validator, ValidatorFn, FormGroup } from "@angular/forms";
import { DropdownConfiguration } from "./dropdown.configuration";
import { MultiSelectConfiguration } from "./multi-select.configuration";
import { BehaviorSubject } from "rxjs";
import { DragAndDropConfiguration, FileConfiguration, ImageConfiguration } from "./file.configuration";
import { AutoCompleteConfiguration } from "./auto-complete.configuration";
import { NgClass } from "@angular/common";
import { CalendarInputConfiguration } from "./calendar.configuration";
import { ChipConfiguration } from "./chip.configuration";
import { InputGroupConfiguration } from "./input-group.configuration";
import { NumberConfiguration } from "./number.configuration";
import { RadioGroupConfiguration } from "./radio-group.configuration";

export interface FormSchema<T> {
  inputs: (item?: T) => FormInput<T>[];

  /**
   * @description inject some data that not included in @param inputs
   */
  staticData?: any;

  /**
   * @description send request as FormData
   */
  parseToFormData?: boolean;

  /**
   * @description callback to notify form-builder parent that formGroup has been initialized.
   */
  onFormInitialized?: (formGroup: FormGroup) => void;

  /**
   * @description router navigation paths for (create, update, view),
   * it will not used in `dialog` mode.
   */
  routes?: Routes<T>;

  /**
   * @description send request to server for get item-by-id when open update page/dialog
   */
  fetchItemForUpdate?: boolean;

  /**
   * form title in create/update pages
   * @param item fetched item in update model
   * @returns {string | undefined}
   */
  title?: (item?: T) => string | undefined;

  ngClass?: NgClass["ngClass"];

  removeNullValues?: boolean;
}

export interface FormInput<T> {
  key: string;
  label: string;
  placeholder?: string;
  value?: any;
  valueFn?: (item: T) => any;
  inputType: FormInputType;
  validators: (any | Validator | ValidatorFn)[];
  visible?: boolean;
  disabled?: boolean;
  visible$?: BehaviorSubject<boolean>;
  disabled$?: BehaviorSubject<boolean>;
  chipConfiguration?: ChipConfiguration;
  fileConfiguration?: FileConfiguration;
  imageConfiguration?: ImageConfiguration;
  numberConfiguration?: NumberConfiguration;
  dropdownConfiguration?: DropdownConfiguration;
  radioGroupConfiguration?: RadioGroupConfiguration;
  inputGroupConfiguration?: InputGroupConfiguration;
  calendarConfiguration?: CalendarInputConfiguration;
  multiSelectConfiguration?: MultiSelectConfiguration;
  dragAndDropConfiguration?: DragAndDropConfiguration;
  autoCompleteConfiguration?: AutoCompleteConfiguration;
  onChange?: (event: any) => void;
}

export enum FormInputType {
  image = "image",
  file = "file",
  text = "text",
  phone = "tel",
  number = "number",
  email = "email",
  password = "password",
  inputNumber = "inputNumber",
  date = "date",
  checkbox = "checkbox",
  triStateCheckbox = "triStateCheckbox",
  radio = "radio",
  time = "time",
  datetime = "datetime",
  color = "color",
  dropdown = "dropdown",
  autocomplete = "autocomplete",
  multiSelect = "multiSelect",
  switch = "switch",
  chips = "chips",
}

export interface Routes<T> {
  create?: string;
  update?: (item: T) => string;
  redirectTo?: string;
  relativeTo?: boolean;
}
