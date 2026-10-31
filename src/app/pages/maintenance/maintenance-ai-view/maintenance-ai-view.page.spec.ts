import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceAiViewPage } from './maintenance-ai-view.page';

describe('MaintenanceAiViewPage', () => {
  let component: MaintenanceAiViewPage;
  let fixture: ComponentFixture<MaintenanceAiViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceAiViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
