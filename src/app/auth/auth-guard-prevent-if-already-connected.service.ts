import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { CookieService } from 'angular2-cookie/core';
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuardPreventIfAlreadyConnected implements CanActivate {
    constructor(
        public authService: AuthService,
        public cookieService: CookieService) {

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        var token = this.cookieService.get('token');
        if (token == null || token == '') {
            return true;
        }
        else {
            return this.authService.isLoggedIn()
                .map(
                data => {
                    if (data.message == null) {
                        return true;
                    }
                    else if (data.message == 'Not Authenticated') {
                        return true;
                    }
                    else if (data.message == 'Authenticated') {
                        return false;
                    }
                },
                error => {
                    return false;
                }
                );
        }
    }
}