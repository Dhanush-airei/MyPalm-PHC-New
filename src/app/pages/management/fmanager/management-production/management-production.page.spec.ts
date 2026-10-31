import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagementProductionPage } from './management-production.page';

describe('ManagementProductionPage', () => {
  let component: ManagementProductionPage;
  let fixture: ComponentFixture<ManagementProductionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementProductionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
