import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { Article } from '../../shared/models/objects-models/article';
import { ArticleService } from '../article-service';
import { SuccessService } from '../../shared/components/notif-to-user/success/success.service';
import { ErrorService } from '../../shared/components/notif-to-user/errors/error.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core/src/event_emitter';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.css']
})
export class ArticlesListComponent implements OnInit {

  private statusText;
  @ViewChild('f') form: NgForm;

  //variables for the lazy loading of the articles
  private numsLoadedArticles: number = 0;
  private numsArticlesPerPage: number = 2;
  private numsOfArticles: number = 0;
  private loadingMutex: boolean = false;
  private loading: boolean = false;
  private eventLoadMoreArticles: EventEmitter<any>;
  private current_url: string;
  private articles_url = '/articles';

  //the word to search
  private search: string;
  //from date search
  private fromDate;
  //to date search
  private toDate;
  //arrays of select options
  private selectedSearchOptions = ['חפש לפי', 'חפש לפי כותרת', 'חפש לפי תאריך', 'חפש לפי תאריך וגם לפי כותרת'];
  //boolean show the search according to the name
  private showSearchName = false;
  //boolean show the search according to the dates
  private showSearchDates = false;
  //search_by
  private search_by;
  //boolean show options
  private showOption: boolean = false;
  //boolean show the button option
  private showButtonOption: boolean = false;


  //array of articles
  articles: Article[];
  constructor(
    private articleService: ArticleService,
    private successService: SuccessService,
    private errorService: ErrorService,
    private router: Router,
    private lc: NgZone
  ) {
    //Active this automatic load scroll only is we
    //are in the page articles
    if (this.router.url == this.articles_url) {
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
        lc.run(() => {
          this.statusText = status;
          console.log(this.statusText);
          if (status == 'bottom reached') {
            this.loadMore();
            console.log('load');
          }
        });
      };
    }
  }

  //on init get the count of articles and start to load them
  ngOnInit() {
    this.current_url = this.router.url;
    if (this.current_url == this.articles_url) {
      this.showButtonOption = true;
    }

    //subscribe to the event load more articles from home page
    if (this.current_url != this.articles_url) {
      this.eventLoadMoreArticles = this.articleService.loadMoreArticlesEmitter.subscribe(
        data => {
          this.loadMore();
        }
      );
    }
    //reset value
    this.numsLoadedArticles = 0;
    this.numsOfArticles = 0;
    this.loadingMutex = false;
    //enable the loader
    this.loading = true;
    this.articleService.getArticlesCount()
      .subscribe(
      data => {
        this.numsOfArticles = data.count;
        this.articles = new Array();
        if (this.numsOfArticles > 0)
          this.loadMore();
        else
          //disable the loader
          this.loading = false;
      },
      error => {
        console.log(error);
        //disable the loader
        this.loading = false;
      }
      );
  }

  ngOnDestroy() {
    //remove the onScroll event
    if (this.current_url == this.articles_url) {
      window.onscroll = () => { };
    }

    //unsubscribe from the event load more
    if (this.current_url != this.articles_url) {
      if (this.eventLoadMoreArticles != undefined)
        this.eventLoadMoreArticles.unsubscribe();
    }
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
    this.loading = true;

    var details = {
      numsArticlesPerPage: this.numsArticlesPerPage,
      numsLoadedArticles: this.numsLoadedArticles,
      search: this.search,
      fromDate: this.fromDate,
      toDate: this.toDate,
      search_by: this.search_by
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
        this.loading = false;
      },
      error => {
        console.log(error);
        this.loadingMutex = false;
        //disable the loader
        this.loading = false;
      }
      );

  }

  //show the diplay option
  onShowOptions() {
    this.showOption = !this.showOption;
  }

  //when click on button search
  onSearch(form: NgForm) {
    const value = form.value;
    this.search = value.search;
    this.fromDate = value.fromDate;
    this.toDate = value.toDate;
    this.ngOnInit();
  }

  //when choose the options to use to display the articles
  onChangeOptions(value) {
    if (value == 'חפש לפי כותרת' || value == 'חפש לפי תאריך וגם לפי כותרת') {
      this.showSearchName = true;
      if (value == 'חפש לפי כותרת')
        this.search_by = "name";
      else
        this.search_by = "nameDate";
    }
    else
      this.showSearchName = false;

    if (value == 'חפש לפי תאריך' || value == 'חפש לפי תאריך וגם לפי כותרת') {
      this.showSearchDates = true;
      if (value == 'חפש לפי תאריך')
        this.search_by = "date";
      else
        this.search_by = "nameDate";
    }
    else
      this.showSearchDates = false;

  }
}
