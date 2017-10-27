import { NgModule } from "@angular/core";

import { CommonModule } from "@angular/common";
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminSpaceComponent } from './admin-space.component';
import { ArticleAdminComponent } from './articles/article-admin/article-admin.component';

@NgModule({
    declarations:[
                
    AdminSpaceComponent,
        
    ArticleAdminComponent,
],
    imports:
    [
        CommonModule,        
        AdminRoutingModule,
    ]

})
export class AdminModule{

}