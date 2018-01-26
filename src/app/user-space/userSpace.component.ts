import { Component, OnInit, Input } from '@angular/core';
import { UserSpaceService } from './userSpace.service';
import { User } from '../shared/models/objects-models/user.model';
import { LoaderService } from '../shared/components/loader/loader.service';

@Component({
  selector: 'app-UserSpace',
  templateUrl: './UserSpace.component.html',
  styleUrls: ['./UserSpace.component.css']
})
export class UserSpaceComponent implements OnInit {
  private user: User;
  private loaded: boolean = false;

  constructor(private userSpaceService: UserSpaceService,
    private loaderService: LoaderService) {

  }

  ngOnInit() {

    this.userSpaceService.getUser()
      .subscribe(
      (response) => {
        //disable the loader
        this.loaderService.disableLoader();
        this.user = response.user;
        this.loaded = true;
      },
      error => {
        //disable the loader
        this.loaderService.disableLoader();
        console.error(error)
      }
      );
  }


}
