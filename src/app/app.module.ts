import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'angular2-cookie/services/cookies.service';


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from "./app-routing.module";
import { HeaderComponent } from './header/header.component';
import { AboutComponent } from './about/about.component';
import { ContactMeComponent } from './contact-me/contact-me.component';
import { HttpModule, Http, RequestOptions } from "@angular/http";
import { ErrorService } from './notif-to-user/errors/error.service';
import { SuccessService } from './notif-to-user/success/success.service';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { TrainingModule } from './user-space/training/training.module';
import { ErrorComponent } from './notif-to-user/errors/error.component';
import { GuestbookModule } from './Guestbook/guestbook.module';
import { MailService } from './services/mail/mail.service';
import { SuccessComponent } from './notif-to-user/success/success.component';
import { AdminModule } from './admin-space/admin.module';
import { ArticleModule } from './articles/article.module';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { LoaderComponent } from './loader/loader.component';
import { LoaderService } from './loader/loader.service';
import { FooterComponent } from './footer/footer.component';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';


//export funct of angular2-jwt
export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    AboutComponent,
    ContactMeComponent,
    ErrorComponent,
    SuccessComponent,
    LoaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    AuthModule,
    TrainingModule,
    GuestbookModule,
    AdminModule,
    ArticleModule,
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.threeBounce,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)', 
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff', 
      secondaryColour: '#ffffff', 
      tertiaryColour: '#ffffff'
  })
  ],
  providers: [
    CookieService,
    AuthService,
    ErrorService,
    SuccessService,
    MailService,
    LoaderService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
