import { NgModule } from "@angular/core";
import { LogoutComponent } from "./logout.component";
import { SignupComponent } from "./signup/signup.component";
import { SigninComponent } from "./signin/signin.component";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { authRouting } from "./auth.routing";
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { Http, RequestOptions } from '@angular/http';

//export funct of angular2-jwt
export function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(new AuthConfig(), http, options);
  }

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
    ],providers: [/* angular2-jwt */
        {
          provide: AuthHttp,
          useFactory: authHttpServiceFactory,
          deps: [Http, RequestOptions]
        }
      ]

})
export class AuthModule{

}