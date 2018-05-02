import { NgModule } from '@angular/core';
import { ArticleService } from './article-service';
import { ArticleItemComponent } from './article-item/article-item.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { ArticleRoutingModule } from './article-routing.module';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { SharedModule } from '../shared/module/shared.module';
import { PreviewArticleComponent } from './preview-article/preview-article.component';
import { SharedArticleModule } from '../shared/module/sharedArticleModule/sharedArticle.module';

@NgModule({
  declarations: [
    ArticleItemComponent,
    ArticleEditComponent,
  ],
  imports: [
    SharedModule,
    SharedArticleModule,
    ArticleRoutingModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  providers: [
    ArticleService,
  ],
  exports: []
})
export class ArticleModule { }
