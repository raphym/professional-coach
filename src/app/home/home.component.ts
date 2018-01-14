import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { UsefulService } from '../shared/services/utility/useful.service';
import { ArticleService } from '../articles/article-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private langDirection;
  private langTextAlign;
  constructor(private usefulService: UsefulService,
    private articleService: ArticleService) { }

  ngOnInit() {
    //subscribe to the langage
    this.usefulService.langTransmitter.subscribe(
      config_langage => {
        this.langDirection = config_langage.direction;
        this.langTextAlign = config_langage.textAlign;
      }
    );
    //set langage
    this.usefulService.initLangage();
  }

  //load more articles
  loadMoreArticles() {
    this.articleService.loadMoreArticlesEmitter.emit();
  }

}
