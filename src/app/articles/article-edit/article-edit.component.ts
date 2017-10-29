import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ArticleService } from '../article-service';
import { SuccessService } from '../../notif-to-user/success/success.service';
import { ErrorService } from '../../notif-to-user/errors/error.service';
import { Article } from '../../models/objects-models/article';
import { ActivatedRoute, Params } from '@angular/router';


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


  constructor(private fb: FormBuilder,
    private articleService: ArticleService,
    private successService: SuccessService,
    private errorService: ErrorService,
    private route: ActivatedRoute,
  ) {

    this.loaded = false;
    this.editMode = false;
    this.rForm = fb.group({
      'title': [null, Validators.required],
      'content': [null, Validators.required]
    });
  }

  ngOnInit() {

    this.route.params
      .subscribe(
      (params: Params) => {
        this.id = params['id'];

        if (this.id != null) {
          this.articleService.getTheArticle(this.id)
            .subscribe(
            (article: Article) => {
              this.article = article;
              this.editMode = params['id'] != null;
              this.initForm();
            },
            error => console.error(error)
            );
        }

      });
  }


  private initForm() {
    let title = '';
    let content = '';

    //if edit an article
    if (this.editMode) {
      title = this.article.title;
      content = this.article.content;
      if (this.article.image != null)
        this.imageBase64Temp = this.article.image;
      this.loaded = true;
    }
    this.rForm = this.fb.group({
      'title': [title, Validators.required],
      'content': [content, Validators.required]
    });
  }

  addPost(post) {
    this.title = post.title;
    this.content = post.content;
    this.imageBase64 = this.imageBase64Temp;

    //new article
    if (!this.editMode) {
      const article = new Article('null', this.title, this.imageBase64, this.content);
      this.articleService.addArticle(article)
        .subscribe(
        data => {
          this.successService.handleSuccess(data);
        },
        error => {
          this.errorService.handleError(error);
        }
        );
    }
    //edit existing article
    else {
      const article = new Article(this.id, this.title, this.imageBase64, this.content);
      this.articleService.updateArticle(article)
        .subscribe(
        data => {
          this.successService.handleSuccess(data);
        },
        error => {
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
