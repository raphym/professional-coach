import { Injectable, EventEmitter } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { User } from "../models/objects-models/user.model";
import { Observable } from "rxjs/Observable";
import { CookieService } from 'angular2-cookie/core';
import { ErrorService } from "../notif-to-user/errors/error.service";
import { Router } from "@angular/router";

const SIGNUP_ADDRESS = 'http://localhost:3000/user/signup';
const SIGNIN_ADDRESS = 'http://localhost:3000/user/signin';
const ISLOGIN_ADDRESS = 'http://localhost:3000/user/islogin';



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

    constructor(private http: Http,
        private errorService: ErrorService,
        private cookieService: CookieService,
        private router: Router
    ) { }

    //signup
    signup(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(SIGNUP_ADDRESS, body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
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
                        this.logout();
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
                    this.logout();
                    this.userLogOutEvent.emit();
                    return response.json()
                }
            })
            .catch((error: Response) => {
                this.logout();
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
                        this.logout();
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
                    this.logout();
                    this.userLogOutEvent.emit();
                    return response.json()
                }
            })
            .catch((error: Response) => {
                this.logout();
                this.userLogOutEvent.emit();
                return Observable.throw(error.json())
            });
    }

    //logout
    logout() {
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
}