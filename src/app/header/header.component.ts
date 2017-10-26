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
    private isExistUser;
    private isAdmin;
    constructor(
        private authService: AuthService,
        private cookieService: CookieService) { }

    ngOnInit() {
        this.displayName = "";
        this.isExistUser = false;
        this.isAdmin = false;
        this.authService.userLogInEvent.subscribe(
            (data) => {
                this.isExistUser = true;
                this.displayName = data.firstName;
                if (data.levelRights >= 200) {
                    this.isAdmin = true;
                }
            }
        );

        this.authService.userLogOutEvent.subscribe(
            (data) => {
                this.onLogout();
            }
        );
        this.isAdmin = false;
        this.isLoggedIn();
    }

    isLoggedIn() {
        var token = this.cookieService.get('token');
        if (token == null || token == '') {
            this.onLogout();
        }
        else {
            this.authService.isLoggedIn()
                .subscribe(
                data => {
                    if (data.message == null) {
                        this.onLogout();
                    }
                    else if (data.message == 'Not Authenticated') {
                        this.onLogout();
                    }
                    else if (data.message == 'Authenticated') {
                        this.isExistUser = true;
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
                    this.onLogout();
                }
                );
        }
    }

    onLogout() {
        this.isExistUser = false;
        this.displayName = '';
        this.isAdmin = false;
        this.authService.logout();
    }
}