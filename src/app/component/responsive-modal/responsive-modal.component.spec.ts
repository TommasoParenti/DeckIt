import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveModalComponent } from './responsive-modal.component';

describe('ResponsiveModalComponent', () => {
  let component: ResponsiveModalComponent;
  let fixture: ComponentFixture<ResponsiveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponsiveModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponsiveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
