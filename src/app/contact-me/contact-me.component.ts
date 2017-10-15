import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MailService } from '../services/mail/mail.service';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { ErrorService } from '../notif-to-user/errors/error.service';
import { SuccessService } from '../notif-to-user/success/success.service';


@Component({
    selector: 'app-contact-me',
    templateUrl: './contact-me.component.html',
    styleUrls: ['./contact-me.component.css']
})
export class ContactMeComponent implements OnInit {

    @ViewChild('f') form: NgForm;
    private envoyer = false;
    private sent = false;

    public constructor(private mailService: MailService, private successService: SuccessService, private errorService: ErrorService) { }

    ngOnInit() {
    }

    onSubmit(form: NgForm) {

        const value = form.value;
        this.envoyer = true;

        var mail_content = "You receive a mail from " + value.name + " " + value.email + " : \r\n\r\n";
        mail_content += value.description;

        //send the mail to the admin
        this.mailService.sendMail('admin', 'Gab Coach Contact', mail_content, 'text')
            .subscribe(

            data => {
                this.markDone();
                this.successService.handleSuccess(data.json());
            },
            error => {
                this.markDone();
                this.errorService.handleError(error);
            }
            );
        //send mail back to the user
        var reponsehtml = '<!DOCTYPE html><html><body>Your message has been sent, we will reply to you shortly<br>Thank you <br> Gab Coach</body></html>';
        this.mailService.sendMail(value.email, 'Gab Coach Contact', reponsehtml, 'html')
            .subscribe(
                data => {},
                error => {}
            );
        this.form.reset();
    }

    markDone()
    {
        this.sent=true;
        this.envoyer=false;
    }


}


