import { Injectable } from '@angular/core';
import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { ROLE_TAB_CONFIG } from 'src/app/shared/config/role-tabs.config';
import { AppTab } from 'src/app/shared/models/app-tab.model';

@Injectable({
  providedIn: 'root',
})
export class RoleTabsService {
  constructor(private userContext: UserContext) {}

  getTabs(): AppTab[] {
    const departmentId = this.userContext.departmentId;
    const designationId = this.userContext.designId;

    const role = ROLE_TAB_CONFIG.find(
      (config) =>
        config.departmentId === departmentId &&
        config.designationIds.includes(designationId),
    );

    return role?.tabs ?? [];
  }
}
