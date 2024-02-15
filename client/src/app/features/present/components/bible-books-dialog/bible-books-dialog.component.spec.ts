import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibleBooksDialogComponent } from './bible-books-dialog.component';

describe('BibleBooksDialogComponent', () => {
  let component: BibleBooksDialogComponent;
  let fixture: ComponentFixture<BibleBooksDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BibleBooksDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BibleBooksDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
