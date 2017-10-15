import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { GuestbookMessageService } from "./guestbook-message.service";
import { GuestbookMessagesComponent } from "./guestbook-messages.component";
import { GuestbookMessageComponent } from "./guestbook-message.component";
import { GuestbookMessageInputComponent } from "./guestbook-message-input.component";
import { GuestbookRoutingModule } from "./guestbook-routing.module";
import { GuestbookMessageListComponent } from "./guestbook-message-list.component";





@NgModule({
    declarations:[
        GuestbookMessagesComponent,
        GuestbookMessageComponent,
        GuestbookMessageInputComponent,
        GuestbookMessageListComponent
    ],
    imports:[
        CommonModule,
        FormsModule,
        GuestbookRoutingModule
    ],
    providers: [GuestbookMessageService]

})
export class GuestbookModule{

}