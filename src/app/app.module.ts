import { NgModule } from '@angular/core';
import { CookieService } from 'angular2-cookie/services/cookies.service';


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from "./app-routing.module";
import { HeaderComponent } from './shared/components/header/header.component';
import { AboutComponent } from './about/about.component';
import { ContactMeComponent } from './contact-me/contact-me.component';
import { Http, RequestOptions } from "@angular/http";
import { ErrorService } from './shared/components/notif-to-user/errors/error.service';
import { SuccessService } from './shared/components/notif-to-user/success/success.service';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { TrainingModule } from './user-space/training/training.module';
import { ErrorComponent } from './shared/components/notif-to-user/errors/error.component';
import { GuestbookModule } from './Guestbook/guestbook.module';
import { MailService } from './shared/services/mail/mail.service';
import { SuccessComponent } from './shared/components/notif-to-user/success/success.component';
import { AdminModule } from './admin-space/admin.module';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { LoaderService } from './shared/components/loader/loader.service';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { SharedModule } from './shared/module/shared.module';
import { UsefulService } from './shared/services/utility/useful.service';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { ArticlesComponent } from './articles/article.component';
import { ArticleItemComponent } from './articles/article-item/article-item.component';
import { ArticlesListComponent } from './articles/articles-list/articles-list.component';
import { PreviewArticleComponent } from './articles/preview-article/preview-article.component';
import { ArticleService } from './articles/article-service';
import { ArticleModule } from './articles/article.module';
import { UserSpaceModule } from './user-space/userSpace.module';

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
    PageNotFoundComponent,
    ArticlesComponent,
    ArticlesListComponent,
    PreviewArticleComponent,
  ],
  imports: [
    SharedModule,
    AuthModule,
    TrainingModule,
    GuestbookModule,
    AdminModule,
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.threeBounce,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff'
    }),
    SharedModule,
    ArticleModule,
    UserSpaceModule,
    AppRoutingModule,

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
    },
    UsefulService,
    ArticleService,
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
