import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceAiPage } from './maintenance-ai.page';

describe('MaintenanceAiPage', () => {
  let component: MaintenanceAiPage;
  let fixture: ComponentFixture<MaintenanceAiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceAiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
