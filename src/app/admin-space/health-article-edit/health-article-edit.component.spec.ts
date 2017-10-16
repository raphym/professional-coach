import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthArticleEditComponent } from './health-article-edit.component';

describe('HealthArticleEditComponent', () => {
  let component: HealthArticleEditComponent;
  let fixture: ComponentFixture<HealthArticleEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthArticleEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthArticleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
