import { Http, Response, Headers, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Injectable, Input, EventEmitter } from "@angular/core";
import { Article } from '../shared/models/objects-models/article';
import { UIParams, UIResponse, FacebookService, InitParams, LoginResponse } from 'ngx-facebook';

@Injectable()
export class ArticleService {

    ADD_Article_ADDRESS = 'http://localhost:3000/article/addArticle';
    UPDATE_Article_ADDRESS = 'http://localhost:3000/article/updateArticle';
    GET_Articles_ADDRESS = 'http://localhost:3000/article/getArticles';
    GET_Article_ADDRESS = 'http://localhost:3000/article/getArticle';
    GET_LAST_Article_ADDRESS = 'http://localhost:3000/article/getNewLastArticle';
    DELETE_Article_ADDRESS = 'http://localhost:3000/article/deleteArticle';

    articles: Article[];
    //EventEmitter to load more articles
    @Input() loadMoreArticlesEmitter: EventEmitter<any> = new EventEmitter();


    constructor(private http: Http,
        private fb: FacebookService
    ) {

        //change for prod
        //135809447088863
        let initParams: InitParams = {
            appId: '330446087441402',
            xfbml: true,
            version: 'v2.8'
        };

        fb.init(initParams);
    }

    //get articles count
    getArticlesCount() {
        return this.http.get('http://localhost:3000/article/getArticlesCount')
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
        return this.http.post('http://localhost:3000/article/getPartOfArticles', body, { headers: headers })
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
                const result = response.json();
                const article = new Article(
                    result.obj._id,
                    result.obj.title,
                    result.obj.image,
                    result.obj.content,
                    result.obj.intro,
                    result.obj.date);
                //this.articles.push(article);
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
                const result = response.json();
                const article = new Article(
                    result.obj._id,
                    result.obj.title,
                    result.obj.image,
                    result.obj.content,
                    result.obj.intro,
                    result.obj.date);
                // this.articles.push(article);
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
                        article.date));
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
                    article.date);
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
            //with method share
            // let params: UIParams = {
            //     method: 'share',
            //     href: '',     // The same than link in feed method
            //     picture: 'https://www.g-fit.co.il/assets/Images/slide3.jpg',  
            //     caption: 'caption',  
            //     description: 'desc',
            // };
            let params: UIParams = {
                method: 'share',/* share_open_graph */
                action_type: 'og.shares',
                action_properties: JSON.stringify({
                    object: {
                        'og:url': url,
                        'og:title': title,
                        'og:description': intro,
                        'og:image': 'https://www.g-fit.co.il/assets/Images/slide3.jpg',
                        'og:image:width': '50',
                        'og:image:height': '50',
                        'og:image:type': 'image/jpeg'
                    }
                }),
                href: 'https://www.g-fit.co.il/'
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