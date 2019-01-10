import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotProjectsComponent } from './hot-projects.component';

describe('HotProjectsComponent', () => {
  let component: HotProjectsComponent;
  let fixture: ComponentFixture<HotProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
