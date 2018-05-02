import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preview-article',
  templateUrl: './preview-article.component.html',
  styleUrls: ['./preview-article.component.css']
})
export class PreviewArticleComponent implements OnInit {

  @Input() public title;
  @Input() public image;
  @Input() public id;
  @Input() public intro;
  @Input() public date;
  @Input() public index;

  public pair: boolean = false;

  constructor(public router: Router) { }

  onClick() {
    var path = 'articles/view-article/';
    path += this.id;
    this.router.navigateByUrl(path);
  }
  ngOnInit() {
    if (this.index % 2 == 0)
      this.pair = true;
  }

}
