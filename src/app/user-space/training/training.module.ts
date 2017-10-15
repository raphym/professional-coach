import { NgModule } from "@angular/core";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TrainingComponent } from "./training.component";
import { TrainingRoutingModule } from "./training-routing.module";
import { TrainingDetailComponent } from "./training-detail/training-detail.component";

@NgModule(
    {
        declarations:[
            TrainingComponent,
            TrainingDetailComponent
        ],
        imports:[
            FormsModule,
            ReactiveFormsModule,  
            TrainingRoutingModule
                      
        ]
    }
)
export class TrainingModule
{

}