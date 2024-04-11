import { inject } from "@angular/core";
import { MessageService } from "primeng/api";
import { BaseHttpService } from "./base-http.service";
import { HttpCacheManager, CacheBucket, withCache } from "@ngneat/cashew";
import { HttpContext } from "@angular/common/http";

export class CommonHttpService extends BaseHttpService {
  protected messageService = inject(MessageService);
  protected cacheManager = inject(HttpCacheManager);
  protected cacheBucket = new CacheBucket();
  protected get cacheContext(): HttpContext | undefined {
    return withCache({
      bucket: this.cacheBucket,
    });
  }

  constructor(baseUrl: string) {
    super(baseUrl);
  }

  public invalidateCache(): void {
    this.cacheManager.delete(this.cacheBucket);
  }

  protected override displayError(error?: any, cause?: any): void {
    console.error("error", error);

    if (!error) return;
    this.messageService.add({
      key: "main-toast",
      severity: "error",
      summary: "",
      detail: error,
    });
  }
}
