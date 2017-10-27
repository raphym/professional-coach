import { Routes, RouterModule } from "@angular/router";
import { AdminSpaceComponent } from "./admin-space.component";
import { AuthGuardAdmin } from "../auth/auth-guard-admin.service";
import { ArticleAdminComponent } from "./articles/article-admin/article-admin.component";


const AUTH_ROUTES: Routes = [

    {path: '' , component: AdminSpaceComponent ,canActivate:[AuthGuardAdmin], children: [
        {path:'article-admin' , component:ArticleAdminComponent},
    ] },

];

export const AdminRoutingModule = RouterModule.forChild(AUTH_ROUTES);