import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
  standalone: false,
})
export class TimePickerComponent implements OnInit {
  @Input() selectedTime: string = '';
  @Output() timeSelected = new EventEmitter<string>();

  isTimeModalOpen: boolean = false;
  tempTime: string = '';
  currentTime: string = '';

  constructor() {}

  ngOnInit(): void {
    // Set default time to current time
    this.currentTime = this.getCurrentTime();
    if (!this.selectedTime) {
      this.selectedTime = this.currentTime;
    }
  }

  /**
   * Open Time Modal
   */
  openTimeModal(): void {
    this.tempTime = this.selectedTime || this.currentTime;
    this.isTimeModalOpen = true;
  }

  /**
   * Close Time Modal
   */
  closeTimeModal(): void {
    this.isTimeModalOpen = false;
  }

  /**
   * Time changed
   */
  onTimeChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (!value) {
      return;
    }
    this.tempTime = String(value).substring(0, 5); // HH:mm format
  }

  /**
   * Time modal dismissed
   */
  onTimeDismiss(): void {
    if (this.tempTime) {
      this.selectedTime = this.tempTime;
      this.timeSelected.emit(this.selectedTime);
    }
    this.isTimeModalOpen = false;
  }

  /**
   * Get current time in HH:mm format
   */
  private getCurrentTime(): string {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
