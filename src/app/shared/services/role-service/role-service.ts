import { Injectable } from '@angular/core';

export interface UserDetails {
  dept_id: number;
  desigId: number;
  name?: string;
  // ...other fields from response.data
}

export type UserRole =
  | 'grader'
  | 'mengineer'
  | 'weighbridge'
  | 'sterilizer'
  | 'press'
  | 'fmanager'
  | 'lab'
  | 'supervisor'
  | 'foreman'
  | 'chargeman'
  | 'unknown';

@Injectable({ providedIn: 'root' })
export class RoleService {
  /** Reads 'userlist' from localStorage and parses it. Null if not present. */
  getUser(): UserDetails | null {
    const raw = localStorage.getItem('userlist');
    return raw ? JSON.parse(raw) : null;
  }

  /** Maps department/designation IDs to an app role. */
  determineRole(user: UserDetails | null): UserRole {
    if (!user) {
      return 'unknown';
    }

    if (user.dept_id === 10 && user.desigId === 10) {
      return 'grader';
    } else if (user.dept_id === 7 && user.desigId === 2) {
      return 'mengineer';
    } else if (user.dept_id === 4 && user.desigId === 3) {
      return 'supervisor';
    } else if (user.dept_id === 7 && user.desigId === 4) {
      return 'foreman';
    } else if (user.dept_id === 7 && user.desigId === 6) {
      return 'chargeman';
    } else if (user.dept_id === 45 && user.desigId === 15) {
      return 'weighbridge';
    } else if (user.dept_id === 4 && user.desigId === 8) {
      return 'sterilizer';
    } else if (user.dept_id === 4 && user.desigId === 7) {
      return 'press';
    } else if (user.dept_id === 25 && user.desigId === 1) {
      return 'fmanager';
    } else if (user.dept_id === 2 && user.desigId === 9) {
      return 'lab';
    }

    return 'unknown';
  }

  /** Convenience: role -> home route path, e.g. 'grader' -> '/tabs/grader-home'. */
  getHomeRouteForRole(role: UserRole): string {
    // switch (role) {
    //   case 'grader':
    //     return '/tabs/grader-home';
    //   case 'mengineer':
    //     return '/tabs/maintenance-dashboard';
    //   case 'weighbridge':
    //     return '/tabs/weighbridge-home';
    //   case 'sterilizer':
    //     return '/tabs/sterilizer-dashboard';
    //   case 'press':
    //     return '/tabs/sterilizer-dashboard';
    //   case 'fmanager':
    //     return '/tabs/management-oil-losses';
    //   case 'lab':
    //     return '/tabs/lab-dashboard';
    //   default:
    //     return '/login';
    // }

    if (role != 'unknown') {
      return '/tabs';
    } else {
      return '/login';
    }
  }

  /**
   * Get logged-in user's home route
   */
  getCurrentHomeRoute(): string {
    const user = this.getUser();

    if (!user) {
      return '/login';
    }

    const role = this.determineRole(user);

    return this.getHomeRouteForRole(role);
  }
}
