import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TbProgressCircleComponent } from './tb-progress-circle.component';

describe('TbProgressCircleComponent', () => {
  let component: TbProgressCircleComponent;
  let fixture: ComponentFixture<TbProgressCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TbProgressCircleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TbProgressCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
