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

        var mail_content = '';
        var reponsehtml = '';
        var messageTitleOk = '';
        var messageContentOk = '';
        var messageTitleNotOk = '';
        var messageContentNotOk = '';
        if (this.usefulService.getLangage() == 'he') {
            //to the admin
            mail_content = "קבלת הודעה";
            mail_content += "\r\n";
            mail_content += "\r\n";
            mail_content += "שם:  ";
            mail_content += value.name;
            mail_content += "\r\n";
            mail_content += "Email: ";
            mail_content += value.email;
            mail_content += "\r\n";
            mail_content += "\r\n";
            mail_content += value.phone;
            mail_content += "\r\n";

            //to the user
            reponsehtml = '<!DOCTYPE html><html><body style="text-align: right;direction: rtl;color: blue;align: right;">פרטיך נקלטו בהצלחה, נחזור אלייך בהקדם. תודה שבחרת G-Fit !<br><br>צוות G-Fit</body></html>';

            //return message
            messageTitleOk = 'צוות G-Fit';
            messageContentOk = 'פרטיך נקלטו בהצלחה, נחזור אלייך בהקדם. תודה שבחרת G-Fit !';
            messageTitleNotOk = 'סליחה';
            messageContentNotOk = 'אירעה שגיאה בעת שליחת ההודעה';
        }
        else if (this.usefulService.getLangage() == 'en') {
            //to the admin
            mail_content = "You receive a mail from " + value.name + " " + value.email + " : \r\n\r\n";
            mail_content += value.phone;
            mail_content += "\r\n";

            //to the user
            reponsehtml = '<!DOCTYPE html><html><body style="text-align: left;direction: ltr;color: blue;align: left;">Your details have been registered, we will contact you as soon as possible. Thank you for choosing G-Fit !<br><br>G-Fit Team</body></html>';

            //return message
            messageTitleOk = 'G-Fit Team';
            messageContentOk = 'Your details have been registered, we will contact you as soon as possible. Thank you for choosing G-Fit!';
            messageTitleNotOk = 'Sorry';
            messageContentNotOk = 'An error occurred while sending the message';
        } else if (this.usefulService.getLangage() == 'fr') {
            //to the admin
            mail_content = "Vous avez reçu un mail de " + value.name + " " + value.email + " : \r\n\r\n";
            mail_content += value.phone;
            mail_content += "\r\n";

            //to the user
            reponsehtml = '<!DOCTYPE html><html><body style="text-align: left;direction: ltr;color: blue;align: left;" >Vos coordonnées ont bien été enregistrée, nous vous contacterons au plus vite. Merci d\'avoir choisis G-Fit !<br><br>Équipe G-Fit</body></html>';

            //return message
            messageTitleOk = 'Équipe G-Fit';
            messageContentOk = 'Vos coordonnées ont bien été enregistrée, nous vous contacterons au plus vite. Merci d\'avoir choisis G-Fit !';
            messageTitleNotOk = 'Désolé';
            messageContentNotOk = 'Une erreur s\'est produite pendant l\'envoi du message';
        }

        //send the mail to the admin
        this.mailService.sendMail('admin', 'G-Fit', mail_content, 'text')
            .subscribe(
                data => {
                    //send mail back to the user
                    this.mailService.sendMail(value.email, 'G-Fit', reponsehtml, 'html')
                        .subscribe(
                            data => {
                                this.markDone();
                                this.successService.handleSuccess({ title: messageTitleOk, message: messageContentOk });
                            },
                            error => {
                                this.markDone();
                                this.errorService.handleError({ title: messageTitleNotOk, message: messageContentNotOk });
                            }
                        );
                },
                error => {
                    this.markDone();
                    this.errorService.handleError({ title: messageTitleNotOk, message: messageContentNotOk });
                }
            );
        if (this.connected)
            this.form.value.phone = '';
        else
            this.form.reset();
    }

    markDone() {
        this.sent = false;
        this.envoyer = false;
    }
}
