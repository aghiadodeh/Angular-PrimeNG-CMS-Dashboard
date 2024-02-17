import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectChangeEvent, MultiSelectModule } from 'primeng/multiselect';
import { MutliSelectConfiguration } from '../../../models/configurations/forms/mutli-select.configuration';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { withCache } from '@ngneat/cashew';
import { finalize, map } from 'rxjs';
import { CMS_CONFIGURATION } from '../../../configurations/cms.configurations';
import { FunctionPipe } from '../../../pipes/function.pipe';

@Component({
  selector: 'cms-generic-multi-select',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MultiSelectModule,
    FunctionPipe,
  ],
  templateUrl: './generic-multi-select.component.html',
  styleUrl: './generic-multi-select.component.scss',
})
export class GenericMultiSelectComponent implements OnInit {
  @Input() configuration!: MutliSelectConfiguration;
  @Input() disabled: boolean | null = null;
  @Input() option: any;
  @Input() loading: boolean = false;
  @Input() invalid: boolean = false;
  @Output() optionChange: EventEmitter<any> = new EventEmitter();
  @Output() valueChange: EventEmitter<any> = new EventEmitter();

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
      this.fetchOptions(url, queryParams ?? remoteDataConfiguration?.queryParams);
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
    })
  }

  private selectIndex(): void {
    const { index, indexFn } = this.configuration;
    if (!this.option) {
      this.option = [];
      const selectIndexs = index ?? indexFn?.(this.configuration.options) ?? [];
      for (const index of selectIndexs) {
        if (index == -1) continue;
        this.option.push(this.configuration.options[index]);
      }
      this.onChange({ value: this.option });
    }
  }

  public onChange(event: Partial<MultiSelectChangeEvent>) {
    this.optionChange.emit(event.value);
    this.valueChange.emit(event.value.map(e => e[this.configuration.valueBy]));
    this.configuration.onChange?.(event.value);
  }
}
