import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CookieService } from 'angular2-cookie/services/cookies.service';



import { ArticleService } from '../services/article/article-service';
import { ArticlesComponent } from './article.component';
import { ArticlesListComponent } from './articles-list/articles-list.component';
import { ArticleItemComponent } from './article-item/article-item.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [

    ArticlesComponent,
    ArticlesListComponent,
    ArticleItemComponent,
    
  ],
  imports: [
    BrowserModule,
    RouterModule

  ],
  providers:[
    CookieService,

    ArticleService,
  ],
  exports: [ArticlesComponent,
    ArticlesListComponent,
    ArticleItemComponent,]
})
export class ArticleModule { }
