import { NgModule } from "@angular/core";
import { GuestbookMessageService } from "./guestbook-message.service";
import { GuestbookMessagesComponent } from "./guestbook-messages.component";
import { GuestbookMessageComponent } from "./guestbook-message.component";
import { GuestbookMessageInputComponent } from "./guestbook-message-input.component";
import { GuestbookRoutingModule } from "./guestbook-routing.module";
import { GuestbookMessageListComponent } from "./guestbook-message-list.component";
import { SharedModule } from '../shared/module/shared.module';

@NgModule({
    declarations: [
        GuestbookMessagesComponent,
        GuestbookMessageComponent,
        GuestbookMessageInputComponent,
        GuestbookMessageListComponent
    ],
    imports: [
        SharedModule,
        GuestbookRoutingModule
    ],
    providers: [GuestbookMessageService]

})
export class GuestbookModule {

}
