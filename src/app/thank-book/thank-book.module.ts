import { NgModule } from '@angular/core';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { SharedModule } from '../shared/module/shared.module';
import { ThankBookService } from './thank-book.service';
import { ThankBookRoutingModule } from './thank-book-routing.module';
import { ThankMessageComponent } from './thank-bookMainComponent/thank-message/thank-message.component';

@NgModule({
  declarations: [
  ],
  imports: [
    SharedModule,
    ThankBookRoutingModule
  ],
  providers: [
    ThankBookService
  ],
  exports: []
})
export class ThankBookModule { }
