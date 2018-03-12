import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { SuccessService } from '../../shared/components/notif-to-user/success/success.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ErrorService } from '../../shared/components/notif-to-user/errors/error.service';

@Component({
  selector: 'app-confirm-forgot-password',
  templateUrl: './confirm-forgot-password.component.html',
  styleUrls: ['./confirm-forgot-password.component.css']
})
export class ConfirmForgotPasswordComponent implements OnInit {
  public myForm: FormGroup;
  public randomHash;
  public message = '';
  public userFound = false;
  public user = null;

  constructor(public authService: AuthService,
    public route: ActivatedRoute,
    public router: Router,
    public loaderService: LoaderService,
    public successService: SuccessService,
    public errorService: ErrorService) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.randomHash = params['randomHash'];
          //enable the loader
          this.loaderService.enableLoader();
          this.authService.confirmForgotPasswordInit(this.randomHash).subscribe(
            data => {
              //disable the loader
              this.loaderService.disableLoader();
              this.userFound = true;
              this.user = data.user;

              //bind the passwordValidator
              this.passwordValidator = this.passwordValidator.bind(this);
              this.myForm = new FormGroup({
                password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
                confirmPassword: new FormControl(null, this.passwordValidator)
              });
            },
            error => {
              //disable the loader
              this.loaderService.disableLoader();
              console.log(error);
              this.message = error.message;
            }
          );
        });
  }

  onSubmit() {
    var password = this.myForm.value.password;
    var confirmPassword = this.myForm.value.confirmPassword;

    //enable the loader
    this.loaderService.enableLoader();
    this.authService.confirmForgotPassword(this.user.email, this.user.randomHash, password, confirmPassword).subscribe(
      data => {
        //disable the loader
        this.loaderService.disableLoader();
        this.successService.handleSuccess({ title: 'Success', message: 'Password updated' });
        this.router.navigateByUrl('/');
      },
      error => {
        //disable the loader
        this.loaderService.disableLoader();
        this.errorService.handleError({ title: 'Errror', message: 'An error has occured' });
      }
    );

    this.myForm.reset();
  }

  //password validator
  public passwordValidator(control: FormControl) {
    if (this.myForm === undefined)
      return null;
    else {
      if (control.value === this.myForm.controls.password.value)
        return null;
      else
        return { isEqual: false };
    }
  }

}
