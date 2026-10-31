import { Component, OnInit } from '@angular/core';
import { DestroyRef, inject } from '@angular/core';
import { Subject, exhaustMap, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TranslateService } from '@ngx-translate/core';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { GradingService } from 'src/app/shared/services/production-services/grading-service/grading-service';

@Component({
  selector: 'app-recent-grading-records',
  templateUrl: './recent-grading-records.component.html',
  styleUrls: ['./recent-grading-records.component.scss'],
  standalone: false,
})
export class RecentGradingRecordsComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  gradinglistArr: any = [];
  pleasewaitflag = false;
  constructor(
    private UserContext: UserContext,
    private LanguageService: LanguageService,
    private translate: TranslateService,
    private GradingService: GradingService,
  ) {}

  ngOnInit() {}

  initializeApiCall() {
    this.getRecentGradingRecords();
  }
  getRecentGradingRecords() {
    var req = {
      user_id: this.UserContext.userId,
      millcode: this.UserContext.millCode,
      dept_id: this.UserContext.departmentId,
      design_id: this.UserContext.designId,
      language: this.LanguageService.getLanguage,
      fromdate: '',
      todate: '',
    };
    this.pleasewaitflag = true;
    this.GradingService.getGradingList(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleasewaitflag = false;
        }),
      )
      .subscribe({
        next: (response) => {
          if (response?.httpcode == 200) {
            this.gradinglistArr = response.data ?? [];
          } else {
            this.gradinglistArr = [];
          }
        },

        error: (error) => {
          console.error('Failed to load report:', error);

          this.gradinglistArr = [];
        },
      });
  }
}
