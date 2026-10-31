import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceMaterialSearchPagePage } from './maintenance-material-search-page.page';

describe('MaintenanceMaterialSearchPagePage', () => {
  let component: MaintenanceMaterialSearchPagePage;
  let fixture: ComponentFixture<MaintenanceMaterialSearchPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceMaterialSearchPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
