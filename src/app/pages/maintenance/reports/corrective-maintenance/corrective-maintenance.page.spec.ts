import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CorrectiveMaintenancePage } from './corrective-maintenance.page';

describe('CorrectiveMaintenancePage', () => {
  let component: CorrectiveMaintenancePage;
  let fixture: ComponentFixture<CorrectiveMaintenancePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectiveMaintenancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
