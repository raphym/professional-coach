import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable, Input, EventEmitter } from "@angular/core";

const Get_fbReviews_ADDRESS = 'http://localhost:3000/social_fb/getFbReviews';


@Injectable()
export class ThankBookService {

    constructor(private http: Http) { }

    //get articles count
    getFbReviews() {
        return this.http.get(Get_fbReviews_ADDRESS)
            .map((response: Response) => {
                return response.json();
            })
            .catch((error: Response) => {
                return Observable.throw(error.json());
            });

    }
}