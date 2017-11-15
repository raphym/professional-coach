import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs/Observable";
import { CookieService } from 'angular2-cookie/core';

const GET_USERS_ADDRESS = "http://localhost:3000/users-management/getUsers";
const EDIT_USER_ADDRESS = "http://localhost:3000/users-management/editUser";


@Injectable()
export class UserManagementService {

    constructor(private cookieService: CookieService,
        private http: Http) {

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
    editUser(fields) {
        const body = JSON.stringify(fields);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(EDIT_USER_ADDRESS, body, { headers: headers })
            .map((response: Response) => {
                return response.json();
            })
            .catch((error: Response) => {
                return Observable.throw(error.json());
            });
    }
}