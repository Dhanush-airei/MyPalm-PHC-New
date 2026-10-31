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
export class LabService {
  private http = inject(HttpClient);

  constructor(
    private router: Router,
    private navCtrl: NavController,
  ) {}

  saveLabOilLosses(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.savelaboillosses}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  saveCPOStock(payload: Record<string, unknown>): Observable<any> {
    const userList = JSON.parse(localStorage.getItem('userlist') || '{}');
    const url = `${userList.report_url}MobileAPI/${API_ENDPOINTS.save_cpostock_data}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  savePKOStock(payload: Record<string, unknown>): Observable<any> {
    const userList = JSON.parse(localStorage.getItem('userlist') || '{}');
    const url = `${userList.report_url}MobileAPI/${API_ENDPOINTS.insert_pko_stock_save}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  savePKStock(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.save_pkstock_data}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }
}
