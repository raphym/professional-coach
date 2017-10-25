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
        this.isAdmin = false;
        this.isLoggedIn();
    }

    isLoggedIn() {
        var token = this.cookieService.get('token');
        if (token == null || token == '') {
            this.isExistUser = false;
        }
        else {
            this.authService.isLoggedIn()
                .subscribe(
                data => {
                    if (data.title == null) {
                        this.isExistUser = false;
                        this.displayName = '';
                        this.isAdmin = false;
                        this.authService.logout();
                    }
                    else if (data.title == 'Not Authenticated') {
                        this.isExistUser = false;
                        this.displayName = '';
                        this.isAdmin = false;
                        this.authService.logout();
                    }
                    else if (data.title == 'Authenticated') {
                        this.isExistUser = true;
                        var levelRights = data.decoded.user.levelRights;
                        if (levelRights != null) {
                            if (levelRights >= 200)
                                this.isAdmin = true;
                        }

                        var firstName = data.decoded.user.firstName;
                        if (firstName != null) {
                            this.displayName = firstName;
                        }
                    }
                },
                error => {
                    this.isExistUser = false;
                    this.displayName = '';
                    this.isAdmin = false;
                    this.authService.logout();
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