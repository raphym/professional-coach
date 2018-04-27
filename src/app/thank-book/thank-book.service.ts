import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable, Input, EventEmitter } from "@angular/core";

@Injectable()
export class ThankBookService {
    getUrl = window.location;
    baseUrl = this.getUrl.protocol + "//" + this.getUrl.host + "/";

    //online
    //Get_fbReviews_ADDRESS = this.baseUrl + 'social_fb/getFbReviews';
    //offline
    Get_fbReviews_ADDRESS = this.baseUrl + 'social_fb/getFbReviewsOffline';
    constructor(public http: Http) { }

    //get articles count
    getFbReviews() {
        return this.http.get(this.Get_fbReviews_ADDRESS)
            .map((response: Response) => {
                return response.json();
            })
            .catch((error: Response) => {
                return Observable.throw(error.json());
            });

    }
}