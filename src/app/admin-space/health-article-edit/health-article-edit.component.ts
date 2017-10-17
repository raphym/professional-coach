import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HealthArticleService } from '../../services/health-article/health-article-service';
import { HealthArticle } from '../../models/objects-models/health-article';
import { SuccessService } from '../../notif-to-user/success/success.service';
import { ErrorService } from '../../notif-to-user/errors/error.service';

@Component({
  selector: 'app-health-article-edit',
  templateUrl: './health-article-edit.component.html',
  styleUrls: ['./health-article-edit.component.css']
})
export class HealthArticleEditComponent implements OnInit {

  rForm: FormGroup;
  loaded: boolean;
  title: string;
  imageBase64: string;
  imageBase64Temp: string;

  content: string


  constructor(private fb: FormBuilder,
    private healthArticleService: HealthArticleService,
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
    const article = new HealthArticle('null', this.title, this.imageBase64, this.content);
    //reset form
    this.rForm.reset();
    this.loaded = false;
    this.imageBase64Temp = '';
    this.title = '';
    this.content = '';
    //send request
    this.healthArticleService.addArticle(article)
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
