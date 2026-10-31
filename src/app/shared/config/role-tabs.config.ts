import { RoleTabConfig } from 'src/app/shared/models/role-tab-config.model';

export const ROLE_TAB_CONFIG: RoleTabConfig[] = [
  /**
   * GRADER
   * Department : 10
   * Designation : 10
   */
  {
    departmentId: 10,
    designationIds: [10],
    tabs: [
      {
        title: 'Home',
        translationKey: 'TABSGRADING.home',
        icon: 'home-outline',
        route: 'grader-home',
        visible: true,
      },
      {
        title: 'Reports',
        translationKey: 'TABSGRADING.reports',
        icon: 'newspaper-outline',
        route: 'grader-report',
        visible: true,
      },
      {
        title: 'Profile',
        translationKey: 'TABSGRADING.more',
        icon: 'person-outline',
        route: 'profile',
        visible: true,
      },
    ],
  },
  /**
   * MENGINEER
   * Department : 7
   * Designation : 2
   */
  {
    departmentId: 7,
    designationIds: [2],
    tabs: [
      {
        title: 'Dashboard',
        translationKey: 'TABSMAINTENANCE.dashboard',
        icon: 'grid-outline',
        route: 'maintenance-dashboard',
        visible: true,
      },
      {
        title: 'Ai',
        translationKey: 'TABSMAINTENANCE.ai',
        icon: 'hardware-chip-outline',
        route: 'maintenance-ai',
        visible: true,
      },
      {
        title: 'CM',
        translationKey: 'TABSMAINTENANCE.correctivemaintenance',
        icon: 'cog-outline',
        route: 'maintenance-cm',
        visible: true,
      },
      {
        title: 'PM',
        translationKey: 'TABSMAINTENANCE.preventivemaintenance',
        icon: 'build-outline',
        route: 'maintenance-pm',
        visible: true,
      },
      {
        title: 'Calendar',
        translationKey: 'TABSMAINTENANCE.calendar',
        icon: 'calendar-outline',
        route: 'maintenance-calendar',
        visible: true,
      },
      {
        title: 'Reports',
        translationKey: 'TABSSUPERVISOR.reports',
        icon: 'newspaper-outline',
        route: 'maintenance-reports',
        visible: true,
      },
    ],
  },

  /**
   * WEIGHBRIDGE
   * Department : 45
   * Designation : 15
   */
  {
    departmentId: 45,
    designationIds: [15],
    tabs: [
      {
        title: 'Home',
        translationKey: 'TABSGRADING.home',
        icon: 'home-outline',
        route: 'weighbridge-home',
        visible: true,
      },
      {
        title: 'Reports',
        translationKey: 'TABSGRADING.reports',
        icon: 'newspaper-outline',
        route: 'weighbridge-report',
        visible: true,
      },
      {
        title: 'Profile',
        translationKey: 'TABSGRADING.more',
        icon: 'person-outline',
        route: 'profile',
        visible: true,
      },
    ],
  },

  /**
   * STERILIZER
   * Department : 4
   * Designation : 8
   */
  {
    departmentId: 4,
    designationIds: [8],
    tabs: [
      {
        title: 'Dashboard',
        translationKey: 'TABSSUPERVISOR.dashboard',
        icon: 'grid-outline',
        route: 'sterilizer-dashboard',
        visible: true,
      },
      {
        title: 'Alert',
        translationKey: 'TABSSUPERVISOR.alert',
        icon: 'warning-outline',
        route: 'sterilizer-alert',
        visible: true,
      },
      {
        title: 'Reports',
        translationKey: 'TABSSUPERVISOR.reports',
        icon: 'newspaper-outline',
        route: 'sterilizer-report',
        visible: true,
      },
      {
        title: 'Profile',
        translationKey: 'TABSSUPERVISOR.more',
        icon: 'person-outline',
        route: 'profile',
        visible: true,
      },
    ],
  },

  /**
   * PRESS
   * Department : 4
   * Designation : 7
   */
  {
    departmentId: 4,
    designationIds: [7],
    tabs: [
      {
        title: 'Dashboard',
        translationKey: 'TABSSUPERVISOR.dashboard',
        icon: 'grid-outline',
        route: 'sterilizer-dashboard',
        visible: true,
      },
      {
        title: 'Alert',
        translationKey: 'TABSSUPERVISOR.alert',
        icon: 'warning-outline',
        route: 'sterilizer-alert',
        visible: true,
      },
      {
        title: 'Reports',
        translationKey: 'TABSSUPERVISOR.reports',
        icon: 'newspaper-outline',
        route: 'press-report',
        visible: true,
      },
      {
        title: 'Profile',
        translationKey: 'TABSSUPERVISOR.more',
        icon: 'person-outline',
        route: 'profile',
        visible: true,
      },
    ],
  },

  /**
   * FMANAGER
   * Department : 25
   * Designation : 1
   */
  {
    departmentId: 25,
    designationIds: [1],
    tabs: [
      {
        title: 'Dashboard',
        translationKey: 'TABSMAINTENANCE.dashboard',
        icon: 'grid-outline',
        route: 'maintenance-dashboard',
        visible: true,
      },
      {
        title: 'Oil-loss',
        translationKey: 'TABSOWNER.oilloss',
        icon: 'water-outline',
        route: 'management-oil-losses',
        visible: true,
      },
      {
        title: 'Production',
        translationKey: 'TABSOWNER.production',
        icon: 'settings-outline',
        route: 'management-production',
        visible: true,
      },
      {
        title: 'Maintenance',
        translationKey: 'TABSOWNER.maintenance',
        icon: 'construct-outline',
        route: 'management-maintenance',
        visible: true,
      },
      {
        title: 'Reports',
        translationKey: 'TABSOWNER.reports',
        icon: 'newspaper-outline',
        route: 'reports',
        visible: true,
      },
    ],
  },

  /**
   * LAB
   * Department : 2
   * Designation : 9
   */
  {
    departmentId: 2,
    designationIds: [9],
    tabs: [
      {
        title: 'Dashboard',
        translationKey: 'TABSMAINTENANCE.dashboard',
        icon: 'grid-outline',
        route: 'lab-dashboard',
        visible: true,
      },
      {
        title: 'CPO/PKO/PK',
        translationKey: 'CPO/PKO/PK',
        icon: 'beaker-outline',
        route: 'lab-cpo-pk-stock',
        visible: true,
      },
      {
        title: 'Oil Loss',
        translationKey: 'TABSSUPERVISOR.oilloss',
        icon: 'water-outline',
        route: 'management-oil-losses',
        visible: true,
      },
      {
        title: 'Reports',
        translationKey: 'TABSMAINTENANCE.reports',
        icon: 'newspaper-outline',
        route: 'reports',
        visible: true,
      },
      {
        title: 'Profile',
        translationKey: 'TABSSUPERVISOR.more',
        icon: 'person-outline',
        route: 'profile',
        visible: true,
      },
    ],
  },

  /**
   * SUPERVISOR
   * Department : 4
   * Designation : 3
   */
  {
    departmentId: 4,
    designationIds: [3],
    tabs: [
      {
        title: 'Dashboard',
        translationKey: 'TABSMAINTENANCE.dashboard',
        icon: 'grid-outline',
        route: 'maintenance-dashboard',
        visible: true,
      },

      {
        title: 'Process',
        translationKey: 'TABSSUPERVISOR.process',
        icon: 'layers-outline',
        route: 'production-process-status',
        visible: true,
      },

      {
        title: 'Alert',
        translationKey: 'TABSSUPERVISOR.alert',
        icon: 'warning-outline',
        route: 'sterilizer-alert',
        visible: true,
      },

      {
        title: 'Oil Loss',
        translationKey: 'TABSSUPERVISOR.oilloss',
        icon: 'water-outline',
        route: 'management-oil-losses',
        visible: true,
      },

      {
        title: 'Reports',
        translationKey: 'TABSSUPERVISOR.reports',
        icon: 'newspaper-outline',
        route: 'reports',
        visible: true,
      },
    ],
  },

  /**
   * MENGINEER
   * Department : 7
   * Designation : 2
   */
  {
    departmentId: 7,
    designationIds: [4, 6],
    tabs: [
      {
        title: 'Dashboard',
        translationKey: 'TABSMAINTENANCE.dashboard',
        icon: 'grid-outline',
        route: 'maintenance-dashboard',
        visible: true,
      },
      {
        title: 'Ai',
        translationKey: 'TABSMAINTENANCE.ai',
        icon: 'hardware-chip-outline',
        route: 'maintenance-ai',
        visible: true,
      },
      {
        title: 'CM',
        translationKey: 'TABSMAINTENANCE.correctivemaintenance',
        icon: 'cog-outline',
        route: 'maintenance-cm',
        visible: true,
      },
      {
        title: 'PM',
        translationKey: 'TABSMAINTENANCE.preventivemaintenance',
        icon: 'build-outline',
        route: 'maintenance-pm',
        visible: true,
      },
      {
        title: 'Calendar',
        translationKey: 'TABSMAINTENANCE.calendar',
        icon: 'calendar-outline',
        route: 'maintenance-calendar',
        visible: true,
      },
      {
        title: 'Profile',
        translationKey: 'TABSGRADING.more',
        icon: 'person-outline',
        route: 'profile',
        visible: true,
      },
    ],
  },
];
