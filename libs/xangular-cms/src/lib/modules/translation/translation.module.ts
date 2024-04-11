import { NgModule } from "@angular/core";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

const translateLoader = {
  loader: {
    provide: TranslateLoader,
    useFactory: (http: HttpClient) => new TranslateHttpLoader(http, "./assets/i18n/", ".json"),
    deps: [HttpClient],
  },
};

@NgModule({
  imports: [TranslateModule.forRoot(translateLoader)],
  exports: [TranslateModule],
  providers: [TranslateService],
})
export class SharedTranslationModule {}
