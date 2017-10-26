import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { CookieService } from 'angular2-cookie/core';
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuardAdmin implements CanActivate {
    constructor(
        private authService: AuthService,
        private cookieService: CookieService) {

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        var token = this.cookieService.get('token');
        if (token == null || token == '') {
            return false;
        }
        else {
            return this.authService.isLoggedIn()
                .map(
                data => {
                    if (data.message == null) {
                        return false;
                    }
                    else if (data.message == 'Not Authenticated') {
                        return false;
                    }
                    else if (data.message == 'Authenticated') {
                        var the_data = data.data;
                        var levelRights = the_data.user.levelRights;
                        if (levelRights != null) {
                            if (levelRights >= 200) {
                                return true;
                            }
                        }
                    }
                },
                error => {
                    return false;
                }
                );
        }
    }
}