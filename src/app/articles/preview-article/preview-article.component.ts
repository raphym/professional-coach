import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preview-article',
  templateUrl: './preview-article.component.html',
  styleUrls: ['./preview-article.component.css']
})
export class PreviewArticleComponent implements OnInit {

  @Input() private title;
  @Input() private image;
  @Input() private id;
  @Input() private intro;
  @Input() private date;
  @Input() private index;

  private pair:boolean = false;

  constructor(private router: Router) { }

  onClick() {
    var path = 'view-article/';
    path += this.id;
    this.router.navigateByUrl(path);
  }
  ngOnInit() {
    // console.log("index: " + this.index);
    if(this.index % 2==0)
      this.pair=true;
  }

}
