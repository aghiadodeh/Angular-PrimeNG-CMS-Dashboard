import { Component, EventEmitter, Input, OnInit, Output, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AutoCompleteConfiguration } from "../../../models/configurations/forms/auto-complete.configuration";
import { HttpClient } from "@angular/common/http";
import { CacheBucket, HttpCacheManager, withCache } from "@ngneat/cashew";
import { AutoCompleteModule, AutoCompleteCompleteEvent } from "primeng/autocomplete";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { map } from "rxjs";
import { CMS_CONFIGURATION } from "../../../models/configurations/crud/cms.configurations";
import { FunctionPipe } from "../../../pipes/function.pipe";

@Component({
  selector: "cms-generic-auto-complete",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, AutoCompleteModule, FunctionPipe],
  templateUrl: "./generic-auto-complete.component.html",
  styleUrl: "./generic-auto-complete.component.scss",
})
export class GenericAutoCompleteComponent implements OnInit {
  @Input() configuration!: AutoCompleteConfiguration;
  @Input() disabled: boolean | null = null;
  @Input() option: any;
  @Input() invalid: boolean = false;
  @Output() optionChange: EventEmitter<any> = new EventEmitter();
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  public suggestions: any[] = [];
  private selected = false;

  private httpClient = inject(HttpClient);
  private apiUrl = inject(CMS_CONFIGURATION).CMS_API_URL;
  private cacheManager = inject(HttpCacheManager);
  private cacheBucket = new CacheBucket();

  ngOnInit(): void {
    const { remoteDataConfiguration, optionsFn } = this.configuration;
    const { endPoint, queryParams, endPoint$ } = remoteDataConfiguration ?? {};
    if (this.configuration.options.length > 0) {
      this.selectIndex();
    }

    if (optionsFn) {
      this.configuration.options = optionsFn();
      this.selectIndex();
    }

    if (endPoint) {
      this.fetchOptions(endPoint, queryParams);
    }
    endPoint$?.subscribe(({ url, queryParams, clearCache }) => {
      if (clearCache) this.cacheManager.delete(this.cacheBucket);
      if (url) remoteDataConfiguration!.endPoint = url;
      if (queryParams) remoteDataConfiguration!.queryParams = queryParams;
      this.fetchOptions(url ?? remoteDataConfiguration!.endPoint!, queryParams ?? remoteDataConfiguration?.queryParams);
    });
  }

  public search(event: AutoCompleteCompleteEvent) {
    const { remoteDataConfiguration } = this.configuration;
    if (remoteDataConfiguration) {
      const { endPoint, queryParams } = remoteDataConfiguration;
      const searchKey = this.configuration.filterBy;
      this.fetchOptions(endPoint!, {
        ...queryParams,
        [searchKey]: event.query,
      });
    } else {
      this.filter(this.configuration.options, event);
    }
  }

  public fetchOptions(endPoint: string, queryParams?: any): void {
    const { mapHttpResponse } = this.configuration.remoteDataConfiguration!;
    this.httpClient
      .get<any>(`${this.apiUrl}/${endPoint}`, {
        params: queryParams,
        context: withCache({ bucket: this.cacheBucket }),
      })
      .pipe(map(mapHttpResponse))
      .subscribe({
        next: (response: any[]) => {
          this.configuration.options = response;
          this.filter(response);
          this.selectIndex();
        },
      });
  }

  private selectIndex(): void {
    if (!this.selected) {
      this.selected = true;
      const { index, indexFn, multiple } = this.configuration;
      if (!this.option) {
        if (multiple == true) {
          this.option = [];
          const selectIndexs = (index ?? indexFn?.(this.configuration.options) ?? []) as number[];
          for (const index of selectIndexs) {
            if (index == -1) continue;
            this.option.push(this.configuration.options[index]);
          }
          this.onChange(this.option);
        } else {
          const selectIndex = (index ?? indexFn?.(this.configuration.options) ?? -1) as number;
          if (selectIndex != -1) {
            this.option = this.configuration.options[selectIndex];
            this.onChange(this.option);
          }
        }
      }
    }
  }

  public onChange(event: any | any[]) {
    this.optionChange.emit(event);
    this.configuration.onChange?.(event);
    if (Array.isArray(event)) {
      this.valueChange.emit(event.map((e) => e[this.configuration.valueBy]));
    } else {
      this.valueChange.emit(event ? event[this.configuration.valueBy] : null);
    }
  }

  public filter(result: any[], event?: AutoCompleteCompleteEvent) {
    const { filterBy } = this.configuration;
    if (!event) {
      this.suggestions = [...result];
    } else {
      if (this.configuration.group == true) {
        const suggestions: any[] = [];
        for (const optgroup of result) {
          const items = optgroup.items.filter((item: any) =>
            `${item[filterBy]}`.toLocaleLowerCase().includes(event.query.toLocaleLowerCase()),
          );
          if (items && items.length > 0) {
            suggestions.push({
              label: optgroup.label,
              value: optgroup.value,
              items,
            });
          }
        }
        this.suggestions = suggestions;
      } else {
        this.suggestions = result.filter((item: any) =>
          `${item[filterBy]}`.toLocaleLowerCase().includes(event.query.toLocaleLowerCase()),
        );
      }
    }
  }
}
