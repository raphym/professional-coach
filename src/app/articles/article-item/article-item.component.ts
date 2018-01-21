import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../article-service';
import { Article } from '../../shared/models/objects-models/article';
import { ActivatedRoute, Params, Router } from "@angular/router";//Router (if redirect)
import { LoaderService } from '../../shared/components/loader/loader.service';
import { AuthService } from '../../auth/auth.service';
import { SuccessService } from '../../shared/components/notif-to-user/success/success.service';
import { ErrorService } from '../../shared/components/notif-to-user/errors/error.service';


@Component({
  selector: 'app-article-item',
  templateUrl: './article-item.component.html',
  styleUrls: ['./article-item.component.css']
})
export class ArticleItemComponent implements OnInit {


  private article: Article;
  private id;
  private showImage: boolean = false;
  private showEdit: boolean = false;
  private display: string = 'none';
  private url: string = 'http://localhost:3000/';

  constructor(private articleService: ArticleService,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private authService: AuthService,
    private successService: SuccessService,
    private errorService: ErrorService,
    private router: Router) { }

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
            //if there is an image so show it
            if (this.article.image != undefined && this.article.image != null && this.article.image != '')
              this.showImage = true;
            document.getElementById('theContent').innerHTML = this.article.content;
            this.url += this.router.url;
            //show the article
            this.display = 'block';
          },
          error => {
            //disable the loader
            this.loaderService.disableLoader();
            console.error(error)
          }
          );
      });
  }

  //check if the user is an admin
  isItAdmin() {
    return this.authService.isItAdmin();
  }

  //to show the edit options
  onShowEdit() {
    this.showEdit = !this.showEdit;
  }
  //when click on edit Article
  onEdit() {
    var path = "/edit-article/";
    path += this.article._id;
    this.router.navigateByUrl(path);
  }

  //when click on delete Article
  onDelete() {
    //enable the loader
    this.loaderService.enableLoader();
    this.articleService.deleteArticle(this.article._id)
      .subscribe(
      (data) => {
        //disable the loader
        this.loaderService.disableLoader();
        this.successService.handleSuccess(data);
        this.router.navigateByUrl('/articles');
      },
      error => {
        //disable the loader
        this.loaderService.disableLoader();
        this.errorService.handleError(error.json());
      }
      );
  }

  //share article 
  shareArticle() {
    this.articleService.shareArticle(this.url, this.article.title, this.article.intro).then(
      function (response) {
      }
    ).catch(function (error) {
      console.log(error);
    })
  }

}
