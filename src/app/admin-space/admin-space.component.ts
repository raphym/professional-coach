import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-admin-space',
  templateUrl: './admin-space.component.html',
  styleUrls: ['./admin-space.component.css']
})
export class AdminSpaceComponent implements OnInit {

  constructor(public router:Router,
    public translate: TranslateService) { }

  ngOnInit() {
  }

  onChange(newValue) {
    console.log(newValue);
    this.router.navigate([newValue]);

  }
}
