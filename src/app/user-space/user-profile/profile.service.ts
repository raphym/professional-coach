import { Http, Response, Headers, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Injectable } from "@angular/core";
import { User } from '../../shared/models/objects-models/user.model';

//address to the server
const GET_USER_ADDRESS = 'http://localhost:3000/user-space/getUser';
const EDIT_USER_ADDRESS = 'http://localhost:3000/user-space/editUser';


@Injectable()
export class ProfileService {
    user: User;

    constructor(public http: Http) {
    }

    getUser() {
        const headers = new Headers({ 'Content-Type': 'application/json' });

        return this.http.get(GET_USER_ADDRESS, { headers: headers })
            .map((response: Response) => {
                return response.json();
            })
            .catch((error: Response) => {
                return Observable.throw(error.json());
            });
    }
    
    updateUser(user){
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const body = JSON.stringify(user);
        return this.http.post(EDIT_USER_ADDRESS,body, { headers: headers })
            .map((response: Response) => {
                return response.json();
            })
            .catch((error: Response) => {
                return Observable.throw(error.json());
            });
    }
}
