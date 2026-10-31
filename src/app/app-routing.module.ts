import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth/auth-guard';
import { LoginGuard } from './shared/guards/login/login-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/auth/login/login.module').then((m) => m.LoginPageModule),
    canActivate: [LoginGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/auth/profile/profile.module').then(
        (m) => m.ProfilePageModule,
      ),
  },
  {
    path: 'grader-dashboard',
    loadChildren: () =>
      import('./pages/production/grader/grader-dashboard/grader-dashboard.module').then(
        (m) => m.GraderDashboardPageModule,
      ),
  },
  {
    path: 'grader-report',
    loadChildren: () =>
      import('./pages/production/grader/grader-report/grader-report.module').then(
        (m) => m.GraderReportPageModule,
      ),
  },
  {
    path: 'change-password',
    loadChildren: () =>
      import('./pages/auth/change-password/change-password.module').then(
        (m) => m.ChangePasswordPageModule,
      ),
  },
  {
    path: 'logout',
    loadChildren: () =>
      import('./pages/auth/logout/logout.module').then(
        (m) => m.LogoutPageModule,
      ),
  },
  {
    path: 'delete-account',
    loadChildren: () =>
      import('./pages/auth/delete-account/delete-account.module').then(
        (m) => m.DeleteAccountPageModule,
      ),
  },
  {
    path: 'grader-vehicle-search',
    loadChildren: () =>
      import('./pages/production/grader/grader-vehicle-search/grader-vehicle-search.module').then(
        (m) => m.GraderVehicleSearchPageModule,
      ),
  },
  {
    path: 'grader-supplier-search',
    loadChildren: () =>
      import('./pages/production/grader/grader-supplier-search/grader-supplier-search.module').then(
        (m) => m.GraderSupplierSearchPageModule,
      ),
  },
  {
    path: 'maintenance-dashboard',
    loadChildren: () =>
      import('./pages/maintenance/maintenance-dashboard/maintenance-dashboard.module').then(
        (m) => m.MaintenanceDashboardPageModule,
      ),
  },
  {
    path: 'weighbridge-home',
    loadChildren: () =>
      import('./pages/production/weighbridge/weighbridge-home/weighbridge-home.module').then(
        (m) => m.WeighbridgeHomePageModule,
      ),
  },
  {
    path: 'weighbridge-report',
    loadChildren: () =>
      import('./pages/production/weighbridge/weighbridge-report/weighbridge-report.module').then(
        (m) => m.WeighbridgeReportPageModule,
      ),
  },
  {
    path: 'weighbridge-update',
    loadChildren: () =>
      import('./pages/production/weighbridge/weighbridge-update/weighbridge-update.module').then(
        (m) => m.WeighbridgeUpdatePageModule,
      ),
  },
  {
    path: 'weighbridge-update-report',
    loadChildren: () =>
      import('./pages/production/weighbridge/weighbridge-update-report/weighbridge-update-report.module').then(
        (m) => m.WeighbridgeUpdateReportPageModule,
      ),
  },
  {
    path: 'sterilizer-dashboard',
    loadChildren: () =>
      import('./pages/production/sterilizer/sterilizer-dashboard/sterilizer-dashboard.module').then(
        (m) => m.SterilizerDashboardPageModule,
      ),
  },
  {
    path: 'sterilizer-report',
    loadChildren: () =>
      import('./pages/production/sterilizer/sterilizer-report/sterilizer-report.module').then(
        (m) => m.SterilizerReportPageModule,
      ),
  },
  {
    path: 'sterilizer-alert',
    loadChildren: () =>
      import('./pages/production/sterilizer/sterilizer-alert/sterilizer-alert.module').then(
        (m) => m.SterilizerAlertPageModule,
      ),
  },
  {
    path: 'dooropenlater-update-modal',
    loadChildren: () =>
      import('./pages/production/sterilizer/dooropenlater-update-modal/dooropenlater-update-modal.module').then(
        (m) => m.DooropenlaterUpdateModalPageModule,
      ),
  },
  {
    path: 'production-hourly-sterilizer-station',
    loadChildren: () =>
      import('./pages/production/sterilizer/production-hourly-sterilizer-station/production-hourly-sterilizer-station.module').then(
        (m) => m.ProductionHourlySterilizerStationPageModule,
      ),
  },
  {
    path: 'alert-acknowledge',
    loadChildren: () =>
      import('./pages/production/sterilizer/alert-acknowledge/alert-acknowledge.module').then(
        (m) => m.AlertAcknowledgePageModule,
      ),
  },
  {
    path: 'press-dashboard',
    loadChildren: () =>
      import('./pages/production/press/press-dashboard/press-dashboard.module').then(
        (m) => m.PressDashboardPageModule,
      ),
  },
  {
    path: 'press-alert',
    loadChildren: () =>
      import('./pages/production/press/press-alert/press-alert.module').then(
        (m) => m.PressAlertPageModule,
      ),
  },
  {
    path: 'press-report',
    loadChildren: () =>
      import('./pages/production/press/press-report/press-report.module').then(
        (m) => m.PressReportPageModule,
      ),
  },
  {
    path: 'production-hourly-press-station',
    loadChildren: () =>
      import('./pages/production/press/production-hourly-press-station/production-hourly-press-station.module').then(
        (m) => m.ProductionHourlyPressStationPageModule,
      ),
  },
  {
    path: 'production-hourly-pressing-station-update',
    loadChildren: () =>
      import('./pages/production/press/production-hourly-pressing-station-update/production-hourly-pressing-station-update.page').then(
        (m) => m.ProductionHourlyPressingStationUpdatePage,
      ),
  },
  {
    path: 'production-hourly-press-station-save',
    loadChildren: () =>
      import('./pages/production/press/production-hourly-press-station-save/production-hourly-press-station-save.module').then(
        (m) => m.ProductionHourlyPressStationSavePageModule,
      ),
  },
  {
    path: 'notification-view',
    loadChildren: () =>
      import('./pages/notification/notification-view/notification-view.module').then(
        (m) => m.NotificationViewPageModule,
      ),
  },
  {
    path: 'notification-alert',
    loadChildren: () =>
      import('./pages/notification/notification-alert/notification-alert.module').then(
        (m) => m.NotificationAlertPageModule,
      ),
  },
  {
    path: 'notification-reminder',
    loadChildren: () =>
      import('./pages/notification/notification-reminder/notification-reminder.module').then(
        (m) => m.NotificationReminderPageModule,
      ),
  },
  //FMANAGER
  {
    path: 'management-oil-losses',
    loadChildren: () =>
      import('./pages/management/fmanager/management-oil-losses/management-oil-losses.module').then(
        (m) => m.ManagementOilLossesPageModule,
      ),
  },
  {
    path: 'management-production',
    loadChildren: () =>
      import('./pages/management/fmanager/management-production/management-production.module').then(
        (m) => m.ManagementProductionPageModule,
      ),
  },
  {
    path: 'management-maintenance',
    loadChildren: () =>
      import('./pages/management/fmanager/management-maintenance/management-maintenance.module').then(
        (m) => m.ManagementMaintenancePageModule,
      ),
  },
  {
    path: 'management-report',
    loadChildren: () =>
      import('./pages/management/fmanager/management-report/management-report.module').then(
        (m) => m.ManagementReportPageModule,
      ),
  },
  {
    path: 'oil-loss-recommendation-modal',
    loadChildren: () =>
      import('./pages/management/fmanager/oil-loss-recommendation-modal/oil-loss-recommendation-modal.module').then(
        (m) => m.OilLossRecommendationModalPageModule,
      ),
  },
  {
    path: 'oil-losses-new',
    loadChildren: () =>
      import('./pages/management/fmanager/oil-losses-new/oil-losses-new.module').then(
        (m) => m.OilLossesNewPageModule,
      ),
  },
  {
    path: 'management-production-summary',
    loadChildren: () =>
      import('./pages/management/fmanager/management-production-summary/management-production-summary.module').then(
        (m) => m.ManagementProductionSummaryPageModule,
      ),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./pages/reports/reports.module').then((m) => m.ReportsPageModule),
  },
  {
    path: 'oil-losses-summary',
    loadChildren: () =>
      import('./pages/production/reports/oil-losses-summary/oil-losses-summary.module').then(
        (m) => m.OilLossesSummaryPageModule,
      ),
  },
  {
    path: 'performance-analysis',
    loadChildren: () =>
      import('./pages/production/reports/performance-analysis/performance-analysis.module').then(
        (m) => m.PerformanceAnalysisPageModule,
      ),
  },
  {
    path: 'corrective-maintenance',
    loadChildren: () =>
      import('./pages/maintenance/reports/corrective-maintenance/corrective-maintenance.module').then(
        (m) => m.CorrectiveMaintenancePageModule,
      ),
  },
  {
    path: 'popup-notification-view',
    loadChildren: () =>
      import('./pages/maintenance/reports/popup-notification-view/popup-notification-view.module').then(
        (m) => m.PopupNotificationViewPageModule,
      ),
  },
  {
    path: 'preventive-maintenance',
    loadChildren: () =>
      import('./pages/maintenance/reports/preventive-maintenance/preventive-maintenance.module').then(
        (m) => m.PreventiveMaintenancePageModule,
      ),
  },
  {
    path: 'predictive-maintenance',
    loadChildren: () =>
      import('./pages/maintenance/reports/predictive-maintenance/predictive-maintenance.module').then(
        (m) => m.PredictiveMaintenancePageModule,
      ),
  },
  {
    path: 'predictive-maintenance-rejected-records',
    loadChildren: () =>
      import('./pages/maintenance/reports/predictive-maintenance-rejected-records/predictive-maintenance-rejected-records.module').then(
        (m) => m.PredictiveMaintenanceRejectedRecordsPageModule,
      ),
  },
  {
    path: 'machineries-running-hours',
    loadChildren: () =>
      import('./pages/maintenance/reports/machineries-running-hours/machineries-running-hours.module').then(
        (m) => m.MachineriesRunningHoursPageModule,
      ),
  },
  {
    path: 'part-running-hours',
    loadChildren: () =>
      import('./pages/maintenance/reports/part-running-hours/part-running-hours.module').then(
        (m) => m.PartRunningHoursPageModule,
      ),
  },
  {
    path: 'laboratory',
    loadChildren: () =>
      import('./pages/production/reports/laboratory/laboratory.module').then(
        (m) => m.LaboratoryPageModule,
      ),
  },
  {
    path: 'daily-ffa-quality',
    loadChildren: () =>
      import('./pages/production/reports/daily-ffa-quality/daily-ffa-quality.module').then(
        (m) => m.DailyFfaQualityPageModule,
      ),
  },
  {
    path: 'cpo-pk-stock',
    loadChildren: () =>
      import('./pages/production/reports/cpo-pk-stock/cpo-pk-stock.module').then(
        (m) => m.CpoPkStockPageModule,
      ),
  },
  {
    path: 'weighbridge-report-dashboard',
    loadChildren: () =>
      import('./pages/production/reports/weighbridge-report-dashboard/weighbridge-report-dashboard.module').then(
        (m) => m.WeighbridgeReportDashboardPageModule,
      ),
  },
  {
    path: 'supply-chain-and-traceability-report',
    loadChildren: () =>
      import('./pages/production/reports/supply-chain-and-traceability-report/supply-chain-and-traceability-report.module').then(
        (m) => m.SupplyChainAndTraceabilityReportPageModule,
      ),
  },
  {
    path: 'supplier-supply-chain-traceability-report',
    loadChildren: () =>
      import('./pages/production/reports/supplier-supply-chain-traceability-report/supplier-supply-chain-traceability-report.module').then(
        (m) => m.SupplierSupplyChainTraceabilityReportPageModule,
      ),
  },
  {
    path: 'supplier-map-screen',
    loadChildren: () =>
      import('./pages/production/reports/supplier-map-screen/supplier-map-screen.module').then(
        (m) => m.SupplierMapScreenPageModule,
      ),
  },

  //LAB
  {
    path: 'lab-dashboard',
    loadChildren: () =>
      import('./pages/production/lab/lab-dashboard/lab-dashboard.module').then(
        (m) => m.LabDashboardPageModule,
      ),
  },
  {
    path: 'lab-cpo-pk-stock',
    loadChildren: () =>
      import('./pages/production/lab/lab-cpo-pk-stock/lab-cpo-pk-stock.module').then(
        (m) => m.LabCpoPkStockPageModule,
      ),
  },
  {
    path: 'production-ffb-cage-mill-stop',
    loadChildren: () =>
      import('./pages/production/supervisor/production-ffb-cage-mill-stop/production-ffb-cage-mill-stop.module').then(
        (m) => m.ProductionFfbCageMillStopPageModule,
      ),
  },
  {
    path: 'production-ffb-cage-mill-start',
    loadChildren: () =>
      import('./pages/production/supervisor/production-ffb-cage-mill-start/production-ffb-cage-mill-start.module').then(
        (m) => m.ProductionFfbCageMillStartPageModule,
      ),
  },
  {
    path: 'production-breakdown',
    loadChildren: () =>
      import('./pages/production/supervisor/production-breakdown/production-breakdown.module').then(
        (m) => m.ProductionBreakdownPageModule,
      ),
  },
  {
    path: 'production-machine-shutdown-alert-modal',
    loadChildren: () =>
      import('./pages/production/supervisor/production-machine-shutdown-alert-modal/production-machine-shutdown-alert-modal.module').then(
        (m) => m.ProductionMachineShutdownAlertModalPageModule,
      ),
  },
  {
    path: 'maintenance-material-search-page',
    loadChildren: () =>
      import('./pages/maintenance/modal/maintenance-material-search/maintenance-material-search-page.module').then(
        (m) => m.MaintenanceMaterialSearchPagePageModule,
      ),
  },
  {
    path: 'production-ffb-cage',
    loadChildren: () =>
      import('./pages/production/supervisor/production-ffb-cage/production-ffb-cage.module').then(
        (m) => m.ProductionFfbCagePageModule,
      ),
  },
  {
    path: 'maintenance-engineer-notification-modal',
    loadChildren: () =>
      import('./pages/maintenance/modal/maintenance-engineer-notification-modal/maintenance-engineer-notification-modal.module').then(
        (m) => m.MaintenanceEngineerNotificationModalPageModule,
      ),
  },
  {
    path: 'summary-popup-modal',
    loadChildren: () =>
      import('./pages/maintenance/modal/summary-popup-modal/summary-popup-modal.module').then(
        (m) => m.SummaryPopupModalPageModule,
      ),
  },
  {
    path: 'maintenance-ai',
    loadChildren: () =>
      import('./pages/maintenance/maintenance-ai/maintenance-ai.module').then(
        (m) => m.MaintenanceAiPageModule,
      ),
  },
  {
    path: 'maintenance-cm',
    loadChildren: () =>
      import('./pages/maintenance/maintenance-cm/maintenance-cm.module').then(
        (m) => m.MaintenanceCmPageModule,
      ),
  },
  {
    path: 'maintenance-pm',
    loadChildren: () =>
      import('./pages/maintenance/maintenance-pm/maintenance-pm.module').then(
        (m) => m.MaintenancePmPageModule,
      ),
  },
  {
    path: 'maintenance-calendar',
    loadChildren: () =>
      import('./pages/maintenance/maintenance-calendar/maintenance-calendar.module').then(
        (m) => m.MaintenanceCalendarPageModule,
      ),
  },
  /**
   * Redirects unmatched URLs based on authentication state.
   * Keep this wildcard route as the last route.
   */

  {
    path: 'maintenance-ai-assign',
    loadChildren: () =>
      import('./pages/maintenance/maintenance-ai-assign/maintenance-ai-assign.module').then(
        (m) => m.MaintenanceAiAssignPageModule,
      ),
  },
  {
    path: 'maintenance-ai-close',
    loadChildren: () =>
      import('./pages/maintenance/maintenance-ai-close/maintenance-ai-close.module').then(
        (m) => m.MaintenanceAiClosePageModule,
      ),
  },
  {
    path: 'maintenance-ai-acknowledge',
    loadChildren: () =>
      import('./pages/maintenance/maintenance-ai-acknowledge/maintenance-ai-acknowledge.module').then(
        (m) => m.MaintenanceAiAcknowledgePageModule,
      ),
  },
  {
    path: 'maintenance-ai-view',
    loadChildren: () =>
      import('./pages/maintenance/maintenance-ai-view/maintenance-ai-view.module').then(
        (m) => m.MaintenanceAiViewPageModule,
      ),
  },
  {
    path: 'maintenance-ai-accept-single-part',
    loadChildren: () =>
      import('./pages/maintenance/maintenance-ai-accept-single-part/maintenance-ai-accept-single-part.module').then(
        (m) => m.MaintenanceAiAcceptSinglePartPageModule,
      ),
  },
  {
    path: 'maintenance-ai-accept-multi-part',
    loadChildren: () =>
      import('./pages/maintenance/maintenance-ai-accept-multi-part/maintenance-ai-accept-multi-part.module').then(
        (m) => m.MaintenanceAiAcceptMultiPartPageModule,
      ),
  },
  {
    path: 'maintenance-ai-reject',
    loadChildren: () =>
      import('./pages/maintenance/maintenance-ai-reject/maintenance-ai-reject.module').then(
        (m) => m.MaintenanceAiRejectPageModule,
      ),
  },
  {
    path: 'maintenance-assign',
    loadChildren: () =>
      import('./pages/maintenance/maintenance-assign/maintenance-assign.module').then(
        (m) => m.MaintenanceAssignPageModule,
      ),
  },
  {
    path: 'maintenance-notification-view',
    loadChildren: () =>
      import('./pages/maintenance/maintenance-notification-view/maintenance-notification-view.module').then(
        (m) => m.MaintenanceNotificationViewPageModule,
      ),
  },
  {
    path: 'maintenance-upload-image-popup',
    loadChildren: () =>
      import('./pages/maintenance/maintenance-upload-image-popup/maintenance-upload-image-popup.module').then(
        (m) => m.MaintenanceUploadImagePopupPageModule,
      ),
  },
  {
    path: 'maintenance-cm-accept-multi-part',
    loadChildren: () =>
      import('./pages/maintenance/maintenance-cm-accept-multi-part/maintenance-cm-accept-multi-part.module').then(
        (m) => m.MaintenanceCmAcceptMultiPartPageModule,
      ),
  },
  {
    path: 'maintenance-cm-accept-single-part',
    loadChildren: () =>
      import('./pages/maintenance/maintenance-cm-accept-single-part/maintenance-cm-accept-single-part.module').then(
        (m) => m.MaintenanceCmAcceptSinglePartPageModule,
      ),
  },
  {
    path: 'maintenance-activity-search',
    loadChildren: () =>
      import('./pages/maintenance/maintenance-activity-search/maintenance-activity-search.module').then(
        (m) => m.MaintenanceActivitySearchPageModule,
      ),
  },
  {
    path: 'replacement-extented-running-hours-update',
    loadChildren: () =>
      import('./pages/maintenance/modal/replacement-extented-running-hours-update/replacement-extented-running-hours-update.module').then(
        (m) => m.ReplacementExtentedRunningHoursUpdatePageModule,
      ),
  },
  {
    path: 'maintenance-ropm-multi-part-save',
    loadChildren: () =>
      import('./pages/maintenance/maintenance-ropm-multi-part-save/maintenance-ropm-multi-part-save.module').then(
        (m) => m.MaintenanceRopmMultiPartSavePageModule,
      ),
  },
  {
    path: 'maintenance-ropm-task-multi-part-save',
    loadChildren: () =>
      import('./pages/maintenance/maintenance-ropm-task-multi-part-save/maintenance-ropm-task-multi-part-save.module').then(
        (m) => m.MaintenanceRopmTaskMultiPartSavePageModule,
      ),
  },
  {
    path: 'maintenance-repm-multi-part-save',
    loadChildren: () =>
      import('./pages/maintenance/maintenance-repm-multi-part-save/maintenance-repm-multi-part-save.module').then(
        (m) => m.MaintenanceRepmMultiPartSavePageModule,
      ),
  },
  {
    path: 'maintenance-preventive-maintenance-task-assign',
    loadChildren: () =>
      import('./pages/maintenance/maintenance-preventive-maintenance-task-assign/maintenance-preventive-maintenance-task-assign.module').then(
        (m) => m.MaintenancePreventiveMaintenanceTaskAssignPageModule,
      ),
  },
  {
    path: 'maintenance-preventive-maintenance-assign',
    loadChildren: () =>
      import('./pages/maintenance/maintenance-preventive-maintenance-assign/maintenance-preventive-maintenance-assign.module').then(
        (m) => m.MaintenancePreventiveMaintenanceAssignPageModule,
      ),
  },
  {
    path: 'maintenance-update-task-list',
    loadChildren: () =>
      import('./pages/maintenance/maintenance-update-task-list/maintenance-update-task-list.module').then(
        (m) => m.MaintenanceUpdateTaskListPageModule,
      ),
  },
  {
    path: 'production-process-status',
    loadChildren: () =>
      import('./pages/production/supervisor/production-process-status/production-process-status.module').then(
        (m) => m.ProductionProcessStatusPageModule,
      ),
  },
  {
    path: 'production-process-status-edit',
    loadChildren: () =>
      import('./pages/production/supervisor/production-process-status-edit/production-process-status-edit.module').then(
        (m) => m.ProductionProcessStatusEditPageModule,
      ),
  },
  {
    path: 'qrcodescanner',
    loadChildren: () =>
      import('./pages/scanner/qrcodescanner/qrcodescanner.module').then(
        (m) => m.QrcodescannerPageModule,
      ),
  },
  {
    path: 'notification-list-modal',
    loadChildren: () =>
      import('./pages/scanner/notification-list-modal/notification-list-modal.module').then(
        (m) => m.NotificationListModalPageModule, // ✅ Module class, not Page
      ),
  },
  {
    path: 'notification-form-history-modal',
    loadChildren: () =>
      import('./pages/scanner/notification-form-history-modal/notification-form-history-modal.module').then(
        (m) => m.NotificationFormHistoryModalPageModule, // ✅ Module class
      ),
  },
  {
    path: 'notification-timeline-modal',
    loadChildren: () =>
      import('./pages/scanner/notification-timeline-modal/notification-timeline-modal.module').then(
        (m) => m.NotificationTimelineModalPageModule, // ✅ Module class
      ),
  },
  /**
   * Redirects unmatched URLs based on authentication state.
   * Keep this wildcard route as the last route.
   */
  {
    path: '**',
    redirectTo: () => {
      const user = localStorage.getItem('userlist');

      return user ? '/tabs' : '/login';
    },
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
