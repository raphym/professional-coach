import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article/article-service';
import { Article } from '../../models/objects-models/article';
import { ActivatedRoute, Params } from "@angular/router";//Router (if redirect)


@Component({
  selector: 'app-article-item',
  templateUrl: './article-item.component.html',
  styleUrls: ['./article-item.component.css']
})
export class ArticleItemComponent implements OnInit {


  private article: Article;
  private id;

  constructor(private articleService: ArticleService,
    private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.params
      .subscribe(
      (params: Params) => {
        this.id = params['id'];

        this.articleService.getTheArticle(this.id)
          .subscribe(
          (article: Article) => {
            this.article = article;
          },
          error => console.error(error)
          );

      });
  }

}
