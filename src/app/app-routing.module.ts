import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from "./home/home.component";
import { ContactMeComponent } from "./contact-me/contact-me.component";
import { AboutComponent } from "./about/about.component";
import { AuthGuardAdmin } from './auth/auth-guard-admin.service';
import { AdminSpaceComponent } from './admin-space/admin-space.component';
import { ArticlesComponent } from './articles/article.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { GuestbookMessagesComponent } from './Guestbook/guestbook-messages.component';

const appRoutes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactMeComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  declarations: [],
  providers: [AuthGuardAdmin]
})

export class AppRoutingModule { }
