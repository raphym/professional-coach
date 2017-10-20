import { Injectable } from "@angular/core";
import { Http , Headers , Response} from "@angular/http";
import 'rxjs/Rx';
import { User } from "../models/objects-models/user.model";
import { Observable } from "rxjs/Observable";
import {CookieService} from 'angular2-cookie/core';
import { ErrorService } from "../notif-to-user/errors/error.service";
import { JwtHelper } from "angular2-jwt";

const SIGNUP_ADDRESS = 'http://localhost:3000/user/signup';
const SIGNIN_ADDRESS = 'http://localhost:3000/user/signin';


@Injectable()
export class AuthService {

    //JwtHelper
    jwtHelper: JwtHelper = new JwtHelper();

    constructor(private http:Http,
        private errorService:ErrorService,
        private cookieService:CookieService,
        ){}

    //signup
    signup(user:User){
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type':'application/json'});
        return this.http.post(SIGNUP_ADDRESS,body,{headers: headers})
        .map((response:Response) => response.json())
        .catch((error: Response) => {
            this.errorService.handleError(error.json());
            return Observable.throw(error.json())
        });
    }

    //signin
    signin(user:User){
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type':'application/json'});
        return this.http.post(SIGNIN_ADDRESS,body,{headers: headers})
        .map((response:Response) => response.json())
        .catch((error: Response) => {
            this.errorService.handleError(error.json());
            return Observable.throw(error.json())
        });
    }

    //logout
    logout()
    {
        this.cookieService.remove('token');
    }

    //check if logged in
    isLoggedIn()
    {
        var token = this.cookieService.get('token');
        if(token)
        {
            var isExpired = this.jwtHelper.isTokenExpired(token);
            if(!isExpired)
            {
                return true;
            }     
            else
            {
                this.cookieService.remove('token');
                return false;
            }     
        }
        else
            return false;
    }


    //get the user_id connected
    getUserId()
    {  
        if(!this.isLoggedIn())
            return 'expired';

        var token = this.cookieService.get('token');
        //var expirationDate = this.jwtHelper.getTokenExpirationDate(token);
        var decoded = this.jwtHelper.decodeToken(token);
        var isExpired = this.jwtHelper.isTokenExpired(token);
        
        if(decoded)
        {

            var user = decoded.user;
            if(user)
            {
                var userId= user._id;
                if(userId)
                {
                    return userId;
                }
            }
            return 'error';
        }
    }


}