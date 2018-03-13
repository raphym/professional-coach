import { Http, Response, Headers, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Injectable } from "@angular/core";
import { User } from '../../shared/models/objects-models/user.model';

@Injectable()
export class ProfileService {
    getUrl = window.location;
    baseUrl = this.getUrl.protocol + "//" + this.getUrl.host + "/";

    //address to the server
    GET_USER_ADDRESS = this.baseUrl + 'user-space/getUser';
    EDIT_USER_ADDRESS = this.baseUrl + 'user-space/editUser';

    user: User;

    constructor(public http: Http) {
    }

    getUser() {
        const headers = new Headers({ 'Content-Type': 'application/json' });

        return this.http.get(this.GET_USER_ADDRESS, { headers: headers })
            .map((response: Response) => {
                return response.json();
            })
            .catch((error: Response) => {
                return Observable.throw(error.json());
            });
    }

    updateUser(user) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const body = JSON.stringify(user);
        return this.http.post(this.EDIT_USER_ADDRESS, body, { headers: headers })
            .map((response: Response) => {
                return response.json();
            })
            .catch((error: Response) => {
                return Observable.throw(error.json());
            });
    }
}
