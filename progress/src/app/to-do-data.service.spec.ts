import { TestBed } from '@angular/core/testing';

import { ToDoDataService } from './to-do-data.service';

describe('ToDoDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToDoDataService = TestBed.get(ToDoDataService);
    expect(service).toBeTruthy();
  });
});
