import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from "./home/home.component";
import { AuthGuardAdmin } from './auth/auth-guard-admin.service';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { GuestbookMessagesComponent } from './Guestbook/guestbook-messages.component';
import { AuthGuardUserLogged } from './auth/auth-guard-userLogged.service';

const appRoutes: Routes = [

  { path: '', component: HomeComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  declarations: [],
  providers: [AuthGuardAdmin, AuthGuardUserLogged]
})

export class AppRoutingModule { }
