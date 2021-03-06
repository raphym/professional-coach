import { Http, Response, Headers, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Injectable, Input, EventEmitter } from "@angular/core";
import { Article } from '../shared/models/objects-models/article';
import { UIParams, UIResponse, FacebookService, InitParams, LoginResponse } from 'ngx-facebook';

@Injectable()
export class ArticleService {
    getUrl = window.location;
    baseUrl = this.getUrl.protocol + "//" + this.getUrl.host + "/";

    ADD_Article_ADDRESS = this.baseUrl + 'article/addArticle';
    UPDATE_Article_ADDRESS = this.baseUrl + 'article/updateArticle';
    GET_Articles_ADDRESS = this.baseUrl + 'article/getArticles';
    GET_Article_ADDRESS = this.baseUrl + 'article/getArticle';
    GET_LAST_Article_ADDRESS = this.baseUrl + 'article/getNewLastArticle';
    DELETE_Article_ADDRESS = this.baseUrl + 'article/deleteArticle';
    VALIDATE_Article_ADDRESS = this.baseUrl + 'article/validateArticle';
    GET_ARTICLES_COUNT_ADDRESS = this.baseUrl + 'article/getArticlesCount';
    GET_PART_OF_ARTICLES_ADDRESS = this.baseUrl + 'article/getPartOfArticles';
    FB_LOGO_ARTICLE_SHARE = this.baseUrl + 'assets/Images/article/fb/logofb.png';

    articles: Article[];
    //EventEmitter to load more articles
    @Input() loadMoreArticlesEmitter: EventEmitter<any> = new EventEmitter();


    constructor(public http: Http,
        public fb: FacebookService,
    ) {
        //change for prod
        let initParams: InitParams = {
            appId: '330446087441402',
            xfbml: true,
            version: 'v2.8'
        };

        fb.init(initParams);
    }

    //get articles count
    getArticlesCount() {
        return this.http.get(this.GET_ARTICLES_COUNT_ADDRESS)
            .map((response: Response) => {
                return response.json();
            })
            .catch((error: Response) => {
                return Observable.throw(error.json());
            });

    }

    getPartOfArticles(wantedData) {
        const headers = new Headers({ 'Content-Type': 'application/json' });

        const body = JSON.stringify(wantedData);
        return this.http.post(this.GET_PART_OF_ARTICLES_ADDRESS, body, { headers: headers })
            .map((response: Response) => {
                return response.json();
            })
            .catch((error: Response) => {
                return Observable.throw(error.json());
            });
    }

    addArticle(article: Article) {

        const body = JSON.stringify(article);
        const headers = new Headers({ 'Content-Type': 'application/json' });

        return this.http.post(this.ADD_Article_ADDRESS, body, { headers: headers })
            .map((response: Response) => {
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
                    return Observable.throw(error.json())

                }
            });
    }

    updateArticle(article: Article) {

        const body = JSON.stringify(article);
        const headers = new Headers({ 'Content-Type': 'application/json' });

        return this.http.post(this.UPDATE_Article_ADDRESS, body, { headers: headers })
            .map((response: Response) => {
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

    validateArticle(request_validation) {

        const body = JSON.stringify(request_validation);
        const headers = new Headers({ 'Content-Type': 'application/json' });

        return this.http.post(this.VALIDATE_Article_ADDRESS, body, { headers: headers })
            .map((response: Response) => {
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
                        article.content,
                        article.intro,
                        article.date,
                        article.valid));
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
                    article.content,
                    article.intro,
                    article.date,
                    article.valid);
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

    getLastNewArticle() {
        return this.http.get(this.GET_LAST_Article_ADDRESS)
            .map((response: Response) => {
                return response.json().article;
            })
            .catch((error: Response) => {
                return Observable.throw(error.json())
            });
    }

    //share article on facebook
    shareArticle(url: string, title: string, intro: string) {
        return new Promise((resolve, reject) => {
            let params: UIParams = {
                method: 'share',/* share_open_graph */
                action_type: 'og.shares',
                action_properties: JSON.stringify({
                    object: {
                        'og:url': url,
                        'og:title': title,
                        'og:description': intro,
                        'og:image': this.FB_LOGO_ARTICLE_SHARE,
                        'og:image:width': '50',
                        'og:image:height': '50',
                        'og:image:type': 'image/jpeg'
                    }
                }),
                href: this.baseUrl
            };

            this.fb.ui(params)
                .then((res: UIResponse) => {
                    resolve('ok');
                })
                .catch((e: any) => {
                    console.error(e);
                    reject('no');
                });
        });
    }
}