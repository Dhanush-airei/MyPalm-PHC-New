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
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  standalone: false,
})
export class DatePickerComponent implements OnInit, OnChanges {
  @Input() date: string = '';
  @Input() externalDate: string = ''; // New input for external date updates

  @Output() getRecords = new EventEmitter<{
    date: string;
  }>();

  isDateModalOpen = false;

  tempDate: string = '';
  displayDate: string = '';

  // Track if date was changed by user
  private isUserSelectedDate: boolean = false;

  /**
   * Maximum selectable date
   */
  maxDate = new Date().toISOString();

  constructor() {}

  ngOnInit() {
    this.initializeDate();
  }

  /**
   * Detect changes to input date
   */
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

  /**
   * Initialize date from input
   */
  private initializeDate(): void {
    if (this.date) {
      // Store the date in YYYY-MM-DD format
      this.tempDate = this.date;

      // Format for display
      this.displayDate = this.formatDateForDisplay(this.date);

      console.log('DatePicker initialized with:', {
        inputDate: this.date,
        displayDate: this.displayDate,
        tempDate: this.tempDate,
      });
    } else {
      // Set default to today
      const today = this.getToday();
      this.tempDate = today;
      this.displayDate = this.formatDateForDisplay(today);
    }
  }

  /**
   * Format date for display (DD-MM-YYYY)
   */
  private formatDateForDisplay(dateString: string): string {
    if (!dateString) return 'DD-MM-YYYY';

    try {
      // If date is already in DD-MM-YYYY format, return as is
      if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
        return dateString;
      }

      // Parse date string
      let date: Date;

      // Check if it's in YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const parts = dateString.split('-');
        date = new Date(
          parseInt(parts[0]),
          parseInt(parts[1]) - 1,
          parseInt(parts[2]),
        );
      } else {
        // Try parsing as Date
        date = new Date(dateString);
      }

      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString);
        return 'DD-MM-YYYY';
      }

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'DD-MM-YYYY';
    }
  }

  /**
   * Format date for API (YYYY-MM-DD)
   */
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

  /**
   * Open Date Modal
   */
  openDateModal(): void {
    this.tempDate = this.date || this.getToday();
    this.isDateModalOpen = true;
  }

  /**
   * Date changed
   */
  onDateChange(event: CustomEvent): void {
    const value = event.detail.value;

    if (!value) {
      return;
    }

    this.tempDate = String(value).substring(0, 10);
    console.log('Date selected:', this.tempDate);
  }

  /**
   * Date modal dismissed
   */
  onDateDismiss(): void {
    if (this.tempDate) {
      // Update date with selected value
      this.date = this.tempDate;
      this.displayDate = this.formatDateForDisplay(this.tempDate);

      // Mark as user-selected date
      this.isUserSelectedDate = true;

      console.log('Date dismissed with:', {
        date: this.date,
        displayDate: this.displayDate,
      });
    }

    this.isDateModalOpen = false;
  }

  /**
   * Emit selected dates to parent
   */
  onGetRecords(): void {
    // Emit the date in YYYY-MM-DD format for API
    const dateForAPI = this.formatDateForAPI(this.date);

    console.log('Getting records with date:', {
      original: this.date,
      apiFormat: dateForAPI,
    });

    this.getRecords.emit({
      date: dateForAPI || this.date,
    });
  }

  /**
   * Reset user selection flag (called when parent wants to reset)
   */
  resetUserSelection(): void {
    this.isUserSelectedDate = false;
  }

  /**
   * Get today's date in YYYY-MM-DD format
   */
  private getToday(): string {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
