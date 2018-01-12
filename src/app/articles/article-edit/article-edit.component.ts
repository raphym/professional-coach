import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ArticleService } from '../article-service';
import { SuccessService } from '../../shared/components/notif-to-user/success/success.service';
import { ErrorService } from '../../shared/components/notif-to-user/errors/error.service';
import { Article } from '../../shared/models/objects-models/article';
import { ActivatedRoute, Params } from '@angular/router';
import { LoaderService } from '../../shared/components/loader/loader.service';


@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css']
})
export class ArticleEditComponent implements OnInit {


  private id;
  private article;
  private editMode;
  private rForm: FormGroup;
  private loaded: boolean;
  private title: string;
  private imageBase64: string;
  private imageBase64Temp: string;
  private content: string
  private intro: string;


  constructor(private fb: FormBuilder,
    private articleService: ArticleService,
    private successService: SuccessService,
    private errorService: ErrorService,
    private route: ActivatedRoute,
    private loaderService: LoaderService
  ) {

    this.loaded = false;
    this.editMode = false;
    this.rForm = fb.group({
      'title': [null, Validators.required],
      'content': [null, Validators.required],
      'intro': [null, Validators.compose([Validators.required, Validators.maxLength(150)])]
    });
  }

  ngOnInit() {
    this.route.params
      .subscribe(
      (params: Params) => {
        this.id = params['id'];

        if (this.id != null) {
          //enable the loader
          this.loaderService.enableLoader();
          this.articleService.getTheArticle(this.id)
            .subscribe(
            (article: Article) => {
              this.article = article;
              this.editMode = params['id'] != null;
              this.initForm();
              //disable the loader
              this.loaderService.disableLoader();
            },
            error => {
              //disable the loader
              this.loaderService.disableLoader();
              console.error(error)
            }
            );
        }

      });
  }


  private initForm() {
    let title = '';
    let content = '';
    let intro = '';

    //if edit an article
    if (this.editMode) {
      title = this.article.title;
      content = this.article.content;
      intro = this.article.intro;
      if (this.article.image != null)
        this.imageBase64Temp = this.article.image;
      this.loaded = true;
    }
    this.rForm = this.fb.group({
      'title': [title, Validators.required],
      'content': [content, Validators.required],
      'intro': [intro, Validators.compose([Validators.required, Validators.maxLength(150)])]
    });
  }

  addPost(post) {
    this.title = post.title;
    this.content = post.content;
    this.imageBase64 = this.imageBase64Temp;
    this.intro = post.intro;

    //new article
    if (!this.editMode) {
      const article = new Article('null', this.title, this.imageBase64, this.content, this.intro, null);
      //enable the loader
      this.loaderService.enableLoader();
      this.articleService.addArticle(article)
        .subscribe(
        data => {
          //disable the loader
          this.loaderService.disableLoader();
          this.successService.handleSuccess(data);
        },
        error => {
          //disable the loader
          this.loaderService.disableLoader();
          this.errorService.handleError(error);
        }
        );
    }
    //edit existing article
    else {
      const article = new Article(this.id, this.title, this.imageBase64, this.content, this.intro, null);
      //enable the loader
      this.loaderService.enableLoader();
      this.articleService.updateArticle(article)
        .subscribe(
        data => {
          //disable the loader
          this.loaderService.disableLoader();
          this.successService.handleSuccess(data);
        },
        error => {
          //disable the loader
          this.loaderService.disableLoader();
          this.errorService.handleError(error);
        }
        );
    }

    //reset form
    this.rForm.reset();
    this.loaded = false;
    this.imageBase64Temp = '';
    this.title = '';
    this.content = '';
    this.intro = '';
  }

  onUploadFile(files) {
    this.loaded = false;
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.imageBase64Temp = myReader.result;
      this.loaded = true;
    }
    myReader.readAsDataURL(files[0])
  }

}
