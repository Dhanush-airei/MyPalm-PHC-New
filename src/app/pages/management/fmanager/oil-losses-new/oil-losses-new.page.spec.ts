import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OilLossesNewPage } from './oil-losses-new.page';

describe('OilLossesNewPage', () => {
  let component: OilLossesNewPage;
  let fixture: ComponentFixture<OilLossesNewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OilLossesNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
