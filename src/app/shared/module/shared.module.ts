import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HttpModule, Http } from "@angular/http";
import { AngularDraggableModule } from 'angular2-draggable';
import { TableComponent } from "../components/table/table.component";
import { TableService } from "../components/table/table.service";
import { DpDatePickerModule } from 'ng2-date-picker';
import { SafePipe } from "../pipe/SafePipe";
import { FacebookModule } from "ngx-facebook";
import { CommonModule } from "@angular/common";
import { LangService } from "../services/langService/langService.service";
import { TranslateModule } from "ng2-translate";

@NgModule({
    declarations: [
        TableComponent,
        SafePipe
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        HttpModule,
        AngularDraggableModule,
        DpDatePickerModule,
        FacebookModule.forRoot()
    ],
    exports: [
        TranslateModule,
        CommonModule,
        TableComponent,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        HttpModule,
        AngularDraggableModule,
        DpDatePickerModule,
        SafePipe,
        FacebookModule,
    ],
    providers: [
        TableService
    ]
})
export class SharedModule {
    constructor(public langService: LangService) {
        //set langage
        this.langService.initLangage();
    }
}