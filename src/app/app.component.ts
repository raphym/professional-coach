import { Component, OnInit } from '@angular/core';
import { LoaderService } from './shared/components/loader/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  public loading = false;
  constructor(public loaderService: LoaderService) { }


  ngOnInit() {
    //on init subscribe to the event emiter of the loader service to get notifs.
    this.loaderService.loadingEvent
      .subscribe(
      (data) => {
        this.loading = data;
      });
  }
}
