import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraderVehicleSearchPage } from './grader-vehicle-search.page';

describe('GraderVehicleSearchPage', () => {
  let component: GraderVehicleSearchPage;
  let fixture: ComponentFixture<GraderVehicleSearchPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GraderVehicleSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
