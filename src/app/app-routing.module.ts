import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from "./home/home.component";
import { ContactMeComponent } from "./contact-me/contact-me.component";
import { AboutComponent } from "./about/about.component";
import { HealthArticlesComponent } from './articles/health-articles/health-articles.component';
import { HealthArticleItemComponent } from './articles/health-articles/health-article-item/health-article-item.component';
import { AuthGuardAdmin } from './auth/auth-guard-admin.service';
import { AdminSpaceComponent } from './admin-space/admin-space.component';

const appRoutes: Routes = [
  
      {path: '' , component: HomeComponent},
      {path: 'articles' , component: HealthArticlesComponent},      
      {path: 'article/:id' , component: HealthArticleItemComponent},       
      {path: 'about' , component: AboutComponent},
      {path: 'contact' , component: ContactMeComponent}, 
      {path: 'admin-space' , component: AdminSpaceComponent,canActivate:[AuthGuardAdmin]}
           
  ];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
  declarations: [],
  providers:[AuthGuardAdmin]
})

export class AppRoutingModule { }
