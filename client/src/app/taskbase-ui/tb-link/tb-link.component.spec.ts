import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterPlayerLinkComponent } from './chapter-player-link.component';

describe('ChapterPlayerLinkComponent', () => {
  let component: ChapterPlayerLinkComponent;
  let fixture: ComponentFixture<ChapterPlayerLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChapterPlayerLinkComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChapterPlayerLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
