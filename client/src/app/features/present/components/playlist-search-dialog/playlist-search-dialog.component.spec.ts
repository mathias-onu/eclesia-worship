import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistSearchDialogComponent } from './playlist-search-dialog.component';

describe('PlaylistSearchDialogComponent', () => {
  let component: PlaylistSearchDialogComponent;
  let fixture: ComponentFixture<PlaylistSearchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlaylistSearchDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlaylistSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
