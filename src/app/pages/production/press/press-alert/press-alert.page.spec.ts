import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PressAlertPage } from './press-alert.page';

describe('PressAlertPage', () => {
  let component: PressAlertPage;
  let fixture: ComponentFixture<PressAlertPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PressAlertPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
