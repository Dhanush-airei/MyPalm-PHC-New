import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationFormHistoryModalPage } from './notification-form-history-modal.page';

describe('NotificationFormHistoryModalPage', () => {
  let component: NotificationFormHistoryModalPage;
  let fixture: ComponentFixture<NotificationFormHistoryModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationFormHistoryModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
