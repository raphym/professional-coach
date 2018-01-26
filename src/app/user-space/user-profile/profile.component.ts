import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../shared/models/objects-models/user.model';
import { ProfileService } from './profile.service';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { UsefulService } from '../../shared/services/utility/useful.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']

})
export class ProfileComponent implements OnInit {
  private user: User;
  private loaded: boolean = false;
  private langTextAlign;
  private showImage: boolean = false;

  private showEdit:boolean = false;

  constructor(private profileService: ProfileService,
    private loaderService: LoaderService,
    private usefulService: UsefulService
  ) {

  }

  ngOnInit() {
    //subscribe to the langage
    this.usefulService.langTransmitter.subscribe(
      config_langage => {
        this.langTextAlign = config_langage.textAlign;
      }
    );
    //set langage
    this.usefulService.initLangage();

    //get the profile of the user
    this.profileService.getUser()
      .subscribe(
      (response) => {
        //disable the loader
        this.loaderService.disableLoader();
        this.user = response.user;
        if (this.user.picture != null && this.user.picture != '')
          this.showImage = true;
        this.loaded = true;
      },
      error => {
        //disable the loader
        this.loaderService.disableLoader();
        console.error(error)
      }
      );
  }

  //edit the profile
  onEdit()
  {
    this.showEdit=true;
  }


}
