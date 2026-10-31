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
export class SterilizerService {
  private http = inject(HttpClient);

  constructor(
    private router: Router,
    private navCtrl: NavController,
  ) {}

  getPressStationAlertData(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.getpressingstationalertdata}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getDoorOpenLaterData(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.getdooroopenlaterdata}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getSterilizerStationAlertData(
    payload: Record<string, unknown>,
  ): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.getsterilizerstationalertdata}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getSterilizerSensorData(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.getsterilizersensordata}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  saveDoorOpenTimeLater(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.savedooropenlater}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getCycleNoValue(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.getcycleno}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getSterilizersValue(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.getsterilizers}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getSterilizerDataDetails(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.get_sterilizer_cycles_data}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getSettings(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.getsettings}`;
    const params = HttpUtils.toHttpParams(payload);

    return this.http.post<any>(url, params);
  }

  getLastDoorOpenTime(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.getsterilizerdooropentime}`;

    // Build query parameters
    let httpParams = new HttpParams();
    httpParams = httpParams.set('userid', String(payload['userid'] || ''));
    httpParams = httpParams.set(
      'departmentid',
      String(payload['departmentid'] || ''),
    );
    httpParams = httpParams.set(
      'designationid',
      String(payload['designationid'] || ''),
    );
    httpParams = httpParams.set('millcode', String(payload['millcode'] || ''));
    httpParams = httpParams.set(
      'sterilizerid',
      String(payload['sterilizerid'] || ''),
    );
    httpParams = httpParams.set(
      'stationid',
      String(payload['stationid'] || ''),
    );
    httpParams = httpParams.set(
      'language',
      String(payload['language'] || 'English'),
    );

    // Optional: Add fromdate if provided
    if (payload['fromdate']) {
      httpParams = httpParams.set('fromdate', String(payload['fromdate']));
    }

    console.log(
      'getLastDoorOpenTime URL:',
      url,
      'Params:',
      httpParams.toString(),
    );

    return this.http.get<any>(url, { params: httpParams });
  }

  getCyclesDetails(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.get_sterilizer_cycles}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  saveHourlySterilizerStation(
    payload: Record<string, unknown>,
  ): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.savehourlysterilizerstation}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getmaintenancependingcount(
    payload: Record<string, unknown>,
  ): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.getmaintenancependingcount}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getalertdetails(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.alertdetailsnotification}`;

    // Build query parameters
    let httpParams = new HttpParams();
    httpParams = httpParams.set('millcode', String(payload['millcode'] || ''));
    httpParams = httpParams.set('userid', String(payload['userid'] || ''));
    httpParams = httpParams.set(
      'departmentid',
      String(payload['departmentid'] || ''),
    );
    httpParams = httpParams.set(
      'designationid',
      String(payload['designationid'] || ''),
    );
    httpParams = httpParams.set('baseid', String(payload['baseid'] || ''));
    httpParams = httpParams.set('id', String(payload['id'] || ''));
    httpParams = httpParams.set('type', String(payload['type'] || ''));
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

  getsterilizervalue(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.get_sterilizer_hourly_performance_new}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }
}
