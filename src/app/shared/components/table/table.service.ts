import { Injectable, EventEmitter, Output, Input } from "@angular/core";


@Injectable()
export class TableService {
    //EventEmitter for a config class
    @Input() configClassEmitter: EventEmitter<any> = new EventEmitter();
    //EventEmitter to display the data in the table
    @Input() diplayDataEmitter: EventEmitter<any> = new EventEmitter();
    //EventEmitter to detect if a row of the table is clicked
    @Input() rowClickedEmitter: EventEmitter<any> = new EventEmitter();
    //EventEmitter to detect if an user change the configs of display page
    @Input() rowsConfigEmitter: EventEmitter<any> = new EventEmitter();
    //EventEmitter to detect which page should be loaded
    @Input() loadPageEmitter: EventEmitter<any> = new EventEmitter();
    //EventEmitter to get the buttons page array
    @Input() buttonsPageEmitter: EventEmitter<any> = new EventEmitter();
    constructor() { }
}