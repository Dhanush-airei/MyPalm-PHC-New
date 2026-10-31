import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { API_ENDPOINTS } from 'src/app/shared/constants/api-endpoints';
import { HttpUtils } from 'src/app/shared/utils/http-utlis';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class CpoPkStockService {
  private http = inject(HttpClient);

  constructor(
    private router: Router,
    private navCtrl: NavController,
  ) {}

  getCPOStockReport(payload: Record<string, unknown>): Observable<any> {
    // const endpoint = localStorage.getItem('endpoint');
    const userList = JSON.parse(localStorage.getItem('userlist') || '{}');
    const url = `${userList.report_url}MobileAPI/${API_ENDPOINTS.CPO_stock_report}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getPKOStockReport(payload: Record<string, unknown>): Observable<any> {
    // const endpoint = localStorage.getItem('endpoint');
    const userList = JSON.parse(localStorage.getItem('userlist') || '{}');
    const url = `${userList.report_url}MobileAPI/${API_ENDPOINTS.PKO_stock_report}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getPKStockReport(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.get_pklist_data}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }
}
