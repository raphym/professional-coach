import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { AngularDraggableModule } from 'angular2-draggable';
import { TableComponent } from "../components/table/table.component";
import { TableService } from "../components/table/table.service";
import {DpDatePickerModule} from 'ng2-date-picker';

//for the translation
export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, './assets/Application_language', '.json');
}

@NgModule({
    declarations: [
        TableComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        BrowserModule,
        RouterModule,
        HttpModule,
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [Http]
        }),
        AngularDraggableModule,
        DpDatePickerModule
    ],
    exports: [
        TableComponent,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        BrowserModule,
        RouterModule,
        HttpModule,
        TranslateModule,
        AngularDraggableModule,
        DpDatePickerModule
    ],
    providers: [
        TableService
    ]
})
export class SharedModule { }