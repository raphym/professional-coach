import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GuestbookMessagesComponent } from "./guestbook-messages.component";


const APP_ROUTES: Routes = [
    { path: 'guestbook', component: GuestbookMessagesComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(APP_ROUTES)
    ],
    exports: [
        RouterModule
    ]
})
export class GuestbookRoutingModule {

}