import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterInput, FilterInputType, FilterSchema } from '../../../models/configurations/filters/filter.schema';
import { CalendarModule } from 'primeng/calendar';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { GenericDropdownComponent } from '../../forms/generic-dropdown/generic-dropdown.component';
import { GenericMultiSelectComponent } from '../../forms/generic-multi-select/generic-multi-select.component';
import moment from 'moment-timezone';

@Component({
  selector: 'cms-generic-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CalendarModule,
    InputTextModule,
    InputNumberModule,
    GenericDropdownComponent,
    GenericMultiSelectComponent,
  ],
  templateUrl: './generic-filters.component.html',
  styleUrl: './generic-filters.component.scss',
})
export class GenericFiltersComponent {
  @Input() filterSchema!: FilterSchema;
  public types = FilterInputType;

  public getFilters(): { [key: string]: any } {
    const array = this.filterSchema.inputs
      .filter((input: FilterInput) => input.value)
      .map((input: FilterInput) => {
        let value;
        switch (input.inputType) {
          case FilterInputType.dropdown:
            value = input.value ? input.value[input.dropdownConfiguration!.valueBy] : undefined;
            break;
          case FilterInputType.multiSelect:
            if (input.mutliSelectConfiguration?.valueBy != "" && Array.isArray(input.value)) {
              input.value = input.value?.map(e => e[input.mutliSelectConfiguration!.valueBy])
            }
            value = Array.isArray(input.value) ? input.value.join(",") : input.value;
            break;
          default:
            value = input.value;
        }
        if (input.value instanceof Date) {
          value = moment(input.value).utcOffset(0, true).format(); 
        }
        return { [input.key]: value }
      });
    const filterObject = Object.assign({}, ...array);
    const { filterDto } = this.filterSchema;
    return { ...filterObject, ...filterDto };
  }

  public resetFilters(): void {
    this.filterSchema.inputs.forEach((input: FilterInput) => {
      if (input.disabled != true) input.value = undefined;
    });
  }
}
