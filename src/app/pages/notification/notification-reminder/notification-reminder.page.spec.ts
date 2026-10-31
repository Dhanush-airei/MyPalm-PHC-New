import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationReminderPage } from './notification-reminder.page';

describe('NotificationReminderPage', () => {
  let component: NotificationReminderPage;
  let fixture: ComponentFixture<NotificationReminderPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationReminderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
