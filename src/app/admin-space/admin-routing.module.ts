import { Routes, RouterModule } from "@angular/router";
import { ArticleEditComponent } from "./articles/article-edit/article-edit.component";
import { AdminSpaceComponent } from "./admin-space.component";
import { AuthGuardAdmin } from "../auth/auth-guard-admin.service";
import { ArticleAdminComponent } from "./articles/article-admin/article-admin.component";
import { ArticlesViewAdminComponent } from "./articles/articles-view-admin/articles-view-admin.component";


const AUTH_ROUTES: Routes = [

    {path: '' , component: AdminSpaceComponent ,canActivate:[AuthGuardAdmin], children: [
        {path:'article-admin' , component:ArticleAdminComponent},
        {path:'articles-view-admin' , component:ArticlesViewAdminComponent},        
        { path: 'article-edit' , component: ArticleEditComponent},
    ] },

];

export const AdminRoutingModule = RouterModule.forChild(AUTH_ROUTES);