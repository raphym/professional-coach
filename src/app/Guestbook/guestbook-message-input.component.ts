import { Component, OnInit } from "@angular/core";
import { GuestbookMessageService } from "./guestbook-message.service";
import { GuestbookMessage } from "../shared/models/objects-models/guestbook-message.model";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth/auth.service";
import { LoaderService } from "../shared/components/loader/loader.service";

@Component({
    selector: 'app-guestbook-message-input',
    templateUrl: './guestbook-message-input.component.html'
})
export class GuestbookMessageInputComponent implements OnInit {
    guestbookMessage: GuestbookMessage;
    constructor(public guestbookMessageService: GuestbookMessageService,
        public authService: AuthService,
        public loaderService: LoaderService) { }

    ngOnInit() {
        //enable the loader
        this.loaderService.enableLoader();
        this.guestbookMessageService.messageIsEdit.subscribe(
            (message: GuestbookMessage) => {
                //disable the loader
                this.loaderService.disableLoader();
                this.guestbookMessage = message;
            });
    }

    isLoggedIn() {
        return this.authService.isItConnect();
    }

    onSubmit(form: NgForm) {
        if (this.guestbookMessage) {
            //edit
            this.guestbookMessage.content = form.value.content;
            //enable the loader
            this.loaderService.enableLoader();
            this.guestbookMessageService.updateMessage(this.guestbookMessage)
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
            this.guestbookMessage = null;

        } else {
            //create
            const msg = new GuestbookMessage(form.value.content, '');
            //enable the loader
            this.loaderService.enableLoader();
            this.guestbookMessageService.addMessage(msg)
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

        form.resetForm();
    }

    onClear(form: NgForm) {
        this.guestbookMessage = null;
        form.resetForm();
    }

}