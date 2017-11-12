import { Routes, RouterModule } from "@angular/router";
import { SignupComponent } from "./signup/signup.component";
import { SigninComponent } from "./signin/signin.component";
import { LogoutComponent } from "./logout.component";
import { ConfirmRegistrationComponent } from "./confirm-registration/confirm-registration.component";

const AUTH_ROUTES: Routes = [
    { path: '', redirectTo: 'signup', pathMatch: 'full' },
    { path: 'signup', component: SignupComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'confirmRegistration/:randomHash', component: ConfirmRegistrationComponent },
    { path: 'confirmRegistration', component: ConfirmRegistrationComponent }
];

export const AuthRoutingModule = RouterModule.forChild(AUTH_ROUTES);