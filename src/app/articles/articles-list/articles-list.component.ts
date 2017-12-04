import { Component, OnInit, NgZone } from '@angular/core';
import { Article } from '../../shared/models/objects-models/article';
import { ArticleService } from '../article-service';
import { SuccessService } from '../../shared/components/notif-to-user/success/success.service';
import { ErrorService } from '../../shared/components/notif-to-user/errors/error.service';
import { LoaderService } from '../../shared/components/loader/loader.service';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.css']
})
export class ArticlesListComponent implements OnInit {

  private statusText;

  //variables for the lazy loading of the articles
  private numsLoadedArticles: number = 0;
  private numsArticlesPerPage: number = 2;
  private numsOfArticles: number = 0;
  private loadingMutex: boolean = false;

  //array of articles
  articles: Article[];
  constructor(
    private articleService: ArticleService,
    private successService: SuccessService,
    private errorService: ErrorService,
    private loaderService: LoaderService,
    private scrollEvent: NgZone
  ) {
    //event on scroll
    window.onscroll = () => {
      let status = "not reached";
      let windowHeight = "innerHeight" in window ? window.innerHeight
        : document.documentElement.offsetHeight;
      let body = document.body, html = document.documentElement;
      let docHeight = Math.max(body.scrollHeight,
        body.offsetHeight, html.clientHeight,
        html.scrollHeight, html.offsetHeight);
      let windowBottom = windowHeight + window.pageYOffset;
      if (windowBottom >= docHeight) {
        status = 'bottom reached';
      }
      scrollEvent.run(() => {
        this.statusText = status;
        if (status == 'bottom reached')
          this.loadMore();
      });
    };
  }

  //on init get the count of articles and start to load them
  ngOnInit() {
    //enable the loader
    this.loaderService.enableLoader();
    this.articleService.getArticlesCount()
      .subscribe(
      data => {
        this.numsOfArticles = data.count;
        this.articles = new Array();
        this.loadMore();
      },
      error => {
        console.log(error);
      }
      );
  }

  //load more articles
  loadMore() {
    //check if we are already trying to load content
    if (this.loadingMutex)
      return;
    else
      this.loadingMutex = true;

    //check if loaded all the articles from the server
    if (this.numsLoadedArticles >= this.numsOfArticles)
      return;

    //enable the loader
    this.loaderService.enableLoader();

    var details = {
      numsArticlesPerPage: this.numsArticlesPerPage,
      numsLoadedArticles: this.numsLoadedArticles
    }
    this.articleService.getPartOfArticles(details)
      .subscribe(
      data => {
        var articles = data.articles;
        this.numsLoadedArticles += articles.length;
        for (var i = 0; i < articles.length; i++) {
          this.articles.push(articles[i]);
        }
        this.loadingMutex = false;
        //disable the loader
        this.loaderService.disableLoader();
      },
      error => {
        console.log(error);
        this.loadingMutex = false;
        //disable the loader
        this.loaderService.disableLoader();
      }
      );

  }
}
