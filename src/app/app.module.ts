import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { CookieService } from 'angular2-cookie/services/cookies.service';


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from "./app-routing.module";
import { HeaderComponent } from './header/header.component';
import { AboutComponent } from './about/about.component';
import { ContactMeComponent } from './contact-me/contact-me.component';
import { HttpModule } from "@angular/http";
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
import { HealthArticleService } from './services/health-article/health-article-service';
import { HealthArticlesComponent } from './articles/health-articles/health-articles.component';
import { HealthArticlesListComponent } from './articles/health-articles/health-articles-list/health-articles-list.component';
import { HealthArticleItemComponent } from './articles/health-articles/health-article-item/health-article-item.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    AboutComponent,
    ContactMeComponent,
    ErrorComponent,
    SuccessComponent,
    HealthArticlesComponent,
    HealthArticlesListComponent,
    HealthArticleItemComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    AuthModule,
    TrainingModule,
    GuestbookModule,
    AdminModule
  ],
  providers:[
    CookieService,
    AuthService,
    ErrorService,
    SuccessService,
    MailService,
    HealthArticleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
