import { Http, Response, Headers } from '@angular/http';
import { ErrorService } from '../../components/notif-to-user/errors/error.service'
import { SuccessService } from '../../components/notif-to-user/success/success.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from "@angular/core";

@Injectable()
export class MailService {
    getUrl = window.location;
    baseUrl = this.getUrl.protocol + "//" + this.getUrl.host + "/";
    POST_ADDRESS = this.baseUrl + 'sendmail/send';
    constructor(public http: Http, public errorService: ErrorService, public successService: SuccessService) { }


    sendMail(emaildest: string, object_mail: string, message_mail: string, text_option: string) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const body = { email: emaildest, object_mail: object_mail, message: message_mail, text_option: text_option };


        return this.http.post(this.POST_ADDRESS, body, { headers: headers })
            .catch((error: Response) => {
                //this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }

}