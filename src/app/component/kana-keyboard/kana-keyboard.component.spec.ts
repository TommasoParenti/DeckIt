import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanaKeyboardComponent } from './kana-keyboard.component';

describe('KanaKeyboardComponent', () => {
  let component: KanaKeyboardComponent;
  let fixture: ComponentFixture<KanaKeyboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanaKeyboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KanaKeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
