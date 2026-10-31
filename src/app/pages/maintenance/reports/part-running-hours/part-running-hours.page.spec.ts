import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartRunningHoursPage } from './part-running-hours.page';

describe('PartRunningHoursPage', () => {
  let component: PartRunningHoursPage;
  let fixture: ComponentFixture<PartRunningHoursPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PartRunningHoursPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
