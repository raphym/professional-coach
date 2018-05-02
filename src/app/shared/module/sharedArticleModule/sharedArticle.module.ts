import { NgModule } from "@angular/core";
import { ArticlesComponent } from "../../../articles/article.component";
import { ArticlesListComponent } from "../../../articles/articles-list/articles-list.component";
import { PreviewArticleComponent } from "../../../articles/preview-article/preview-article.component";
import { SharedModule } from "../shared.module";
@NgModule({
    declarations: [
        ArticlesComponent,
        ArticlesListComponent,
        PreviewArticleComponent
    ],
    imports: [
        SharedModule
    ],
    exports: [
        ArticlesComponent,
        ArticlesListComponent,
        PreviewArticleComponent
    ],
    providers: [
    ]
})
export class SharedArticleModule {
    constructor() {
    }
}