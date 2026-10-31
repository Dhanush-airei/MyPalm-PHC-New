import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertAcknowledgePage } from './alert-acknowledge.page';

describe('AlertAcknowledgePage', () => {
  let component: AlertAcknowledgePage;
  let fixture: ComponentFixture<AlertAcknowledgePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertAcknowledgePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
