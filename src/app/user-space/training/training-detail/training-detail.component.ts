import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Training } from '../../../models/objects-models/training';


@Component({
    selector: 'app-training-detail',
    templateUrl: './training-detail.component.html',
})

export class TrainingDetailComponent  {
    training:Training;

}
