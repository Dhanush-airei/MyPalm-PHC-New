import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationAlertPage } from './notification-alert.page';

describe('NotificationAlertPage', () => {
  let component: NotificationAlertPage;
  let fixture: ComponentFixture<NotificationAlertPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationAlertPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
