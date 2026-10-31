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
export class SupplyChainTraceabilityService {
  private http = inject(HttpClient);

  constructor(
    private router: Router,
    private navCtrl: NavController,
  ) {}

  getSupplyChainReport(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.getsupplychain}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getSupplierSupplyChainGpsData(
    payload: Record<string, unknown>,
  ): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.getsuppliersupplychain}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getSupplierSupplyChainReport(
    payload: Record<string, unknown>,
  ): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.getsuppliersupplychaincount}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getSupplierSupplyChainPolygonData(
    payload: Record<string, unknown>,
  ): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.getsupplierPolygon}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }
}
