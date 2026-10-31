import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { RoleTabsService } from '../shared/services/role-tabs-service/role-tabs-service';

let newRoutes: any;
const userlistRaw: string | null = localStorage.getItem('userlist');
let userlist: any = userlistRaw ? JSON.parse(userlistRaw) : null;

const routes_unknown: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      // Grader Routes
      {
        path: 'grader-home',
        loadChildren: () =>
          import('../pages/production/grader/grader-dashboard/grader-dashboard.module').then(
            (m) => m.GraderDashboardPageModule,
          ),
      },
      {
        path: 'grader-report',
        loadChildren: () =>
          import('../pages/production/grader/grader-report/grader-report.module').then(
            (m) => m.GraderReportPageModule,
          ),
      },

      // mengineer
      {
        path: 'maintenance-dashboard',
        loadChildren: () =>
          import('../pages/maintenance/maintenance-dashboard/maintenance-dashboard.module').then(
            (m) => m.MaintenanceDashboardPageModule,
          ),
      },
      {
        path: 'maintenance-ai',
        loadChildren: () =>
          import('../pages/maintenance/maintenance-ai/maintenance-ai.module').then(
            (m) => m.MaintenanceAiPageModule,
          ),
      },
      {
        path: 'maintenance-cm',
        loadChildren: () =>
          import('../pages/maintenance/maintenance-cm/maintenance-cm.module').then(
            (m) => m.MaintenanceCmPageModule,
          ),
      },
      {
        path: 'maintenance-pm',
        loadChildren: () =>
          import('../pages/maintenance/maintenance-pm/maintenance-pm.module').then(
            (m) => m.MaintenancePmPageModule,
          ),
      },
      {
        path: 'maintenance-calendar',
        loadChildren: () =>
          import('../pages/maintenance/maintenance-calendar/maintenance-calendar.module').then(
            (m) => m.MaintenanceCalendarPageModule,
          ),
      },

      // profile route
      {
        path: 'profile',
        loadChildren: () =>
          import('../pages/auth/profile/profile.module').then(
            (m) => m.ProfilePageModule,
          ),
      },

      //Weighbridge
      {
        path: 'weighbridge-home',
        loadChildren: () =>
          import('../pages/production/weighbridge/weighbridge-home/weighbridge-home.module').then(
            (m) => m.WeighbridgeHomePageModule,
          ),
      },

      {
        path: 'weighbridge-report',
        loadChildren: () =>
          import('../pages/production/weighbridge/weighbridge-report/weighbridge-report.module').then(
            (m) => m.WeighbridgeReportPageModule,
          ),
      },

      {
        path: 'weighbridge-update',
        loadChildren: () =>
          import('../pages/production/weighbridge/weighbridge-update/weighbridge-update.module').then(
            (m) => m.WeighbridgeUpdatePageModule,
          ),
      },

      {
        path: 'weighbridge-update-report',
        loadChildren: () =>
          import('../pages/production/weighbridge/weighbridge-update-report/weighbridge-update-report.module').then(
            (m) => m.WeighbridgeUpdateReportPageModule,
          ),
      },

      //Sterilizer
      {
        path: 'sterilizer-dashboard',
        loadChildren: () =>
          import('../pages/production/sterilizer/sterilizer-dashboard/sterilizer-dashboard.module').then(
            (m) => m.SterilizerDashboardPageModule,
          ),
      },
      {
        path: 'sterilizer-report',
        loadChildren: () =>
          import('../pages/production/sterilizer/sterilizer-report/sterilizer-report.module').then(
            (m) => m.SterilizerReportPageModule,
          ),
      },
      {
        path: 'sterilizer-alert',
        loadChildren: () =>
          import('../pages/production/sterilizer/sterilizer-alert/sterilizer-alert.module').then(
            (m) => m.SterilizerAlertPageModule,
          ),
      },

      //Press
      {
        path: 'press-dashboard',
        loadChildren: () =>
          import('../pages/production/press/press-dashboard/press-dashboard.module').then(
            (m) => m.PressDashboardPageModule,
          ),
      },
      {
        path: 'press-alert',
        loadChildren: () =>
          import('../pages/production/press/press-alert/press-alert.module').then(
            (m) => m.PressAlertPageModule,
          ),
      },
      {
        path: 'press-report',
        loadChildren: () =>
          import('../pages/production/press/press-report/press-report.module').then(
            (m) => m.PressReportPageModule,
          ),
      },

      //FManager
      {
        path: 'management-oil-losses',
        loadChildren: () =>
          import('../pages/management/fmanager/management-oil-losses/management-oil-losses.module').then(
            (m) => m.ManagementOilLossesPageModule,
          ),
      },
      {
        path: 'management-production',
        loadChildren: () =>
          import('../pages/management/fmanager/management-production/management-production.module').then(
            (m) => m.ManagementProductionPageModule,
          ),
      },
      {
        path: 'management-maintenance',
        loadChildren: () =>
          import('../pages/management/fmanager/management-maintenance/management-maintenance.module').then(
            (m) => m.ManagementMaintenancePageModule,
          ),
      },
      {
        path: 'management-report',
        loadChildren: () =>
          import('../pages/management/fmanager/management-report/management-report.module').then(
            (m) => m.ManagementReportPageModule,
          ),
      },
      {
        path: 'maintenance-reports',
        loadChildren: () =>
          import('../pages/reports/reports.module').then(
            (m) => m.ReportsPageModule,
          ),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('../pages/reports/reports.module').then(
            (m) => m.ReportsPageModule,
          ),
      },

      //Lab
      {
        path: 'lab-dashboard',
        loadChildren: () =>
          import('../pages/production/lab/lab-dashboard/lab-dashboard.module').then(
            (m) => m.LabDashboardPageModule,
          ),
      },
      {
        path: 'lab-cpo-pk-stock',
        loadChildren: () =>
          import('../pages/production/lab/lab-cpo-pk-stock/lab-cpo-pk-stock.module').then(
            (m) => m.LabCpoPkStockPageModule,
          ),
      },
      {
        path: 'production-process-status',
        loadChildren: () =>
          import('../pages/production/supervisor/production-process-status/production-process-status.module').then(
            (m) => m.ProductionProcessStatusPageModule,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: () => {
          const roleTabsService = inject(RoleTabsService);

          const firstVisibleTab = roleTabsService
            .getTabs()
            .find((tab) => tab.visible);

          return firstVisibleTab?.route ?? 'profile';
        },
      },
    ],
  },
];

console.log('Userlist:', userlist);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
