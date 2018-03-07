import { Component, Input, OnInit } from '@angular/core';
import { Response } from "@angular/http";
import { CookieService } from 'angular2-cookie/core';
import { AuthService } from "../../../auth/auth.service";
import { TranslateService } from 'ng2-translate';
import { UsefulService } from '../../services/utility/useful.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']

}
)
export class HeaderComponent implements OnInit {
    public displayName;
    public isConnect;
    public isAdmin;
    public langDirection;
    public langTextAlign;
    public floatDirection;
    public floatDirectionReverse;
    public margLeft = "-40";
    public header_height = '80';

    constructor(
        public authService: AuthService,
        public cookieService: CookieService,
        public translate: TranslateService,
        public usefulService: UsefulService,
        public router: Router) {
    }

    //open the slide menu
    openSlideMenu() {
        document.getElementById('side-menu').style.width = '250px';
        //remove clicked dropdown content side
        var dropdown_content_side2 = document.getElementById('d_done2');
        try {
            dropdown_content_side2.classList.remove('dropdown_content_side_clicked');
        } catch (e) { }
    }
    //close the slide menu
    closeSlideMenu() {
        document.getElementById('side-menu').style.width = '0';
        //add clicked dropdown content side
        var dropdown_content_side2 = document.getElementById('d_done2');
        dropdown_content_side2.classList.add('dropdown_content_side_clicked');
    }

    //change langage
    changeLangage(langage) {
        this.usefulService.setLangage(langage);
        if (langage == 'he') {

            this.floatDirection = 'right';
            this.floatDirectionReverse = 'left';
            this.langDirection = 'rtl';
            this.margLeft = "-40";
            /* side of the side nav */
            var side_nav = document.getElementById('side-menu');
            try {
                side_nav.classList.add('sideRight');
            } catch (e) { }
            try {
                side_nav.classList.remove('sideLeft');
            } catch (e) { }
            /* side of the close button of the side nav */
            var btn_close = document.getElementById('btn_close');
            try {
                btn_close.classList.add('sideLeftButClose');
            } catch (e) { }
            try {
                btn_close.classList.remove('sideRightButClose');
            } catch (e) { }
        }

        else {
            this.floatDirection = 'left';
            this.langDirection = 'ltr';
            this.floatDirectionReverse = 'right';
            this.margLeft = "0";
            /* side of the side nav */
            var side_nav = document.getElementById('side-menu');
            try {
                side_nav.classList.add('sideLeft');
            } catch (e) { }
            try {
                side_nav.classList.add('sideRight');
            } catch (e) { }
            /* side of the close button of the side nav */

            var btn_close = document.getElementById('btn_close');
            try {
                btn_close.classList.add('sideRightButClose');
            } catch (e) { }
            try {
                btn_close.classList.remove('sideLeftButClose');
            } catch (e) { }
        }
    }

    ngOnInit() {
        this.displayName = "";
        this.isConnect = false;
        this.isAdmin = false;

        //subscribe to the langage
        this.usefulService.langTransmitter.subscribe(
            config_langage => {
                this.langDirection = config_langage.direction;
                this.langTextAlign = config_langage.textAlign;
                this.floatDirection = config_langage.floatDirection;
            }
        );
        //set langage
        this.changeLangage('he');

        //User Login Event
        this.authService.userLogInEvent.subscribe(
            (data) => {
                this.isConnect = true;
                this.displayName = data.userName;
                if (data.levelRights >= 200) {
                    this.isAdmin = true;
                }
            }
        );

        //User Logout Event
        this.authService.userLogOutEvent.subscribe(
            (data) => {
                this.isConnect = false;
                this.displayName = '';
                this.isAdmin = false;
            }
        );

        //workaround  to force the reload on the same page
        //with router.navigate
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
        this.router.events.subscribe((evt) => {
            if (evt instanceof NavigationEnd) {
                if (this.router.navigated) {
                    this.router.navigated = false;
                    window.scrollTo(0, 0);
                }
            }
        });

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
                                if (levelRights >= 200) {
                                    this.header_height = '80';
                                    this.isAdmin = true;
                                }
                            }

                            var userName = the_data.user.userName;
                            if (userName != null) {
                                this.displayName = userName;
                            }
                        }
                    },
                    error => {
                        this.onLogout(false);
                    }
                );
        }
    }

    onLogout(redirect: boolean) {
        this.isConnect = false;
        this.displayName = '';
        this.isAdmin = false;
        this.authService.logout(redirect);
    }
}