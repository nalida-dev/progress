import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarProgressComponent } from './bar-progress.component';

describe('BarProgressComponent', () => {
  let component: BarProgressComponent;
  let fixture: ComponentFixture<BarProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
