import { Component, OnInit } from "@angular/core";
import { TheError } from "./error.model";
import { ErrorService } from "./error.service";
import { LangService } from "../../../services/langService/langService.service";


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
export class ErrorComponent implements OnInit {
    error: TheError;
    display = 'none';
    public langDirection;
    public langTextAlign;

    constructor(public errorService: ErrorService, public langService: LangService) {
        this.errorService.errorOccured.subscribe(
            (error: TheError) => {
                this.error = error;
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

    onErrorHandled() {
        this.display = 'none';
    }

}