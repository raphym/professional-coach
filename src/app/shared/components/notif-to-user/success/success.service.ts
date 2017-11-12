import { EventEmitter } from "@angular/core";
import { TheSuccess } from "./success.model";

export class SuccessService {
    successOccured = new EventEmitter<TheSuccess>();

    handleSuccess(success:any){
        const successData = new TheSuccess(success.title,success.message);
        this.successOccured.emit(successData);
    }

}