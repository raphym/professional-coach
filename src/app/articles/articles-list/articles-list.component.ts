import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Article } from '../../shared/models/objects-models/article';
import { ArticleService } from '../article-service';
import { SuccessService } from '../../shared/components/notif-to-user/success/success.service';
import { ErrorService } from '../../shared/components/notif-to-user/errors/error.service';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { NgForm } from '@angular/forms';

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
  private showOption:boolean = false;


  //array of articles
  articles: Article[];
  constructor(
    private articleService: ArticleService,
    private successService: SuccessService,
    private errorService: ErrorService,
    private loaderService: LoaderService,
    private lc: NgZone
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
      lc.run(() => {
        this.statusText = status;
        if (status == 'bottom reached')
          this.loadMore();
      });
    };
  }

  //on init get the count of articles and start to load them
  ngOnInit() {
    //reset value
    this.numsLoadedArticles = 0;
    this.numsOfArticles = 0;
    this.loadingMutex = false;
    //enable the loader
    this.loaderService.enableLoader();
    this.articleService.getArticlesCount()
      .subscribe(
      data => {
        this.numsOfArticles = data.count;
        this.articles = new Array();
        if (this.numsOfArticles > 0)
          this.loadMore();
        else
          //disable the loader
          this.loaderService.disableLoader();

      },
      error => {
        console.log(error);
      }
      );
  }

  //on destroy , remove the onScroll event
  ngOnDestroy() {
    window.onscroll = () => { };
    //window.removeEventListener('onscroll',this.onScrollEvent,true)

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

  //show the diplay option
  onShowOptions()
  {
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
