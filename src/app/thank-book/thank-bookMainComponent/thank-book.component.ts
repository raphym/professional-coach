import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { ThankBookService } from '../thank-book.service';
import { ThankMessage } from '../../shared/models/objects-models/thankMessage';
import { UsefulService } from '../../shared/services/utility/useful.service';

const HEADER_SIZE = 56;

@Component({
  selector: 'app-thank-book',
  templateUrl: './thank-book.component.html',
  styleUrls: ['./thank-book.component.css'],
  animations: [
    trigger('movePanel', [
      transition('active => inactive', [
        animate(600, keyframes([
          style({ opacity: 0, transform: 'translateY(-200px)', offset: 0 }),
          style({ opacity: 1, transform: 'translateY(25px)', offset: .75 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
        ]))]),
      transition('inactive => active', [
        animate(600, keyframes([
          style({ opacity: 0, transform: 'translateY(-200px)', offset: 0 }),
          style({ opacity: 1, transform: 'translateY(25px)', offset: .75 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
        ]))]),
      transition('void => inactive', [
        animate(600, keyframes([
          style({ opacity: 0, transform: 'translateY(-200px)', offset: 0 }),
          style({ opacity: 1, transform: 'translateY(25px)', offset: .75 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
        ]))
      ]),
      transition('inactive => void', [
        animate(600, keyframes([
          style({ opacity: 0, transform: 'translateY(-200px)', offset: 0 }),
          style({ opacity: 1, transform: 'translateY(25px)', offset: .75 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
        ]))
      ]),
      transition('void => active', [
        animate(600, keyframes([
          style({ opacity: 0, transform: 'translateY(-200px)', offset: 0 }),
          style({ opacity: 1, transform: 'translateY(25px)', offset: .75 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
        ]))
      ]),
      transition('active => void', [
        animate(600, keyframes([
          style({ opacity: 0, transform: 'translateY(-200px)', offset: 0 }),
          style({ opacity: 1, transform: 'translateY(25px)', offset: .75 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
        ]))
      ])
    ])
  ]
})
export class ThankBookComponent implements OnInit {

  public initiate: boolean = false;
  public thankMessagesArray: ThankMessage[] = [];
  public thankMessage: ThankMessage;
  public cursorPosition: number = 0;
  public maxCursorPosition: number = 0;
  public heightPage = window.innerHeight - HEADER_SIZE;
  public widthPage = window.innerWidth;
  public fontSize = 0;
  public stateAnimation: string = 'inactive';
  public langDirection;
  public langTextAlign;

  constructor(public thankBookService: ThankBookService, public usefulService: UsefulService) { }

  ngOnInit() {
    //subscribe to the langage
    this.usefulService.langTransmitter.subscribe(
      config_langage => {
        this.langDirection = config_langage.direction;
        this.langTextAlign = config_langage.textAlign;
      }
    );
    //set langage
    this.usefulService.initLangage();
    this.init();
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
    this.stateAnimation = (this.stateAnimation === 'inactive' ? 'active' : 'inactive');
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
