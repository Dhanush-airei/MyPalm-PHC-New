import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { API_ENDPOINTS } from 'src/app/shared/constants/api-endpoints';
import { HttpUtils } from 'src/app/shared/utils/http-utlis';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  private http = inject(HttpClient);

  getMaintenanceNotificationView(
    payload: Record<string, unknown>,
  ): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.getmaintenancenotificationview}`;
    const params = HttpUtils.toHttpParams(payload);

    return this.http.get<any>(url, { params });
  }
}
