import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { CmsService } from '../../../services/cms.service';
import { CardModule } from 'primeng/card';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { UploadFileComponent } from '../../forms/upload-file/upload-file.component';
import { CmsActionEnum } from '../../../models/configurations/crud/actions.configuration';
import { FunctionPipe } from '../../../pipes/function.pipe';

@Component({
  selector: 'cms-actions',
  standalone: true,
  imports: [
    CardModule,
    CommonModule,
    ToolbarModule,
    ButtonModule,
    UploadFileComponent,
    TranslateModule,
    FunctionPipe,
  ],
  templateUrl: './cms-actions.component.html',
  styleUrl: './cms-actions.component.scss',
})
export class CmsActionsComponent<T> {
  public cmsActionEnum = CmsActionEnum;

  constructor(public cmsService: CmsService<T>) { }
}
