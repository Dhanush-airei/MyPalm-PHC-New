import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { SterilizerService } from 'src/app/shared/services/production-services/sterilizer-service/sterilizer-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: false,
})
export class ReportsPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  fmanagerArrReport: any[] = [
    {
      report_name: 'Production Reports',
      reportArr: [
        {
          title: this.translate.instant('PRODUCTIONHOME.sterilizationtitle'),
          subtitle: this.translate.instant('PRODUCTIONHOME.subtitlestation'),
          img: '../../assets/img/sterilizer_ report.png',
          path: '/sterilizer-report',
        },
        {
          title: this.translate.instant('PRODUCTIONHOME.pressingtitle'),
          subtitle: this.translate.instant('PRODUCTIONHOME.pressingsubtitle'),
          img: '../../assets/img/press_report.png',
          path: '/press-report',
        },
        {
          title: this.translate.instant('OILLOSSESSREPORT.oillosses'),
          subtitle: this.translate.instant('OILLOSSESSREPORT.summary'),
          img: '../../assets/img/oil_loss.png',
          path: '/oil-losses-summary',
        },
        {
          title: 'Performance',
          subtitle: 'Analysis',
          img: '../../assets/img/performanceanalysis.png',
          path: '/performance-analysis',
        },
      ],
    },
    {
      report_name: 'Maintenance Reports',
      reportArr: [
        {
          title: this.translate.instant('PRODUCTIONHOME.correctivetitle'),
          subtitle: this.translate.instant('PRODUCTIONHOME.correctivesubtitle'),
          img: '../../assets/img/corrective_report.png',
          path: '/corrective-maintenance',
        },
        {
          title: this.translate.instant('PRODUCTIONHOME.preventivetitle'),
          subtitle: this.translate.instant('PRODUCTIONHOME.preventivesubtitle'),
          img: '../../assets/img/preventive_report.png',
          path: '/preventive-maintenance',
        },
        {
          title: 'Predictive',
          subtitle: 'Maintenance',
          img: '../../assets/img/predictivemaintenance.png',
          path: '/predictive-maintenance',
        },
        {
          title: 'Machineries',
          subtitle: 'Running Hours',
          img: '../../assets/img/cpooerreport.png',
          path: '/machineries-running-hours',
        },
        {
          title: 'Part',
          subtitle: 'Running Hours',
          img: '../../assets/img/machinerunninghours.png',
          path: '/part-running-hours',
        },
      ],
    },
    {
      report_name: 'Lab Reports',
      reportArr: [
        {
          title: this.translate.instant('DEPARTMENTS.Laboratory'),
          subtitle: this.nl2br('<br>'),
          img: '../../assets/img/labdailyreport.png',
          path: '/laboratory',
        },
        {
          title: this.translate.instant('OILLOSSESSREPORT.ffa'),
          subtitle: 'Quality',
          img: '../../assets/img/ffa.png',
          path: '/daily-ffa-quality',
        },
        {
          title: 'CPO/PK',
          subtitle: 'Stock',
          img: '../../assets/img/oilreport-removebg-preview.png',
          path: '/cpo-pk-stock',
        },
      ],
    },
    {
      report_name: 'Grading Reports',
      reportArr: [
        {
          title: 'Weighbridge',
          subtitle: this.nl2br('<br>'),
          img: '../../assets/img/weighbridge.png',
          path: '/weighbridge-report-dashboard',
        },
        {
          title: 'Supply Chain &',
          subtitle: 'Traceability',
          img: '../../assets/img/tracability-icon.png',
          path: '/supply-chain-and-traceability-report',
        },
        {
          title: 'FFB Grading',
          subtitle: 'Reports',
          img: '../../assets/img/gradingreport.png',
          path: '/grader-report',
        },
      ],
    },
  ];

  labArrReport: any[] = [
    {
      report_name: '',
      reportArr: [
        {
          title: this.translate.instant('DEPARTMENTS.Laboratory'),
          subtitle: this.nl2br('<br>'),
          img: '../../assets/img/labdailyreport.png',
          path: '/laboratory',
        },
        {
          title: this.translate.instant('OILLOSSESSREPORT.ffa'),
          subtitle: 'Quality',
          img: '../../assets/img/ffa.png',
          path: '/daily-ffa-quality',
        },
        {
          title: this.translate.instant('OILLOSSESSREPORT.oillosses'),
          subtitle: this.translate.instant('OILLOSSESSREPORT.summary'),
          img: '../../assets/img/oil_loss.png',
          path: '/oil-losses-summary',
        },
        {
          title: 'CPO/PK',
          subtitle: 'Stock',
          img: '../../assets/img/oilreport-removebg-preview.png',
          path: '/cpo-pk-stock',
        },
      ],
    },
  ];

  supervisorArrReport: any[] = [
    {
      report_name: 'Production Reports',
      reportArr: [
        {
          title: this.translate.instant('PRODUCTIONHOME.sterilizationtitle'),
          subtitle: this.translate.instant('PRODUCTIONHOME.subtitlestation'),
          img: '../../assets/img/sterilizer_ report.png',
          path: '/sterilizer-report',
        },
        {
          title: this.translate.instant('PRODUCTIONHOME.pressingtitle'),
          subtitle: this.translate.instant('PRODUCTIONHOME.pressingsubtitle'),
          img: '../../assets/img/press_report.png',
          path: '/press-report',
        },
        {
          title: this.translate.instant('OILLOSSESSREPORT.oillosses'),
          subtitle: this.translate.instant('OILLOSSESSREPORT.summary'),
          img: '../../assets/img/oil_loss.png',
          path: '/oil-losses-summary',
        },
      ],
    },
    {
      report_name: 'Maintenance Reports',
      reportArr: [
        {
          title: this.translate.instant('PRODUCTIONHOME.correctivetitle'),
          subtitle: this.translate.instant('PRODUCTIONHOME.correctivesubtitle'),
          img: '../../assets/img/corrective_report.png',
          path: '/corrective-maintenance',
        },
        {
          title: this.translate.instant('PRODUCTIONHOME.preventivetitle'),
          subtitle: this.translate.instant('PRODUCTIONHOME.preventivesubtitle'),
          img: '../../assets/img/preventive_report.png',
          path: '/preventive-maintenance',
        },
        {
          title: 'Predictive',
          subtitle: 'Maintenance',
          img: '../../assets/img/predictivemaintenance.png',
          path: '/predictive-maintenance',
        },
        {
          title: 'Machineries',
          subtitle: 'Running Hours',
          img: '../../assets/img/cpooerreport.png',
          path: '/machineries-running-hours',
        },
        {
          title: 'Part',
          subtitle: 'Running Hours',
          img: '../../assets/img/machinerunninghours.png',
          path: '/part-running-hours',
        },
      ],
    },
    {
      report_name: 'Grading Reports',
      reportArr: [
        {
          title: 'Weighbridge',
          subtitle: this.nl2br('<br>'),
          img: '../../assets/img/weighbridge.png',
          path: '/weighbridge-report-dashboard',
        },
        {
          title: 'Supply Chain &',
          subtitle: 'Traceability',
          img: '../../assets/img/tracability-icon.png',
          path: '/supply-chain-and-traceability-report',
        },
        {
          title: 'FFB Grading',
          subtitle: 'Reports',
          img: '../../assets/img/gradingreport.png',
          path: '/grader-report',
        },
      ],
    },
  ];

  appTitle = this.nl2br(this.userContext.millName);
  headerActions: any;

  showLogo = 1;
  showBackButton = 0;
  showNewLoad = false;

  //Counts
  maintenanceCount: number = 0;
  maintenanceCountLength: number = 0;
  productionCount: number = 0;
  productionCountLength: number = 0;

  // Notification Counts
  count: number = 0;
  pendingcount: number = 0;
  pendingcountlength: number = 0;

  isFirstLoad: Boolean = true;

  reportArr: any[] = [];

  constructor(
    private translate: TranslateService,
    private userContext: UserContext,
    private router: Router,
    private languageService: LanguageService,
    private sterilizerService: SterilizerService,
  ) {
    this.checkLoadingReportArr();
  }

  ngOnInit(): void {
    this.initializeReports();
  }

  ionViewDidEnter() {
    this.fetchHeaderAction();
    console.log('headerActions ' + this.headerActions);

    if (this.isFirstLoad) {
      // this.isFirstLoad = false;
      this.getProductionPendingCount();
    }
    this.checkLoadingReportArr();
  }

  fetchHeaderAction() {
    if (
      this.userContext.designId == 9 ||
      this.userContext.designId == 2 ||
      this.userContext.designId == 3
    ) {
      this.headerActions = '2';
    } else {
      this.headerActions = '6,7';
    }
  }

  checkLoadingReportArr() {
    if (this.userContext.designId == 9) {
      this.reportArr = this.labArrReport;
    } else if (this.userContext.designId == 1) {
      this.reportArr = this.fmanagerArrReport;
    } else if (this.userContext.designId == 2) {
      this.reportArr = this.fmanagerArrReport;
    } else if (this.userContext.designId == 3) {
      this.reportArr = this.supervisorArrReport;
    }

    console.log('report length');
    console.log(this.reportArr.length);
  }

  /**
   * Initialize reports - can be used for additional setup
   */
  private initializeReports(): void {
    this.getProductionPendingCount();
  }

  /**
   * Navigate to report detail page
   */
  navigateToReport(report: any): void {
    if (report.path) {
      this.router.navigate([report.path]);
    }
  }

  /**
   * Get production pending count
   */
  getProductionPendingCount(): void {
    const req = {
      userid: this.userContext.userId,
      departmentid: this.userContext.departmentId,
      design_id: this.userContext.designId,
      millcode: this.userContext.millCode,
      language: this.languageService.getLanguage,
    };

    console.log(req);

    this.sterilizerService
      .getmaintenancependingcount(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          if (result.httpcode == 200) {
            this.maintenanceCount = result.maintenancecount || 0;
            this.maintenanceCountLength =
              this.maintenanceCount.toString().length;
            this.productionCount = result.productioncount || 0;
            this.productionCountLength = this.productionCount.toString().length;
            this.pendingcount = result.count;
            this.pendingcountlength = this.pendingcount.toString().length;
          } else {
            this.pendingcount = 0;
            this.pendingcountlength = this.pendingcount.toString().length;
          }
        },
        error: (err) => {
          console.error('Failed to get pending count:', err);
          this.pendingcount = 0;
          this.pendingcountlength = this.pendingcount.toString().length;
        },
      });
  }

  /**
   * Convert newlines to <br> tags
   */
  private nl2br(text: string): string {
    if (!text) return '';
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }

  /**
   * Track by function for ngFor optimization
   */
  trackByReportGroup(index: number, item: any): string {
    return item.report_name;
  }

  /**
   * Track by function for report items
   */
  trackByReport(index: number, item: any): string {
    return item.title + item.subtitle;
  }
}
