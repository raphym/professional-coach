import { Component, OnInit, Input } from '@angular/core';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  private loading = false;
  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    //on init subscribe to the event emiter of the loader service to get notifs.
    this.loaderService.loadingEvent
      .subscribe(
      (data) => {
        this.loading = data;
      });
  }

}
