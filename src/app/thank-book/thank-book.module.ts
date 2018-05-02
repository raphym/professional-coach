import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/module/shared.module';
import { ThankBookService } from './thank-book.service';
import { ThankMessageComponent } from './thank-bookMainComponent/thank-message/thank-message.component';

@NgModule({
  declarations: [
  ],
  imports: [
    SharedModule,
  ],
  providers: [
    ThankBookService
  ],
  exports: []
})
export class ThankBookModule { }
