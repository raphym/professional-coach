import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../shared/models/objects-models/user.model';

@Component({
  selector: 'profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  
  @Input() private user: User;

  constructor() { }

  ngOnInit() {
    console.log(this.user);
  }

  onSave(){
    alert('save');
  }

}
