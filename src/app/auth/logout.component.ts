import { Component, OnInit } from "@angular/core";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-logout',
    template: `
    `

})
export class LogoutComponent implements OnInit {
    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit() {
        this.authService.logout(true);
        this.router.navigate(['/']);
    }
    // onLogout() {
    //     this.authService.logout(true);
    //     this.router.navigate(['/']);
    // }

}