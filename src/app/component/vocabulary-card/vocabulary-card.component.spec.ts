import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularyCardComponent } from './vocabulary-card.component';

describe('VocabularyCardComponent', () => {
  let component: VocabularyCardComponent;
  let fixture: ComponentFixture<VocabularyCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VocabularyCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VocabularyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
