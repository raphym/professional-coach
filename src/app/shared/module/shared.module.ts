import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HttpModule } from "@angular/http";

@NgModule({
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        BrowserModule,
        RouterModule,
        HttpModule
    ],
    exports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        BrowserModule,
        RouterModule,
        HttpModule
    ]
})
export class SharedModule { }