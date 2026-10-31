import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceAiClosePage } from './maintenance-ai-close.page';

describe('MaintenanceAiClosePage', () => {
  let component: MaintenanceAiClosePage;
  let fixture: ComponentFixture<MaintenanceAiClosePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceAiClosePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
