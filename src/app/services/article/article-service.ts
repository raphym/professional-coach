import { Http, Response, Headers, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Injectable } from "@angular/core";
import { Article } from '../../models/objects-models/article';

@Injectable()
export class ArticleService {

    ADD_Article_ADDRESS = 'http://localhost:3000/article/addArticle';
    GET_Articles_ADDRESS = 'http://localhost:3000/article/getArticles';
    GET_Article_ADDRESS = 'http://localhost:3000/article/getArticle';


    articles: Article[];

    constructor(private http: Http) { }



    addArticle(article: Article) {

        const body = JSON.stringify(article);
        const headers = new Headers({ 'Content-Type': 'application/json' });

        return this.http.post(this.ADD_Article_ADDRESS, body, { headers: headers })
            .map((response: Response) => {
                const result = response.json();
                const article = new Article(
                    result.obj._id,
                    result.obj.title,
                    result.obj.image,
                    result.obj.content);
                this.articles.push(article);
                return article;
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
        return this.http.get(this.GET_Articles_ADDRESS)
            .map((response: Response) => {
                const articles = response.json().obj;
                let transformedArticles: Article[] = [];
                for (let article of articles) {
                    transformedArticles.push(new Article(
                        article._id,
                        article.title,
                        article.image,
                        article.content));
                }
                this.articles = transformedArticles;
                return transformedArticles;
            })
            .catch((error: Response) => {
                //this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }

    getTheArticle(id) {

        let params: URLSearchParams = new URLSearchParams();
        params.set('id', id);
        return this.http.get(this.GET_Article_ADDRESS, { search: params })
            .map((response: Response) => {
                const article = response.json().obj;

                let transformedArticle: Article;
                transformedArticle = new Article(
                    article._id,
                    article.title,
                    article.image,
                    article.content);
                return transformedArticle;
            })
            .catch((error: Response) => {
                //this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }

}