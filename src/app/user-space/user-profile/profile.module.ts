import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '../../shared/module/shared.module';
import { ProfileService } from './profile.service';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';


@NgModule({
  declarations: [
    ProfileComponent,
    ProfileEditComponent,
  ],
  imports: [
    SharedModule,
    ProfileRoutingModule,
  ],
  providers: [
    ProfileService,
  ],
  exports: []
})
export class ProfileModule { }
