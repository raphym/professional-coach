import { Http, Response, Headers, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Injectable } from "@angular/core";
import { HealthArticle } from '../../models/objects-models/health-article';

@Injectable()
export class HealthArticleService {

    ADD_healthArticle_ADDRESS = 'http://localhost:3000/healthArticle/addArticle';
    GET_healthArticles_ADDRESS = 'http://localhost:3000/healthArticle/getArticles';
    GET_healthArticle_ADDRESS = 'http://localhost:3000/healthArticle/getArticle';


    healthArticles: HealthArticle[];

    constructor(private http: Http) { }



    addArticle(healthArticle: HealthArticle) {

        const body = JSON.stringify(healthArticle);
        const headers = new Headers({ 'Content-Type': 'application/json' });

        return this.http.post(this.ADD_healthArticle_ADDRESS , body, { headers: headers })
            .map((response: Response) => {
                const result = response.json();
                const healthArticle = new HealthArticle(
                    result.obj._id,
                    result.obj.title,
                    result.obj.image,
                    result.obj.content);
                this.healthArticles.push(healthArticle);
                return healthArticle;
            })
            .catch((error: Response) => {

                if (error.status == 413) {
                    var personalError = {
                        title: 'Error occurred (Status Code : ' + error.status + ')',
                        error: { message: error.statusText },
                    }
                    return Observable.throw(personalError)
                }
                else
                    return Observable.throw(error.json())
            });
    }


    getArticles() {
        return this.http.get(this.GET_healthArticles_ADDRESS)
            .map((response: Response) => {
                const articles = response.json().obj;
                let transformedHealthArticles: HealthArticle[] = [];
                for (let article of articles) {
                    transformedHealthArticles.push(new HealthArticle(
                        article._id,
                        article.title,
                        article.image,
                        article.content));
                }
                this.healthArticles = transformedHealthArticles;
                return transformedHealthArticles;
            })
            .catch((error: Response) => {
                //this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }

    getTheArticle(id) {

        let params: URLSearchParams = new URLSearchParams();
        params.set('id', id);
        return this.http.get(this.GET_healthArticle_ADDRESS, { search: params })
            .map((response: Response) => {
                const article = response.json().obj;

                let transformedHealthArticle: HealthArticle;
                transformedHealthArticle = new HealthArticle(
                    article._id,
                    article.title,
                    article.image,
                    article.content);
                return transformedHealthArticle;
            })
            .catch((error: Response) => {
                //this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }

}