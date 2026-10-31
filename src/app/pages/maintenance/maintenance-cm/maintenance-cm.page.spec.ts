import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceCmPage } from './maintenance-cm.page';

describe('MaintenanceCmPage', () => {
  let component: MaintenanceCmPage;
  let fixture: ComponentFixture<MaintenanceCmPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceCmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
