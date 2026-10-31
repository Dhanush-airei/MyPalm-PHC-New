import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationTimelineModalPage } from './notification-timeline-modal.page';

describe('NotificationTimelineModalPage', () => {
  let component: NotificationTimelineModalPage;
  let fixture: ComponentFixture<NotificationTimelineModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationTimelineModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
