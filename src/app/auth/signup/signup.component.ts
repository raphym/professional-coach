import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { User } from "../../shared/models/objects-models/user.model";
import { LoaderService } from "../../shared/components/loader/loader.service";
import { UsefulService } from "../../shared/services/utility/useful.service";

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
        private usefulService: UsefulService) { }

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
            firstName: new FormControl(null, Validators.required),
            lastName: new FormControl(null, Validators.required),
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
            this.myForm.value.email,
            this.myForm.value.password,
            200,
            this.myForm.value.firstName,
            this.myForm.value.lastName,
            null,
            null,
            null);
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


}