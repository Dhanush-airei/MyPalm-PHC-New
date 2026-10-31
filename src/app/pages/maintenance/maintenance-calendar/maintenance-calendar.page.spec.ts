import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceCalendarPage } from './maintenance-calendar.page';

describe('MaintenanceCalendarPage', () => {
  let component: MaintenanceCalendarPage;
  let fixture: ComponentFixture<MaintenanceCalendarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceCalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
