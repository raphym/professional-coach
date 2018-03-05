import { Component, OnInit, Input, OnChanges } from '@angular/core';
const HEADER_SIZE = 56;

@Component({
  selector: 'thank-message',
  templateUrl: './thank-message.component.html',
  styleUrls: ['./thank-message.component.css'],
})
export class ThankMessageComponent implements OnInit {

  @Input() public createdTime: string;
  @Input() public rating: string;
  @Input() public reviewText: string;
  @Input() public name: string;
  public heightPage = window.innerHeight - HEADER_SIZE;
  public widthPage = window.innerWidth;
  public fontSize = 0;
  public langDirectionName;
  public langDirectionMessage;

  constructor() { }

  ngOnInit() {
    this.displayStars();
    this.onResize();
  }
  onResize() {
    this.heightPage = window.innerHeight - HEADER_SIZE;
    this.calculateFontSize();
  }

  //calcul to get the font size
  calculateFontSize() {
    var average_width_height = (this.widthPage + this.heightPage) / 2;
    this.fontSize = average_width_height * (28 / 1280);
  }

  //display stars
  displayStars() {
    var i = 1;
    while (i <= parseInt(this.rating)) {
      var clasIdStars = 's' + i;
      document.getElementById(clasIdStars).classList.add('checked');
      i++;
    }
  }

  //when the @input is changing
  ngOnChanges() {
    this.displayStars();
    this.detectHebrewName();
    this.detectHebrewReviewText();
  }

  //detect hebrew for the text direction
  detectHebrewName() {
    if (this.name == null || this.name == '') {
      this.langDirectionName = 'ltr';
      return;
    }
    var position = this.reviewText.search(/[\u0590-\u05FF]/);
    if (position >= 0) {
      this.langDirectionName = 'rtl';
    }
    else {
      this.langDirectionName = 'ltr';
    }
  }

  //detect hebrew for the text direction
  detectHebrewReviewText() {
    if (this.reviewText == null || this.reviewText == '') {
      this.langDirectionMessage = 'ltr';
      return;
    }
    var position = this.reviewText.search(/[\u0590-\u05FF]/);
    if (position >= 0) {
      this.langDirectionMessage = 'rtl';
    }
    else {
      this.langDirectionMessage = 'ltr';
    }
  }

}
