import { Component, OnInit } from '@angular/core';
import { UserManagementService } from './user-management.service';
import { User } from '../../shared/models/objects-models/user.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  constructor(private userManagementService: UserManagementService) { }

  private users: User[] = new Array;
  private display = 'none';
  private myForm: FormGroup;

  ngOnInit() {
    this.userManagementService.getUsers().subscribe(
      data => {
        var users = data.users;

        for (var i = 0; i < users.length; i++) {
          var user = new User(
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
      },
      error => console.log(error)
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
    this.myForm = new FormGroup({
      email: new FormControl(user.email, [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
      ]),
      levelRights: new FormControl(user.levelRights, Validators.required),
      firstName: new FormControl(user.firstName, Validators.required),
      lastName: new FormControl(user.lastName, Validators.required),
      phone: new FormControl(user.phone, Validators.required),
      street: new FormControl(user.street, Validators.required),
      streetNumber: new FormControl(user.streetNumber, Validators.required),
      city: new FormControl(user.city, Validators.required),
      country: new FormControl(user.country, Validators.required)
    });
    this.display = 'block';
  }

  editSave() {
    console.log(this.myForm);
    this.display = 'none';
  }

  editCancel() {
    this.display = 'none';
  }

  selectLevelRights(levelRights)
  {
    this.myForm.controls.levelRights.setValue(levelRights);
  }



}
