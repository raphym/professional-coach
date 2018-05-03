import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable, Input, EventEmitter } from "@angular/core";

@Injectable()
export class ThankBookService {
    getUrl = window.location;
    baseUrl = this.getUrl.protocol + "//" + this.getUrl.host + "/";

    //online
    get_fbReviews_online_ADDRESS = this.baseUrl + 'social_fb/getFbReviews';
    //offline
    Get_fbReviews_offline_ADDRESS = this.baseUrl + 'social_fb/getFbReviewsOffline';
    constructor(public http: Http) { }

    //get articles count
    getFbReviews() {
        return this.http.get(this.get_fbReviews_online_ADDRESS)
            .map((response: Response) => {
                return response.json();
            })
            .catch((error: Response) => {
                //error to get live reviews , so go to the server to quey the offline reviews
                return this.http.get(this.Get_fbReviews_offline_ADDRESS)
                    .map((response: Response) => {
                        return response.json();
                    })
                    .catch((error: Response) => {
                        return Observable.throw(error.json());
                    });
            });
    }
}