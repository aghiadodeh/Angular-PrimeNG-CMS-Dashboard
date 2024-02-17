import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule, DropdownChangeEvent } from 'primeng/dropdown';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollerOptions } from 'primeng/api/scrolleroptions';
import { DropdownConfiguration } from '../../../models/configurations/forms/dropdown.configuration';
import { HttpClient } from '@angular/common/http';
import { finalize, map } from 'rxjs';
import { withCache } from '@ngneat/cashew';
import { CMS_CONFIGURATION } from '../../../configurations/cms.configurations';
import { FunctionPipe } from '../../../pipes/function.pipe';

@Component({
  selector: 'cms-generic-dropdown',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    DropdownModule,
    FunctionPipe,
  ],
  templateUrl: './generic-dropdown.component.html',
  styleUrl: './generic-dropdown.component.scss',
})
export class GenericDropdownComponent implements OnInit {
  @Input() configuration!: DropdownConfiguration;
  @Input() disabled: boolean | null = null;
  @Input() option: any;
  @Input() loading: boolean = false;
  @Input() invalid: boolean = false;
  @Output() optionChange: EventEmitter<any> = new EventEmitter();
  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  public options: ScrollerOptions = {
    lazy: true,
  }

  private httpClient = inject(HttpClient);
  private apiUrl = inject(CMS_CONFIGURATION).CMS_API_URL;

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
    endPoint$?.subscribe(({ url, queryParams }) => {
      if (url) remoteDataConfiguration!.endPoint = url;
      if (queryParams) remoteDataConfiguration!.queryParams = queryParams;
      this.fetchOptions(url ?? remoteDataConfiguration!.endPoint!, queryParams ?? remoteDataConfiguration?.queryParams);
    });
  }

  private fetchOptions(endPoint: string, queryParams?: any): void {
    this.loading = true;
    const { mapHttpResponse } = this.configuration.remoteDataConfiguration!;
    this.configuration.options = [];
    this.httpClient.get<any>(`${this.apiUrl}/${endPoint}`, {
      params: queryParams,
      context: withCache(),
    }).pipe(
      finalize(() => this.loading = false),
      map(mapHttpResponse),
    ).subscribe({
      next: (response: any[]) => {
        this.configuration.options = response;
        this.selectIndex();
      },
    });
  }

  private selectIndex(): void {
    const { index, indexFn } = this.configuration;
    if (!this.option) {
      const selectIndex = index ?? indexFn?.(this.configuration.options) ?? -1;
      if (selectIndex != -1) {
        this.option = this.configuration.options[selectIndex];
        this.onChange({ value: this.option });
      }
    }
  }

  public onChange(event: Partial<DropdownChangeEvent>) {
    this.optionChange.emit(event.value);
    this.valueChange.emit(event.value?.[this.configuration.valueBy]);
    this.configuration.onChange?.(event.value);
  }
}
