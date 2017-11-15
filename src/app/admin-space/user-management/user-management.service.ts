import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs/Observable";
import { CookieService } from 'angular2-cookie/core';

const GET_USERS_ADDRESS = "http://localhost:3000/users-management/getUsers";

@Injectable()
export class UserManagementService {

    constructor(private cookieService: CookieService,
        private http: Http) {

    }
    getUsers() {
        var token = this.cookieService.get('token');
        const body = JSON.stringify(token);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.get(GET_USERS_ADDRESS, { headers: headers })
            .map((response: Response) => {
                return response.json();
            })
            .catch((error: Response) => {
                return Observable.throw(error.json());
            });

    }
}