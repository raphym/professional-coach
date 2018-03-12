import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { User } from "../../shared/models/objects-models/user.model";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { LoaderService } from "../../shared/components/loader/loader.service";
import { UsefulService } from "../../shared/services/utility/useful.service";
import { ErrorService } from "../../shared/components/notif-to-user/errors/error.service";
import { SuccessService } from "../../shared/components/notif-to-user/success/success.service";

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']

})
export class SigninComponent {
    public myForm: FormGroup;
    public langDirection;
    public langTextAlign;
    public enterEmail: boolean = false;
    public enterPassword: boolean = false;
    public alreadyPasswordForgot: boolean = false;


    constructor(public authService: AuthService,
        public router: Router,
        public loaderService: LoaderService,
        public usefulService: UsefulService,
        public errorService: ErrorService,
        public successService: SuccessService) { }


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

        this.myForm = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
            ]),
            password: new FormControl(null, Validators.required)
        });
    }

    validateEmail(email) {
        var regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regularExpression.test(String(email).toLowerCase());
    }

    onSubmit() {
        this.enterEmail = false;
        this.enterPassword = false;

        var email = this.myForm.value.email;
        var password = this.myForm.value.password;
        if (email == undefined || email == null || email == '' || !this.validateEmail(email)) {
            this.enterEmail = true;
            return;
        }
        if (password == undefined || password == null || password == '') {
            this.enterPassword = true;
            return;
        }
        const user = new User(null, null, email, password, null, null, null, null, null, null);
        //enable the loader
        this.loaderService.enableLoader();
        this.authService.signin(user).subscribe(
            data => {
                //disable the loader
                this.loaderService.disableLoader();
                if (data.message == 'Successfully logged in') {
                    this.router.navigateByUrl('/');
                }
            },
            error => {
                //disable the loader
                this.loaderService.disableLoader();
            }
        );

        this.myForm.reset();
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

    forgotPassword() {
        this.alreadyPasswordForgot = true;
        this.enterEmail = false;
        var email = this.myForm.value.email;
        if (email == undefined || email == null || email == '' || !this.validateEmail(email)) {
            this.enterEmail = true;
            return;
        }

        const user = new User(null, null, email, null, null, null, null, null, null, null);
        //enable the loader
        this.loaderService.enableLoader();

        this.authService.forgotPassword(user).subscribe(
            data => {
                //disable the loader
                this.loaderService.disableLoader();
                this.successService.handleSuccess({ title: 'Success', message: 'Please check your email to reset your password' });

            },
            error => {
                //disable the loader
                this.loaderService.disableLoader();
                this.alreadyPasswordForgot = false;
                this.errorService.handleError({ title: 'Error', message: error.message });
            }
        );

        this.myForm.reset();
    }

}