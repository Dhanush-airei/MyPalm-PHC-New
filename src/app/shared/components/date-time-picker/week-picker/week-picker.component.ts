/* week-picker.component.ts */
import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-week-picker',
  templateUrl: './week-picker.component.html',
  styleUrls: ['./week-picker.component.scss'],
  standalone: false,
})
export class WeekPickerComponent implements OnInit, OnChanges {
  @Input() date: string = '';
  @Input() externalDate: string = '';

  @Output() getRecords = new EventEmitter<{
    date: string;
  }>();

  isDateModalOpen = false;

  tempDate: string = '';
  displayDate: string = '';

  // Store the original date before opening modal
  private originalDate: string = '';
  private isUserSelectedDate: boolean = false;

  maxDate = new Date().toISOString();

  constructor() {}

  ngOnInit() {
    this.initializeDate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Only update if the date is from external source and not user-selected
    if (
      changes['date'] &&
      changes['date'].currentValue &&
      !this.isUserSelectedDate
    ) {
      this.initializeDate();
    }

    // Handle external date updates (from API)
    if (changes['externalDate'] && changes['externalDate'].currentValue) {
      // Don't override user-selected date
      if (!this.isUserSelectedDate) {
        this.date = changes['externalDate'].currentValue;
        this.initializeDate();
      }
    }
  }

  private initializeDate(): void {
    if (this.date) {
      // Store the date in YYYY-MM-DD format
      this.tempDate = this.date;
      this.displayDate = this.formatDateForDisplay(this.date);
      console.log('WeekPicker initialized with date:', this.date);
    } else {
      // Set default to empty - don't auto-set today
      this.tempDate = '';
      this.displayDate = '';
    }
  }

  private formatDateForDisplay(dateString: string): string {
    if (!dateString) return '';

    try {
      // If date is already in DD-MM-YYYY format, return as is
      if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
        return dateString;
      }

      // Check if it's in YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const parts = dateString.split('-');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }

      // Try parsing as Date
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '';
      }

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }

  private formatDateForAPI(dateString: string): string {
    if (!dateString) return '';

    try {
      // If already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }

      // Parse DD-MM-YYYY to YYYY-MM-DD
      if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
        const parts = dateString.split('-');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }

      // Try parsing as Date
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '';
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date for API:', error);
      return '';
    }
  }

  openDateModal(): void {
    // Store the original date before opening modal
    this.originalDate = this.date || '';

    // If there's no date, don't set tempDate to today - keep it empty
    // The ion-datetime will show current date but won't auto-select
    this.tempDate = this.originalDate || '';

    console.log('Opening date modal with tempDate:', this.tempDate);
    this.isDateModalOpen = true;
  }

  onDateChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (!value) return;
    this.tempDate = String(value).substring(0, 10);
    console.log('Date selected in modal:', this.tempDate);
  }

  onDateDismiss(): void {
    console.log('Date dismissed - tempDate:', this.tempDate);
    console.log('Original date:', this.originalDate);

    // Only update if we have a valid tempDate and it's different from original
    if (this.tempDate && this.tempDate !== this.originalDate) {
      this.date = this.tempDate;
      this.displayDate = this.formatDateForDisplay(this.tempDate);
      this.isUserSelectedDate = true;
      console.log('Date updated to:', this.date);
    } else {
      // Revert to original date if cancelled or no selection
      this.date = this.originalDate;
      this.displayDate = this.formatDateForDisplay(this.originalDate);
      console.log('Date reverted to:', this.date);
    }
    this.isDateModalOpen = false;
  }

  onGetRecords(): void {
    const dateForAPI = this.formatDateForAPI(this.date);
    console.log('Getting records with date:', dateForAPI || this.date);
    this.getRecords.emit({
      date: dateForAPI || this.date,
    });
  }

  resetUserSelection(): void {
    this.isUserSelectedDate = false;
  }

  private getToday(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
