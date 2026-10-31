import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SterilizerAlertPage } from './sterilizer-alert.page';

describe('SterilizerAlertPage', () => {
  let component: SterilizerAlertPage;
  let fixture: ComponentFixture<SterilizerAlertPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SterilizerAlertPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
