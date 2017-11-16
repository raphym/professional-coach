import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs/Observable";
import { CookieService } from 'angular2-cookie/core';
import { UsefulService } from '../../shared/services/utility/useful.service'
import { MailService } from "../../shared/services/mail/mail.service";

const GET_USERS_ADDRESS = "http://localhost:3000/users-management/getUsers";
const EDIT_USER_ADDRESS = "http://localhost:3000/users-management/editUser";
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

            //generate randomSecretCode and randomHash
            var randomSecretCode = this.usefulService.makeRandomString(6);
            var randomHash = this.usefulService.makeRandomString(20);

            fields.labels.push('randomSecretCode');
            fields.labels.push('randomHash');
            fields.labels.push('registered');


            fields.values.push(randomSecretCode);
            fields.values.push(randomHash);
            fields.values.push(false);

            //body is the fields object
            const body = JSON.stringify(fields);

            //create the confirm url to put in the mail
            this.CONFIRMATION_REG_LINK_URL += '/';
            this.CONFIRMATION_REG_LINK_URL += randomHash;

            //content of the mail
            var mail_content = this.usefulService.createRegMail(firstName,
                lastName,
                randomSecretCode,
                this.CONFIRMATION_REG_LINK_URL,
                SUPPORT_LINK_ADDRESS);

            //promise to be sur to do the actions in the order
            //first we send a confirm email
            //second we edit the user profile if the mail sent
            return new Promise((resolve, reject) => {
                //Send the mail to confirm it
                this.mailService.sendMail(email, 'Change your mail', mail_content, 'html')
                    .toPromise()
                    .then(

                    (res) => {
                        //if success so edit the user
                        return this.http.post(EDIT_USER_ADDRESS, body, { headers: headers })
                            .toPromise()
                            .then(
                            (res) => {
                                //if success to edit the user return the response
                                resolve(res.json());
                            },
                            (error) => {
                                //if error to edit the user return the error
                                reject(error.json());
                            }
                            );
                    },
                    (error) => {
                        //if error to send the confirm mail return the error
                        reject(error);
                    }
                    );
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