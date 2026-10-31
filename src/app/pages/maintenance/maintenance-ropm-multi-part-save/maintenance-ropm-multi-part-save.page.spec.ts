import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceRopmMultiPartSavePage } from './maintenance-ropm-multi-part-save.page';

describe('MaintenanceRopmMultiPartSavePage', () => {
  let component: MaintenanceRopmMultiPartSavePage;
  let fixture: ComponentFixture<MaintenanceRopmMultiPartSavePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceRopmMultiPartSavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
