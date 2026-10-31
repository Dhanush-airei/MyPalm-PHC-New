import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { WeighbridgeService } from 'src/app/shared/services/production-services/weighbrigde-service/weighbridge-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-weighbridge-update',
  templateUrl: './weighbridge-update.page.html',
  styleUrls: ['./weighbridge-update.page.scss'],
  standalone: false,
})
export class WeighbridgeUpdatePage implements OnInit {
  private destroyRef = inject(DestroyRef);

  // Form
  weighbridgeForm!: FormGroup;

  // Variables
  params: any;
  getid: string = '';
  getnetweight: string = '';
  module: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private navParams: NavParams,
    private UserContext: UserContext,
    private LanguageService: LanguageService,
    private weighbridgeService: WeighbridgeService,
    private toastService: ToastService,
    private translate: TranslateService,
  ) {
    // Get params from navigation
    const viewform = navParams.get('item');
    this.module = navParams.get('module') || '';
    this.params = viewform ? JSON.parse(viewform) : null;

    // Set values
    this.getid = this.params?.id || '';
    this.getnetweight = this.params?.net_weight || '';

    // Handle module HOME
    if (this.module === 'HOME') {
      this.getnetweight = '';
    } else {
      if (this.getnetweight === '-' || this.getnetweight === null) {
        this.getnetweight = '0';
      }
    }

    // Create form
    this.createForm();
  }

  ngOnInit() {}

  /**
   * Create form with net weight control
   */
  private createForm(): void {
    this.weighbridgeForm = this.fb.group({
      txt_netweight: new FormControl(this.getnetweight),
    });
  }

  /**
   * Handle enter key press
   */
  onKeydown(event: KeyboardEvent, nextfield: string): void {
    if (event.key === 'Enter' && nextfield === 'done') {
      this.save();
    }
  }

  /**
   * Save net weight
   */
  save(): void {
    const netWeight = this.weighbridgeForm.value.txt_netweight;

    // Validate net weight
    if (!netWeight || netWeight === '') {
      this.toastService.warning('Net Weight is Mandatory');
      return;
    }

    // Prepare request
    const req = {
      userid: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      departmentid: this.UserContext.departmentId,
      designationid: this.UserContext.designId,
      id: Number(this.getid),
      netweight: netWeight,
      language: this.LanguageService.getLanguage,
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
          } else {
            this.toastService.error('Net Weight Update Failed');
          }
        },
        error: (err) => {
          console.error('Failed to update net weight:', err);
          this.toastService.error('Net Weight Update Failed');
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
