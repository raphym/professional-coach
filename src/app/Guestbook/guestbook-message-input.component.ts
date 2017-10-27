import { Component, OnInit } from "@angular/core";
import { GuestbookMessageService } from "./guestbook-message.service";
import { GuestbookMessage } from "../models/objects-models/guestbook-message.model";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth/auth.service";

@Component({
    selector: 'app-guestbook-message-input',
    templateUrl: './guestbook-message-input.component.html'
})
export class GuestbookMessageInputComponent implements OnInit {
    guestbookMessage: GuestbookMessage;
    constructor(private guestbookMessageService: GuestbookMessageService, private authService: AuthService) { }

    ngOnInit() {
        this.guestbookMessageService.messageIsEdit.subscribe(
            (message: GuestbookMessage) => {
                this.guestbookMessage = message;
            });
    }

    isLoggedIn() {
        if(this.authService.getUserId()!='')
            return true;
    }

    onSubmit(form: NgForm) {
        if (this.guestbookMessage) {
            //edit
            this.guestbookMessage.content = form.value.content;
            this.guestbookMessageService.updateMessage(this.guestbookMessage)
                .subscribe(
                );
            this.guestbookMessage = null;

        } else {
            //create
            const msg = new GuestbookMessage(form.value.content, '');
            this.guestbookMessageService.addMessage(msg)
                .subscribe(
            );
        }

        form.resetForm();
    }

    onClear(form: NgForm) {
        this.guestbookMessage = null;
        form.resetForm();
    }

}