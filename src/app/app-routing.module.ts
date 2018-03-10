import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from "./home/home.component";
import { AuthGuardAdmin } from './auth/auth-guard-admin.service';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { AuthGuardUserLogged } from './auth/auth-guard-userLogged.service';
import { LogoutComponent } from './auth/logout.component';
import { AuthGuardPreventIfAlreadyConnected } from './auth/auth-guard-prevent-if-already-connected.service';

const appRoutes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'logout', component: LogoutComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  declarations: [],
  providers: [AuthGuardAdmin, AuthGuardUserLogged, AuthGuardPreventIfAlreadyConnected]
})

export class AppRoutingModule { }
