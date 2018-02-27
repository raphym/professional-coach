import { NgModule } from '@angular/core';
import { UserSpaceComponent } from './userSpace.component';
import { SharedModule } from '../shared/module/shared.module';
import { UserSpaceRoutingModule } from './userSpace-routing.module';
import { UserSpaceService } from './userSpace.service';
import { ProfileModule } from './user-profile/profile.module';


@NgModule({
  declarations: [
    UserSpaceComponent,
  ],
  imports: [
    SharedModule,
    UserSpaceRoutingModule,
    // TrainingModule,
    ProfileModule
  ],
  providers: [
    UserSpaceService,
  ],
  exports: []
})
export class UserSpaceModule { }
