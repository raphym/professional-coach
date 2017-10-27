import { Http, Response, Headers } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';


import { GuestbookMessage } from "../models/objects-models/guestbook-message.model";
import { ErrorService } from '../notif-to-user/errors/error.service';

const GET_MESSAGE_ADDRESS = 'http://localhost:3000/guestbook/getMessages';
const SAVE_MESSAGE_ADDRESS = 'http://localhost:3000/guestbook/protect/saveMessage';
const EDIT_MESSAGE_ADDRESS = 'http://localhost:3000/guestbook/protect/editMessage';
const DELETE_MESSAGE_ADDRESS = 'http://localhost:3000/guestbook/protect/deleteMessage';


@Injectable()
export class GuestbookMessageService {
    private guestbookMessages: GuestbookMessage[] = [];
    messageIsEdit = new EventEmitter<GuestbookMessage>();

    constructor(private http: Http, private errorService: ErrorService) { }

    addMessage(message: GuestbookMessage) {

        const body = JSON.stringify(message);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        
        return this.http.post(SAVE_MESSAGE_ADDRESS , body, { headers: headers })
            .map((response: Response) => {
                const result = response.json();
                const guestbookMessage = new GuestbookMessage(
                    result.obj.content,
                    result.obj.user.firstName,
                    result.obj._id,
                    result.obj.user._id);
                this.guestbookMessages.push(message);
                return message;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }

    getMessage() {
        return this.http.get(GET_MESSAGE_ADDRESS)
            .map((response: Response) => {
                const messages = response.json().obj;
                let transformedMessages: GuestbookMessage[] = [];
                for (let message of messages) {
                    transformedMessages.push(new GuestbookMessage(
                        message.content,
                        message.user.firstName,
                        message._id,
                        message.user._id));
                }
                this.guestbookMessages = transformedMessages;
                return transformedMessages;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }

    editMessage(message: GuestbookMessage) {
        this.messageIsEdit.emit(message);
    }

    updateMessage(message: GuestbookMessage) {
        const body = JSON.stringify(message);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        
        return this.http.patch(EDIT_MESSAGE_ADDRESS + '/' + message.messageId , body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }

    deleteMessage(message: GuestbookMessage) {
        //remove from the frond-end (imediately)
        this.guestbookMessages.splice(this.guestbookMessages.indexOf(message), 1);
        //remove from the backend
        return this.http.delete(DELETE_MESSAGE_ADDRESS + '/' + message.messageId)
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }


}