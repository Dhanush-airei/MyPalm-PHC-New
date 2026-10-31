import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MachineriesRunningHoursPage } from './machineries-running-hours.page';

describe('MachineriesRunningHoursPage', () => {
  let component: MachineriesRunningHoursPage;
  let fixture: ComponentFixture<MachineriesRunningHoursPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineriesRunningHoursPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
