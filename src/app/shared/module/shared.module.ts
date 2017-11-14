import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { AngularDraggableModule } from 'angular2-draggable';

//for the translation
export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, './assets/Application_language', '.json');
}

@NgModule({
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
        AngularDraggableModule
    ],
    exports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        BrowserModule,
        RouterModule,
        HttpModule,
        TranslateModule,
        AngularDraggableModule
    ]
})
export class SharedModule { }