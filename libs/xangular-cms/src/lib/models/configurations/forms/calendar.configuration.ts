import { CalendarTypeView } from "primeng/calendar";
import { BehaviorSubject } from "rxjs";

export interface CalendarInputConfiguration {
  view?: CalendarTypeView;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  minDate$?: BehaviorSubject<Date>;
  maxDate$?: BehaviorSubject<Date>;
  selectionMode?: "single" | "multiple" | "range" | undefined;
}
