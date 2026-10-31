import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceAiAcknowledgePage } from './maintenance-ai-acknowledge.page';

describe('MaintenanceAiAcknowledgePage', () => {
  let component: MaintenanceAiAcknowledgePage;
  let fixture: ComponentFixture<MaintenanceAiAcknowledgePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceAiAcknowledgePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
