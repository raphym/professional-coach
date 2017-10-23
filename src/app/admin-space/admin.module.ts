import { NgModule } from "@angular/core";

import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AdminRoutingModule } from "./admin-routing.module";
import { HealthArticleEditComponent } from './health-article-edit/health-article-edit.component';
import { AdminSpaceComponent } from './admin-space.component';

@NgModule({
    declarations:[
        
    HealthArticleEditComponent,
        
    AdminSpaceComponent
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