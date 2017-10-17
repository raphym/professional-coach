import { Component, OnInit } from '@angular/core';
import { HealthArticle } from '../../../models/objects-models/health-article';
import { HealthArticleService } from '../../../services/health-article/health-article-service';

@Component({
  selector: 'app-health-articles-list',
  templateUrl: './health-articles-list.component.html',
  styleUrls: ['./health-articles-list.component.css']
})
export class HealthArticlesListComponent implements OnInit {

  healthArticles:HealthArticle [];
  constructor(private healthArticleService:HealthArticleService) { }

  ngOnInit() {
    
    this.healthArticleService.getArticles()
    .subscribe(
    (healthArticles: HealthArticle[]) => {
        this.healthArticles = healthArticles;
    },
    error => console.error(error)
    );
  }

}
