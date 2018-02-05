import { Routes, RouterModule } from "@angular/router";
import { SignupComponent } from "./signup/signup.component";
import { SigninComponent } from "./signin/signin.component";
import { LogoutComponent } from "./logout.component";
import { ConfirmRegistrationComponent } from "./confirm-registration/confirm-registration.component";
import { AuthGuardPreventIfAlreadyConnected } from "./auth-guard-prevent-if-already-connected.service";



const AUTH_ROUTES: Routes = [
    { path: 'signup', component: SignupComponent, canActivate: [AuthGuardPreventIfAlreadyConnected] },
    { path: 'signin', component: SigninComponent, canActivate: [AuthGuardPreventIfAlreadyConnected] },
    { path: 'logout', component: LogoutComponent },
    { path: 'confirmRegistration/:randomHash', component: ConfirmRegistrationComponent, canActivate: [AuthGuardPreventIfAlreadyConnected] },
    { path: 'confirmRegistration', component: ConfirmRegistrationComponent, canActivate: [AuthGuardPreventIfAlreadyConnected] }
];

export const AuthRoutingModule = RouterModule.forChild(AUTH_ROUTES);