import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceCmAcceptMultiPartPage } from './maintenance-cm-accept-multi-part.page';

describe('MaintenanceCmAcceptMultiPartPage', () => {
  let component: MaintenanceCmAcceptMultiPartPage;
  let fixture: ComponentFixture<MaintenanceCmAcceptMultiPartPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceCmAcceptMultiPartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
