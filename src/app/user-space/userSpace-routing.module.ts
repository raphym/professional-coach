import { Routes, RouterModule } from "@angular/router";
import { UserSpaceComponent } from "./userSpace.component";
import { AuthGuardUserLogged } from "../auth/auth-guard-userLogged.service";


const AUTH_ROUTES: Routes = [

    { path: '', component: UserSpaceComponent, canActivate: [AuthGuardUserLogged] },
    //lazy loading : Profile Module
    {
        path: 'profile',
        loadChildren: './user-profile/profile.module#ProfileModule'
    }
];

export const UserSpaceRoutingModule = RouterModule.forChild(AUTH_ROUTES);