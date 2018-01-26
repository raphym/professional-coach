import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable} from "@angular/core";
import { User } from '../shared/models/objects-models/user.model';

//address to the server
const GET_USER_ADDRESS = 'http://localhost:3000/user-space/getUser';

@Injectable()
export class UserSpaceService {

    user: User;

    constructor(private http: Http) {
    }

    getUser() {
        const headers = new Headers({ 'Content-Type': 'application/json' });

        return this.http.get(GET_USER_ADDRESS,{ headers: headers })
            .map((response: Response) => {
                return response.json();
            })
            .catch((error: Response) => {
                return Observable.throw(error.json());
            });
    }

}