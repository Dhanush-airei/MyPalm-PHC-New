import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  inject,
  DestroyRef,
  OnDestroy,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ModalController,
  NavParams,
  IonContent,
  Platform,
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { WeighbridgeService } from 'src/app/shared/services/production-services/weighbrigde-service/weighbridge-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';

// Import Capacitor Keyboard if available
import { Keyboard } from '@capacitor/keyboard';

@Component({
  selector: 'app-weighbridge-update-report',
  templateUrl: './weighbridge-update-report.page.html',
  styleUrls: ['./weighbridge-update-report.page.scss'],
  standalone: false,
})
export class WeighbridgeUpdateReportPage
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('pageBottom', { static: false }) pageBottom!: IonContent;
  @ViewChild('txtNetweight', { static: false }) txtNetweight!: ElementRef;

  private destroyRef = inject(DestroyRef);
  private keyboardListeners: any[] = [];

  // Form
  weighbridgeForm!: FormGroup;

  // Variables
  params: any;
  getid: string = '';
  getnetweight: string = '';
  module: string = '';
  weighbridgeid: number = 0;
  hardbunches: string = '';
  dateandtime: string = '';
  loosefruits: string = '';
  netweight: string = '';
  overduepercent: string = '';
  ripenesspercent: string = '';
  underripebunches: string = '';
  isLoading: boolean = false;

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    public modalController: ModalController,
    private fb: FormBuilder,
    private weighbridgeService: WeighbridgeService,
    private toastService: ToastService,
    private navParams: NavParams,
    private UserContext: UserContext,
    private platform: Platform,
  ) {
    // Get params from navigation
    const viewform = navParams.get('item');
    this.module = navParams.get('module') || '';
    this.params = viewform ? JSON.parse(viewform) : null;

    console.log('Params:', this.params);

    // Set values based on module
    if (this.module === 'NOTIFICATION SCREEN') {
      this.weighbridgeid = this.params?.baseid || 0;
      this.getDetails(this.weighbridgeid);
    } else {
      this.weighbridgeid = Number(this.params?.id) || 0;
      this.hardbunches = this.params?.hard_bunch_percent || '';
      this.loosefruits = this.params?.loose_fruit_percent || '';
      this.netweight = this.params?.net_weight || '';
      this.overduepercent = this.params?.overdue_percent || '';
      this.ripenesspercent = this.params?.ripeness_percent || '';
      this.underripebunches = this.params?.under_ripe_bunch_percent || '';
    }

    // Create form
    this.createForm();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    // Setup scroll for keyboard
    this.setupKeyboardScroll();
  }

  ngOnDestroy() {
    // Clean up keyboard listeners
    this.removeKeyboardListeners();
  }

  /**
   * Create form with net weight control
   */
  private createForm(): void {
    this.weighbridgeForm = this.fb.group({
      txt_netweight: new FormControl(this.netweight, [
        Validators.required,
        Validators.min(0.01),
      ]),
    });
  }

  /**
   * Setup keyboard scroll with proper Capacitor Keyboard plugin usage
   */
  private setupKeyboardScroll(): void {
    // Method 1: Using Capacitor Keyboard plugin (recommended)
    if (this.platform.is('hybrid')) {
      try {
        // Check if Keyboard plugin is available
        if (Keyboard && typeof Keyboard.addListener === 'function') {
          const willShowListener = Keyboard.addListener(
            'keyboardWillShow',
            () => {
              setTimeout(() => {
                this.scrollToInput();
              }, 200);
            },
          );

          const didShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
              setTimeout(() => {
                this.scrollToInput();
              }, 200);
            },
          );

          // Store listeners for cleanup
          this.keyboardListeners.push(willShowListener, didShowListener);
        } else {
          console.warn('Capacitor Keyboard plugin not available');
          this.setupLegacyKeyboardScroll();
        }
      } catch (error) {
        console.warn('Error setting up Keyboard plugin:', error);
        this.setupLegacyKeyboardScroll();
      }
    } else {
      // Web platform - use a different approach or ignore
      console.log('Running on web platform, keyboard scroll not needed');
    }
  }

  /**
   * Legacy keyboard scroll setup (fallback)
   */
  private setupLegacyKeyboardScroll(): void {
    // Try to use window.Keyboard (older versions)
    if (typeof window !== 'undefined' && (window as any).Keyboard) {
      try {
        const keyboard = (window as any).Keyboard;
        if (typeof keyboard.addListener === 'function') {
          const willShowListener = keyboard.addListener(
            'keyboardWillShow',
            () => {
              setTimeout(() => {
                this.scrollToInput();
              }, 200);
            },
          );

          const didShowListener = keyboard.addListener(
            'keyboardDidShow',
            () => {
              setTimeout(() => {
                this.scrollToInput();
              }, 200);
            },
          );

          this.keyboardListeners.push(willShowListener, didShowListener);
        }
      } catch (error) {
        console.warn('Error setting up legacy keyboard:', error);
      }
    }
  }

  /**
   * Clean up keyboard listeners
   */
  private removeKeyboardListeners(): void {
    this.keyboardListeners.forEach((listener) => {
      try {
        if (listener && typeof listener.remove === 'function') {
          listener.remove();
        }
      } catch (error) {
        console.warn('Error removing keyboard listener:', error);
      }
    });
    this.keyboardListeners = [];
  }

  /**
   * Scroll to input element
   */
  private scrollToInput(): void {
    try {
      if (this.txtNetweight && this.txtNetweight.nativeElement) {
        const element = this.txtNetweight.nativeElement;
        const offsetTop = element.offsetTop || 0;
        if (
          this.pageBottom &&
          typeof this.pageBottom.scrollToPoint === 'function'
        ) {
          this.pageBottom.scrollToPoint(0, offsetTop, 20);
        }
      }
    } catch (error) {
      console.warn('Error scrolling to input:', error);
    }
  }

  /**
   * Get details for notification screen
   */
  getDetails(getId: number): void {
    const req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      id: getId,
      page: 1,
      fromdate: '',
      todate: '',
      language: this.languageService.getLanguage,
    };

    console.log('Get Details Request:', req);

    this.weighbridgeService
      .getWeighbridgeDetails(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          console.log('Get Details Response:', response);

          if (
            response.httpcode === 200 &&
            response.data &&
            response.data.length > 0
          ) {
            const data = response.data[0];
            this.weighbridgeid = Number(data.id) || 0;
            this.hardbunches = data.hard_bunch_percent || '';
            this.loosefruits = data.loose_fruit_percent || '';
            this.netweight = data.net_weight || '';
            this.overduepercent = data.overdue_percent || '';
            this.ripenesspercent = data.ripeness_percent || '';
            this.underripebunches = data.under_ripe_bunch_percent || '';

            // Update form with net weight
            this.weighbridgeForm.controls['txt_netweight'].setValue(
              this.netweight,
            );
          }
        },
        error: (err) => {
          console.error('Failed to get details:', err);
          this.toastService.error('Failed to load details');
        },
      });
  }

  /**
   * Save net weight
   */
  save(): void {
    const netWeight = this.weighbridgeForm.value.txt_netweight;

    // Validate net weight
    if (!netWeight || netWeight === '' || netWeight === null) {
      this.toastService.warning('Net Weight is Mandatory');
      return;
    }

    // Prepare request
    const req = {
      userid: this.UserContext.userId,
      departmentid: this.UserContext.departmentId,
      designationid: this.UserContext.designId,
      millcode: this.UserContext.millCode,
      id: this.weighbridgeid,
      netweight: netWeight,
      language: this.languageService.getLanguage,
    };

    console.log('Update Request:', req);

    this.isLoading = true;

    this.weighbridgeService
      .saveweighbridgedetails(req)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response: any) => {
          console.log('Update Response:', response);

          if (response.httpcode == 200) {
            this.toastService.success('Net Weight Updated Successfully');
            this.modalController.dismiss({
              dismissed: true,
              item: 'Saved',
            });
          } else if (response.httpcode === 203) {
            this.toastService.warning('Net Weight already updated!');
            this.modalController.dismiss({
              dismissed: true,
              item: 'Updated',
            });
          } else {
            this.toastService.error('Net Weight Updation Failed');
          }
        },
        error: (err) => {
          console.error('Failed to update net weight:', err);
          this.toastService.error('Net Weight Updation Failed');
        },
      });
  }

  /**
   * Cancel and dismiss modal
   */
  cancel(): void {
    this.modalController.dismiss({
      dismissed: true,
      item: '',
    });
  }

  /**
   * Scroll to bottom when input is focused
   */
  scrollBottom(): void {
    setTimeout(() => {
      this.scrollToInput();
    }, 200);
  }

  /**
   * Filter decimal input (allows only 2 decimal places)
   */
  decimalFilter(event: any): void {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    const input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }
}
