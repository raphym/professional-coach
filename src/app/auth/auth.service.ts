import { Injectable } from "@angular/core";
import { Http , Headers , Response} from "@angular/http";
import 'rxjs/Rx';
import { User } from "../models/objects-models/user.model";
import { Observable } from "rxjs/Observable";
import { ErrorService } from "../notif-to-user/errors/error.service";

const SIGNUP_ADDRESS = 'http://localhost:3000/user';
const SIGNIN_ADDRESS = 'http://localhost:3000/user/signin';


@Injectable()
export class AuthService {

    constructor(private http:Http,private errorService:ErrorService){}

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
        localStorage.clear();
    }

    //check if logged in
    isLoggedIn()
    {
        return localStorage.getItem('token')!== null;
    }
}