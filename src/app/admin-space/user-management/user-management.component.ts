import { Component, OnInit } from '@angular/core';
import { UserManagementService } from './user-management.service';
import { User } from '../../shared/models/objects-models/user.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ErrorService } from '../../shared/components/notif-to-user/errors/error.service';
import { SuccessService } from '../../shared/components/notif-to-user/success/success.service';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { TableService } from '../../shared/components/table/table.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  //the users
  private users: User[];
  //display of the div edit user
  private display = 'none';
  //form for the div edit user
  private myForm: FormGroup;
  //the current edit user
  private editUser: User = null;

  //for the table
  private config;
  private pageToDisplay = 0;

  constructor(
    private userManagementService: UserManagementService,
    private errorService: ErrorService,
    private successService: SuccessService,
    private loaderService: LoaderService,
    private tableService: TableService) { }

  ngOnInit() {
    this.init();

    //Emitter to dected if a row of a table is clicked
    this.tableService.rowClickedEmitter.subscribe(
      rowValues => {
        var userEmail = rowValues[0];
        this.clickOnUser(userEmail);
      }
    );

    //Emitter to detect if in the table component the user change the config
    this.tableService.rowsConfigEmitter.subscribe(
      config => {
        this.config = config;
        this.pageToDisplay = 0;
        this.init();
      }
    );

    //Emitter to display the page clicked
    this.tableService.loadPageEmitter.subscribe(
      pageClicked => {
        this.pageToDisplay = pageClicked;
        this.init();
      }
    );
  }

  //go to display the table
  displayTable(users) {
    var columsName = new Array('Email', 'First Name', 'Last Name', 'Type User', 'Status User');
    var rowsValues = new Array();
    for (var i = 0; i < users.length; i++) {
      //ternary condition to check if the user is registered
      var status = (users[i].registered) ? 'Registered' : 'Not Registered';
      //check the level rights of the user
      var role = 'Normal';
      if (users[i].levelRights == 200)
        role = 'Admin';
      if (users[i].levelRights == 300)
        role = 'Super Admin';

      //push the value into the rows values array
      rowsValues.push(new Array(
        users[i].email,
        users[i].firstName,
        users[i].lastName,
        users[i].levelRights,
        users[i].registered));
    }
    //Event emitter to display the table in the table component
    this.tableService.diplayDataEmitter.emit({ columsName, rowsValues });
  }

  //init to count how many users there are and apply the getUsers function
  init() {
    //reset the users array
    this.users = new Array;
    //enable the loader
    this.loaderService.enableLoader();

    this.userManagementService.getUsersCount().subscribe(
      data => {
        //disable the loader
        this.loaderService.disableLoader();
        this.getUsers(data.count);
      },
      error => {
        console.log(error);
        //disable the loader
        this.loaderService.disableLoader();
      }
    );
    //init the form
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

  //go to get the users from the server
  getUsers(count) {
    var details = {
      usersPerPage: this.config.rowsPerPage,
      pageClicked: this.pageToDisplay
    }

    //enable the loader
    this.loaderService.enableLoader();
    this.userManagementService.getPartOfUsers(details).subscribe(
      data => {
        //disable the loader
        this.loaderService.disableLoader();
        this.users = data.users;
        this.tableService.buttonsPageEmitter.emit(Array(Math.ceil(count / details.usersPerPage)).fill(0).map((x, i) => i + 1));
        this.displayTable(data.users);
      },
      error => {
        console.log(error);
        //disable the loader
        this.loaderService.disableLoader();
      }
    );

  }


  //when click on an user
  clickOnUser(userEmail) {
    var user = null;
    for (var i = 0; i < this.users.length; i++) {
      if (this.users[i].email == userEmail) {
        user = this.users[i];
        break;
      }
    }
    this.editUser = user;
    //init the form
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

  //when edit an user
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

      const fields = { id: this.editUser._id, labels: fieldsLabelUpdated, values: fieldsValueUpdated, changeEmail: false };
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

  //when click on Cancel
  editCancel() {
    this.display = 'none';
  }

  //Select for the level rights
  selectLevelRights(levelRights) {
    this.myForm.controls.levelRights.setValue(levelRights);
  }
}
