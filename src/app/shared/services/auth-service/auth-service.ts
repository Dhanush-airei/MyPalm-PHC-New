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
export class AuthService {
  private http = inject(HttpClient);

  constructor(
    private router: Router,
    private navCtrl: NavController,
  ) {}

  getMillDetails(payload: any) {
    const params = HttpUtils.toHttpParams({
      millcode: payload.millcode,
    });

    // const body = HttpUtils.toFormData(payload);

    return this.http.post<any>(API_ENDPOINTS.MILL_AUTH, payload, { params });
  }

  login(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.login}`;
    const params = HttpUtils.toHttpParams(payload);

    return this.http.post<any>(url, payload, { params });
  }

  getLoginCheckApi() {
    return this.http.get<any>(API_ENDPOINTS.checkbuttonflag);
  }

  userManual(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.user_manual_list}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  changePassword(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.change_password}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  deleteAccount(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.deleteaccount}`;
    const params = HttpUtils.toFormData(payload);
    return this.http.post<any>(url, params);
  }

  logout(): void {
    // this.isLoading = true;

    const selectedEstate = localStorage.getItem('selectedEstate');
    const language = localStorage.getItem('SELECTED_LANGUAGE');
    const endpoint = localStorage.getItem('endpoint');

    localStorage.clear();

    if (selectedEstate) {
      localStorage.setItem('selectedEstate', selectedEstate);
    }

    if (language) {
      localStorage.setItem('SELECTED_LANGUAGE', language);
    }

    if (endpoint) {
      localStorage.setItem('endpoint', endpoint);
    }

    this.navCtrl.navigateRoot('/login', { animated: false });
  }
}
