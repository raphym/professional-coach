import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { RouterModule } from '@angular/router';



import { ArticleService } from './article-service';
import { ArticlesComponent } from './article.component';
import { ArticlesListComponent } from './articles-list/articles-list.component';
import { ArticleItemComponent } from './article-item/article-item.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ArticleRoutingModule } from './article-routing.module';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

@NgModule({
  declarations: [

    ArticlesComponent,
    ArticlesListComponent,
    ArticleItemComponent,
	ArticleEditComponent,

    
  ],
  imports: [
    BrowserModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,    
    ArticleRoutingModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()


  ],
  providers:[
    CookieService,

    ArticleService,
  ],
  exports: []
})
export class ArticleModule { }
