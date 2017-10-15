import { Http, Response, Headers } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';


import { GuestbookMessage } from "../models/objects-models/guestbook-message.model";
import { ErrorService } from '../notif-to-user/errors/error.service';

const MESSAGE_ADDRESS = 'http://localhost:3000/guestbook';


@Injectable()
export class GuestbookMessageService {
    private guestbookMessages: GuestbookMessage[] = [];
    messageIsEdit = new EventEmitter<GuestbookMessage>();

    constructor(private http: Http, private errorService: ErrorService) { }

    addMessage(message: GuestbookMessage) {

        const body = JSON.stringify(message);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.post(MESSAGE_ADDRESS + token, body, { headers: headers })
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
        return this.http.get(MESSAGE_ADDRESS)
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
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.patch(MESSAGE_ADDRESS + '/' + message.messageId + token, body, { headers: headers })
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
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.delete(MESSAGE_ADDRESS + '/' + message.messageId + token)
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }


}