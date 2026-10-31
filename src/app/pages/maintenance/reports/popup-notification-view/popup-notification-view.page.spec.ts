import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopupNotificationViewPage } from './popup-notification-view.page';

describe('PopupNotificationViewPage', () => {
  let component: PopupNotificationViewPage;
  let fixture: ComponentFixture<PopupNotificationViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupNotificationViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
