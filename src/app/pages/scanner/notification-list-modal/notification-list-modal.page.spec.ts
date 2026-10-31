import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationListModalPage } from './notification-list-modal.page';

describe('NotificationListModalPage', () => {
  let component: NotificationListModalPage;
  let fixture: ComponentFixture<NotificationListModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationListModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
