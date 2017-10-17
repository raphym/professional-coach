import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthArticlesComponent } from './health-articles.component';

describe('HealthArticlesComponent', () => {
  let component: HealthArticlesComponent;
  let fixture: ComponentFixture<HealthArticlesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthArticlesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
