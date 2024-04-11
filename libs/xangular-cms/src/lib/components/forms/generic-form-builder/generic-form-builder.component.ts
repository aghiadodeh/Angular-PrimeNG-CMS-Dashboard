import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { CommonModule, NgClass } from "@angular/common";
import { FormInput, FormInputType, FormSchema } from "../../../models/configurations/forms/form.schema";
import { UploadFileComponent } from "../upload-file/upload-file.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { CalendarModule } from "primeng/calendar";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { GenericDropdownComponent } from "../generic-dropdown/generic-dropdown.component";
import { GenericAutoCompleteComponent } from "../generic-auto-complete/generic-auto-complete.component";
import { GenericMultiSelectComponent } from "../generic-multi-select/generic-multi-select.component";
import { UploadImageComponent } from "../upload-image/upload-image.component";
import { ColorPickerModule } from "primeng/colorpicker";
import { PasswordModule } from "primeng/password";
import { CheckboxModule, CheckboxChangeEvent } from "primeng/checkbox";
import { TriStateCheckboxModule, TriStateCheckboxChangeEvent } from "primeng/tristatecheckbox";
import { RadioButtonModule } from "primeng/radiobutton";
import { DestroyedComponent } from "../../common/destroyed/destroyed.component";
import { takeUntil } from "rxjs";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputSwitchModule } from "primeng/inputswitch";
import { ChipsModule } from "primeng/chips";

@Component({
  selector: "cms-generic-form-builder",
  standalone: true,
  imports: [
    ChipsModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    CalendarModule,
    InputTextModule,
    CheckboxModule,
    PasswordModule,
    ColorPickerModule,
    InputNumberModule,
    RadioButtonModule,
    InputGroupModule,
    InputSwitchModule,
    InputGroupAddonModule,
    TriStateCheckboxModule,
    ReactiveFormsModule,
    UploadFileComponent,
    UploadImageComponent,
    GenericDropdownComponent,
    GenericMultiSelectComponent,
    GenericAutoCompleteComponent,
  ],
  templateUrl: "./generic-form-builder.component.html",
  styleUrl: "./generic-form-builder.component.scss",
})
export class GenericFormBuilderComponent<T> extends DestroyedComponent implements OnInit {
  @Input() item?: T;
  @Input() formSchema!: FormSchema<T>;
  @Input() ngClass?: NgClass["ngClass"];
  public inputs: FormInput<T>[] = [];
  public types = FormInputType;
  public formGroup!: FormGroup;

  public minDate = new Date(1900, 1, 1);
  public maxDate = new Date(2100, 1, 1);
  public currentDate = new Date();

  constructor(private cdk: ChangeDetectorRef) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.initializeForm();
    this.cdk.detectChanges();
  }

  private initializeForm(): void {
    const group: { [key: string]: FormControl } = {};
    this.inputs = this.formSchema.inputs(this.item);
    this.inputs.forEach((input: FormInput<T>) => {
      let value: any;
      if (this.item) {
        value = input.valueFn?.(this.item) ?? input.value ?? null;
      } else {
        value = input.value ?? null;
      }
      input.value = value;
      group[input.key] = new FormControl(value, input.validators);

      if (input.disabled == true) {
        group[input.key].disable();
      }

      input.disabled$?.pipe(takeUntil(this.destroyed)).subscribe((disabled: boolean) => {
        if (disabled) group[input.key].disable();
        else group[input.key].enable();
      });
    });
    this.formGroup = new FormGroup(group);
    this.formSchema.onFormInitialized?.(this.formGroup);
  }

  public checkBoxChanged(input: FormInput<T>, event: CheckboxChangeEvent) {
    input.onChange?.(event);
  }

  public triStateCheckboxChanged(input: FormInput<T>, event: TriStateCheckboxChangeEvent) {
    input.onChange?.(event);
  }

  public imageChanged(input: FormInput<T>, event: File): void {
    this.formGroup.controls[input.key].setValue(event);
    input.onChange?.(event);
  }

  public filesChanged(input: FormInput<T>, event: File | File[] | null): void {
    this.formGroup.controls[input.key].setValue(event);
    input.onChange?.(event);
  }

  public dropdownValueChanged(input: FormInput<T>, event: any): void {
    this.formGroup.controls[input.key].setValue(event);
    input.onChange?.(event);
  }

  public timeDurationChanged(input: FormInput<T>, event: any): void {
    this.formGroup.controls[input.key].setValue(event);
    input.onChange?.(event);
  }

  public switchValueChanged(input: FormInput<T>, event: any): void {
    input.onChange?.(event);
  }

  public chipChanged(input: FormInput<T>, event: any): void {
    input.onChange?.(event);
  }
}
