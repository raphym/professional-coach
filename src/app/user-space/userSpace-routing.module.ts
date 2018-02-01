import { Routes, RouterModule } from "@angular/router";
import { UserSpaceComponent } from "./userSpace.component";
import { AuthGuardUserLogged } from "../auth/auth-guard-userLogged.service";


const AUTH_ROUTES: Routes = [

    { path: 'userspace', component: UserSpaceComponent, canActivate: [AuthGuardUserLogged] },
];

export const UserSpaceRoutingModule = RouterModule.forChild(AUTH_ROUTES);