import { inject } from "@angular/core";
import { MessageService } from "primeng/api";
import { BaseHttpService } from "./base-http.service";

export class CommonHttpService extends BaseHttpService {
    protected messageService = inject(MessageService);
    constructor(baseUrl: string) {
        super(baseUrl);
    }

    protected override displayError(error?: any): void {
        if (!error) return;
        this.messageService.add({
            key: 'main-toast',
            severity: 'error',
            summary: '',
            detail: error,
        });
    }
}