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
                    if (data.title == null) {
                        return false;
                    }
                    else if (data.title == 'Not Authenticated') {
                        return false;
                    }
                    else if (data.title == 'Authenticated') {
                        var levelRights = data.decoded.user.levelRights;
                        if (levelRights != null) {
                            if (levelRights >= 200) {
                                console.log('Should be OK!!');
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