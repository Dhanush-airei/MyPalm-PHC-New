import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceRepmMultiPartSavePage } from './maintenance-repm-multi-part-save.page';

describe('MaintenanceRepmMultiPartSavePage', () => {
  let component: MaintenanceRepmMultiPartSavePage;
  let fixture: ComponentFixture<MaintenanceRepmMultiPartSavePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceRepmMultiPartSavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
