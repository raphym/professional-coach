import { Component, OnInit } from "@angular/core";
import { TheSuccess } from "./success.model";
import { SuccessService } from "./success.service";


@Component({
    selector: 'app-success',
    templateUrl: './success.component.html',
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
export class SuccessComponent implements OnInit{
    success:TheSuccess;
    display='none';

    constructor(public successService: SuccessService){
        this.successService.successOccured.subscribe(
            (success: TheSuccess)=>{
                this.success = success;
                this.display='block';
            }
        );
    }

    ngOnInit()
    {

    }

    onSuccessHandled(){
        this.display='none';
    }

}