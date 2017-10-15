import { Component } from "@angular/core";

@Component({
    selector:'app-messages',
    template:`
        <div class="container-fluid">
            <h1 style="text-align:center;">Guest Book</h1>
            <br><br>
            <div class="row">
                <div class="col-md-12">
        
                    <app-guestbook-message-input></app-guestbook-message-input>
                </div>
            </div>
            <hr>
            <div class="row">
                <div class="col-md-12">        
                    <app-guestbook-message-list></app-guestbook-message-list>
                </div>
            </div>
        </div>    
    `
})
export class GuestbookMessagesComponent{

}