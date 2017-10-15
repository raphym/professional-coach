import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TrainingComponent } from "./training.component";


const authRoutes : Routes = [
    {path:'usertraining',component: TrainingComponent},
];

@NgModule({
    imports:[
        RouterModule.forChild(authRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class TrainingRoutingModule
{

}