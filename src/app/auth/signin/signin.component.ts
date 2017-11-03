import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { User } from "../../models/objects-models/user.model";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { LoaderService } from "../../loader/loader.service";

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html'
})
export class SigninComponent {
    myForm: FormGroup;

    constructor(private authService: AuthService,
        private router: Router,
        private loaderService: LoaderService) { }


    ngOnInit() {
        this.myForm = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
            ]),
            password: new FormControl(null, Validators.required)
        });
    }

    onSubmit() {
        const user = new User(this.myForm.value.email, this.myForm.value.password, null, null, null, null, null, null);
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