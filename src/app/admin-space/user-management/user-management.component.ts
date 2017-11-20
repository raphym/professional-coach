import { Component, OnInit } from '@angular/core';
import { UserManagementService } from './user-management.service';
import { User } from '../../shared/models/objects-models/user.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ErrorService } from '../../shared/components/notif-to-user/errors/error.service';
import { SuccessService } from '../../shared/components/notif-to-user/success/success.service';
import { LoaderService } from '../../shared/components/loader/loader.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  constructor(
    private userManagementService: UserManagementService,
    private errorService: ErrorService,
    private successService: SuccessService,
    private loaderService: LoaderService) { }

  private users: User[];
  private display = 'none';
  private myForm: FormGroup;
  private editUser: User = null;

  ngOnInit() {
    this.init();
  }

  init() {
    //reset the users array
    this.users = new Array;
    //enable the loader
    this.loaderService.enableLoader();
    this.userManagementService.getUsers().subscribe(
      data => {
        var users = data.users;

        for (var i = 0; i < users.length; i++) {
          var user = new User(
            users[i]._id,
            users[i].email,
            users[i].password,
            users[i].levelRights,
            users[i].firstName,
            users[i].lastName,
            users[i].randomSecretCode,
            users[i].randomHash,
            users[i].registered,
            users[i].phone,
            users[i].street,
            users[i].streetNumber,
            users[i].city,
            users[i].country,
            users[i].picture,
          );
          this.users.push(user);
        }
        //disable the loader      
        this.loaderService.disableLoader();
      },
      error => {
        console.log(error);
        //disable the loader      
        this.loaderService.disableLoader();
      }

    );
    this.myForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
      ]),
      levelRights: new FormControl(null, Validators.required),
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      phone: new FormControl(null, Validators.required),
      street: new FormControl(null, Validators.required),
      streetNumber: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
      country: new FormControl(null, Validators.required)
    });
  }

  clickOnUser(user) {
    this.editUser = user;
    this.myForm = new FormGroup({
      email: new FormControl(user.email, [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
      ]),
      levelRights: new FormControl(user.levelRights, Validators.required),
      firstName: new FormControl(user.firstName, Validators.required),
      lastName: new FormControl(user.lastName, Validators.required),
      phone: new FormControl(user.phone, null),
      street: new FormControl(user.street, null),
      streetNumber: new FormControl(user.streetNumber, null),
      city: new FormControl(user.city, null),
      country: new FormControl(user.country, null)
    });
    this.display = 'block';
  }

  editSave() {
    //enable the loader
    this.loaderService.enableLoader();

    var emailChanged = false;
    var fieldsLabelUpdated = new Array;
    var fieldsValueUpdated = new Array;

    Object.keys(this.myForm.controls).forEach(key => {
      if (this.myForm.get(key).value != this.editUser[key]) {
        if (key == 'email')
          emailChanged = true;
        fieldsLabelUpdated.push(key);
        fieldsValueUpdated.push(this.myForm.get(key).value);
      }
    });
    //there are fields to update
    if (fieldsLabelUpdated.length > 0 && fieldsLabelUpdated.length == fieldsValueUpdated.length) {
      var firstName = this.myForm.controls.firstName.value;
      var lastName = this.myForm.controls.lastName.value;
      var email = this.myForm.controls.email.value;

      const fields = { id: this.editUser.id, labels: fieldsLabelUpdated, values: fieldsValueUpdated, changeEmail: false };
      this.userManagementService.editUser(fields, emailChanged, email, firstName, lastName)
        .then(
        data => {
          //disable the loader      
          this.loaderService.disableLoader();
          this.successService.handleSuccess(data);
          this.init();
        },
        error => {
          console.log(error);
          //disable the loader      
          this.loaderService.disableLoader();
          this.errorService.handleError(error);
        }
        );
    }
    else {
      //disable the loader      
      this.loaderService.disableLoader();
    }
    this.display = 'none';
  }

  editCancel() {
    this.display = 'none';
  }

  selectLevelRights(levelRights) {
    this.myForm.controls.levelRights.setValue(levelRights);
  }

}
