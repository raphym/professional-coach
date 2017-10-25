import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ArticleService } from '../../../services/article/article-service';
import { Article } from '../../../models/objects-models/article';
import { SuccessService } from '../../../notif-to-user/success/success.service';
import { ErrorService } from '../../../notif-to-user/errors/error.service';

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css']
})
export class ArticleEditComponent implements OnInit {

  rForm: FormGroup;
  loaded: boolean;
  title: string;
  imageBase64: string;
  imageBase64Temp: string;

  content: string


  constructor(private fb: FormBuilder,
    private articleService: ArticleService,
    private successService: SuccessService,
    private errorService: ErrorService) {
    this.loaded = false;
    this.rForm = fb.group({
      'title': [null, Validators.required],
      'content': [null, Validators.required]
    });
  }

  addPost(post) {
    this.title = post.title;
    this.content = post.content;
    this.imageBase64 = this.imageBase64Temp;

    //create
    const article = new Article('null', this.title, this.imageBase64, this.content);
    //reset form
    this.rForm.reset();
    this.loaded = false;
    this.imageBase64Temp = '';
    this.title = '';
    this.content = '';
    //send request
    this.articleService.addArticle(article)
      .subscribe(
      data => {
        this.successService.handleSuccess(data.json());
      },
      error => {
        this.errorService.handleError(error);
      }
      );

  }

  onUploadFile(files) {
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.imageBase64Temp = myReader.result;
      this.loaded = true;
    }

    myReader.readAsDataURL(files[0])
  }

  ngOnInit() {

  }

}
