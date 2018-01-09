import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { User } from "../../shared/models/objects-models/user.model";
import { LoaderService } from "../../shared/components/loader/loader.service";
import { UsefulService } from "../../shared/services/utility/useful.service";
import { ErrorService } from "../../shared/components/notif-to-user/errors/error.service";
import { SuccessService } from "../../shared/components/notif-to-user/success/success.service";
import { Router } from "@angular/router";


@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
    private myForm: FormGroup;
    private langDirection;
    private langTextAlign;

    constructor(private authService: AuthService,
        private loaderService: LoaderService,
        private usefulService: UsefulService,
        private errorService: ErrorService,
        private successService: SuccessService,
        private router:Router ) { }

    ngOnInit() {
        //subscribe to the langage
        this.usefulService.langTransmitter.subscribe(
            config_langage => {
                this.langDirection = config_langage.direction;
                this.langTextAlign = config_langage.textAlign;
            }
        );
        //set langage
        this.usefulService.initLangage();

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
    private passwordValidator(control: FormControl) {
        if (this.myForm === undefined)
            return null;
        else {
            if (control.value === this.myForm.controls.password.value)
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