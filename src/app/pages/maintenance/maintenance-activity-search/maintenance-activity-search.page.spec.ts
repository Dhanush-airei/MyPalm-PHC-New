import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceActivitySearchPage } from './maintenance-activity-search.page';

describe('MaintenanceActivitySearchPage', () => {
  let component: MaintenanceActivitySearchPage;
  let fixture: ComponentFixture<MaintenanceActivitySearchPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceActivitySearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
