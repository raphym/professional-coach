import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankBookComponent } from './thank-book.component';

describe('ThankBookComponent', () => {
  let component: ThankBookComponent;
  let fixture: ComponentFixture<ThankBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThankBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThankBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
