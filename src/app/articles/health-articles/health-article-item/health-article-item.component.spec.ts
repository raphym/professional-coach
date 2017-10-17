import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthArticleItemComponent } from './health-article-item.component';

describe('HealthArticleItemComponent', () => {
  let component: HealthArticleItemComponent;
  let fixture: ComponentFixture<HealthArticleItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthArticleItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthArticleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
