import {
  Component,
  OnInit,
  Input,
  ViewChild,
  DestroyRef,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { IonContent, ModalController } from '@ionic/angular';

import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { WeighbridgeService } from 'src/app/shared/services/production-services/weighbrigde-service/weighbridge-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';

@Component({
  selector: 'app-production-hourly-pressing-station-update',
  templateUrl: './production-hourly-pressing-station-update.page.html',
  styleUrls: ['./production-hourly-pressing-station-update.page.scss'],
  standalone: false,
})
export class ProductionHourlyPressingStationUpdatePage implements OnInit {
  // @ViewChild('pageHeader')
  // pageHeader!: PageHeaderComponent;

  // @ViewChild(IonContent) pageBottom!: IonContent;

  // private destroyRef = inject(DestroyRef);

  // // Header Configuration
  // appTitle: string = 'Update Net Weight';
  // headerActions: string = '0';
  // showLogo: number = 0;
  // showBackButton: number = 0;

  // // Props passed via ModalController componentProps
  // @Input() item: string = ''; // JSON string of the record
  // @Input() module: string = ''; // 'NOTIFICATION SCREEN' or ''

  // // Form
  // weighbridgeForm!: FormGroup;

  // // User Data
  // userId: number = 0;
  // millCode: string = '';
  // departmentId: number = 0;
  // designationId: number = 0;

  // // Params
  // params: any;

  // // Weighbridge Data
  // weighbridgeId: number = 0;
  // hardBunches: string = '';
  // underRipeBunches: string = '';
  // ripenessPercent: string = '';
  // overduePercent: string = '';
  // looseFruits: string = '';
  // netWeight: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private modalController: ModalController,
    private userContext: UserContext,
    private languageService: LanguageService,
    private weighbridgeService: WeighbridgeService,
    private toastService: ToastService,
  ) {
    // Initialize user data from UserContext
    // this.userId = this.userContext.userId || 0;
    // this.millCode = this.userContext.millCode || '';
    // this.departmentId = this.userContext.departmentId || 0;
    // this.designationId = this.userContext.designId || 0;
    // // Create the form
    // this.createForm();
  }

  ngOnInit(): void {
    // this.initializeFromInputs();
  }

  // ionViewWillEnter(): void {
  //   this.pageHeader?.getNotificationApi();
  // }

  // private createForm(): void {
  //   this.weighbridgeForm = this.fb.group({
  //     txt_netweight: new FormControl(''),
  //   });
  // }

  // /**
  //  * Read the inputs (from ModalController componentProps),
  //  * set the current record, and call the API if needed
  //  */
  // private initializeFromInputs(): void {
  //   if (!this.item) {
  //     return;
  //   }

  //   try {
  //     this.params = JSON.parse(this.item);
  //   } catch (e) {
  //     console.error('Failed to parse item:', e);
  //     this.params = null;
  //     return;
  //   }

  //   console.log('Params:', this.params);
  //   console.log('Module:', this.module);

  //   if (this.module === 'NOTIFICATION SCREEN') {
  //     // Fetch details from API
  //     this.weighbridgeId = this.params.baseid;
  //     this.getDetails(this.weighbridgeId);
  //   } else {
  //     // Use values directly from params
  //     this.weighbridgeId = Number(this.params.id);
  //     this.hardBunches = this.params.hard_bunch_percent || '';
  //     this.looseFruits = this.params.loose_fruit_percent || '';
  //     this.netWeight = this.params.net_weight || '';
  //     this.overduePercent = this.params.overdue_percent || '';
  //     this.ripenessPercent = this.params.ripeness_percent || '';
  //     this.underRipeBunches = this.params.under_ripe_bunch_percent || '';

  //     // Populate form
  //     this.weighbridgeForm.controls['txt_netweight'].setValue(this.netWeight);
  //   }
  // }

  // /**
  //  * Fetch weighbridge details from the API
  //  */
  // private getDetails(id: number | string): void {
  //   const req = {
  //     user_id: this.userId,
  //     millcode: this.millCode,
  //     dept_id: this.departmentId,
  //     design_id: this.designationId,
  //     id: id,
  //     page: 1,
  //     fromdate: '',
  //     todate: '',
  //     language: this.languageService.getLanguage,
  //   };

  //   console.log('getweighbridgedetails Request:', req);

  //   this.weighbridgeService
  //     .getWeighbridgeDetails(req)
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe({
  //       next: (response: any) => {
  //         console.log('getweighbridgedetails Response:', response);

  //         if (response?.httpcode == 200 || response?.httpcode == '200') {
  //           const data = response.data?.[0] || {};

  //           this.weighbridgeId = Number(data.id) || 0;
  //           this.hardBunches = data.hard_bunch_percent || '';
  //           this.looseFruits = data.loose_fruit_percent || '';
  //           this.netWeight = data.net_weight || '';
  //           this.overduePercent = data.overdue_percent || '';
  //           this.ripenessPercent = data.ripeness_percent || '';
  //           this.underRipeBunches = data.under_ripe_bunch_percent || '';

  //           // Populate the form with the net weight
  //           this.weighbridgeForm.controls['txt_netweight'].setValue(
  //             this.netWeight,
  //           );
  //         }
  //       },
  //       error: (error) => {
  //         console.error('Error fetching weighbridge details:', error);
  //       },
  //     });
  // }

  // /**
  //  * Save the net weight update
  //  */
  // save(): void {
  //   const netWeightValue = this.weighbridgeForm.value.txt_netweight;

  //   // Validation
  //   if (
  //     netWeightValue === '' ||
  //     netWeightValue === null ||
  //     netWeightValue === undefined
  //   ) {
  //     this.toastService.error('Net Weight is Mandatory');
  //     return;
  //   }

  //   const req = {
  //     userid: this.userId,
  //     departmentid: this.departmentId,
  //     designationid: this.designationId,
  //     millcode: this.millCode,
  //     id: this.weighbridgeId,
  //     netweight: netWeightValue,
  //     language: this.languageService.getLanguage,
  //   };

  //   console.log('saveweighbridgedetails Request:', req);

  //   this.weighbridgeService
  //     .saveweighbridgedetails(req)
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe({
  //       next: (response: any) => {
  //         console.log('saveweighbridgedetails Response:', response);

  //         if (response?.httpcode == 200 || response?.httpcode == '200') {
  //           this.toastService.success('Net Weight Updated Successfully');
  //           this.modalController.dismiss({
  //             dismissed: true,
  //             item: 'Saved',
  //           });
  //         } else if (response?.httpcode == 203 || response?.httpcode == '203') {
  //           this.toastService.error('Net Weight already updated!');
  //           this.modalController.dismiss({
  //             dismissed: true,
  //             item: 'Updated',
  //           });
  //         } else {
  //           this.toastService.error('Net Weight Updation Failed');
  //         }
  //       },
  //       error: (error) => {
  //         console.error('Error saving net weight:', error);
  //         this.toastService.error('Net Weight Updation Failed');
  //       },
  //     });
  // }

  // /**
  //  * Cancel and dismiss the modal
  //  */
  // cancel(): void {
  //   this.modalController.dismiss({
  //     dismissed: true,
  //     item: '',
  //   });
  // }

  // /**
  //  * Scroll to the net weight input when it receives focus
  //  */
  // scrollBottom(): void {
  //   setTimeout(() => {
  //     const element = document.getElementById('txt_netweight');
  //     if (element && this.pageBottom) {
  //       const offsetTop = (element as HTMLElement).offsetTop;
  //       this.pageBottom.scrollToPoint(0, offsetTop, 20);
  //     }
  //   }, 300);
  // }

  // /**
  //  * Filter input to allow 2 decimal places
  //  */
  // decimalFilter(event: any): void {
  //   const reg = /^-?\d*(\.\d{0,2})?$/;
  //   const input = event.target.value + String.fromCharCode(event.charCode);

  //   if (!reg.test(input)) {
  //     event.preventDefault();
  //   }
  // }
}
