import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { DestroyRef, inject } from '@angular/core';
import { Subject, finalize, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { WeighbridgeService } from 'src/app/shared/services/production-services/weighbrigde-service/weighbridge-service';
import { ModalController } from '@ionic/angular';
import { WeighbridgeUpdatePage } from 'src/app/pages/production/weighbridge/weighbridge-update/weighbridge-update.page';
import { Animation, AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-weighbridge-records-card',
  templateUrl: './weighbridge-records-card.component.html',
  styleUrls: ['./weighbridge-records-card.component.scss'],
  standalone: false,
})
export class WeighbridgeRecordsCardComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  // Animation element - matches older version
  @ViewChild('myElementRef', { static: false }) myElementRef!: ElementRef;

  @Output() buttonClick = new EventEmitter<any>();
  @Output() dateUpdate = new EventEmitter<string>();

  @Input() externalDate: string = '';
  @Input() selectedDate: string = ''; // New input for user-selected date
  @Input() refreshTrigger: number = 0; // New input to trigger refresh

  @ViewChild('searchInput') searchInput!: ElementRef;

  private destroyRef = inject(DestroyRef);

  // Form
  reportForm!: FormGroup;

  // Date variables
  date: string = '';
  getDate: string = '';
  displayDate: string = '';

  // Track if we should use external date or user-selected date
  private useExternalDate: boolean = true;

  // STATIC FLAG - Shared across all instances
  private static hasAnimatedGlobally: boolean = false;

  // Track if this is the first ever load
  private isFirstEverLoad: boolean = true;

  // Data arrays
  weighbridgeArr: any = [];
  filteredWeighbridgeArr: any = [];

  // Search filter
  filterTerm: string = '';
  private searchSubject = new Subject<string>();
  isSearchFocused: boolean = false;

  // Pagination
  newsize: number = 0;
  newtotalpage: number = 0;

  currentPage: number = 1;
  hasMoreData: boolean = true;
  isLoadingMore: boolean = false;

  // Flags
  pleasewaitflag: boolean = false;
  norecordFlag: boolean = false;

  // Animation reference for cleanup
  private pageAnimation?: Animation;

  constructor(
    private fb: FormBuilder,
    private UserContext: UserContext,
    private LanguageService: LanguageService,
    private translate: TranslateService,
    private weighbridgeService: WeighbridgeService,
    public modalController: ModalController,
    private animationCtrl: AnimationController,
  ) {
    this.createForm();

    // Setup search with debounce
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((searchTerm) => {
        this.applyFilter(searchTerm);
      });
  }

  ngOnInit() {}

  /**
   * After view init - Prepare animation but don't play yet
   */
  ngAfterViewInit(): void {
    // Create animation but don't play yet
    // We'll play it after data loads
    this.createAnimation();
  }

  /**
   * Create animation instance
   */
  private createAnimation(): void {
    // Check if element exists
    if (!this.myElementRef || !this.myElementRef.nativeElement) {
      console.warn('Element for animation not found');
      return;
    }

    try {
      // Animation - exactly matching older version
      this.pageAnimation = this.animationCtrl
        .create()
        .addElement(this.myElementRef.nativeElement)
        .duration(2000) // Same as older version
        .fromTo('transform', 'translateX(600px)', 'translateX(0px)')
        .fromTo('opacity', '0', '1');
    } catch (error) {
      console.error('Error creating animation:', error);
    }
  }

  /**
   * Play the animation - ONLY on first ever load
   */
  private playAnimation(): void {
    // Only play if:
    // 1. Animation exists
    // 2. Has not animated globally before (static flag)
    // 3. This is the first ever load
    if (
      this.pageAnimation &&
      !WeighbridgeRecordsCardComponent.hasAnimatedGlobally &&
      this.isFirstEverLoad
    ) {
      try {
        this.pageAnimation.play();
        WeighbridgeRecordsCardComponent.hasAnimatedGlobally = true;
        this.isFirstEverLoad = false;
        console.log('🎬 Animation played (first ever load only)');
      } catch (error) {
        console.error('Error playing animation:', error);
      }
    } else {
      // If already animated globally, make element visible immediately
      if (this.myElementRef && this.myElementRef.nativeElement) {
        this.myElementRef.nativeElement.style.transform = 'translateX(0px)';
        this.myElementRef.nativeElement.style.opacity = '1';
      }
      console.log('⏭️ Animation skipped - already played globally');
    }
  }

  /**
   * On destroy - cleanup animations
   */
  ngOnDestroy(): void {
    // Destroy animation to prevent memory leaks
    if (this.pageAnimation) {
      this.pageAnimation.destroy();
      this.pageAnimation = undefined;
    }
  }

  /**
   * Detect changes to input dates
   */
  ngOnChanges(changes: SimpleChanges): void {
    // If user selected a date, use that instead of external date
    if (changes['selectedDate'] && changes['selectedDate'].currentValue) {
      this.useExternalDate = false;
      this.date = changes['selectedDate'].currentValue;
      this.getDate = this.date;
      this.displayDate = this.formatToDDMMYYYY(this.date);
      // Clear existing data and load new data (not first load)
      this.clearAndLoadData(false);
    }

    // If external date changes and no user date is selected, update
    if (
      changes['externalDate'] &&
      changes['externalDate'].currentValue &&
      this.useExternalDate
    ) {
      this.date = changes['externalDate'].currentValue;
      this.getDate = this.date;
      this.displayDate = this.formatToDDMMYYYY(this.date);
    }

    // If refresh trigger changes, reload data
    if (
      changes['refreshTrigger'] &&
      changes['refreshTrigger'].currentValue > 0
    ) {
      this.clearAndLoadData(false);
    }
  }

  /**
   * Clear existing data and load new data
   */
  private clearAndLoadData(isFirstLoad: boolean = false): void {
    // Clear all existing data
    this.weighbridgeArr = [];
    this.filteredWeighbridgeArr = [];
    this.currentPage = 1;
    this.hasMoreData = true;
    this.isLoadingMore = false;
    this.norecordFlag = false;
    this.filterTerm = '';
    this.filteredWeighbridgeArr = [];

    // Reset search
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }

    // Load new data
    this.getWeighbridgeDetails(true, 0, isFirstLoad);
  }

  initializeApiCall() {
    // Reset user selection flag for initial load
    this.useExternalDate = true;

    // Set this as first ever load if not animated globally yet
    this.isFirstEverLoad = !WeighbridgeRecordsCardComponent.hasAnimatedGlobally;

    // Use the date (either external or user-selected)
    if (this.date) {
      this.getDate = this.date;
      this.displayDate = this.formatToDDMMYYYY(this.date);
      this.reportForm.controls['date'].setValue(this.displayDate);
    } else if (this.externalDate) {
      this.date = this.externalDate;
      this.getDate = this.externalDate;
      this.displayDate = this.formatToDDMMYYYY(this.externalDate);
      this.reportForm.controls['date'].setValue(this.displayDate);
    }

    // Clear existing data
    this.weighbridgeArr = [];
    this.filteredWeighbridgeArr = [];
    this.currentPage = 1;
    this.hasMoreData = true;
    this.isLoadingMore = false;
    this.filterTerm = '';
    this.filteredWeighbridgeArr = [];

    // Reset element to initial state for animation (only if not animated globally)
    if (
      this.myElementRef &&
      this.myElementRef.nativeElement &&
      !WeighbridgeRecordsCardComponent.hasAnimatedGlobally
    ) {
      this.myElementRef.nativeElement.style.transform = 'translateX(600px)';
      this.myElementRef.nativeElement.style.opacity = '0';
    } else if (this.myElementRef && this.myElementRef.nativeElement) {
      // Already animated globally, make visible immediately
      this.myElementRef.nativeElement.style.transform = 'translateX(0px)';
      this.myElementRef.nativeElement.style.opacity = '1';
    }

    this.getWeighbridgeDetails(true, 0, this.isFirstEverLoad);
  }

  /**
   * Create form with date control
   */
  private createForm(): void {
    this.reportForm = this.fb.group({
      date: [''],
    });
  }

  /**
   * Format date to DD-MM-YYYY
   */
  private formatToDDMMYYYY(dateString: string): string {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString);
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

  /**
   * Handle search input change
   */
  onSearchChange(value: string): void {
    this.filterTerm = value;
    this.searchSubject.next(value);
  }

  onSearchFocus(): void {
    this.isSearchFocused = true;
  }

  onSearchBlur(): void {
    this.isSearchFocused = false;
  }

  /**
   * Handle search clear
   */
  clearSearch(): void {
    this.filterTerm = '';
    this.searchSubject.next('');
    // Focus back on input after clearing
    setTimeout(() => {
      if (this.searchInput) {
        this.searchInput.nativeElement.focus();
      }
    }, 0);
  }

  /**
   * Apply filter to weighbridge data
   */
  private applyFilter(searchTerm: string): void {
    if (!searchTerm || searchTerm.trim() === '') {
      this.filteredWeighbridgeArr = [...this.weighbridgeArr];
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    this.filteredWeighbridgeArr = this.weighbridgeArr.filter((item: any) => {
      // Search in supplier name
      if (
        item.supplier_name &&
        item.supplier_name.toLowerCase().includes(term)
      ) {
        return true;
      }
      // Search in vehicle number
      if (item.vehicle_no && item.vehicle_no.toLowerCase().includes(term)) {
        return true;
      }
      // Search in date
      if (item.insdt && item.insdt.toLowerCase().includes(term)) {
        return true;
      }
      // Search in hard_bunch_percent
      if (
        item.hard_bunch_percent &&
        String(item.hard_bunch_percent).includes(term)
      ) {
        return true;
      }
      // Search in under_ripe_bunch_percent
      if (
        item.under_ripe_bunch_percent &&
        String(item.under_ripe_bunch_percent).includes(term)
      ) {
        return true;
      }
      // Search in ripeness_percent
      if (
        item.ripeness_percent &&
        String(item.ripeness_percent).includes(term)
      ) {
        return true;
      }
      // Search in overdue_percent
      if (item.overdue_percent && String(item.overdue_percent).includes(term)) {
        return true;
      }
      // Search in loose_fruit_percent
      if (
        item.loose_fruit_percent &&
        String(item.loose_fruit_percent).includes(term)
      ) {
        return true;
      }
      // Search in any other string fields
      for (const key in item) {
        if (item[key] && typeof item[key] === 'string') {
          if (item[key].toLowerCase().includes(term)) {
            return true;
          }
        }
        // Search in number fields
        if (item[key] && typeof item[key] === 'number') {
          if (String(item[key]).includes(term)) {
            return true;
          }
        }
      }
      return false;
    });
  }

  /**
   * Get weighbridge details - API Call
   */
  getWeighbridgeDetails(
    pageRefresh: boolean,
    pageNum: number,
    isFirstLoad: boolean = false,
  ): void {
    // Prevent duplicate pagination API calls
    if (!pageRefresh && this.isLoadingMore) {
      return;
    }

    // If there is no more data, don't call API
    if (!pageRefresh && !this.hasMoreData) {
      return;
    }

    // Date
    if (this.date && this.date !== '') {
      this.getDate = this.date;
    } else {
      this.getDate = '';
    }

    // Reset pagination for fresh request
    if (pageRefresh) {
      this.currentPage = 1;
      this.hasMoreData = true;
      this.isLoadingMore = false;

      // Clear existing data for fresh request
      if (pageRefresh && !isFirstLoad) {
        this.weighbridgeArr = [];
        this.filteredWeighbridgeArr = [];
      }

      this.norecordFlag = false;
      this.pleasewaitflag = true;
    } else {
      this.isLoadingMore = true;
    }

    const requestPage = pageNum + 1;

    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      id: 0,
      page: requestPage,
      fromdate: this.getDate,
      todate: this.getDate,
      language: this.LanguageService.getLanguage,
    };

    console.log('Weighbridge Request:', req);

    this.weighbridgeService
      .getWeighbridgeDetails(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleasewaitflag = false;
          this.isLoadingMore = false;
          // Play animation ONLY on first ever load
          if (isFirstLoad) {
            this.playAnimation();
          } else {
            // For all other loads, ensure element is visible without animation
            if (this.myElementRef && this.myElementRef.nativeElement) {
              this.myElementRef.nativeElement.style.transform =
                'translateX(0px)';
              this.myElementRef.nativeElement.style.opacity = '1';
            }
          }
        }),
      )
      .subscribe({
        next: (response: any) => {
          console.log('Weighbridge Response:', response);

          // IMPORTANT: Only update date from API if we're using external date
          // and NOT if user has selected a date
          if (response?.Fromdate && this.useExternalDate) {
            // Store the date from API (YYYY-MM-DD format)
            const apiDate = response.Fromdate;
            this.date = apiDate;
            this.getDate = apiDate;

            // Format for display (DD-MM-YYYY)
            this.displayDate = this.formatToDDMMYYYY(apiDate);

            // Update form with formatted date
            this.reportForm.controls['date'].setValue(this.displayDate);

            // Emit date update to parent (in YYYY-MM-DD format for API)
            this.dateUpdate.emit(apiDate);

            console.log('Date updated from API (external):', {
              apiDate: apiDate,
              displayDate: this.displayDate,
            });
          } else if (response?.Fromdate && !this.useExternalDate) {
            // User selected date - don't override, just log
            console.log('API returned date but using user-selected date:', {
              apiDate: response.Fromdate,
              userDate: this.date,
            });
          }

          // API response pagination information
          this.newsize = Number(response?.size) || 0;
          const totalPages = Number(response?.total_page) || 0;
          this.newtotalpage = totalPages * this.newsize;

          // API success
          if (Number(response?.httpcode) === 200) {
            const newData = Array.isArray(response?.data) ? response.data : [];

            // No records returned
            if (newData.length === 0) {
              this.hasMoreData = false;
              // Clear existing data if no records found for the selected date
              if (!this.useExternalDate) {
                this.weighbridgeArr = [];
                this.filteredWeighbridgeArr = [];
              }
            } else {
              // Use immutable array update - replace, not append
              if (pageRefresh) {
                // For fresh request, replace all data
                this.weighbridgeArr = [...newData];
              } else {
                // For pagination, append new data
                this.weighbridgeArr = [...this.weighbridgeArr, ...newData];
              }
              this.currentPage = requestPage;

              // Apply filter to new data
              this.applyFilter(this.filterTerm);

              // Determine whether more data exists
              const loadedRecords = this.weighbridgeArr.length;

              if (totalPages > 0 && requestPage >= totalPages) {
                this.hasMoreData = false;
              } else if (
                this.newsize > 0 &&
                loadedRecords >= this.newtotalpage
              ) {
                this.hasMoreData = false;
              } else if (newData.length < this.newsize) {
                this.hasMoreData = false;
              } else {
                this.hasMoreData = true;
              }
            }

            this.norecordFlag = this.weighbridgeArr.length === 0;
            this.refreshLatestWeighbridgeRecords();
          } else {
            // Clear data on error for user-selected date
            if (!this.useExternalDate) {
              this.weighbridgeArr = [];
              this.filteredWeighbridgeArr = [];
            }
            this.norecordFlag = this.weighbridgeArr.length === 0;
            this.hasMoreData = false;
          }
        },
        error: (err: any) => {
          console.error('Failed to load weighbridge details:', err);
          // Clear data on error for user-selected date
          if (!this.useExternalDate) {
            this.weighbridgeArr = [];
            this.filteredWeighbridgeArr = [];
          }
          this.norecordFlag = this.weighbridgeArr.length === 0;
          this.hasMoreData = false;
          // Still play animation on error - ONLY on first ever load
          if (isFirstLoad) {
            this.playAnimation();
          }
        },
      });
  }

  async newpagination(event: any): Promise<void> {
    const infiniteScroll = event.target;

    // Already loading
    if (this.isLoadingMore) {
      infiniteScroll.complete();
      return;
    }

    // No more records
    if (!this.hasMoreData) {
      infiniteScroll.complete();
      infiniteScroll.disabled = true;
      return;
    }

    const nextPage = this.currentPage;
    this.getWeighbridgeDetails(false, nextPage, false);

    setTimeout(() => {
      infiniteScroll.complete();
      if (!this.hasMoreData) {
        infiniteScroll.disabled = true;
      }
    }, 0);
  }

  refreshLatestWeighbridgeRecords() {
    this.buttonClick.emit({
      refresh: true,
    });
  }

  async btn_update(value: any): Promise<void> {
    const weighbridgeModal = await this.modalController.create({
      component: WeighbridgeUpdatePage,
      componentProps: {
        item: JSON.stringify(value),
        module: 'HOME',
      },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: 'weighbridgepopup-update-modal',
    });

    weighbridgeModal.onDidDismiss().then((modalData) => {
      const getData = modalData?.data?.item;
      if (getData) {
        this.clearAndLoadData(false);
      }
    });

    await weighbridgeModal.present();
  }
}
