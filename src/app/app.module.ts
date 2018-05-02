import { NgModule } from '@angular/core';
import { CookieService, CookieOptions } from 'angular2-cookie/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Http, RequestOptions } from "@angular/http";
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import 'hammerjs';
import { TranslateStaticLoader, TranslateModule, TranslateLoader, TranslateService } from 'ng2-translate';
import { AppRoutingModule } from "./app-routing.module";
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { AboutComponent } from './about/about.component';
import { ContactMeComponent } from './contact-me/contact-me.component';
import { ErrorComponent } from './shared/components/notif-to-user/errors/error.component';
import { SuccessComponent } from './shared/components/notif-to-user/success/success.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { ThankBookComponent } from './thank-book/thank-bookMainComponent/thank-book.component';
import { ThankMessageComponent } from './thank-book/thank-bookMainComponent/thank-message/thank-message.component';


import { ErrorService } from './shared/components/notif-to-user/errors/error.service';
import { SuccessService } from './shared/components/notif-to-user/success/success.service';
import { AuthService } from './auth/auth.service';
import { MailService } from './shared/services/mail/mail.service';
import { LoaderService } from './shared/components/loader/loader.service';
import { UsefulService } from './shared/services/utility/useful.service';
import { ArticleService } from './articles/article-service';
import { LangService } from './shared/services/langService/langService.service';

import { SharedModule } from './shared/module/shared.module';
import { ThankBookModule } from './thank-book/thank-book.module';
import { SharedArticleModule } from './shared/module/sharedArticleModule/sharedArticle.module';


//for the translation
export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, '../assets/Application_language', '.json');
}

//for the gesture
declare var Hammer: any;
export class MyHammerConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement) {
    let mc = new Hammer(element, {
      touchAction: "pan-y"
    });
    return mc;
  }
}

//export funct of angular2-jwt
export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
}

//export funct for cookies
export function cookieServiceFactory() {
  return new CookieService();
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
    ThankBookComponent,
    ThankMessageComponent,
  ],
  imports: [
    SharedModule,
    SharedArticleModule,
    BrowserAnimationsModule,
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.threeBounce,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff'
    }),
    ThankBookModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
  ],
  providers: [
    TranslateService,
    LangService,
    CookieService,
    { provide: CookieService, useFactory: cookieServiceFactory },
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
    {
      // hammer instantion with custom config
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule {

}
