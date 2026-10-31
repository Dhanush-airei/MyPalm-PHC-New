/* performance-analysis.page.ts */
import {
  Component,
  OnInit,
  DestroyRef,
  inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexMarkers,
} from 'ng-apexcharts';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ManagementService } from 'src/app/shared/services/management-service/management-service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  colors: any[];
  labels: any[];
  yaxis: ApexYAxis | ApexYAxis[];
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  markers: ApexMarkers;
};

@Component({
  selector: 'app-performance-analysis',
  templateUrl: './performance-analysis.page.html',
  styleUrls: ['./performance-analysis.page.scss'],
  standalone: false,
})
export class PerformanceAnalysisPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  @ViewChild('chart1') chart1!: ElementRef;
  @ViewChild('chart2') chart2!: ElementRef;

  // Header Configuration
  appTitle: string = 'Performance Analysis';
  showLogo: number = 0;
  showBackButton: number = 1;
  headerActions: string = '';

  // User Data
  userId: number = 0;
  millCode: string = '';
  departmentId: number = 0;
  designationId: number = 0;

  // Month Date
  reportDateDisplay: string = '';
  reportDateExternal: string = '';
  private reportDateForAPI: string = '';

  // Year Date
  yearReportDisplay: string = '';
  yearReportExternal: string = '';
  private yearReportForAPI: string = '';

  // Data Arrays - Chart 1
  dailyoillossArr: any[] = [];
  dailyoillossLabelArr: string[] = [];
  dailyoillossaverageArr: number[] = [];
  dailyoillossoer: number[] = [];
  dailyoillossbaseline: number[] = [];

  // Data Arrays - Chart 2
  monthlyoillossArr: any[] = [];
  monthlyoillossLabelArr: string[] = [];
  monthlyoillossaverageArr: number[] = [];
  monthlyoillossoer: number[] = [];

  // Flags
  noRecordsFlag: boolean = false;
  pleaseWaitFlag: boolean = false;

  // Chart Options
  public chart1Options: Partial<ChartOptions> = {};
  public chart2Options: Partial<ChartOptions> = {};

  oerminpercentage: number = 15;
  oermaxpercentage: number = 25;

  constructor(
    private translate: TranslateService,
    private userContext: UserContext,
    private languageService: LanguageService,
    private managementService: ManagementService,
  ) {
    // Initialize user data from UserContext
    this.userId = this.userContext.userId || 0;
    this.millCode = this.userContext.millCode || '';
    this.departmentId = this.userContext.departmentId || 0;
    this.designationId = this.userContext.designId || 0;

    // Initialize with current month for initial API call
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    this.reportDateForAPI = `${year}-${month}`;
    this.reportDateDisplay = `${month}-${year}`;

    // Initialize with current year for initial API call
    this.yearReportForAPI = String(year);
    this.yearReportDisplay = String(year);

    // Initialize chart options with default empty values
    this.initChartOptions();
  }

  ngOnInit(): void {}

  ionViewDidEnter(): void {
    this.getPressReport();
    this.getMonthWiseAverage();
  }

  /**
   * Initialize chart options with default values
   */
  private initChartOptions(): void {
    // ============================================================
    // CHART 1 OPTIONS - Daily Oil Losses
    // ============================================================
    this.chart1Options = {
      series: [],
      chart: {
        type: 'bar',
        height: 200,
        stacked: false,
        toolbar: {
          show: false,
        },
        // FIX: Use 'as any' to bypass TypeScript type checking for 'padding'
        // The 'padding' property is supported at runtime by ApexCharts
        padding: {
          top: 15,
          bottom: 10,
        },
      } as any, // Type assertion to bypass TypeScript error
      stroke: {
        width: [2, 5, 1],
        dashArray: [0, 0, 5],
      },
      plotOptions: {
        bar: {
          borderRadius: 1,
        },
      },
      dataLabels: {
        enabled: false,
      },
      yaxis: [
        {
          min: 0,
          max: 8,
          tickAmount: 5,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#ffffff',
          },
          labels: {
            style: {
              colors: '#ffffff',
            },
          },
          title: {
            text: 'Oil Losses in Press Machines(%)',
            style: {
              fontSize: '8px',
              color: '#ffffff',
            },
          },
        },
        {
          min: this.oerminpercentage,
          max: this.oermaxpercentage,
          tickAmount: 5,
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#ffffff',
          },
          labels: {
            style: {
              colors: '#ffffff',
            },
          },
          title: {
            text: 'OER(%)',
            style: {
              fontSize: '8px',
              color: '#ffffff',
            },
          },
        },
      ],
      xaxis: {
        categories: [],
        title: {
          text: 'Process Date',
          style: {
            fontSize: '8px',
            color: '#ffffff',
          },
        },
        labels: {
          rotate: -90,
          style: {
            colors: 'white',
            fontSize: '7px',
          },
        },
      },
      // ============================================================
      // FIX: Legend Configuration for Chart 1
      // This ensures "Average Oil Losses (%)" and "OER (%)" are in same line
      // "OER Baseline (%)" appears below them
      // ============================================================
      legend: {
        position: 'top',
        horizontalAlign: 'center',
        fontSize: '10px',
        fontWeight: 400,
        labels: {
          colors: '#FFFFFF',
        },
        itemMargin: {
          horizontal: 8,
          vertical: 4,
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
    };

    // ============================================================
    // CHART 2 OPTIONS - Monthly Oil Losses
    // ============================================================
    this.chart2Options = {
      series: [],
      chart: {
        type: 'bar',
        height: 200,
        stacked: false,
        toolbar: {
          show: false,
        },
        // FIX: Use 'as any' to bypass TypeScript type checking for 'padding'
        // The 'padding' property is supported at runtime by ApexCharts
        padding: {
          top: 15,
          bottom: 10,
        },
      } as any, // Type assertion to bypass TypeScript error
      stroke: {
        width: [2, 5],
      },
      plotOptions: {
        bar: {
          borderRadius: 1,
        },
      },
      dataLabels: {
        enabled: false,
      },
      yaxis: [
        {
          min: 0,
          max: 8,
          tickAmount: 5,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#ffffff',
          },
          labels: {
            style: {
              colors: '#ffffff',
            },
          },
          title: {
            text: 'Oil Losses(%)',
            style: {
              fontSize: '8px',
              color: '#ffffff',
            },
          },
        },
        {
          min: this.oerminpercentage,
          max: this.oermaxpercentage,
          tickAmount: 5,
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#ffffff',
          },
          labels: {
            style: {
              colors: '#ffffff',
            },
          },
          title: {
            text: 'OER(%)',
            style: {
              fontSize: '8px',
              color: '#ffffff',
            },
          },
        },
      ],
      xaxis: {
        categories: [],
        title: {
          text: 'Month',
          style: {
            fontSize: '8px',
            color: '#ffffff',
          },
        },
        labels: {
          rotate: -45,
          style: {
            colors: 'white',
            fontSize: '7px',
          },
        },
      },
      // ============================================================
      // FIX: Legend Configuration for Chart 2
      // ============================================================
      legend: {
        position: 'top',
        horizontalAlign: 'center',
        fontSize: '10px',
        fontWeight: 400,
        labels: {
          colors: '#FFFFFF',
        },
        itemMargin: {
          horizontal: 8,
          vertical: 4,
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
    };
  }

  /**
   * Handle month selected from month picker
   */
  onMonthSelected(event: { month: string }): void {
    console.log('Month selected:', event);
    this.reportDateForAPI = event.month;
    this.reportDateDisplay = this.formatMonthFromString(event.month);
    this.reportDateExternal = '';
    this.getPressReport();
  }

  /**
   * Handle year selected from year picker
   */
  onYearSelected(event: { year: string }): void {
    console.log('Year selected:', event);
    this.yearReportForAPI = event.year;
    this.yearReportDisplay = event.year;
    this.yearReportExternal = '';
    this.getMonthWiseAverage();
  }

  /**
   * Get Daily Lab Oil Loss Report - Chart 1
   */
  getPressReport(): void {
    const fromDate = this.reportDateForAPI || '';

    this.dailyoillossArr = [];
    this.dailyoillossLabelArr = [];
    this.dailyoillossaverageArr = [];
    this.dailyoillossoer = [];
    this.dailyoillossbaseline = [];
    this.noRecordsFlag = false;
    this.pleaseWaitFlag = true;

    const req = {
      millcode: this.millCode,
      Fromdate: fromDate,
      language: this.languageService.getLanguage,
    };

    console.log('getPressReport - fromdate:', fromDate);

    this.managementService
      .getDailylabOillossList(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleaseWaitFlag = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          console.log('Daily Lab Oil Loss Response:', response);

          if (response?.fromdate && !fromDate) {
            this.reportDateForAPI = response.fromdate;
            this.reportDateDisplay = this.formatMonthFromString(
              response.fromdate,
            );
            this.reportDateExternal = response.fromdate;
          }

          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.noRecordsFlag = false;
            this.dailyoillossArr = response.data || [];

            for (let i = 0; i < this.dailyoillossArr.length; i++) {
              this.dailyoillossLabelArr.push(this.dailyoillossArr[i].date);
              this.dailyoillossaverageArr.push(
                this.dailyoillossArr[i].labvalue,
              );
              this.dailyoillossoer.push(this.dailyoillossArr[i].oervalue);
              this.dailyoillossbaseline.push(response.oer_baseline);
            }

            this.updateMixedChart();
          } else {
            this.noRecordsFlag = true;
          }
        },
        error: (error) => {
          console.error('Error fetching daily lab oil loss:', error);
          this.noRecordsFlag = true;
        },
      });
  }

  /**
   * Get Monthly Lab Oil Loss Report - Chart 2
   */
  getMonthWiseAverage(): void {
    const year = this.yearReportForAPI || '';

    this.monthlyoillossArr = [];
    this.monthlyoillossLabelArr = [];
    this.monthlyoillossaverageArr = [];
    this.monthlyoillossoer = [];
    this.noRecordsFlag = false;
    this.pleaseWaitFlag = true;

    const req = {
      userid: this.userId,
      millcode: this.millCode,
      type: 1,
      year: year,
      language: this.languageService.getLanguage,
      pressid: '',
    };

    console.log('getMonthWiseAverage - year:', year);

    this.managementService
      .getMonthlylabOillossList(req)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.pleaseWaitFlag = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          console.log('Monthly Lab Oil Loss Response:', response);

          if (response?.year && !year) {
            this.yearReportForAPI = response.year;
            this.yearReportDisplay = response.year;
            this.yearReportExternal = response.year;
          }

          if (response?.httpcode == 200 || response?.httpcode == '200') {
            this.noRecordsFlag = false;
            this.monthlyoillossArr = response.data || [];

            for (let i = 0; i < this.monthlyoillossArr.length; i++) {
              this.monthlyoillossLabelArr.push(this.monthlyoillossArr[i].month);
              this.monthlyoillossaverageArr.push(
                this.monthlyoillossArr[i].oilloss,
              );
              this.monthlyoillossoer.push(this.monthlyoillossArr[i].oerdata);
            }

            this.updateMixedOilLossChart();
          } else {
            this.noRecordsFlag = true;
          }
        },
        error: (error) => {
          console.error('Error fetching monthly lab oil loss:', error);
          this.noRecordsFlag = true;
        },
      });
  }

  /**
   * Update Chart 1 - Mixed Chart (Bar + Line)
   *
   * ============================================================
   * SERIES ORDER DETERMINES LEGEND ORDER:
   * - "Average Oil Losses (%)" - First in legend (Bar)
   * - "OER (%)" - Second in legend (Line)
   * - "OER Baseline (%)" - Third in legend (Line)
   * ============================================================
   */
  updateMixedChart(): void {
    this.chart1Options = {
      ...this.chart1Options,
      series: [
        {
          name: 'Average Oil Losses (%)',
          data: this.dailyoillossaverageArr,
          color: '#3cd2a5',
          type: 'bar',
        },
        {
          name: 'OER (%)',
          data: this.dailyoillossoer,
          type: 'line',
          color: '#ffad33',
        },
        {
          name: 'OER Baseline (%)',
          data: this.dailyoillossbaseline,
          type: 'line',
          color: '#fff300',
        },
      ],
      xaxis: {
        ...this.chart1Options.xaxis,
        categories: this.dailyoillossLabelArr,
      },
    };
  }

  /**
   * Update Chart 2 - Mixed Chart (Bar + Line)
   */
  updateMixedOilLossChart(): void {
    this.chart2Options = {
      ...this.chart2Options,
      series: [
        {
          name: 'Average Oil Losses (%)',
          data: this.monthlyoillossaverageArr,
          color: '#3cd2a5',
          type: 'bar',
        },
        {
          name: 'OER (%)',
          data: this.monthlyoillossoer,
          type: 'line',
          color: '#ffad33',
        },
      ],
      xaxis: {
        ...this.chart2Options.xaxis,
        categories: this.monthlyoillossLabelArr,
      },
    };
  }

  /**
   * Format month from YYYY-MM to MM-YYYY
   */
  private formatMonthFromString(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 2) return dateStr;
    return `${parts[1]}-${parts[0]}`;
  }

  /**
   * Convert newlines to <br> tags
   */
  private nl2br(text: string): string {
    if (!text) return '';
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
