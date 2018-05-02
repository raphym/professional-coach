import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { AuthGuardAdmin } from './auth/auth-guard-admin.service';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { AuthGuardUserLogged } from './auth/auth-guard-userLogged.service';
import { AuthGuardPreventIfAlreadyConnected } from './auth/auth-guard-prevent-if-already-connected.service';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  //lazy loading : Admin Module
  {
    path: 'admin',
    loadChildren: './admin-space/admin.module#AdminModule'
  },
  //lazy loading : UserSpace Module
  {
    path: 'userspace',
    loadChildren: './user-space/userSpace.module#UserSpaceModule'
  },
  //lazy loading : Auth Module
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule'
  },
  //lazy loading : Articles Module
  {
    path: 'articles',
    loadChildren: './articles/article.module#ArticleModule'
  },
  //not found root
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  declarations: [],
  providers: [AuthGuardAdmin, AuthGuardUserLogged, AuthGuardPreventIfAlreadyConnected]
})

export class AppRoutingModule { }
