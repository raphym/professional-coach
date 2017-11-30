import { Component, OnInit, OnDestroy } from '@angular/core';
import { Article } from '../../shared/models/objects-models/article';
import { ArticleService } from '../article-service';
import { AuthService } from '../../auth/auth.service';
import { SuccessService } from '../../shared/components/notif-to-user/success/success.service';
import { ErrorService } from '../../shared/components/notif-to-user/errors/error.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { TableService } from '../../shared/components/table/table.service';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.css']
})
export class ArticlesListComponent implements OnInit, OnDestroy {

  private size;

  //for the table
  private config;
  private pageToDisplay = 0;

  //the subscriptions to the emitters
  private subscriptionRowClicked;
  private subscriptionRowsConfig;
  private subscriptionLoadPage;

  articles: Article[];
  constructor(
    private articleService: ArticleService,
    private authService: AuthService,
    private successService: SuccessService,
    private errorService: ErrorService,
    private router: Router,
    private loaderService: LoaderService,
    private tableService: TableService
  ) {
  }

  ngOnInit() {

    this.articleService.getArticles()
      .subscribe(
      articles => {
        this.articles = articles;
        this.size = articles.length;
      }
      );

    //Emitter to detect if in the table component the user change the config
    this.subscriptionRowsConfig = this.tableService.rowsConfigEmitter.subscribe(
      config => {
        this.config = config;
        this.pageToDisplay = 0;
        this.init();
      }
    );

    //Emitter to display the page clicked
    this.subscriptionLoadPage = this.tableService.loadPageEmitter.subscribe(
      pageClicked => {
        this.pageToDisplay = pageClicked;
        this.init();
      }
    );

    //Emitter to dected if a row of a table is clicked
    this.subscriptionRowClicked = this.tableService.rowClickedEmitter.subscribe(
      rowValues => {
        //redirect to the clicked article
        var redirectArticle = 'view-article/';
        redirectArticle += rowValues[0];
        this.router.navigateByUrl(redirectArticle);
      }
    );

  }

  ngOnDestroy() {
    //unsubscribe to the emitters
    this.subscriptionRowsConfig.unsubscribe();
    this.subscriptionLoadPage.unsubscribe();
    this.subscriptionRowClicked.unsubscribe();
  }

  init() {
    //reset the articles array
    this.articles = new Array;
    //enable the loader
    this.loaderService.enableLoader();

    this.articleService.getArticlesCount().subscribe(
      data => {
        var configClass = 'table table-dark right';
        //Emitter to config the class table
        this.tableService.configClassEmitter.emit(configClass);
        //disable the loader
        this.loaderService.disableLoader();
        this.getArticles(data.count);
      },
      error => {
        console.log(error);
        //disable the loader
        this.loaderService.disableLoader();
      }
    );
  }

  //go to display the table
  displayTable(articles) {
    var columsName = new Array('Id', 'כתבה', 'תאריך');
    var rowsValues = new Array();
    for (var i = 0; i < articles.length; i++) {
      //push the value into the rows values array
      rowsValues.push(new Array(
        articles[i]._id,
        articles[i].title,
        "היום של התאריך"
      ));
    }
    //Event emitter to display the table in the table component
    this.tableService.diplayDataEmitter.emit({ columsName, rowsValues });
  }

  //go to get the articles from the server
  getArticles(count) {
    var details = {
      articlesPerPage: this.config.rowsPerPage,
      pageClicked: this.pageToDisplay
    }

    //enable the loader
    this.loaderService.enableLoader();
    this.articleService.getPartOfArticles(details).subscribe(
      data => {
        //disable the loader
        this.loaderService.disableLoader();
        this.articles = data.articles;
        this.tableService.buttonsPageEmitter.emit(Array(Math.ceil(count / details.articlesPerPage)).fill(0).map((x, i) => i + 1));
        this.displayTable(data.articles);
      },
      error => {
        console.log(error);
        //disable the loader
        this.loaderService.disableLoader();
      }
    );

  }

  isItAdmin() {
    return this.authService.isItAdmin();
  }

  onDelete(id) {
    //enable the loader
    this.loaderService.enableLoader();
    this.articleService.deleteArticle(id)
      .subscribe(
      (data) => {
        //disable the loader
        this.loaderService.disableLoader();
        this.init();
        this.successService.handleSuccess(data);
      },
      error => {
        //disable the loader
        this.loaderService.disableLoader();
        this.errorService.handleError(error.json());
      }
      );
  }

}
