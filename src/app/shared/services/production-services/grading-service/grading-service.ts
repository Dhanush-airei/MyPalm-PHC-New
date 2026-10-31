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
export class GradingService {
  private http = inject(HttpClient);

  constructor(
    private router: Router,
    private navCtrl: NavController,
  ) {}

  getSupplierList(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.supplerlist}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getVehicleNoList(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.vehiclelist}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  saveGrading(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.savegrading}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getGradingList(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.gradingvehiclelist}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getGradingReport(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.gradingreport}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }
}
