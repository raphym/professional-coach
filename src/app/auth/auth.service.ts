import { Injectable, EventEmitter } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { User } from "../models/objects-models/user.model";
import { Observable } from "rxjs/Observable";
import { CookieService } from 'angular2-cookie/core';
import { ErrorService } from "../notif-to-user/errors/error.service";
import { JwtHelper } from "angular2-jwt";

const SIGNUP_ADDRESS = 'http://localhost:3000/user/signup';
const SIGNIN_ADDRESS = 'http://localhost:3000/user/signin';
const ISLOGIN_ADDRESS = 'http://localhost:3000/user/islogin';



@Injectable()
export class AuthService {
    userLogInEvent = new EventEmitter<{}>();
    private isExistUser = false;
    private _id = '';
    private isAdmin = false;
    private firstName = '';
    private lastName = '';
    private email = '';

    //JwtHelper
    jwtHelper: JwtHelper = new JwtHelper();

    constructor(private http: Http,
        private errorService: ErrorService,
        private cookieService: CookieService,
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
                    if (data.levelRights >= 200)
                        this.isAdmin = true;
                    this._id = response.json()._id;
                    this.isExistUser = true;
                    this.firstName = data.firstName;
                    this.lastName = data.lastName;
                    this.email = data.email;
                    this.userLogInEvent.emit(data);
                    response.json()
                }
                response.json()
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }

    //check if logged in
    isLoggedIn() {
        const body = '';
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(ISLOGIN_ADDRESS, body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                return Observable.throw(error.json())
            });
    }

    //logout
    logout() {
        this.cookieService.remove('token');
        this.isExistUser = false;
        this._id = '';
        this.isAdmin = false;
        this.firstName = '';
        this.lastName = '';
        this.email = '';
    }


    //get the user_id connected
    getUserId() {
        return this._id;
    }
}