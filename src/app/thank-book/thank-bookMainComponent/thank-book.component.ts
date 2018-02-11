import { Component, OnInit } from '@angular/core';
import { ThankBookService } from '../thank-book.service';
import { ThankMessage } from '../../shared/models/objects-models/thankMessage';

@Component({
  selector: 'app-thank-book',
  templateUrl: './thank-book.component.html',
  styleUrls: ['./thank-book.component.css'],
})
export class ThankBookComponent implements OnInit {

  private thankMessagesArray: ThankMessage[] = [];
  constructor(private thankBookService: ThankBookService) { }

  ngOnInit() {
    this.thankBookService.getFbReviews().subscribe(
      data => {
        var the_data = data.data;
        for (var i = 0; i < the_data.length; i++) {
          var thankMessage: ThankMessage = new ThankMessage(the_data[i].created_time, the_data[i].rating, the_data[i].review_text, the_data[i].reviewer.name);
          this.thankMessagesArray.push(thankMessage);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

}
