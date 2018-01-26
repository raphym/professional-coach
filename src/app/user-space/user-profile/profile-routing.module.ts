import { Routes, RouterModule } from "@angular/router";
import { ProfileComponent } from "./profile.component";


const AUTH_ROUTES: Routes = [

    { path: 'profile', component: ProfileComponent },
];

export const ProfileRoutingModule = RouterModule.forChild(AUTH_ROUTES);