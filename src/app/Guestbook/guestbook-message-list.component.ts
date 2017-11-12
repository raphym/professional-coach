import { Component, OnInit } from "@angular/core";
import { GuestbookMessage } from "../shared/models/objects-models/guestbook-message.model";
import { GuestbookMessageService } from "./guestbook-message.service";
import { LoaderService } from "../shared/components/loader/loader.service";

@Component({
    selector: 'app-guestbook-message-list',
    template: `
        <div class="col-md-12">
            <app-guestbook-message 
                [guestbookMessage]="guestbookMessage" 
                *ngFor="let guestbookMessage of guestbookMessages">
            </app-guestbook-message>
        </div>
        `
})
export class GuestbookMessageListComponent implements OnInit {
    constructor(private guestbookMessageService: GuestbookMessageService,
        private loaderService: LoaderService) { }
    guestbookMessages: GuestbookMessage[];

    ngOnInit() {
        //enable the loader
        this.loaderService.enableLoader();
        this.guestbookMessageService.getMessage()
            .subscribe(
            (guestbookMessages: GuestbookMessage[]) => {
                this.guestbookMessages = guestbookMessages;
                //disable the loader
                this.loaderService.disableLoader();
            },
            error => {
                //disable the loader
                this.loaderService.disableLoader();
                console.error(error)
            }
            );
    }
}