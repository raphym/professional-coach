import { Component, OnInit, Input, Output } from '@angular/core';
import { User } from '../../shared/models/objects-models/user.model';
import { ProfileService } from './profile.service';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { UsefulService } from '../../shared/services/utility/useful.service';
import { SuccessService } from '../../shared/components/notif-to-user/success/success.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']

})
export class ProfileComponent implements OnInit {
  private user: User;
  private loaded: boolean = false;
  private langTextAlign;
  private langDirection;

  private showImage: boolean = false;

  @Output() private showEdit: boolean;
  @Input() private notifyEditFinish;


  constructor(private profileService: ProfileService,
    private loaderService: LoaderService,
    private usefulService: UsefulService,
    private successService: SuccessService
  ) {

  }

  ngOnInit() {
    //subscribe to the langage
    this.usefulService.langTransmitter.subscribe(
      config_langage => {
        this.langTextAlign = config_langage.textAlign;
        this.langDirection = config_langage.direction;
      }
    );
    //set langage
    this.usefulService.initLangage();

    //get the profile of the user
    this.init();
  }

  init() {
    //get the profile of the user
    this.loaderService.enableLoader();
    this.loaded = false;
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
  onEdit() {
    this.showEdit = true;
  }

  //finish to execute the child component (profile-edit)
  onFinishEdit(event) {
    this.showEdit = false;
    if (event != true)
      return;
    else {
      this.successService.handleSuccess({ title: 'Ok', message: 'User updated' });
      this.init();
    }
  }


}
