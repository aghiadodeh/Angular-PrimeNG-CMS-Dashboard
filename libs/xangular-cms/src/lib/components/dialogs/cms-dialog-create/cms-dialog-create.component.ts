import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CmsService } from "../../../services/cms.service";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { DialogModule } from "primeng/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { GenericFormBuilderComponent } from "../../forms/generic-form-builder/generic-form-builder.component";

@Component({
  selector: "cms-dialog-create",
  standalone: true,
  imports: [CommonModule, TranslateModule, ButtonModule, DialogModule, DividerModule, GenericFormBuilderComponent],
  templateUrl: "./cms-dialog-create.component.html",
  styleUrl: "./cms-dialog-create.component.scss",
})
export class CmsDialogCreateComponent<T> implements OnInit {
  @ViewChild(GenericFormBuilderComponent)
  genericFormBuilder?: GenericFormBuilderComponent<T>;
  constructor(
    public cmsService: CmsService<T>,
    private ref: DynamicDialogRef,
    private cdk: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cdk.detectChanges();
  }

  public submit(): void {
    const { formSchema } = this.cmsService;
    const { formGroup } = this.genericFormBuilder!;
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
      next: (result: T) => {
        this.close(result);
      },
    });
  }

  public close(result?: any) {
    this.ref.close(result);
  }
}
