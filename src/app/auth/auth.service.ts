import { Injectable, EventEmitter } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { User } from "../shared/models/objects-models/user.model";
import { Observable } from "rxjs/Observable";
import { CookieService } from 'angular2-cookie/core';
import { ErrorService } from "../shared/components/notif-to-user/errors/error.service";
import { Router } from "@angular/router";
import { SuccessService } from "../shared/components/notif-to-user/success/success.service";
import { MailService } from "../shared/services/mail/mail.service";

const SIGNUP_ADDRESS = 'http://localhost:3000/user/signup';
const SIGNIN_ADDRESS = 'http://localhost:3000/user/signin';
const ISLOGIN_ADDRESS = 'http://localhost:3000/user/islogin';

const SUPPORT_LINK_ADDRESS = "http://localhost:3000/contact";
const CONFIRMATION_REG_INIT_ADDRESS = "http://localhost:3000/user/confirmRegInit";
const CONFIRMATION_REG_VALID_ADDRESS = "http://localhost:3000/user/confirmRegValidation";


@Injectable()
export class AuthService {

    userLogInEvent = new EventEmitter<{}>();
    userLogOutEvent = new EventEmitter<any>();

    private isConnect = false;
    private _id = '';
    private isAdmin = false;
    private firstName = '';
    private lastName = '';
    private email = '';
    private CONFIRMATION_REG_LINK_URL = "http://localhost:3000/confirmRegistration";


    constructor(private http: Http,
        private errorService: ErrorService,
        private successService: SuccessService,
        private cookieService: CookieService,
        private mailService: MailService,
        private router: Router
    ) { }

    //signup
    signup(user: User) {

        var randomSecretCode = this.makeRandomString(6);
        var randomHash = this.makeRandomString(20);

        this.CONFIRMATION_REG_LINK_URL += '/';
        this.CONFIRMATION_REG_LINK_URL += randomHash;


        user.randomSecretCode = randomSecretCode;
        user.randomHash = randomHash;

        const body = JSON.stringify(user);
        const headers = new Headers({ 'Content-Type': 'application/json' });


        return new Promise((resolve, reject) => {

            //go to signup the new user
            this.http.post(SIGNUP_ADDRESS, body, { headers: headers })
                .toPromise()
                .then(


                (res) => {
                    //success to create the user , now send the confirm mail

                    var mail_content = this.createRegMail(user.firstName,
                        user.lastName,
                        randomSecretCode,
                        this.CONFIRMATION_REG_LINK_URL,
                        SUPPORT_LINK_ADDRESS);

                    //send a confirm email to the new user
                    this.mailService.sendMail(user.email, 'Registration', mail_content, 'html')
                        .subscribe(

                        data => {
                            //if success sending return a success message to the user
                            var my_response = {
                                title: 'Validate your account',
                                message: 'Confirm your account by confirming the email'
                            };
                            this.successService.handleSuccess(my_response);
                            resolve(data);
                        },
                        error => {
                            //error to send the mail
                            this.errorService.handleError(error);
                            resolve(error);
                        }
                        );
                },

                error => {
                    //error to create the user
                    this.errorService.handleError(error.json());
                    reject(error);
                }
                );
        });


    }

    //confirmation registration init
    confirmRegInit(randomHash: string) {
        const body = JSON.stringify({ randomHash: randomHash });
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(CONFIRMATION_REG_INIT_ADDRESS, body, { headers: headers })
            .map((response: Response) => {
                if (response.json().title == 'Success') {
                    return response.json();
                }
            })
            .catch((error: Response) => {
                    return Observable.throw(error.json());
            });
    }

    //confirmation registration Validate
    confirmRegValid(randomHash: string, secretCode: string) {
        const body = JSON.stringify({ randomHash: randomHash, secretCode: secretCode });
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(CONFIRMATION_REG_VALID_ADDRESS, body, { headers: headers })
            .map((response: Response) => {
                if (response.json().title == 'Success') {
                    return response.json();
                }
            })
            .catch((error: Response) => {
                    return Observable.throw(error.json());
            });
    }

    //signin
    signin(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(SIGNIN_ADDRESS, body, { headers: headers })
            .map((response: Response) => {
                var data = response.json().data;
                if (response.json().message == 'Successfully logged in') {

                    if (data.levelRights == null) {
                        this.logout(true);
                        this.userLogOutEvent.emit();
                    }

                    if (data.levelRights >= 200)
                        this.isAdmin = true;

                    this._id = data._id;
                    this.isConnect = true;
                    this.firstName = data.firstName;
                    this.lastName = data.lastName;
                    this.email = data.email;
                    this.userLogInEvent.emit(data);

                    return response.json()
                }
                else {
                    this.logout(true);
                    this.userLogOutEvent.emit();
                    return response.json()
                }
            })
            .catch((error: Response) => {
                this.logout(true);
                this.userLogOutEvent.emit();
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }

    //check if logged in
    isLoggedIn() {
        const body = '';
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(ISLOGIN_ADDRESS, body, { headers: headers })
            .map((response: Response) => {
                if (response.json().message == 'Authenticated') {
                    var data = response.json().data;

                    if (data == null || data.user == null) {
                        this.logout(false);
                        this.userLogOutEvent.emit();
                    }

                    if (data.user.levelRights >= 200)
                        this.isAdmin = true;
                    this._id = data.user._id;
                    this.isConnect = true;
                    this.firstName = data.user.firstName;
                    this.lastName = data.user.lastName;
                    this.email = data.user.email;
                    this.userLogInEvent.emit(data.user);
                    return response.json()

                }
                else {
                    this.logout(false);
                    this.userLogOutEvent.emit();
                    return response.json()
                }
            })
            .catch((error: Response) => {
                this.logout(false);
                this.userLogOutEvent.emit();
                return Observable.throw(error.json())
            });
    }

    //logout
    logout(redirect: boolean) {
        try {
            this.cookieService.remove('token');
        } catch (e) {

        }
        this.isConnect = false;
        this._id = '';
        this.isAdmin = false;
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        if (redirect == true)
            this.router.navigateByUrl('/');
    }


    //return true if connect
    isItConnect() {
        return this.isConnect;
    }

    //return true if Admin
    isItAdmin() {
        return this.isAdmin;
    }
    //get the user_id connected
    getUserId() {
        return this._id;
    }

    // get the firstName of the connected
    getFirstName() {
        return this.firstName;
    }
    // get the lastName of the connected
    getLastName() {
        return this.lastName;
    }

    //get the Email of the connected
    getEmail() {
        return this.email;
    }

    //create a registration template mail
    createRegMail(firstName: String, lastName: String, secretCode: string, link: string, supportLink: string) {
        var mail_content = `
        <h1 style="color: #5e9ca0;">Hi , ` + firstName + ' ' + lastName + ` </h1>
        <p><span style="color: #0000ff;">Please confirm your registration by following the instructions:<br />1) Copy the secret code<br />2) Click on the link<br />3) Past the secret code into the confirm page</span></p>
        <p style="text-align: center;"><span style="text-decoration: underline;">Secret Code:</span><strong>  `+ secretCode + `</strong></p>
        <p style="text-align: center;"><span style="text-decoration: underline;">Link:</span><strong>  <a href="`+ link + `" target="_blank" rel="noopener">Confirm</a></strong></p>
        <p><br /><span style="color: #ff0000;">If you have a problem please&nbsp;<a href="`+ supportLink + `" target="_blank" rel="noopener">contact us</a></span></p>
        <p>Coach</p>
        `;
        return mail_content;
    }

    //create a random string
    makeRandomString(nums: number) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 1; i < nums; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
}