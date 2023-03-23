import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TbChatMessageComponent } from './tb-chat-message.component';

describe('TbChatMessageComponent', () => {
  let component: TbChatMessageComponent;
  let fixture: ComponentFixture<TbChatMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TbChatMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TbChatMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
