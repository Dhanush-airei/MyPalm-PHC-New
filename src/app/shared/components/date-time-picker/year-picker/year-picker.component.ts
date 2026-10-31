/* year-picker.component.ts */
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
  selector: 'app-year-picker',
  templateUrl: './year-picker.component.html',
  styleUrls: ['./year-picker.component.scss'],
  standalone: false,
})
export class YearPickerComponent implements OnInit, OnChanges {
  @Input() year: string = '';
  @Input() externalYear: string = '';

  @Output() getRecords = new EventEmitter<{
    year: string;
  }>();

  isYearModalOpen = false;

  tempYear: string = '';
  displayYear: string = '';

  // Store the original year before opening modal
  private originalYear: string = '';
  private isUserSelectedYear: boolean = false;

  maxDate = new Date().toISOString();

  constructor() {}

  ngOnInit() {
    this.initializeYear();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['year'] &&
      changes['year'].currentValue &&
      !this.isUserSelectedYear
    ) {
      this.initializeYear();
    }

    if (changes['externalYear'] && changes['externalYear'].currentValue) {
      if (!this.isUserSelectedYear) {
        this.year = changes['externalYear'].currentValue;
        this.initializeYear();
      }
    }
  }

  private initializeYear(): void {
    if (this.year) {
      this.tempYear = this.year;
      this.displayYear = this.year;
      console.log('YearPicker initialized with year:', this.year);
    } else {
      this.tempYear = '';
      this.displayYear = '';
    }
  }

  openYearModal(): void {
    // Store the original year before opening modal
    this.originalYear = this.year || '';
    this.tempYear = this.originalYear || '';
    console.log('Opening year modal with tempYear:', this.tempYear);
    this.isYearModalOpen = true;
  }

  onYearChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (!value) return;
    this.tempYear = String(value).substring(0, 4);
    console.log('Year selected in modal:', this.tempYear);
  }

  onYearDismiss(): void {
    console.log('Year dismissed - tempYear:', this.tempYear);
    console.log('Original year:', this.originalYear);

    if (this.tempYear && this.tempYear !== this.originalYear) {
      this.year = this.tempYear;
      this.displayYear = this.tempYear;
      this.isUserSelectedYear = true;
      console.log('Year updated to:', this.year);
    } else {
      this.year = this.originalYear;
      this.displayYear = this.originalYear;
      console.log('Year reverted to:', this.year);
    }
    this.isYearModalOpen = false;
  }

  onGetRecords(): void {
    console.log('Getting records with year:', this.year);
    this.getRecords.emit({
      year: this.year,
    });
  }

  resetUserSelection(): void {
    this.isUserSelectedYear = false;
  }

  private getCurrentYear(): string {
    const date = new Date();
    return String(date.getFullYear());
  }
}
