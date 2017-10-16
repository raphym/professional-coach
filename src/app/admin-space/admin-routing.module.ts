import { Routes, RouterModule } from "@angular/router";
import { HealthArticleEditComponent } from "./health-article-edit/health-article-edit.component";


const AUTH_ROUTES: Routes = [
        
    {path:'health-article-edit', component: HealthArticleEditComponent},

];

export const AdminRoutingModule = RouterModule.forChild(AUTH_ROUTES);