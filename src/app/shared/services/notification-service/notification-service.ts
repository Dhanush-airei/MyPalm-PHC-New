import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { API_ENDPOINTS } from 'src/app/shared/constants/api-endpoints';
import { HttpUtils } from 'src/app/shared/utils/http-utlis';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private http = inject(HttpClient);

  constructor(
    private router: Router,
    private navCtrl: NavController,
  ) {}

  getalertnotification(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.alertnotification}`;

    // Build query parameters
    let httpParams = new HttpParams();
    httpParams = httpParams.set('millcode', String(payload['millcode'] || ''));
    httpParams = httpParams.set('userid', String(payload['userid'] || ''));
    httpParams = httpParams.set(
      'departmentid',
      String(payload['departmentid'] || ''),
    );
    httpParams = httpParams.set('filter', String(payload['filter'] || ''));
    httpParams = httpParams.set(
      'language',
      String(payload['language'] || 'English'),
    );

    console.log(
      'getalertnotification URL:',
      url,
      'Params:',
      httpParams.toString(),
    );

    return this.http.get<any>(url, { params: httpParams });
  }

  getsegregatenotification(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.segregatenotification}`;

    // Build query parameters
    let httpParams = new HttpParams();
    httpParams = httpParams.set('millcode', String(payload['millcode'] || ''));
    httpParams = httpParams.set('userid', String(payload['userid'] || ''));
    httpParams = httpParams.set(
      'departmentid',
      String(payload['departmentid'] || ''),
    );
    httpParams = httpParams.set('filter', String(payload['filter'] || ''));
    httpParams = httpParams.set(
      'language',
      String(payload['language'] || 'English'),
    );

    console.log(
      'getsegregatenotification URL:',
      url,
      'Params:',
      httpParams.toString(),
    );

    return this.http.get<any>(url, { params: httpParams });
  }

  updatealertnotification(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.updatealertnotification}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  deletedasboardnotification(
    payload: Record<string, unknown>,
  ): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.deletedashboardnotification}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }
}
