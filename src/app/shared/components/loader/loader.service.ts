import { Injectable, Output, EventEmitter } from "@angular/core";

@Injectable()
export class LoaderService {

    //event emitter to send the loader status
    @Output() loadingEvent = new EventEmitter<boolean>();
    constructor() { }


    //enable the loader
    enableLoader() {
        this.loadingEvent.emit(true);
    }

    //disable the loader
    disableLoader() {
        this.loadingEvent.emit(false);
    }

}