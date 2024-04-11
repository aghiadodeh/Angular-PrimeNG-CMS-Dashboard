import { Component, Input, ViewChild } from "@angular/core";
import { CommonModule, Location } from "@angular/common";
import { GenericFormBuilderComponent } from "../generic-form-builder/generic-form-builder.component";
import { CmsService } from "../../../services/cms.service";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { TranslateModule } from "@ngx-translate/core";
import { FunctionPipe } from "../../../pipes/function.pipe";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";

@Component({
  selector: "cms-generic-form-create",
  standalone: true,
  imports: [CommonModule, ButtonModule, DividerModule, TranslateModule, GenericFormBuilderComponent, FunctionPipe],
  templateUrl: "./generic-form-create.component.html",
  styleUrl: "./generic-form-create.component.scss",
})
export class GenericFormCreateComponent<T> {
  @Input() submitButton: boolean = true;
  @ViewChild(GenericFormBuilderComponent, { static: false })
  genericFormBuilder?: GenericFormBuilderComponent<T>;

  constructor(
    private messageService: MessageService,
    public cmsService: CmsService<T>,
    private location: Location,
    private router: Router,
  ) {}

  public submit(): void {
    const { formSchema } = this.cmsService;
    const { formGroup } = this.genericFormBuilder!;
    if (!formGroup.valid) {
      this.cmsService.notifyFormErrors(formGroup);
      formGroup.markAllAsTouched();
      return;
    }

    let value = {
      ...formGroup.value,
      ...formSchema?.staticData,
    };

    if (formSchema?.removeNullValues == true) {
      Object.entries(value).forEach((entry) => {
        if (entry[1] == null) delete value[entry[0]];
      });
    }

    if (formSchema!.parseToFormData == true) {
      value = this.cmsService.parseToFormData(value);
    }
    this.cmsService.create(value).subscribe({
      next: () => {
        this.cmsService.invalidateCache();
        let redirectTo = formSchema?.routes?.redirectTo;
        if (!redirectTo) {
          redirectTo = this.location
            .path()
            .split("/")
            .find((p) => p.length > 0);
        }
        this.router.navigate([`/${redirectTo}`], { replaceUrl: true });
      },
    });
  }
}
