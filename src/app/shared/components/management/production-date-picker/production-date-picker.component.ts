/* production-date-picker.component.ts */
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
  selector: 'app-production-date-picker',
  templateUrl: './production-date-picker.component.html',
  styleUrls: ['./production-date-picker.component.scss'],
  standalone: false,
})
export class ProductionDatePickerComponent implements OnInit, OnChanges {
  @Input() fromDate: string = '';
  @Input() toDate: string = '';

  // Output events for date changes
  @Output() fromDateChange = new EventEmitter<string>();
  @Output() toDateChange = new EventEmitter<string>();
  @Output() getReport = new EventEmitter<{
    fromDate: string;
    toDate: string;
  }>();

  isFromDateModalOpen: boolean = false;
  isToDateModalOpen: boolean = false;

  // Internal date values (YYYY-MM-DD)
  internalFromDate: string = '';
  internalToDate: string = '';

  // Temporary values for modal
  tempFromDate: string = '';
  tempToDate: string = '';

  // Store original values to revert on cancel
  originalFromDate: string = '';
  originalToDate: string = '';

  maxDate: string = '';

  constructor() {}

  ngOnInit() {
    this.maxDate = this.getToday();
    // Initialize internal dates from inputs
    this.internalFromDate = this.fromDate || '';
    this.internalToDate = this.toDate || '';
  }

  /**
   * Detect changes to input properties
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fromDate']) {
      this.internalFromDate = changes['fromDate'].currentValue || '';
    }
    if (changes['toDate']) {
      this.internalToDate = changes['toDate'].currentValue || '';
    }
  }

  /**
   * Get display formatted from date (DD-MM-YYYY)
   */
  get displayFromDate(): string {
    if (!this.internalFromDate) return '';
    return this.formatDateToDisplay(this.internalFromDate);
  }

  /**
   * Get display formatted to date (DD-MM-YYYY)
   */
  get displayToDate(): string {
    if (!this.internalToDate) return '';
    return this.formatDateToDisplay(this.internalToDate);
  }

  /**
   * Open From Date Modal
   */
  openFromDateModal(): void {
    // Store original value for cancel
    this.originalFromDate = this.internalFromDate;
    // Use existing fromDate if available
    this.tempFromDate = this.internalFromDate || '';
    this.isFromDateModalOpen = true;
  }

  /**
   * Open To Date Modal
   */
  openToDateModal(): void {
    // Store original value for cancel
    this.originalToDate = this.internalToDate;
    // Use existing toDate if available
    this.tempToDate = this.internalToDate || '';
    this.isToDateModalOpen = true;
  }

  /**
   * From date changed
   */
  onFromDateChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (!value) return;
    this.tempFromDate = String(value).substring(0, 10);
  }

  /**
   * To date changed
   */
  onToDateChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (!value) return;
    this.tempToDate = String(value).substring(0, 10);
  }

  /**
   * From date cancel - revert to original value
   */
  onFromDateCancel(): void {
    // Revert to original value
    this.internalFromDate = this.originalFromDate;
    this.isFromDateModalOpen = false;
  }

  /**
   * To date cancel - revert to original value
   */
  onToDateCancel(): void {
    // Revert to original value
    this.internalToDate = this.originalToDate;
    this.isToDateModalOpen = false;
  }

  /**
   * From date modal dismissed
   */
  onFromDateDismiss(): void {
    // Only update if we have a valid date
    if (this.tempFromDate) {
      this.internalFromDate = this.tempFromDate;

      // Emit the change to parent
      this.fromDateChange.emit(this.internalFromDate);

      // If From Date becomes greater than To Date, automatically update To Date
      if (this.internalToDate && this.internalFromDate > this.internalToDate) {
        this.internalToDate = this.internalFromDate;
        // Emit the to date change as well
        this.toDateChange.emit(this.internalToDate);
      }
    }

    this.isFromDateModalOpen = false;
  }

  /**
   * To date modal dismissed
   */
  onToDateDismiss(): void {
    // Only update if we have a valid date
    if (this.tempToDate) {
      this.internalToDate = this.tempToDate;

      // Emit the change to parent
      this.toDateChange.emit(this.internalToDate);

      // Don't allow To Date before From Date
      if (
        this.internalFromDate &&
        this.internalToDate < this.internalFromDate
      ) {
        this.internalToDate = this.internalFromDate;
        // Emit the to date change again
        this.toDateChange.emit(this.internalToDate);
      }
    }

    this.isToDateModalOpen = false;
  }

  /**
   * Emit selected dates to parent
   */
  onGetReport(): void {
    console.log('ProductionDatePicker - onGetReport called');
    console.log('internalFromDate:', this.internalFromDate);
    console.log('internalToDate:', this.internalToDate);

    if (this.internalFromDate && this.internalToDate) {
      this.getReport.emit({
        fromDate: this.internalFromDate,
        toDate: this.internalToDate,
      });
    }
  }

  /**
   * Set from date externally (from API response)
   */
  setFromDate(date: string): void {
    this.internalFromDate = date || '';
  }

  /**
   * Set to date externally (from API response)
   */
  setToDate(date: string): void {
    this.internalToDate = date || '';
  }

  /**
   * Format date from YYYY-MM-DD to DD-MM-YYYY for display
   */
  private formatDateToDisplay(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
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
