import { Component, Input, OnInit } from "@angular/core";
import { GuestbookMessage } from "../models/objects-models/guestbook-message.model";
import { GuestbookMessageService } from "./guestbook-message.service";
import { AuthService } from "../auth/auth.service";

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
        //this.message.content = this.message.content.replace("\n", "<br/>");
    }

    constructor(
        private guestbookMessageService: GuestbookMessageService,
        private authService: AuthService
    ) { }
    onEdit() {
        this.guestbookMessageService.editMessage(this.guestbookMessage);
    }

    onDelete() {
        this.guestbookMessageService.deleteMessage(this.guestbookMessage)
            .subscribe(
            result => console.log(result)
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