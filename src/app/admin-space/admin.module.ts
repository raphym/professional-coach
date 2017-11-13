import { NgModule } from "@angular/core";

import { AdminRoutingModule } from "./admin-routing.module";
import { AdminSpaceComponent } from './admin-space.component';
import { ArticleAdminComponent } from './articles/article-admin/article-admin.component';
import { SharedModule } from "../shared/module/shared.module";

@NgModule({
    declarations: [
        AdminSpaceComponent,
        ArticleAdminComponent,
    ],
    imports:
        [
            SharedModule,
            AdminRoutingModule,
        ]

})
export class AdminModule {

}