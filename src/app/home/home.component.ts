import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { UsefulService } from '../shared/services/utility/useful.service';
import { ArticleService } from '../articles/article-service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

const HEADER_SIZE = 56;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public langDirection;
  public langTextAlign;
  public heightPage = window.innerHeight - HEADER_SIZE;
  public widthPage = window.innerWidth;

  //for the anchor in the page
  public scrollExecuted: boolean = false;
  constructor(public usefulService: UsefulService,
    public articleService: ArticleService,
    public activatedRoute: ActivatedRoute) { }

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
  }

  onResize() {
    this.heightPage = window.innerHeight - HEADER_SIZE;
    this.widthPage = window.innerWidth;
  }

  ngAfterViewChecked() {

    //to navigate to the anchor in the page
    if (!this.scrollExecuted) {
      let routeFragmentSubscription: Subscription;

      // Automatic scroll to the anchor in the page
      routeFragmentSubscription =
        this.activatedRoute.fragment
          .subscribe(fragment => {
            if (fragment) {
              let element = document.getElementById(fragment);
              if (element) {
                element.scrollIntoView();
                this.scrollExecuted = true;
              }
            }
          });
    }

  }

  //load more articles
  loadMoreArticles() {
    this.articleService.loadMoreArticlesEmitter.emit();
  }

}
