import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsService } from '../../../services/cms.service';
import { ActivatedRoute, Params } from '@angular/router';
import { finalize } from 'rxjs';
import { ProgressBarModule } from 'primeng/progressbar';
import { DataResult, LoadingResult, Result } from '../../../models/data/result';
import { PageTitleService } from '../../../services/pages/page.title.service';

@Component({
  selector: 'cms-view-details',
  standalone: true,
  imports: [
    CommonModule,
    ProgressBarModule,
  ],
  templateUrl: './cms-view-details.component.html',
  styleUrl: './cms-view-details.component.scss',
})
export class CmsViewDetailsComponent<T> {
  @Input() title?: string;
  @Input() result: Result<T> = new LoadingResult<T>();
}

export abstract class ViewDetailsComponent<T> {
  abstract title: (item: T) => string | undefined;
  protected result: Result<T> = new LoadingResult();
  protected cmsService = inject(CmsService<T>);
  protected activatedRoute = inject(ActivatedRoute);
  protected pageTitleSerivce = inject(PageTitleService);

  constructor() {
    this.activatedRoute.params.subscribe((params: Params) => {
      const id = params['id'];
      if (id) this.fetchData(id);
    });
  }

  protected fetchData(id: string): void {
    this.cmsService.findOne(id)
      .pipe(finalize(() => this.result.loading$.next(false)))
      .subscribe({
        next: (result: T) => { this.setResult(result); },
      });
  }

  protected setResult(result: T): void {
    this.result = new DataResult(result);
    setTimeout(() => {
      this.pageTitleSerivce.setTitle(this.title(result));
    });
  }
}
