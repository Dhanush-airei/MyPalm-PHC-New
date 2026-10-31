import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraderDashboardPage } from './grader-dashboard.page';

describe('GraderDashboardPage', () => {
  let component: GraderDashboardPage;
  let fixture: ComponentFixture<GraderDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GraderDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
