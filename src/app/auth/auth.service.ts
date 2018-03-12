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
import { UsefulService } from "../shared/services/utility/useful.service";

const SIGNUP_ADDRESS = 'http://localhost:3000/users-auth/signup';
const SIGNIN_ADDRESS = 'http://localhost:3000/users-auth/signin';
const FORGOT_PASSWORD_ADDRESS = 'http://localhost:3000/users-auth/forgotPassword';

const ISLOGIN_ADDRESS = 'http://localhost:3000/users-auth/islogin';

const SUPPORT_LINK_ADDRESS = "http://localhost:3000/contact";
const CONFIRMATION_REG_INIT_ADDRESS = "http://localhost:3000/users-auth/confirmRegInit";
const CONFIRMATION_REG_VALID_ADDRESS = "http://localhost:3000/users-auth/confirmRegValidation";
const CONFIRMATION_FORGOT_PASSWORD_ADDRESS = "http://localhost:3000/users-auth/confirmForgotPassword";

import { FacebookService, InitParams, LoginResponse } from 'ngx-facebook';


@Injectable()
export class AuthService {

    userLogInEvent = new EventEmitter<{}>();
    userLogOutEvent = new EventEmitter<any>();

    public isConnect = false;
    public _id = '';
    public isAdmin = false;
    public userName = '';
    public firstName = '';
    public lastName = '';
    public email = '';
    public CONFIRMATION_REG_LINK_URL = "http://localhost:3000/confirmRegistration";

    constructor(public http: Http,
        public errorService: ErrorService,
        public successService: SuccessService,
        public cookieService: CookieService,
        public mailService: MailService,
        public router: Router,
        public usefulService: UsefulService,
        public fb: FacebookService
    ) {

        //change for prod
        let initParams: InitParams = {
            appId: '330446087441402',
            xfbml: true,
            version: 'v2.8'
        };

        fb.init(initParams);
    }


    //login with facebook
    fbLogin() {
        return new Promise((resolve, reject) => {
            /* {scope:'email'}*/
            this.fb.login({ scope: 'email' })
                .then((result: LoginResponse) => {
                    console.log('auth.service fblogin');
                    console.log(result);
                    return this.http.post(`http://localhost:3000/users-auth/auth/facebook`, { access_token: result.authResponse.accessToken })
                        .toPromise()
                        .then(response => {

                            var data = response.json().data;
                            var my_error = { title: "Error", message: "An error has occured" };
                            if (response.json().message == 'Successfully logged in') {

                                if (data.levelRights == null) {
                                    this.logout(true);
                                    this.userLogOutEvent.emit();
                                    reject(my_error);
                                }

                                if (data.levelRights >= 200)
                                    this.isAdmin = true;

                                this._id = data._id;
                                this.isConnect = true;
                                this.userName = data.userName;
                                this.email = data.email;
                                this.userLogInEvent.emit(data);

                                resolve(response.json());
                            }
                            else {
                                this.logout(true);
                                this.userLogOutEvent.emit();
                                reject(my_error);
                            }

                        })
                        .catch((error) => {
                            console.log('error fb login server side');
                            this.logout(false);
                            this.userLogOutEvent.emit();
                            reject(error.json());
                        });
                })
                .catch((error: any) => {
                    console.log('error fb login client side');
                    console.error(error);
                    this.logout(false);
                    this.userLogOutEvent.emit();
                    reject(error.json());
                });
        });
    }

    //signup
    signup(user: User) {

        const body = JSON.stringify(user);
        const headers = new Headers({ 'Content-Type': 'application/json' });


        return new Promise((resolve, reject) => {

            //go to signup the new user
            this.http.post(SIGNUP_ADDRESS, body, { headers: headers })
                .toPromise()
                .then(

                    (res) => {
                        //success to create the user , now send the confirm mail
                        var user = res.json().user;
                        var randomHash = user.randomHash;
                        var randomSecretCode = user.randomSecretCode;

                        this.CONFIRMATION_REG_LINK_URL += '/';
                        this.CONFIRMATION_REG_LINK_URL += randomHash;

                        var mail_content = this.usefulService.createRegMail(user.userName,
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
                    this.userName = data.userName;
                    this.email = data.email;
                    this.userLogInEvent.emit(data);

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
                    this.userName = data.user.userName;
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
        this.userLogOutEvent.emit();
        this.isConnect = false;
        this._id = '';
        this.isAdmin = false;
        this.userName = '';
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        if (redirect == true)
            this.router.navigateByUrl('/');
    }

    //forgotPassword
    forgotPassword(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(FORGOT_PASSWORD_ADDRESS, body, { headers: headers })
            .map((response: Response) => {
                var data = response.json().data;
                return response.json()
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }

    //confirmation forgot Password Init
    confirmForgotPasswordInit(randomHash: string) {
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

    //confirmation forgot Password
    confirmForgotPassword(email: string, randomHash: string, password: string, confirmPassword: string) {
        const body = JSON.stringify({ email: email, randomHash: randomHash, password: password, confirmPassword: confirmPassword });
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(CONFIRMATION_FORGOT_PASSWORD_ADDRESS, body, { headers: headers })
            .map((response: Response) => {
                if (response.json().message == 'success') {
                    return response.json();
                }
            })
            .catch((error: Response) => {
                return Observable.throw(error.json());
            });
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

    //get username
    getUserName() {
        return this.userName;
    }

}