import { Component, OnInit } from '@angular/core';
import { UserManagementService } from './user-management.service';
import { User } from '../../shared/models/objects-models/user.model';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  constructor(private userManagementService: UserManagementService) { }

  private users: User[];
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
          console.log('user:');
          console.log(user);
        }
      },
      error => console.log(error)
    );

  }

}
