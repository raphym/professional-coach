import { Routes, RouterModule } from "@angular/router";
import { ProfileComponent } from "./profile.component";
import { AuthGuardUserLogged } from "../../auth/auth-guard-userLogged.service";


const AUTH_ROUTES: Routes = [

    { path: '', component: ProfileComponent, canActivate: [AuthGuardUserLogged] },
];

export const ProfileRoutingModule = RouterModule.forChild(AUTH_ROUTES);