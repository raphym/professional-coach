import { Injectable, Input, EventEmitter, Output } from "@angular/core";


@Injectable()
export class UsefulService {
    constructor() { }

    //create a registration template mail
    //English
    // createRegMail(firstName: String, lastName: String, secretCode: string, link: string, supportLink: string) {
    //     var mail_content = `
    // <h1 style="color: #5e9ca0;">Hi , ` + firstName + ' ' + lastName + ` </h1>
    // <p><span style="color: #0000ff;">Please confirm your registration by following the instructions:<br />1) Copy the secret code<br />2) Click on the link<br />3) Past the secret code into the confirm page</span></p>
    // <p style="text-align: center;"><span style="text-decoration: underline;">Secret Code:</span><strong>  `+ secretCode + `</strong></p>
    // <p style="text-align: center;"><span style="text-decoration: underline;">Link:</span><strong>  <a href="`+ link + `" target="_blank" rel="noopener">Confirm</a></strong></p>
    // <p><br /><span style="color: #ff0000;">If you have a problem please&nbsp;<a href="`+ supportLink + `" target="_blank" rel="noopener">contact us</a></span></p>
    // <p>Coach</p>
    // `;
    //     return mail_content;
    // }

    //create a registration template mail
    //Hebrew
    createRegMail(userName: String, secretCode: string, link: string, supportLink: string) {
        var mail_content = `
    <h1 style="color: #5e9ca0;text-align:right;">שלום , ` + userName + ` </h1>
    <p style="color: #0000ff;text-align:right;">:אשר את ההרשמה שלך על פי ההנחיות הבאות
    <br/>א) העתק את הקוד הסודי<br/>
    ב) לחץ על הקישור<br/>
    ג) העבר את הקוד הסודי לדף אישור</p>
    <p style="text-align: center;"><strong>`+ secretCode + `</strong> :קוד סודי</p>
    <p style="text-align: center;"> קישור: <strong>  <a href="`+ link + `" target="_blank" rel="noopener">אשר</a></strong></p>
    <p style="color: #ff0000;text-align: right;direction: rtl;align: right;">אם יש לך בעיה &nbsp;<a style="color: #ff0000;" href="`+ supportLink + `" target="_blank" rel="noopener">תיצור איתנו קשר</a></p>
    <p style="text-align: right;direction: rtl;align: right;">G-Fit</p>
    `;
        return mail_content;
    }

    //create a random string
    makeRandomString(nums: number) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 1; i < nums; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
}