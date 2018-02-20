import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MailService } from '../shared/services/mail/mail.service';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { ErrorService } from '../shared/components/notif-to-user/errors/error.service';
import { SuccessService } from '../shared/components/notif-to-user/success/success.service';
import { CookieService } from 'angular2-cookie/core';
import { JwtHelper } from "angular2-jwt";
import { UsefulService } from '../shared/services/utility/useful.service';

const HEADER_SIZE = 56;
@Component({
    selector: 'app-contact-me',
    templateUrl: './contact-me.component.html',
    styleUrls: ['./contact-me.component.css']
})
export class ContactMeComponent implements OnInit {

    @ViewChild('f') form: NgForm;
    public envoyer = false;
    public sent = false;
    public connected = false;
    public jwtHelper = new JwtHelper();
    public name = '';
    public email = '';
    public langDirection;
    public langTextAlign;
    public heightPage = window.innerHeight - HEADER_SIZE;
    public widthPage = window.innerWidth;
    public fontSize = 0;

    public constructor(
        public mailService: MailService,
        public successService: SuccessService,
        public errorService: ErrorService,
        public cookieService: CookieService,
        public usefulService: UsefulService) {
    }
    ngOnInit() {
        this.onResize();
        //subscribe to the langage
        this.usefulService.langTransmitter.subscribe(
            config_langage => {
                this.langDirection = config_langage.direction;
                this.langTextAlign = config_langage.textAlign;
            }
        );
        //set langage
        this.usefulService.initLangage();

        var token = this.cookieService.get('token');
        if (token != null && token != '') {

            this.connected = true;
            var decoded_token = this.jwtHelper.decodeToken(token);
            var user = decoded_token.user;
            if (user.userName != undefined)
                this.name = user.userName;
            if (user.email != undefined)
                this.email = user.email;
        }
    }

    onResize() {
        this.heightPage = window.innerHeight - HEADER_SIZE;
        this.widthPage = window.innerWidth;
        this.calculateFontSize();
    }

    //calcul to get the font size
    calculateFontSize() {
        var average_width_height = (this.widthPage + this.heightPage) / 2;
        this.fontSize = average_width_height * (28 / 1280);
    }


    onSubmit(form: NgForm) {

        const value = form.value;
        this.envoyer = true;

        //english mail
        //var mail_content = "You receive a mail from " + value.name + " " + value.email + " : \r\n\r\n";

        //hebrew mail
        var mail_content = "קבלת הודעה";
        mail_content += "\r\n";
        mail_content += "\r\n";
        mail_content += "שם:  ";
        mail_content += value.name;
        mail_content += "\r\n";
        mail_content += "Email: ";
        mail_content += value.email;
        mail_content += "\r\n";
        mail_content += "\r\n";
        mail_content += value.description;
        mail_content += "\r\n";

        //send the mail to the admin
        this.mailService.sendMail('admin', 'G-Fit', mail_content, 'text')
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
        //english
        //var reponsehtml = '<!DOCTYPE html><html><body>Your message has been sent, we will reply to you shortly<br>Thank you <br> Gab Coach</body></html>';
        //hebrew
        var reponsehtml = '<!DOCTYPE html><html><body style="text-align: right;direction: rtl;color: blue;align: right;">ההודעה שלך נשלחה, אנו נענה לך בהקדם<br>תודה<br>G-Fit</body></html>';
        this.mailService.sendMail(value.email, 'G-Fit', reponsehtml, 'html')
            .subscribe(
                data => { },
                error => { }
            );
        if (this.connected)
            this.form.value.description = '';
        else
            this.form.reset();
    }

    markDone() {
        this.sent = true;
        this.envoyer = false;
    }
}
