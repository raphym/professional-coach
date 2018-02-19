import { Component, OnInit, Input, OnChanges } from '@angular/core';
const HEADER_SIZE = 56;

@Component({
  selector: 'thank-message',
  templateUrl: './thank-message.component.html',
  styleUrls: ['./thank-message.component.css'],
})
export class ThankMessageComponent implements OnInit {

  @Input() private createdTime: string;
  @Input() private rating: string;
  @Input() private reviewText: string;
  @Input() private name: string;
  private heightPage = window.innerHeight - HEADER_SIZE;
  private widthPage = window.innerWidth;
  private fontSize = 0;


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
  }

}
