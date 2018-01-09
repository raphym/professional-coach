import { Routes, RouterModule } from "@angular/router";
import { ArticlesComponent } from "./article.component";
import { ArticleItemComponent } from "./article-item/article-item.component";
import { ArticleEditComponent } from "./article-edit/article-edit.component";
import { ArticlesListComponent } from "./articles-list/articles-list.component";
import { AuthGuardAdmin } from "../auth/auth-guard-admin.service";


const AUTH_ROUTES: Routes = [

    { path: 'articles', component: ArticlesComponent },
    { path: 'view-article/:id', component: ArticleItemComponent },
    { path: 'edit-article', component: ArticleEditComponent, canActivate: [AuthGuardAdmin] },
    { path: 'edit-article/:id', component: ArticleEditComponent, canActivate: [AuthGuardAdmin] },

];

export const ArticleRoutingModule = RouterModule.forChild(AUTH_ROUTES);