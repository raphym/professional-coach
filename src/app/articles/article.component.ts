import { Component, OnInit } from '@angular/core';
import { ArticleService } from './article-service';
import { SuccessService } from '../shared/components/notif-to-user/success/success.service';
import { ErrorService } from '../shared/components/notif-to-user/errors/error.service';
import { LoaderService } from '../shared/components/loader/loader.service';
import { Article } from '../shared/models/objects-models/article';
import { Router } from '@angular/router';

@Component({
  selector: 'app-articles',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticlesComponent implements OnInit {

  private lastArticle: Article;
  constructor(
    private articleService: ArticleService,
    private successService: SuccessService,
    private errorService: ErrorService,
    private loaderService: LoaderService,
    private router: Router) {

  }
  ngOnInit() {
    this.articleService.getLastNewArticle().subscribe(
      data => {
        this.lastArticle = new Article(data._id, data.title, data.image, data.content, data.intro, data.date);
      },
      error => {
        console.log('error');
        console.log(error);
      }
    );
  }
  onClick() {
    var path = 'view-article/';
    path += this.lastArticle._id;
    this.router.navigateByUrl(path);
  }

}
