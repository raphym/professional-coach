import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { User } from "../../shared/models/objects-models/user.model";
import { LoaderService } from "../../shared/components/loader/loader.service";
import { ErrorService } from "../../shared/components/notif-to-user/errors/error.service";
import { SuccessService } from "../../shared/components/notif-to-user/success/success.service";
import { Router } from "@angular/router";
import { LangService } from "../../shared/services/langService/langService.service";


@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
    public myForm: FormGroup;
    public langDirection;
    public langTextAlign;

    constructor(public authService: AuthService,
        public loaderService: LoaderService,
        public langService: LangService,
        public errorService: ErrorService,
        public successService: SuccessService,
        public router: Router) { }

    ngOnInit() {
        //subscribe to the langage
        this.langService.langTransmitter.subscribe(
            config_langage => {
                this.langDirection = config_langage.direction;
                this.langTextAlign = config_langage.textAlign;
            }
        );
        this.langService.initLangage();

        //bind the passwordValidator
        this.passwordValidator = this.passwordValidator.bind(this);
        this.myForm = new FormGroup({
            userName: new FormControl(null, Validators.required),
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
            ]),
            password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
            confirmPassword: new FormControl(null, this.passwordValidator)
        });
        this.myForm.controls.confirmPassword.setValue('');
    }

    onSubmit() {
        const user = new User(
            null,
            this.myForm.value.userName,
            this.myForm.value.email,
            this.myForm.value.password,
            null,
            null,
            null,
            null,
            null,
            null
        );
        //enable the loader
        this.loaderService.enableLoader();
        this.authService.signup(user).then(
            data => {
                //disable the loader
                this.loaderService.disableLoader();
                //console.log(data)
            },
            error => {
                //disable the loader
                this.loaderService.disableLoader();
                //console.error(error)
            }
        );

        this.myForm.reset();
    }

    //password validator
    public passwordValidator(control: FormControl) {
        if (this.myForm === undefined)
            return { isEqual: false };
        else {
            if (control.value === '')
                return { isEqual: false };
            else if (control.value === this.myForm.controls.password.value)
                return null;
            else
                return { isEqual: false };
        }
    }

    fbLogin() {
        this.authService.fbLogin().then(data => {
            //if success sending return a success message to the user
            var my_response = {
                title: 'Success',
                message: 'You are successfully login'
            };
            //this.successService.handleSuccess(my_response);
            this.router.navigateByUrl('/');
        },
            error => {
                console.log(error);
                if (error.title != undefined)
                    this.errorService.handleError(error);
                else {
                    var my_error = { title: 'Error', message: "An error has occured" };
                    this.errorService.handleError(my_error);
                }
            });
    }

}