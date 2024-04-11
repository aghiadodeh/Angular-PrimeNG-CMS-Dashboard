import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { catchError, map, Observable, throwError } from "rxjs";
import { saveAs } from "file-saver";
import { isMoment } from "moment-timezone";
import { inject } from "@angular/core";
import { BaseResponse } from "../../models/responses/base.response";
import { AppError } from "../../models/data/app-error";

export interface BaseHttpConfig {
  params?: any;
  headers?: any;
  context?: any;
}

export class BaseHttpService {
  protected httpClient: HttpClient = inject(HttpClient);
  constructor(protected baseUrl: string) {}

  protected getFullUrl(endPoint: string): string {
    if (endPoint.length == 0) return this.baseUrl;
    return `${this.baseUrl}/${endPoint}`;
  }

  /**
   * download file from api and save it in the disk
   *
   * @param {string} endPoint api endPoint
   * @param {string} filename save file in disk with name
   * @param {string} ext file extension
   * @param {BaseHttpConfig} config base http config
   */
  public download(endPoint: string, filename: string, ext: string, config?: BaseHttpConfig): Observable<any> {
    return this.httpClient
      .get(this.getFullUrl(endPoint), {
        params: config?.params,
        headers: config?.headers,
        observe: "response",
        responseType: "blob",
      })
      .pipe(
        map((res) => {
          if (res && res.body instanceof Blob) {
            saveAs(res.body, `${filename}.${ext}`);
          }
        }),
        catchError((error) => {
          return this.handleError(error);
        }),
      );
  }

  public get<T>(resourceName: string = "", config: BaseHttpConfig = {}): Observable<BaseResponse<T>> {
    return this.httpClient.get<HttpResponse<T>>(this.getFullUrl(resourceName), config).pipe(
      map(this.mapResponse),
      catchError((error) => {
        return this.handleError(error);
      }),
    );
  }

  public post<T>(resourceName: string, body: any = null): Observable<BaseResponse<T>> {
    return this.httpClient.post<HttpResponse<T>>(this.getFullUrl(resourceName), body).pipe(
      map(this.mapResponse),
      catchError((error) => {
        return this.handleError(error);
      }),
    );
  }

  public put<T>(resourceName: string, body: any = null): Observable<BaseResponse<T>> {
    return this.httpClient.put<HttpResponse<T>>(this.getFullUrl(resourceName), body).pipe(
      map(this.mapResponse),
      catchError((error) => {
        return this.handleError(error);
      }),
    );
  }

  public patch<T>(resourceName: string, body: any = null): Observable<BaseResponse<T>> {
    return this.httpClient.patch<HttpResponse<T>>(this.getFullUrl(resourceName), body).pipe(
      map(this.mapResponse),
      catchError((error) => {
        return this.handleError(error);
      }),
    );
  }

  public delete(resourceName: string): Observable<BaseResponse<null>> {
    return this.httpClient.delete<HttpResponse<any>>(this.getFullUrl(resourceName)).pipe(
      map(this.mapResponse),
      catchError((error) => {
        return this.handleError(error);
      }),
    );
  }

  /**
   * map http-response to base-response
   * if your backend return a response not matching with BaseResponse
   * you can override this method inside your service
   * @example
   * ```
   * override mapResponse<T>(response: HttpResponse<T>) {
   *    const body: any = response.body ?? {};
   *    return { data: response.data, success: body.status };
   * }
   * ```
   */
  protected mapResponse<T>(response: HttpResponse<T>): BaseResponse<T> {
    const body: any = response ?? {};
    return {
      data: body.data,
      statusCode: body.statusCode,
      success: body.success,
      message: body.message,
    };
  }

  public parseToFormData(object: any): FormData {
    const keys = Object.keys(object);
    const formData = new FormData();
    for (const key of keys) {
      if (object[key] instanceof Date) {
        object[key] = (object[key] as Date).toISOString();
      }

      if (isMoment(object[key])) object[key] = object[key].format();

      if (Array.isArray(object[key])) {
        const list = [...object[key]];
        for (let i = 0; i < list.length; i++) {
          formData.append(`${key}[${i}]`, list[i] instanceof Object ? JSON.stringify(list[i]) : list[i]);
        }
        continue;
      }

      if (object[key] !== null && typeof object[key] !== "undefined") {
        formData.append(key, object[key]);
      }
    }

    return formData;
  }

  protected handleError(error: Error): Observable<never> {
    if (error instanceof HttpErrorResponse && error.status != 401) {
      const cause = error.error?.error;
      const message = error.error.message ?? error.error;
      this.displayError(message, cause);
      return throwError(() => new AppError(message, cause));
    }
    return throwError(() => new HttpErrorResponse({ error: error.message }));
  }

  /**
   * override this method to display error messages as you wish
   * @param error backend error
   */
  protected displayError(error?: any, cause?: any): void {}
}
