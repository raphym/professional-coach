import { Routes, RouterModule } from "@angular/router";
import { UserSpaceComponent } from "./userSpace.component";


const AUTH_ROUTES: Routes = [

    { path: 'userspace', component: UserSpaceComponent },
];

export const UserSpaceRoutingModule = RouterModule.forChild(AUTH_ROUTES);