import { NgModule } from "@angular/core";

import { AdminRoutingModule } from "./admin-routing.module";
import { AdminSpaceComponent } from './admin-space.component';
import { ArticleAdminComponent } from './articles/article-admin/article-admin.component';
import { SharedModule } from "../shared/module/shared.module";
import { UserManagementComponent } from './user-management/user-management.component';
import { UserManagementService } from "./user-management/user-management.service";

@NgModule({
    declarations: [
        AdminSpaceComponent,
        ArticleAdminComponent,
        UserManagementComponent,
    ],
    imports:
        [
            SharedModule,
            AdminRoutingModule,
        ],
    providers: [
        UserManagementService
    ]


})
export class AdminModule {

}