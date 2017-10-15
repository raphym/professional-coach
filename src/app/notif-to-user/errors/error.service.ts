import { EventEmitter } from "@angular/core";
import { TheError } from "./error.model";

export class ErrorService {
    errorOccured = new EventEmitter<TheError>();

    handleError(error:any){
        const errorData = new TheError(error.title,error.error.message);
        this.errorOccured.emit(errorData);
    }

}