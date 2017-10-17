import { Component, OnInit } from '@angular/core';
import { HealthArticleService } from '../../../services/health-article/health-article-service';
import { HealthArticle } from '../../../models/objects-models/health-article';
import { ActivatedRoute, Params } from "@angular/router";//Router (if redirect)


@Component({
  selector: 'app-health-article-item',
  templateUrl: './health-article-item.component.html',
  styleUrls: ['./health-article-item.component.css']
})
export class HealthArticleItemComponent implements OnInit {


  private healthArticle: HealthArticle;
  private id;

  constructor(private healthArticleService: HealthArticleService,
    private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.params
      .subscribe(
      (params: Params) => {
        this.id = params['id'];

        this.healthArticleService.getTheArticle(this.id)
          .subscribe(
          (healthArticle: HealthArticle) => {
            this.healthArticle = healthArticle;
          },
          error => console.error(error)
          );

      });
  }

}
