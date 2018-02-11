import { NgModule } from '@angular/core';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { SharedModule } from '../shared/module/shared.module';
import { ThankBookComponent } from './thank-bookMainComponent/thank-book.component';
import { ThankBookService } from './thank-book.service';
import { ThankBookRoutingModule } from './thank-book-routing.module';
import { ThankMessageComponent } from './thank-bookMainComponent/thank-message/thank-message.component';

@NgModule({
  declarations: [
    ThankBookComponent,
    ThankMessageComponent,
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
