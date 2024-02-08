import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiverComponent } from './receiver.component';

describe('ReceiverComponent', () => {
  let component: ReceiverComponent;
  let fixture: ComponentFixture<ReceiverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceiverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReceiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
