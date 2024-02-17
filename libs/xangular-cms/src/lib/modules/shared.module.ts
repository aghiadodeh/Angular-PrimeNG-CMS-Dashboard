import { NgModule } from "@angular/core";
import { SharedTranslationModule } from "./translation/translation.module";
import { MessageService } from "primeng/api";
import { NgEventBus } from 'ng-event-bus';

@NgModule({
    imports: [
        SharedTranslationModule,
    ],
    exports: [
        SharedTranslationModule,
    ],
    providers: [
        MessageService,
        NgEventBus,
    ],
})
export class AppSharedModule { }