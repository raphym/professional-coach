import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-admin-space',
  templateUrl: './admin-space.component.html',
  styleUrls: ['./admin-space.component.css']
})
export class AdminSpaceComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  onChange(newValue) {
    console.log(newValue);
    this.router.navigate([newValue]);

  }
}
