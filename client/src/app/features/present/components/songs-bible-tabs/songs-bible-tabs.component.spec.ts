import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongsBibleTabsComponent } from './songs-bible-tabs.component';

describe('SongsBibleTabsComponent', () => {
  let component: SongsBibleTabsComponent;
  let fixture: ComponentFixture<SongsBibleTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SongsBibleTabsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SongsBibleTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
