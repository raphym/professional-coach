import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../shared/models/objects-models/user.model';
import { ProfileService } from '../profile.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoaderService } from '../../../shared/components/loader/loader.service';

@Component({
  selector: 'profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {

  @Input() private user: User;
  @Input() private showEdit: boolean;
  @Input() private langDirection: string;
  @Input() private langTextAlign: string;
  @Output() notifyEditFinish: EventEmitter<boolean> = new EventEmitter<boolean>();
  private myForm: FormGroup;
  private imageBase64: string = '';
  private imageToDisplay: string = '';
  private imageExist: boolean = false;



  constructor(private profileService: ProfileService, private loaderService: LoaderService) { }

  ngOnInit() {
    if (this.user.picture != null && this.user.picture != '') {
      this.imageToDisplay = this.user.picture;
      this.imageExist = true;
    }
    //init the form with the details of the user
    this.myForm = new FormGroup({
      userName: new FormControl(this.user.userName, Validators.required),
      phone: new FormControl(this.user.phone, null),
      street: new FormControl(this.user.street, null),
      streetNumber: new FormControl(this.user.streetNumber, null),
      city: new FormControl(this.user.city, null),
      country: new FormControl(this.user.country, null)
    });
  }

  //when clicked on the button Save
  onSave() {

    //enable the loader
    this.loaderService.enableLoader();

    var emailChanged = false;
    var fieldsLabelUpdated = new Array;
    var fieldsValueUpdated = new Array;

    Object.keys(this.myForm.controls).forEach(key => {
      if (this.myForm.get(key).value != this.user[key]) {
        fieldsLabelUpdated.push(key);
        fieldsValueUpdated.push(this.myForm.get(key).value);
      }
    });

    //check if the user has uploaded a profile picture
    if (this.imageBase64 != null && this.imageBase64 != '') {
      fieldsLabelUpdated.push('picture');
      fieldsValueUpdated.push(this.imageBase64);
    }
    //there are fields to update
    if (fieldsLabelUpdated.length > 0 && fieldsLabelUpdated.length == fieldsValueUpdated.length) {

      const fields = { id: this.user._id, labels: fieldsLabelUpdated, values: fieldsValueUpdated };
      this.profileService.updateUser(fields).subscribe((response) => {
        //disable the loader 
        this.loaderService.disableLoader();
        this.notifyEditFinish.emit(true);
        console.log('ok');
        console.log(response);
      },
        (error) => {
          //disable the loader      
          this.loaderService.disableLoader();

          console.log('not ok');
          console.log(error);
        });
    }
    else {
      //disable the loader 
      this.loaderService.disableLoader();
      this.notifyEditFinish.emit(true);
      console.log('ok');
    }
  }

  //when clicked on the button cancel
  editCancel() {
    this.notifyEditFinish.emit(false);
  }

  //upload profile image
  onUploadFile(files) {
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      var cursor = myReader.result.indexOf('data:image');
      if (cursor == 0) {
        this.imageBase64 = myReader.result;
        this.imageToDisplay = myReader.result;
        this.imageExist = true;
      }
      else {
        this.imageExist = false;
      }
    }
    myReader.readAsDataURL(files[0])
  }
}
