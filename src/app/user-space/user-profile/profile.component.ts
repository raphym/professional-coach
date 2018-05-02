import { Component, OnInit, Input, Output } from '@angular/core';
import { User } from '../../shared/models/objects-models/user.model';
import { ProfileService } from './profile.service';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { SuccessService } from '../../shared/components/notif-to-user/success/success.service';
import { LangService } from '../../shared/services/langService/langService.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']

})
export class ProfileComponent implements OnInit {
  public user: User;
  public loaded: boolean = false;
  public langTextAlign;
  public langDirection;

  public showImage: boolean = false;

  @Output() public showEdit: boolean;
  @Input() public notifyEditFinish;


  constructor(public profileService: ProfileService,
    public loaderService: LoaderService,
    public langService: LangService,
    public successService: SuccessService
  ) {

  }

  ngOnInit() {
    //subscribe to the langage
    this.langService.langTransmitter.subscribe(
      config_langage => {
        this.langTextAlign = config_langage.textAlign;
        this.langDirection = config_langage.direction;
      }
    );
    this.langService.initLangage();

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
