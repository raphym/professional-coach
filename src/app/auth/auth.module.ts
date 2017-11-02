import { NgModule } from "@angular/core";
import { LogoutComponent } from "./logout.component";
import { SignupComponent } from "./signup/signup.component";
import { SigninComponent } from "./signin/signin.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { authRouting } from "./auth.routing";
import { ConfirmRegistrationComponent } from './confirm-registration/confirm-registration.component';



@NgModule({
    declarations:[
        LogoutComponent,
        SignupComponent,
        SigninComponent,
        ConfirmRegistrationComponent,
    ],
    imports:[
        CommonModule,
        ReactiveFormsModule,
        authRouting,
        FormsModule,
        BrowserModule        
    ],providers: [
      ]

})
export class AuthModule{

}