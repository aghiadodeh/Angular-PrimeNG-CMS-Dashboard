import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FilterInput, FilterInputType, FilterSchema } from "../../../models/configurations/filters/filter.schema";
import { CalendarModule } from "primeng/calendar";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { GenericDropdownComponent } from "../../forms/generic-dropdown/generic-dropdown.component";
import { GenericMultiSelectComponent } from "../../forms/generic-multi-select/generic-multi-select.component";
import moment from 'moment-timezone';
import { DestroyedComponent } from "../../common/destroyed/destroyed.component";
import { takeUntil } from "rxjs";

@Component({
  selector: "cms-generic-filters",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CalendarModule,
    InputTextModule,
    InputNumberModule,
    GenericDropdownComponent,
    GenericMultiSelectComponent,
  ],
  templateUrl: "./generic-filters.component.html",
  styleUrl: "./generic-filters.component.scss",
})
export class GenericFiltersComponent extends DestroyedComponent implements OnInit {
  @Input() filterSchema!: FilterSchema;
  public types = FilterInputType;
  public minDate = new Date(1900, 1, 1);
  public maxDate = new Date(2100, 1, 1);

  override ngOnInit(): void {
    super.ngOnInit();
    this.subscribeValueChanges();
  }

  private subscribeValueChanges(): void {
    const inputs = this.filterSchema.inputs.filter((e) => {
      return e.value$ != undefined && [this.types.multiSelect, this.types.dropdown].includes(e.inputType);
    });
    for (const input of inputs) {
      const { value$ } = input;
      value$?.pipe(takeUntil(this.destroyed)).subscribe((value: any) => {
        input.value = value;
      });
    }
  }

  public getFilters(): { [key: string]: any } {
    const array = this.filterSchema.inputs
      .filter((input: FilterInput) => input.value && input.value != "")
      .map((input: FilterInput) => {
        let value;
        switch (input.inputType) {
          case FilterInputType.dropdown:
            value = input.value ? input.value[input.dropdownConfiguration!.valueBy] : undefined;
            break;
          case FilterInputType.multiSelect:
            if (input.multiSelectConfiguration?.valueBy != "" && Array.isArray(input.value)) {
              value = input.value?.map((e) => e[input.multiSelectConfiguration!.valueBy]);
            }
            value = Array.isArray(value ?? input.value) ? (value ?? input.value).join(",") : value ?? input.value;
            break;
          default:
            value = input.value;
        }
        if (input.calendarConfiguration && Array.isArray(input.value)) {
          value = input.value.map((e) => {
            if (e instanceof Date) {
              return this.convertDateToIsoDate(e);
            }
            return e;
          });
        }
        if (input.value instanceof Date) {
          value = this.convertDateToIsoDate(input.value);
        }

        return { [input.key]: value };
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

  private convertDateToIsoDate(value: Date): string {
    return moment(value).utcOffset(0, true).format();
  }
}
