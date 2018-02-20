import { Component, OnInit } from "@angular/core";
import { TheError } from "./error.model";
import { ErrorService } from "./error.service";


@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styles: [`
    .backdrop{
        background-color: rgba(0,0,0,0.6);
        position: fixed;
        top: 0;
        left:0;
        with:100%;
        height:100%;
    }
    `]
})
export class ErrorComponent implements OnInit{
    error:TheError;
    display='none';

    constructor(public errorService: ErrorService){
        this.errorService.errorOccured.subscribe(
            (error: TheError)=>{
                this.error = error;
                this.display='block';
            }
        );
    }

    ngOnInit()
    {

    }

    onErrorHandled(){
        this.display='none';
    }

}