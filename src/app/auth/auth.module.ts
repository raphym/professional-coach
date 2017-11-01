import { NgModule } from "@angular/core";
import { LogoutComponent } from "./logout.component";
import { SignupComponent } from "./signup/signup.component";
import { SigninComponent } from "./signin/signin.component";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { authRouting } from "./auth.routing";



@NgModule({
    declarations:[
        LogoutComponent,
        SignupComponent,
        SigninComponent,
    ],
    imports:[
        CommonModule,
        ReactiveFormsModule,
        authRouting
    ],providers: [
      ]

})
export class AuthModule{

}