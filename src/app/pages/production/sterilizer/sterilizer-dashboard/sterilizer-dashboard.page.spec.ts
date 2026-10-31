import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SterilizerDashboardPage } from './sterilizer-dashboard.page';

describe('SterilizerDashboardPage', () => {
  let component: SterilizerDashboardPage;
  let fixture: ComponentFixture<SterilizerDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SterilizerDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
