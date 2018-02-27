import { Routes, RouterModule } from "@angular/router";
import { ThankBookComponent } from "./thank-bookMainComponent/thank-book.component";

const AUTH_ROUTES: Routes = [

    // { path: 'thankbook', component: ThankBookComponent },
];

export const ThankBookRoutingModule = RouterModule.forChild(AUTH_ROUTES);