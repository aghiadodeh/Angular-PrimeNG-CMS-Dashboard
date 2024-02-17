import { BehaviorSubject } from "rxjs";
import { DropdownConfiguration } from "../forms/dropdown.configuration";
import { MutliSelectConfiguration } from "../forms/mutli-select.configuration";
import { BaseFilterDto } from "./base-filter.dto";

export const defaultFilterDto = {
    page: 1,
    pagination: true,
};

export interface FilterSchema {
    inputs: FilterInput[];

    /**
     * @description filter transfer object, if you want to add some static filters which not included in inputs
     * you can extend BaseFilterDto and decalre your own filter object
     */
    filterDto: BaseFilterDto;
}

export interface FilterInput {
    key: string;
    label: string;
    value?: any;
    inputType: FilterInputType;
    disabled?: boolean;
    disabled$?: BehaviorSubject<boolean>;
    dropdownConfiguration?: DropdownConfiguration;
    mutliSelectConfiguration?: MutliSelectConfiguration;
}

export enum FilterInputType {
    text = 'text',
    email = 'email',
    number = 'number',
    date = 'date',
    time = 'time',
    search = 'search',
    dropdown = 'dropdown',
    multiSelect = 'multiSelect',
}