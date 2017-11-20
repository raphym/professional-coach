import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs/Observable";
import { CookieService } from 'angular2-cookie/core';
import { UsefulService } from '../../shared/services/utility/useful.service'
import { MailService } from "../../shared/services/mail/mail.service";

const GET_USERS_ADDRESS = "http://localhost:3000/users-management/getUsers";
const EDIT_USER_ADDRESS = "http://localhost:3000/users-management/editUser";
const CHECK_EMAIL_USER_ADDRESS = "http://localhost:3000/users-management/checkEmail";

const SUPPORT_LINK_ADDRESS = "http://localhost:3000/contact";


@Injectable()
export class UserManagementService {

    private CONFIRMATION_REG_LINK_URL: string = "http://localhost:3000/confirmRegistration";
    constructor(private cookieService: CookieService,
        private http: Http,
        private usefulService: UsefulService,
        private mailService: MailService) {

    }
    getUsers() {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.get(GET_USERS_ADDRESS, { headers: headers })
            .map((response: Response) => {
                return response.json();
            })
            .catch((error: Response) => {
                return Observable.throw(error.json());
            });
    }

    //edit a user
    editUser(fields, emailChanged, email, firstName, lastName) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        //check if the user change his email
        //because if yes , we have to update his registered status.
        if (emailChanged) {
            //check if the new email is already used
            const body = JSON.stringify({ email: email });
            return new Promise((resolve, reject) => {
                this.http.post(CHECK_EMAIL_USER_ADDRESS, body, { headers: headers })
                    .toPromise()
                    .then(
                    (res) => {
                        //The mail is ok we can now edit the user
                        //Edit the user
                        //body is the fields object
                        fields.changeEmail = true;
                        const body = JSON.stringify(fields);
                        this.http.post(EDIT_USER_ADDRESS, body, { headers: headers })
                            .subscribe(
                            (data) => {
                                //success to edit the user , now send the confirm mail
                                var keys = data.json().keys;
                                var randomSecretCode = keys.randomSecretCode;
                                var randomHash = keys.randomHash;

                                this.CONFIRMATION_REG_LINK_URL += '/';
                                this.CONFIRMATION_REG_LINK_URL += randomHash;

                                //content of the mail
                                var mail_content = this.usefulService.createRegMail(firstName,
                                    lastName,
                                    randomSecretCode,
                                    this.CONFIRMATION_REG_LINK_URL,
                                    SUPPORT_LINK_ADDRESS);
                                this.mailService.sendMail(email,
                                    'Confirm User Email',
                                    mail_content,
                                    'html'
                                )
                                    .subscribe(
                                    (data) => {
                                        //success to send the confirm mail
                                        var my_response = { title: 'User Edited', message: 'Please confirm the new email address' };
                                        resolve(my_response);
                                    },
                                    (error) => {
                                        //error to send the confirm mail
                                        var email_error = { title: 'Error', message: 'Error when sending the confirmation mail, please contact the admin' };
                                        reject(email_error);
                                    });
                            },
                            (error) => {
                                //error to edit the user
                                reject(error.json());
                            });
                    },
                    (error) => {
                        //error email alread used
                        reject(error.json());
                    });
            });
        }
        else {
            //the field email is not modified
            //so we don't need to send a confirm mail
            //body is the fields object
            const body = JSON.stringify(fields);
            return new Promise((resolve, reject) => {
                this.http.post(EDIT_USER_ADDRESS, body, { headers: headers })
                    .toPromise()
                    .then(
                    (res) => {
                        //success to edit the user
                        resolve(res.json());
                    },
                    (error) => {
                        //error to edit the user
                        reject(error.json());
                    });
            });
        }
    }

}