import { Http, Response, Headers, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Injectable } from "@angular/core";
import { Article } from '../models/objects-models/article';

@Injectable()
export class ArticleService {

    ADD_Article_ADDRESS = 'http://localhost:3000/article/addArticle';
    UPDATE_Article_ADDRESS = 'http://localhost:3000/article/updateArticle';
    GET_Articles_ADDRESS = 'http://localhost:3000/article/getArticles';
    GET_Article_ADDRESS = 'http://localhost:3000/article/getArticle';
    DELETE_Article_ADDRESS = 'http://localhost:3000/article/deleteArticle';




    articles: Article[];

    constructor(private http: Http) {
        this.getArticles()
            .subscribe(
            (articles: Article[]) => {
                this.articles = articles;
            },
            error => console.error(error)
            );
    }



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
                return response.json().my_response;
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

    updateArticle(article: Article) {

        const body = JSON.stringify(article);
        const headers = new Headers({ 'Content-Type': 'application/json' });

        return this.http.post(this.UPDATE_Article_ADDRESS, body, { headers: headers })
            .map((response: Response) => {
                const result = response.json();
                const article = new Article(
                    result.obj._id,
                    result.obj.title,
                    result.obj.image,
                    result.obj.content);
                this.articles.push(article);
                return response.json().my_response;
            })
            .catch((error: Response) => {

                if (error.status == 413) {
                    var personalError = {
                        title: 'Error occurred (Status Code : ' + error.status + ')',
                        error: { message: error.statusText },
                    }
                    return Observable.throw(personalError)
                }
                else {
                    console.log(error);
                    return Observable.throw(error);
                }

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

    deleteArticle(id) {
        const body = JSON.stringify({ _id: id });
        const headers = new Headers({ 'Content-Type': 'application/json' });

        return this.http.post(this.DELETE_Article_ADDRESS, body, { headers: headers })
            .map((response: Response) => {
                return response.json().my_response;
            })
            .catch((error: Response) => {
                console.log(error);
                return Observable.throw(error);
            });
    }
}