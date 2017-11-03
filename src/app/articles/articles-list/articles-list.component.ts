import { Component, OnInit } from '@angular/core';
import { Article } from '../../models/objects-models/article';
import { ArticleService } from '../article-service';
import { AuthService } from '../../auth/auth.service';
import { SuccessService } from '../../notif-to-user/success/success.service';
import { ErrorService } from '../../notif-to-user/errors/error.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../loader/loader.service';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.css']
})
export class ArticlesListComponent implements OnInit {

  articles: Article[];
  constructor(
    private articleService: ArticleService,
    private authService: AuthService,
    private successService: SuccessService,
    private errorService: ErrorService,
    private router: Router,
    private loaderService: LoaderService
  ) {
  }

  ngOnInit() {
    this.init();
  }

  init() {
    //enable the loader
    this.loaderService.enableLoader();
    this.articleService.getArticles()
      .subscribe(
      (articles: Article[]) => {
        //disable the loader
        this.loaderService.disableLoader();
        this.articles = articles;
      },
      error => {
        //disable the loader
        this.loaderService.disableLoader();
        //console.error(error)
      }
      );
  }

  isItAdmin() {
    return this.authService.isItAdmin();
  }

  onDelete(id) {
    //enable the loader
    this.loaderService.enableLoader();
    this.articleService.deleteArticle(id)
      .subscribe(
      (data) => {
        //disable the loader
        this.loaderService.disableLoader();
        this.init();
        this.successService.handleSuccess(data);
      },
      error => {
        //disable the loader
        this.loaderService.disableLoader();
        this.errorService.handleError(error.json());
      }
      );
  }

}
