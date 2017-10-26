import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { User } from "../../models/objects-models/user.model";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-signin',
    templateUrl : './signin.component.html'
})
export class SigninComponent{
    myForm: FormGroup;

    constructor(private authService: AuthService,private router:Router) { }
    
    
        ngOnInit()
        {
            this.myForm = new FormGroup({
                email: new FormControl(null,[
                    Validators.required,
                    Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
                ]),
                password: new FormControl(null,Validators.required)  
            });
        }
    
        onSubmit(){
            const user = new User(this.myForm.value.email, this.myForm.value.password,null,null,null);
            this.authService.signin(user).subscribe(
                data => {
                    this.router.navigateByUrl('/');
                },
                error => console.log(error)
            );
    
            this.myForm.reset();
        }

}