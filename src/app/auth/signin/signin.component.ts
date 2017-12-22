import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { User } from "../../shared/models/objects-models/user.model";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { LoaderService } from "../../shared/components/loader/loader.service";
import { UsefulService } from "../../shared/services/utility/useful.service";

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']

})
export class SigninComponent {
    private myForm: FormGroup;
    private langDirection;
    private langTextAlign;

    constructor(private authService: AuthService,
        private router: Router,
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

        this.myForm = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
            ]),
            password: new FormControl(null, Validators.required)
        });
    }

    onSubmit() {
        const user = new User(null,this.myForm.value.email, this.myForm.value.password, null, null, null, null, null, null);
        //enable the loader
        this.loaderService.enableLoader();
        this.authService.signin(user).subscribe(
            data => {
                //disable the loader
                this.loaderService.disableLoader();
                this.router.navigateByUrl('/');
            },
            error => {
                //disable the loader
                this.loaderService.disableLoader();
                //console.log(error)  
            }
        );

        this.myForm.reset();
    }

}