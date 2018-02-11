import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'thank-message',
  templateUrl: './thank-message.component.html',
  styleUrls: ['./thank-message.component.css']
})
export class ThankMessageComponent implements OnInit {

  @Input() private createdTime: string;
  @Input() private rating: string;
  @Input() private reviewText: string;
  @Input() private name: string;

  constructor() { }

  ngOnInit() {

  }

}
