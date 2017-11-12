import { Component, Input, OnInit } from "@angular/core";
import { GuestbookMessage } from "../shared/models/objects-models/guestbook-message.model";
import { GuestbookMessageService } from "./guestbook-message.service";
import { AuthService } from "../auth/auth.service";
import { LoaderService } from "../shared/components/loader/loader.service";

@Component({
    selector: 'app-guestbook-message',
    templateUrl: './guestbook-message.component.html',
    styles: [`
    .author{
        display: inline-block;
        font-style: italic;
        font-size: 12px;
        with: 80%;
    }
    .config{
        //display: inline-block;
        text-align: right;
        font-size: 12px;
        with: 19%;
    }
`]
})
export class GuestbookMessageComponent implements OnInit {
    @Input() guestbookMessage: GuestbookMessage;

    ngOnInit() {
    }

    constructor(
        private guestbookMessageService: GuestbookMessageService,
        private authService: AuthService,
        private loaderService: LoaderService
    ) { }
    onEdit() {
        this.guestbookMessageService.editMessage(this.guestbookMessage);
    }

    onDelete() {
        //enable the loader
        this.loaderService.enableLoader();
        this.guestbookMessageService.deleteMessage(this.guestbookMessage)
            .subscribe(
            data => {
                //disable the loader
                this.loaderService.disableLoader();
            },
            error => {
                //disable the loader
                this.loaderService.disableLoader();
            }
            );
    }

    belongsToUsers() {
        var userId = this.authService.getUserId();
        if (userId == this.guestbookMessage.userId)
            return true;
        else
            return false;
    }
}