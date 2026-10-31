import {
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  IonInfiniteScroll,
  IonSearchbar,
  ModalController,
} from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { GradingService } from 'src/app/shared/services/production-services/grading-service/grading-service';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';

@Component({
  selector: 'app-grader-supplier-search',
  templateUrl: './grader-supplier-search.page.html',
  styleUrls: ['./grader-supplier-search.page.scss'],
  standalone: false,
})
export class GraderSupplierSearchPage implements OnInit {
  @ViewChild('search') search!: IonSearchbar;
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  private destroyRef = inject(DestroyRef);

  supplierSearchForm!: FormGroup;

  supplierArr: any[] = [];

  searchTerm = '';

  page = 1;
  size = 20;
  totalPage = 1;

  isLoading = false;
  noRecords = false;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private gradingService: GradingService,
    private languageService: LanguageService,
    private userContext: UserContext,
  ) {
    afterNextRender(() => {
      this.search?.setFocus();
    });
  }

  ngOnInit(): void {
    this.supplierSearchForm = this.fb.group({
      search: new FormControl(''),
    });

    this.loadSuppliers(true);
  }

  loadSuppliers(refresh: boolean): void {
    if (refresh) {
      this.page = 1;
      this.supplierArr = [];
    }

    const req = {
      user_id: this.userContext.userId,
      millcode: this.userContext.millCode,
      dept_id: this.userContext.departmentId,
      design_id: this.userContext.designId,
      searchtext: this.searchTerm,
      page: this.page,
      language: this.languageService.getLanguage,
    };

    this.isLoading = true;

    this.gradingService
      .getSupplierList(req)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res: any) => {
          if (res.httpcode == 200) {
            this.size = Number(res.size);
            this.totalPage = Number(res.total_page);

            if (refresh) {
              this.supplierArr = [];
            }

            this.supplierArr.push(...res.vehicleData);

            this.noRecords = this.supplierArr.length === 0;
          } else {
            this.noRecords = true;
          }
        },
        error: (err) => {
          console.error(err);
          this.noRecords = true;
        },
      });
  }

  onSearch(event: any): void {
    this.searchTerm = event.detail.value?.trim() || '';
    this.loadSuppliers(true);
  }

  loadMore(event: any): void {
    if (this.page >= this.totalPage) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }

    this.page++;

    const req = {
      user_id: this.userContext.userId,
      millcode: this.userContext.millCode,
      dept_id: this.userContext.departmentId,
      design_id: this.userContext.designId,
      searchtext: this.searchTerm,
      page: this.page,
      language: this.languageService.getLanguage,
    };

    this.gradingService
      .getSupplierList(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          if (res.httpcode == 200) {
            this.supplierArr.push(...res.vehicleData);
          }

          event.target.complete();
        },
        error: () => {
          event.target.complete();
        },
      });
  }

  selectSupplier(item: any): void {
    this.modalController.dismiss({
      type: item.id == 0 ? 'manual' : 'selected',
      id: item.supplier_id,
      supplier_name: item.id == 0 ? this.searchTerm : item.supplier_name,
    });
  }

  dismiss(): void {
    this.modalController.dismiss();
  }

  getTextColor(status: number): string {
    switch (status) {
      case 1:
        return '#006426';

      case 0:
        return '#b91818';

      default:
        return '#000000';
    }
  }
}
