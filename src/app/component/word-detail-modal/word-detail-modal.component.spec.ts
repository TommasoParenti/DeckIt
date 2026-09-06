import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordDetailModalComponent } from './word-detail-modal.component';

describe('WordDetailModalComponent', () => {
  let component: WordDetailModalComponent;
  let fixture: ComponentFixture<WordDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordDetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
