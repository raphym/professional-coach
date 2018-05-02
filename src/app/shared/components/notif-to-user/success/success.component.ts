import { Component, OnInit } from "@angular/core";
import { TheSuccess } from "./success.model";
import { SuccessService } from "./success.service";
import { LangService } from "../../../services/langService/langService.service";

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
export class SuccessComponent implements OnInit {
    success: TheSuccess;
    display = 'none';
    public langDirection;
    public langTextAlign;

    constructor(public successService: SuccessService, public langService: LangService) {
        this.successService.successOccured.subscribe(
            (success: TheSuccess) => {
                this.success = success;
                this.display = 'block';
            }
        );
    }

    ngOnInit() {
        //subscribe to the langage
        this.langService.langTransmitter.subscribe(
            config_langage => {
                this.langDirection = config_langage.direction;
                this.langTextAlign = config_langage.textAlign;
            }
        );
        this.langService.initLangage();
    }

    onSuccessHandled() {
        this.display = 'none';
    }

}