/* month-picker.component.ts */
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
  selector: 'app-month-picker',
  templateUrl: './month-picker.component.html',
  styleUrls: ['./month-picker.component.scss'],
  standalone: false,
})
export class MonthPickerComponent implements OnInit, OnChanges {
  @Input() month: string = '';
  @Input() externalMonth: string = '';

  @Output() getRecords = new EventEmitter<{
    month: string;
  }>();

  isMonthModalOpen = false;

  tempMonth: string = '';
  displayMonth: string = '';

  // Store the original month before opening modal
  private originalMonth: string = '';
  private isUserSelectedMonth: boolean = false;

  maxDate = new Date().toISOString();

  constructor() {}

  ngOnInit() {
    this.initializeMonth();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['month'] &&
      changes['month'].currentValue &&
      !this.isUserSelectedMonth
    ) {
      this.initializeMonth();
    }

    if (changes['externalMonth'] && changes['externalMonth'].currentValue) {
      if (!this.isUserSelectedMonth) {
        this.month = changes['externalMonth'].currentValue;
        this.initializeMonth();
      }
    }
  }

  private initializeMonth(): void {
    if (this.month) {
      this.tempMonth = this.month;
      this.displayMonth = this.formatMonthForDisplay(this.month);
      console.log('MonthPicker initialized with month:', this.month);
    } else {
      this.tempMonth = '';
      this.displayMonth = '';
    }
  }

  private formatMonthForDisplay(monthString: string): string {
    if (!monthString) return '';

    try {
      // If already in MM-YYYY format, return as is
      if (/^\d{2}-\d{4}$/.test(monthString)) {
        return monthString;
      }

      // If in YYYY-MM format, convert to MM-YYYY
      if (/^\d{4}-\d{2}$/.test(monthString)) {
        const parts = monthString.split('-');
        return `${parts[1]}-${parts[0]}`;
      }

      const date = new Date(monthString);
      if (isNaN(date.getTime())) {
        return '';
      }

      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}-${year}`;
    } catch (error) {
      console.error('Error formatting month:', error);
      return '';
    }
  }

  private formatMonthForAPI(monthString: string): string {
    if (!monthString) return '';

    try {
      // If already in YYYY-MM format, return as is
      if (/^\d{4}-\d{2}$/.test(monthString)) {
        return monthString;
      }

      // If in MM-YYYY format, convert to YYYY-MM
      if (/^\d{2}-\d{4}$/.test(monthString)) {
        const parts = monthString.split('-');
        return `${parts[1]}-${parts[0]}`;
      }

      const date = new Date(monthString);
      if (isNaN(date.getTime())) {
        return '';
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}`;
    } catch (error) {
      console.error('Error formatting month for API:', error);
      return '';
    }
  }

  /**
   * Convert YYYY-MM to YYYY-MM-DD format for ion-datetime
   * Uses the first day of the month
   */
  private formatMonthForDatetime(monthString: string): string {
    if (!monthString) return '';

    try {
      // If already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(monthString)) {
        return monthString;
      }

      // If in YYYY-MM format, append '-01' for the first day
      if (/^\d{4}-\d{2}$/.test(monthString)) {
        return `${monthString}-01`;
      }

      // If in MM-YYYY format, convert to YYYY-MM-DD
      if (/^\d{2}-\d{4}$/.test(monthString)) {
        const parts = monthString.split('-');
        return `${parts[1]}-${parts[0]}-01`;
      }

      // Try parsing as Date
      const date = new Date(monthString);
      if (isNaN(date.getTime())) {
        return '';
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}-01`;
    } catch (error) {
      console.error('Error formatting month for datetime:', error);
      return '';
    }
  }

  openMonthModal(): void {
    // Store the original month before opening modal
    this.originalMonth = this.month || '';

    // Convert to YYYY-MM-DD format for ion-datetime
    // This ensures the correct month is shown in the modal
    const datetimeValue = this.formatMonthForDatetime(this.originalMonth);
    this.tempMonth = datetimeValue || this.getCurrentMonthFirstDay();

    console.log(
      'Opening month modal with tempMonth (YYYY-MM-DD):',
      this.tempMonth,
    );
    console.log('Original month (Display):', this.originalMonth);
    this.isMonthModalOpen = true;
  }

  onMonthChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (!value) return;
    // ion-datetime returns YYYY-MM-DD format, extract YYYY-MM
    this.tempMonth = String(value).substring(0, 7);
    console.log('Month selected in modal (YYYY-MM):', this.tempMonth);
  }

  onMonthDismiss(): void {
    console.log('Month dismissed - tempMonth:', this.tempMonth);
    console.log('Original month:', this.originalMonth);

    if (this.tempMonth && this.tempMonth !== this.originalMonth) {
      this.month = this.tempMonth;
      this.displayMonth = this.formatMonthForDisplay(this.tempMonth);
      this.isUserSelectedMonth = true;
      console.log('Month updated to:', this.month);
    } else {
      this.month = this.originalMonth;
      this.displayMonth = this.formatMonthForDisplay(this.originalMonth);
      console.log('Month reverted to:', this.month);
    }
    this.isMonthModalOpen = false;
  }

  onGetRecords(): void {
    const monthForAPI = this.formatMonthForAPI(this.month);
    console.log('Getting records with month:', monthForAPI || this.month);
    this.getRecords.emit({
      month: monthForAPI || this.month,
    });
  }

  resetUserSelection(): void {
    this.isUserSelectedMonth = false;
  }

  private getCurrentMonth(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  private getCurrentMonthFirstDay(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}-01`;
  }
}
