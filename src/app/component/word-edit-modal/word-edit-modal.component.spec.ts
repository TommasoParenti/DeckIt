import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordEditModalComponent } from './word-edit-modal.component';

describe('WordEditModalComponent', () => {
  let component: WordEditModalComponent;
  let fixture: ComponentFixture<WordEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
