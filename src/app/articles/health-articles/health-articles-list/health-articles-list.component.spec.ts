import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthArticlesListComponent } from './health-articles-list.component';

describe('HealthArticlesListComponent', () => {
  let component: HealthArticlesListComponent;
  let fixture: ComponentFixture<HealthArticlesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthArticlesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthArticlesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
