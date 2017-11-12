import { NgModule } from "@angular/core";
import { AuthRoutingModule } from "./auth-routing.module";
import { LogoutComponent } from "./logout.component";
import { SignupComponent } from "./signup/signup.component";
import { SigninComponent } from "./signin/signin.component";
import { ConfirmRegistrationComponent } from './confirm-registration/confirm-registration.component';
import { SharedModule } from "../shared/module/shared.module";



@NgModule({
    declarations: [
        LogoutComponent,
        SignupComponent,
        SigninComponent,
        ConfirmRegistrationComponent,
    ],
    imports: [
        SharedModule,
        AuthRoutingModule,
    ], providers: [
    ]

})
export class AuthModule {

}