import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { User } from "../../models/objects-models/user.model";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
    myForm: FormGroup;

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.myForm = new FormGroup({
            firstName: new FormControl(null, Validators.required),
            lastName: new FormControl(null, Validators.required),
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
            ]),
            password: new FormControl(null, Validators.required)
        });
    }

    onSubmit() {
        const user = new User(
            this.myForm.value.email,
            this.myForm.value.password,
            200,
            this.myForm.value.firstName,
            this.myForm.value.lastName,
            null,
            null,
            null);
        this.authService.signup(user).subscribe(
            // data => console.log(data),
            // error => console.error(error)
        );

        this.myForm.reset();
    }

}