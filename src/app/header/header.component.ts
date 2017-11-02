import { Component, Input, OnInit } from '@angular/core';
import { Response } from "@angular/http";
import { CookieService } from 'angular2-cookie/core';
import { AuthService } from "../auth/auth.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
}
)
export class HeaderComponent implements OnInit {
    private displayName;
    private isConnect;
    private isAdmin;
    constructor(
        private authService: AuthService,
        private cookieService: CookieService) {

    }

    ngOnInit() {
        this.displayName = "";
        this.isConnect = false;
        this.isAdmin = false;
        this.authService.userLogInEvent.subscribe(
            (data) => {
                this.isConnect = true;
                this.displayName = data.firstName;
                if (data.levelRights >= 200) {
                    this.isAdmin = true;
                }
            }
        );

        this.authService.userLogOutEvent.subscribe(
            (data) => {
                this.isConnect = false;
                this.displayName = '';
                this.isAdmin = false;
            }
        );
        //call the function IsLoggedIn 
        this.isLoggedIn();
    }

    //function which call the authService to check if connected
    isLoggedIn() {
        var token = this.cookieService.get('token');
        if (token == null || token == '') {
            this.onLogout(false);
        }
        else {
            this.authService.isLoggedIn()
                .subscribe(
                data => {
                    if (data.message == null) {
                        this.onLogout(false);
                    }
                    else if (data.message == 'Not Authenticated') {
                        this.onLogout(false);
                    }
                    else if (data.message == 'Authenticated') {
                        this.isConnect = true;
                        var the_data = data.data;
                        var levelRights = the_data.user.levelRights;
                        if (levelRights != null) {
                            if (levelRights >= 200)
                                this.isAdmin = true;
                        }

                        var firstName = the_data.user.firstName;
                        if (firstName != null) {
                            this.displayName = firstName;
                        }
                    }
                },
                error => {
                    this.onLogout(false);
                }
                );
        }
    }

    onLogout(redirect:boolean) {
        this.isConnect = false;
        this.displayName = '';
        this.isAdmin = false;
        this.authService.logout(redirect);
    }
}