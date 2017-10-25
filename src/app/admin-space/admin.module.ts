import { NgModule } from "@angular/core";

import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AdminRoutingModule } from "./admin-routing.module";
import {ArticleEditComponent } from './articles/article-edit/article-edit.component';
import { AdminSpaceComponent } from './admin-space.component';
import { ArticleAdminComponent } from './articles/article-admin/article-admin.component';
import { ArticlesViewAdminComponent } from "./articles/articles-view-admin/articles-view-admin.component";

@NgModule({
    declarations:[
        
    ArticleEditComponent,
        
    AdminSpaceComponent,
        
    ArticleAdminComponent,
    ArticlesViewAdminComponent,  
],
    imports:
    [
        CommonModule,
        ReactiveFormsModule,
        AdminRoutingModule,
        FormsModule,     
    ]

})
export class AdminModule{

}