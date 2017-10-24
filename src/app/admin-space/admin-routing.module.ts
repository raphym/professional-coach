import { Routes, RouterModule } from "@angular/router";
import { HealthArticleEditComponent } from "./health-article-edit/health-article-edit.component";
import { AdminSpaceComponent } from "./admin-space.component";
import { AuthGuardAdmin } from "../auth/auth-guard-admin.service";


const AUTH_ROUTES: Routes = [
     /*   
    {path:'', component: AdminSpaceComponent, canActivate: [AuthGuardAdmin]},
    {path:'health-article-edit', component: HealthArticleEditComponent}
*/

    {path: 'admin-space' , component: AdminSpaceComponent , children: [
        { path: 'health-article-edit' , component: HealthArticleEditComponent},
    ] },

];

export const AdminRoutingModule = RouterModule.forChild(AUTH_ROUTES);