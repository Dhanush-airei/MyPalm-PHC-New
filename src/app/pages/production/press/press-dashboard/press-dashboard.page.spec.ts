import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PressDashboardPage } from './press-dashboard.page';

describe('PressDashboardPage', () => {
  let component: PressDashboardPage;
  let fixture: ComponentFixture<PressDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PressDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
