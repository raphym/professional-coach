import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { NgForm } from '@angular/forms';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { SuccessService } from '../../shared/components/notif-to-user/success/success.service';


@Component({
  selector: 'app-confirm-registration',
  templateUrl: './confirm-registration.component.html',
  styleUrls: ['./confirm-registration.component.css']
})
export class ConfirmRegistrationComponent implements OnInit {

  @ViewChild('f') form: NgForm;
  public randomHash;
  public message = '';
  public userFound = false;
  public user = null;
  public validate = false;

  constructor(public authService: AuthService,
    public route: ActivatedRoute,
    public router: Router,
    public loaderService: LoaderService,
    public successService: SuccessService) { }

  ngOnInit() {

    this.route.params
      .subscribe(
      (params: Params) => {
        this.randomHash = params['randomHash'];
        //enable the loader
        this.loaderService.enableLoader();
        this.authService.confirmRegInit(this.randomHash).subscribe(
          data => {
            //disable the loader
            this.loaderService.disableLoader();
            this.userFound = true;
            this.user = data.user;
          },
          error => {
            //disable the loader
            this.loaderService.disableLoader();
            //console.log(error);
            this.message = error.message;
          }
        );


      });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const secretCode = value.secretCode;
    this.form.reset();
    //enable the loader
    this.loaderService.enableLoader();
    this.authService.confirmRegValid(this.randomHash, secretCode)
      .subscribe(
      data => {
        //disable the loader
        this.loaderService.disableLoader();
        //console.log(data);
        if (data.title == "Success") {
          this.successService.handleSuccess({ title: 'Success', message: 'Your account has been validated, you can now login' })
          this.router.navigateByUrl('/');
        }
      },
      error => {
        //disable the loader
        this.loaderService.disableLoader();
        if (error.title == 'No Validate') {
          this.message = 'Failed: The User Not Validate'
        }
        //console.log(error);
      }
      );
  }

}
