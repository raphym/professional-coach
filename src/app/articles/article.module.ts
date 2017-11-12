import { NgModule } from '@angular/core';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { ArticleService } from './article-service';
import { ArticlesComponent } from './article.component';
import { ArticlesListComponent } from './articles-list/articles-list.component';
import { ArticleItemComponent } from './article-item/article-item.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { ArticleRoutingModule } from './article-routing.module';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { SharedModule } from '../shared/module/shared.module';

@NgModule({
  declarations: [
    ArticlesComponent,
    ArticlesListComponent,
    ArticleItemComponent,
    ArticleEditComponent,
  ],
  imports: [
    SharedModule,
    ArticleRoutingModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  providers: [
    CookieService,
    ArticleService,
  ],
  exports: []
})
export class ArticleModule { }
