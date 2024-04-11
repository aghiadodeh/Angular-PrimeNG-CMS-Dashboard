import { EventEmitter } from "@angular/core";

export interface RemoteDataConfiguration {
  endPoint?: string;
  queryParams?: any;

  /**
   * @description use event-emitter emit dropdown re-fetch data with new endPoint
   * user this when this dropdown depend on dynamic endPoint parameters like (id, query)
   */
  endPoint$?: EventEmitter<{ url: string; queryParams?: any; clearCache?: boolean }>;

  mapHttpResponse: <T>(response: any) => T[];
}
