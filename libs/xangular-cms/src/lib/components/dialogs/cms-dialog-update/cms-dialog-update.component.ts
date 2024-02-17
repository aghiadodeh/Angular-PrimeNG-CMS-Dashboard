import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsService } from '../../../services/cms.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { GenericFormBuilderComponent } from '../../forms/generic-form-builder/generic-form-builder.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'cms-dialog-update',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    DialogModule,
    DividerModule,
    GenericFormBuilderComponent,
  ],
  templateUrl: './cms-dialog-update.component.html',
  styleUrl: './cms-dialog-update.component.scss',
})
export class CmsDialogUpdateComponent<T> implements OnInit {
  public item?: T;
  public loading: boolean = true;
  @ViewChild(GenericFormBuilderComponent, { static: false }) genericFormBuilder?: GenericFormBuilderComponent<T>;

  constructor(
    public cmsService: CmsService<T>,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private cdk: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.getItem();
    });
  }

  private getItem(): void {
    const { data } = this.config;
    const { formSchema } = this.cmsService;
    const { fetchItemForUpdate } = formSchema!;

  if (fetchItemForUpdate == true) {
      this.cmsService.findOne(data.id ?? data.item.id)
        .pipe(finalize(() => this.loading = false))
        .subscribe(result => {
          this.item = result;
          this.cdk.detectChanges();
        });
    } else {
      this.item = data?.item;
      this.loading = false;
      this.cdk.detectChanges();
    }
  }

  public submit(): void {
    const { data } = this.config;
    const { formSchema } = this.cmsService;
    const { formGroup } = this.genericFormBuilder!;
    let value = {
      ...formGroup.value,
      ...formSchema?.staticData,
    };

    if (formSchema!.parseToFormData == true) {
      value = this.cmsService.parseToFormData(value);
    }
    const id = data.id ?? data.item.id;
    this.cmsService.update(id, value).subscribe({
      next: (result: T) => {
        this.close(result);
      },
    });
  }

  public close(result?: any) {
    this.ref.close(result);
  }
}
