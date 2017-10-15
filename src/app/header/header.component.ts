import { Component, Input } from '@angular/core';
import { Response } from "@angular/http";
import { AuthService } from "../auth/auth.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
}
)
export class HeaderComponent 
{    
    constructor(private authService:AuthService) 
    {

    }

    isLoggedIn()
    {
        return this.authService.isLoggedIn();
    }

    onLogout()
    {
        this.authService.logout();
    }
    
}