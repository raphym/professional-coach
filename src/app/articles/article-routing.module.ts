import { Routes, RouterModule } from "@angular/router";
import { ArticlesComponent } from "./article.component";
import { ArticleItemComponent } from "./article-item/article-item.component";
import { ArticleEditComponent } from "./article-edit/article-edit.component";
import { ArticlesListComponent } from "./articles-list/articles-list.component";


const AUTH_ROUTES: Routes = [

    {path: '', component: ArticlesComponent},
    { path: 'edit-article', component: ArticleEditComponent },
    { path: 'view-article/:id', component: ArticleItemComponent },
];

export const ArticleRoutingModule = RouterModule.forChild(AUTH_ROUTES);