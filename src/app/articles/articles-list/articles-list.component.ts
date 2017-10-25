import { Component, OnInit } from '@angular/core';
import { Article } from '../../models/objects-models/article';
import { ArticleService } from '../../services/article/article-service';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.css']
})
export class ArticlesListComponent implements OnInit {

  articles:Article [];
  constructor(private articleService:ArticleService) { }

  ngOnInit() {
    
    this.articleService.getArticles()
    .subscribe(
    (articles: Article[]) => {
        this.articles = articles;
    },
    error => console.error(error)
    );
  }

}
