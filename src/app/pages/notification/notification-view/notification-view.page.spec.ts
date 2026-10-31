import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationViewPage } from './notification-view.page';

describe('NotificationViewPage', () => {
  let component: NotificationViewPage;
  let fixture: ComponentFixture<NotificationViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
