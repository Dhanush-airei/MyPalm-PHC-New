import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagementOilLossesPage } from './management-oil-losses.page';

describe('ManagementOilLossesPage', () => {
  let component: ManagementOilLossesPage;
  let fixture: ComponentFixture<ManagementOilLossesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementOilLossesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
