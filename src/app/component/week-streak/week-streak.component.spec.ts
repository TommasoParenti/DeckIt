import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekStreakComponent } from './week-streak.component';

describe('WeekStreakComponent', () => {
  let component: WeekStreakComponent;
  let fixture: ComponentFixture<WeekStreakComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekStreakComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekStreakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
