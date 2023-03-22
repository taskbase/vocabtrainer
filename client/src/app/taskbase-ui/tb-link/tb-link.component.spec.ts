import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TbLinkComponent } from './tb-link.component';

describe('TbLinkComponent', () => {
  let component: TbLinkComponent;
  let fixture: ComponentFixture<TbLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TbLinkComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TbLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
