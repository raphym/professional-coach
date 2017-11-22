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
  private users: User[];
  private display = 'none';
  private myForm: FormGroup;
  private editUser: User = null;


  private optionsShowUsers=[2,4,6,8,10,12,14,16,18,20]; //Options for name of users show per page
  private usersPerPage: number = this.optionsShowUsers[0];
  private numbers = [];
  private currentButton = 0;
  private firstTimeLoaded = true;
  private currentPage = 0;

  private start = 0;
  private numbersOfNums = 4;
  private end = this.start + this.numbersOfNums;
  private buttonBackAvailable = false;
  private buttonNextAvailable = false;


  constructor(
    private userManagementService: UserManagementService,
    private errorService: ErrorService,
    private successService: SuccessService,
    private loaderService: LoaderService) { }

  ngOnInit() {
    this.init(false, 0);
  }

  init(refresh, val) {
    //if refresh after edit user
    if (refresh) {
      this.currentPage = val;
      this.firstTimeLoaded = true;
    }
    else
      this.currentPage = 1;

    //reset the users array
    this.users = new Array;
    //enable the loader
    this.loaderService.enableLoader();

    this.userManagementService.getUsersCount().subscribe(
      data => {
        //disable the loader
        this.loaderService.disableLoader();
        this.numbers = Array(Math.ceil(data.val / this.usersPerPage)).fill(0).map((x, i) => i + 1);
        if(this.numbers.length>this.numbersOfNums)
          this.buttonNextAvailable=true;
        this.pageClick(this.currentPage);
        this.firstTimeLoaded = false;
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

  selectOptionsShowUsers(event)
  {
    this.usersPerPage=parseInt(event.target.value);
    this.init(true,1);
  }
  back() {
    this.buttonNextAvailable=true;
    if (this.start - this.numbersOfNums < 0) {
      if (this.start == 1) {
        this.start = 0;
        this.end = this.start + this.numbersOfNums;
        this.buttonBackAvailable = false;
        return;
      }
      else
        return;

    }
    else {
      this.start -= this.numbersOfNums
      this.end = this.start + this.numbersOfNums;
      return;

    }

  }
  next() {
    if (this.end >= this.numbers.length) {
      return;
    }
    this.buttonBackAvailable = true;
    
    if (this.end + this.numbersOfNums >= this.numbers.length) {
      this.start = this.numbers.length - this.numbersOfNums;
      this.end = this.numbers.length;
      this.buttonNextAvailable = false;
      return;
    }
    else {
      this.start += this.numbersOfNums;
      this.end = this.start + this.numbersOfNums;
      return;
    }


  }
  pageClick(i) {
    if (!this.firstTimeLoaded && this.currentButton == i)
      return;

    //enable the loader
    this.loaderService.enableLoader();
    this.currentButton = i;
    this.currentPage = i;

    var details = {
      usersPerPage: this.usersPerPage,
      pageClicked: i - 1
    }
    this.userManagementService.getPartOfUsers(details).subscribe(
      data => {
        //reset the users array
        this.users = new Array;
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
          this.init(true, this.currentPage);
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
