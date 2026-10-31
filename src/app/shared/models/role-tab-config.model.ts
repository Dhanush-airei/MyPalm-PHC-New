import { AppTab } from './app-tab.model';

export interface RoleTabConfig {
  departmentId: number;
  designationIds: number[];
  tabs: AppTab[];
}
