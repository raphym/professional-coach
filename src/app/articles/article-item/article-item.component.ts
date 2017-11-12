import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../article-service';
import { Article } from '../../models/objects-models/article';
import { ActivatedRoute, Params } from "@angular/router";//Router (if redirect)
import { LoaderService } from '../../loader/loader.service';


@Component({
  selector: 'app-article-item',
  templateUrl: './article-item.component.html',
  styleUrls: ['./article-item.component.css']
})
export class ArticleItemComponent implements OnInit {


  private article: Article;
  private id;

  constructor(private articleService: ArticleService,
    private route: ActivatedRoute,
    private loaderService: LoaderService) { }

  ngOnInit() {
    //enable the loader
    this.loaderService.enableLoader();
    this.route.params
      .subscribe(
      (params: Params) => {
        this.id = params['id'];

        this.articleService.getTheArticle(this.id)
          .subscribe(
          (article: Article) => {
            //disable the loader
            this.loaderService.disableLoader();
            this.article = article;
            document.getElementById('theContent').innerHTML=article.content;            
          },
          error => {
            //disable the loader
            this.loaderService.disableLoader();
            console.error(error)
          }
          );
      });
  }

}
