import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceCmAcceptSinglePartPage } from './maintenance-cm-accept-single-part.page';

describe('MaintenanceCmAcceptSinglePartPage', () => {
  let component: MaintenanceCmAcceptSinglePartPage;
  let fixture: ComponentFixture<MaintenanceCmAcceptSinglePartPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceCmAcceptSinglePartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
