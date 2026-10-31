import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WeighbridgeRecordsCardComponent } from './weighbridge-records-card.component';

describe('WeighbridgeRecordsCardComponent', () => {
  let component: WeighbridgeRecordsCardComponent;
  let fixture: ComponentFixture<WeighbridgeRecordsCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WeighbridgeRecordsCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WeighbridgeRecordsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
