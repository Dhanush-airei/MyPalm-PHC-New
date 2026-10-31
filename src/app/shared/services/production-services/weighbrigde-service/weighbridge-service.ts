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
export class WeighbridgeService {
  private http = inject(HttpClient);

  constructor(
    private router: Router,
    private navCtrl: NavController,
  ) {}

  getWeighbridgeDetails(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.getpendinggradinglist}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  saveweighbridgedetails(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.updategradingnetweight}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getweighbridgereportdetails(
    payload: Record<string, unknown>,
  ): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.getweighbridgereport}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }
}
