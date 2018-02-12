import { Component, OnInit } from '@angular/core';
import { ThankBookService } from '../thank-book.service';
import { ThankMessage } from '../../shared/models/objects-models/thankMessage';

@Component({
  selector: 'app-thank-book',
  templateUrl: './thank-book.component.html',
  styleUrls: ['./thank-book.component.css'],
})
export class ThankBookComponent implements OnInit {

  private initiate: boolean = false;
  private thankMessagesArray: ThankMessage[] = [];
  private thankMessage: ThankMessage;
  private cursorPosition: number = 0;
  private maxCursorPosition: number = 0;
  constructor(private thankBookService: ThankBookService) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.thankBookService.getFbReviews().subscribe(
      data => {
        var the_data = data.data;
        for (var i = 0; i < the_data.length; i++) {
          var thankMessage: ThankMessage = new ThankMessage(the_data[i].created_time, the_data[i].rating, the_data[i].review_text, the_data[i].reviewer.name);
          this.thankMessagesArray.push(thankMessage);
        }

        //update the value of the max
        this.maxCursorPosition = this.thankMessagesArray.length - 1;
        //set the first thankMessage
        this.setPosition();
        //initiate the display
        this.initiate = true;
      },
      error => {
        console.log(error);
      }
    );
  }

  setPosition() {
    this.thankMessage = this.thankMessagesArray[this.cursorPosition];
  }

  previousClicked() {
    if (this.cursorPosition <= 0)
      this.cursorPosition = this.maxCursorPosition;
    else
      this.cursorPosition--;

    this.setPosition();
  }

  nextClicked() {
    if (this.cursorPosition >= this.maxCursorPosition)
      this.cursorPosition = 0;
    else
      this.cursorPosition++;

    this.setPosition();
  }
}
