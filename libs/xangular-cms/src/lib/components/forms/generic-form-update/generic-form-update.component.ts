import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { GenericFormBuilderComponent } from '../generic-form-builder/generic-form-builder.component';
import { CmsService } from '../../../services/cms.service';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TranslateModule } from '@ngx-translate/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { Router } from '@angular/router';
import { FunctionPipe } from '../../../pipes/function.pipe';
import { LoadingResult, Result } from '../../../models/data/result';

@Component({
  selector: 'cms-generic-form-update',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DividerModule,
    TranslateModule,
    ProgressBarModule,
    FunctionPipe,
    GenericFormBuilderComponent,
  ],
  templateUrl: './generic-form-update.component.html',
  styleUrl: './generic-form-update.component.scss',
})
export class GenericFormUpdateComponent<T> {
  @Input() dataKey: string = 'id';
  @Input() result: Result<T> = new LoadingResult<T>();
  @Input() submitButton: boolean = true;
  @ViewChild(GenericFormBuilderComponent, { static: false }) genericFormBuilder?: GenericFormBuilderComponent<T>;

  constructor(
    public cmsService: CmsService<T>,
    private location: Location,
    private router: Router,
  ) { }

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

    if (formSchema!.parseToFormData == true) {
      value = this.cmsService.parseToFormData(value);
    }
    const id = this.result.data$.value![this.dataKey];
    this.cmsService.update(id, value).subscribe({
      next: () => {
        this.cmsService.invalidateCache();
        let redirectTo = formSchema?.routes?.redirectTo;
        if (!redirectTo) {
          redirectTo = this.location.path().split("/").find(p => p.length > 0);
        }
        this.router.navigate([`/${redirectTo}`], { replaceUrl: true })
      },
    });
  }
}
