import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalHistoryComponent } from './personal-history.component';

describe('PersonalHistoryComponent', () => {
  let component: PersonalHistoryComponent;
  let fixture: ComponentFixture<PersonalHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
