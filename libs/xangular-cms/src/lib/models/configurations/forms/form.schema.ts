import { Validator, ValidatorFn, FormGroup } from "@angular/forms";
import { DropdownConfiguration } from "./dropdown.configuration";
import { MutliSelectConfiguration } from "./mutli-select.configuration";
import { BehaviorSubject } from "rxjs";
import { FileConfiguration, ImageConfiguration } from "./file.configuration";
import { AutoCompleteConfiguration } from "./auto-complete.configuration";
import { NgClass } from "@angular/common";

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
    onFormInilialized?: (formGroup: FormGroup) => void;

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

    ngClass?: NgClass['ngClass'];
}

export interface FormInput<T> {
    key: string;
    label: string;
    value?: any;
    valueFn?: (item: T) => any;
    inputType: FormInputType;
    validators: (any | Validator | ValidatorFn)[];
    numberConfiguration?: NumberConfiguration;
    visible?: boolean;
    disabled?: boolean;
    visible$?: BehaviorSubject<boolean>;
    disabled$?: BehaviorSubject<boolean>;
    fileConfiguration?: FileConfiguration;
    imageConfiguration?: ImageConfiguration;
    dropdownConfiguration?: DropdownConfiguration;
    radioGroupConfiguration?: RadioGroupConfiguration;
    calendarConfiguration?: CalendarInputConfiguration;
    mutliSelectConfiguration?: MutliSelectConfiguration;
    autoCompleteConfiguration?: AutoCompleteConfiguration;
    onChange?: (event: any) => void;
}

export enum FormInputType {
    image = 'image',
    file = 'file',
    text = 'text',
    email = 'email',
    password = 'password',
    number = 'number',
    date = 'date',
    checkbox = 'checkbox',
    triStateCheckbox = 'triStateCheckbox',
    radio = 'radio',
    time = 'time',
    datetime = 'datetime',
    color = 'color',
    dropdown = 'dropdown',
    autocomplete = 'autocomplete',
    multiSelect = 'multiSelect',
}

export interface NumberConfiguration {
    currency?: string;
    prefix?: string;
    suffix?: string;
    mode?: 'decimal' | 'currency';
}

export interface RadioGroupConfiguration {
    ngClass?: NgClass['ngClass'];
    radioButtons: RadioButtonConfiguration[];
}

export interface RadioButtonConfiguration {
    ngClass?: NgClass['ngClass'];
    label: string;
    value: string;
}

export interface CalendarInputConfiguration {
    dateFormat?: string;
}

export interface Routes<T> {
    create?: string;
    update?: (item: T) => string;
    redirectTo?: string;
}
