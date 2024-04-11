import { Component, Input, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CmsService } from "../../../services/cms.service";
import { ActivatedRoute, Params } from "@angular/router";
import { finalize } from "rxjs";
import { ProgressBarModule } from "primeng/progressbar";
import { DataResult, LoadingResult, Result } from "../../../models/data/result";
import { PageTitleService } from "../../../services/pages/page.title.service";

@Component({
  selector: "cms-view-details",
  standalone: true,
  imports: [CommonModule, ProgressBarModule],
  templateUrl: "./cms-view-details.component.html",
  styleUrl: "./cms-view-details.component.scss",
})
export class CmsViewDetailsComponent<T> {
  @Input() title?: string;
  @Input() result: Result<T> = new LoadingResult<T>();
}

@Component({ template: "" })
export abstract class BaseViewDetailsComponent<T> implements OnInit {
  public result: Result<T> = new LoadingResult();
  protected activatedRoute = inject(ActivatedRoute);
  protected pageTitleService = inject(PageTitleService);

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      const id = params["id"];
      if (id) this.fetchData(id);
    });
  }

  protected abstract fetchData(id: string): void;

  protected setResult(result: T): void {
    this.result = new DataResult(result);
    const title = this.title(result);
    this.pageTitleService.setTitle(title);
  }

  abstract title(item: T): string | undefined;
}

@Component({ template: "" })
export abstract class ViewDetailsComponent<T> extends BaseViewDetailsComponent<T> {
  protected cmsService = inject(CmsService<T>);

  override fetchData(id: string): void {
    this.cmsService
      .findOne(id)
      .pipe(finalize(() => this.result.loading$.next(false)))
      .subscribe({
        next: (result: T) => {
          this.setResult(result);
        },
      });
  }
}
