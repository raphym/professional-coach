import { Component, OnInit } from '@angular/core';
import { Article } from '../../models/objects-models/article';
import { ArticleService } from '../article-service';
import { AuthService } from '../../auth/auth.service';
import { SuccessService } from '../../notif-to-user/success/success.service';
import { ErrorService } from '../../notif-to-user/errors/error.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) {
  }

  ngOnInit() {
    this.init();
  }

  init()
  {
    this.articleService.getArticles()
    .subscribe(
    (articles: Article[]) => {
      this.articles = articles;
    },
    error => console.error(error)
    );
  }

  isItAdmin() {
    return this.authService.isItAdmin();
  }

  onDelete(id) {
    this.articleService.deleteArticle(id)
      .subscribe(
      (data) => {
        this.init();
        this.successService.handleSuccess(data);
      },
      error => {
        this.errorService.handleError(error.json());
      }
      );
  }

}
