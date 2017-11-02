import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Params } from "@angular/router";
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-confirm-registration',
  templateUrl: './confirm-registration.component.html',
  styleUrls: ['./confirm-registration.component.css']
})
export class ConfirmRegistrationComponent implements OnInit {

  @ViewChild('f') form: NgForm;  
  private randomHash;
  private message = '';
  private userFound = false;
  private user = null;
  private validate =false;

  constructor(private authService: AuthService,
    private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.params
      .subscribe(
      (params: Params) => {
        this.randomHash = params['randomHash'];

        this.authService.confirmRegInit(this.randomHash).subscribe(
          data => {
            this.userFound = true;
            this.user = data.user;
          },
          error => {
            console.log(error);
            this.message = error.message;
          }
        );


      });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const secretCode = value.secretCode;
    this.form.reset();
    this.authService.confirmRegValid(this.randomHash,secretCode)
    .subscribe(
      data =>{
        console.log(data);
        if(data.title=="Success")
        {
          this.validate=true;
        }
      },
      error=>{
        console.log(error);
      }
    );
  }

}
