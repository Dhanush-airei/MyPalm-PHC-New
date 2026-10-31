import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-date-ranger-picker',
  templateUrl: './date-ranger-picker.component.html',
  styleUrls: ['./date-ranger-picker.component.scss'],
  standalone: false,
})
export class DateRangerPickerComponent implements OnInit {
  @Input() fromDate: string = '';

  @Input() toDate: string = '';

  @Output() getReport = new EventEmitter<{
    fromDate: string;
    toDate: string;
  }>();

  isFromDateModalOpen = false;

  isToDateModalOpen = false;

  tempFromDate: string = '';

  tempToDate: string = '';

  /**
   * Maximum selectable date
   */
  maxDate = new Date().toISOString();

  constructor() {}

  ngOnInit() {}

  /**
   * Open From Date
   */
  openFromDateModal(): void {
    this.tempFromDate = this.fromDate || this.getToday();

    this.isFromDateModalOpen = true;
  }

  /**
   * Close From Date
   */
  closeFromDateModal(): void {
    this.isFromDateModalOpen = false;
  }

  /**
   * Open To Date
   */
  openToDateModal(): void {
    this.tempToDate = this.toDate || this.fromDate || this.getToday();

    this.isToDateModalOpen = true;
  }

  /**
   * Close To Date
   */
  closeToDateModal(): void {
    this.isToDateModalOpen = false;
  }

  /**
   * From date changed
   */
  onFromDateChange(event: CustomEvent): void {
    const value = event.detail.value;

    if (!value) {
      return;
    }

    this.tempFromDate = String(value).substring(0, 10);
  }

  /**
   * To date changed
   */
  onToDateChange(event: CustomEvent): void {
    const value = event.detail.value;

    if (!value) {
      return;
    }

    this.tempToDate = String(value).substring(0, 10);
  }

  /**
   * From date modal dismissed
   */
  onFromDateDismiss(): void {
    this.fromDate = this.tempFromDate;

    /**
     * If From Date becomes greater than To Date,
     * automatically update To Date.
     */
    if (this.toDate && this.fromDate > this.toDate) {
      this.toDate = this.fromDate;
    }

    this.isFromDateModalOpen = false;
  }

  /**
   * To date modal dismissed
   */
  onToDateDismiss(): void {
    this.toDate = this.tempToDate;

    /**
     * Don't allow To Date before From Date.
     */
    if (this.fromDate && this.toDate < this.fromDate) {
      this.toDate = this.fromDate;
    }

    this.isToDateModalOpen = false;
  }

  /**
   * Emit selected dates to parent
   */
  onGetReport(): void {
    this.getReport.emit({
      fromDate: this.fromDate,
      toDate: this.toDate,
    });
  }

  /**
   * Get today
   */
  private getToday(): string {
    const date = new Date();

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, '0');

    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
