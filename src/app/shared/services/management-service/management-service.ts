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
export class ManagementService {
  private http = inject(HttpClient);

  constructor(
    private router: Router,
    private navCtrl: NavController,
  ) {}

  //FManager - Maintenance
  getMaintenanceData(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.ownermaintenancedata}`;

    // Build query parameters - FIX: Use lowercase keys to match service expectations
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
    httpParams = httpParams.set(
      'language',
      String(payload['language'] || 'English'),
    );
    httpParams = httpParams.set('fromdate', String(payload['fromdate'] || ''));

    console.log('getProductionData URL:', url);
    console.log('getProductionData Params:', httpParams.toString());

    return this.http.get<any>(url, { params: httpParams });
  }

  //FManager - Production
  getProductionData(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.ownerproductiondata}`;

    // Build query parameters - FIX: Use lowercase keys to match service expectations
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

    // FIX: Check for both 'fromdate' and 'Fromdate' keys
    const fromdate = payload['fromdate'] || payload['Fromdate'] || '';
    const todate = payload['todate'] || payload['Todate'] || '';

    httpParams = httpParams.set('fromdate', String(fromdate));
    httpParams = httpParams.set('todate', String(todate));
    httpParams = httpParams.set(
      'language',
      String(payload['language'] || 'English'),
    );

    console.log('getProductionData URL:', url);
    console.log('getProductionData Params:', httpParams.toString());
    console.log('getProductionData fromdate:', fromdate);
    console.log('getProductionData todate:', todate);

    return this.http.get<any>(url, { params: httpParams });
  }

  getProductionAlertSummary(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.getproductionalertsummary}`;

    // Build query parameters
    let httpParams = new HttpParams();
    httpParams = httpParams.set('user_id', String(payload['userid'] || ''));
    httpParams = httpParams.set('millcode', String(payload['millcode'] || ''));
    httpParams = httpParams.set('type', String(payload['type'] || ''));
    httpParams = httpParams.set('Fromdate', String(payload['Fromdate'] || ''));
    httpParams = httpParams.set(
      'language',
      String(payload['language'] || 'English'),
    );

    console.log('getProductionAlertSummary URL:', url);
    console.log('getProductionAlertSummary Params:', httpParams.toString());

    return this.http.get<any>(url, { params: httpParams });
  }

  //FManager - Report - Oil-losses
  getOillossesvalues(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.get_oilloss_prediction}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getOillossesReportList(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.oillosses_report_list}`;

    // Build query parameters - FIX: Use lowercase keys to match service expectations
    let httpParams = new HttpParams();
    httpParams = httpParams.set('millcode', String(payload['millcode'] || ''));
    const fromdate = payload['fromdate'] || payload['Fromdate'] || '';

    httpParams = httpParams.set('fromdate', String(fromdate));
    httpParams = httpParams.set(
      'language',
      String(payload['language'] || 'English'),
    );

    console.log('getProductionData URL:', url);
    console.log('getProductionData Params:', httpParams.toString());

    return this.http.get<any>(url, { params: httpParams });
  }

  //FManager - Report - Performance-Analysis
  /**
   * Get Daily Lab Oil Loss List
   */
  getDailylabOillossList(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.getdailylaboillosslist}`;

    let httpParams = new HttpParams();
    httpParams = httpParams.set('millcode', String(payload['millcode'] || ''));
    const fromdate = payload['Fromdate'] || payload['fromdate'] || '';
    httpParams = httpParams.set('fromdate', String(fromdate));
    httpParams = httpParams.set(
      'language',
      String(payload['language'] || 'English'),
    );

    console.log('getDailylabOillossList URL:', url);
    console.log('getDailylabOillossList Params:', httpParams.toString());

    return this.http.get<any>(url, { params: httpParams });
  }

  /**
   * Get Monthly Lab Oil Loss List
   */
  getMonthlylabOillossList(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.getmonthlylaboillosslist}`;

    let httpParams = new HttpParams();
    httpParams = httpParams.set('userid', String(payload['userid'] || ''));
    httpParams = httpParams.set('millcode', String(payload['millcode'] || ''));
    httpParams = httpParams.set('type', String(payload['type'] || '1'));
    httpParams = httpParams.set('year', String(payload['year'] || ''));
    httpParams = httpParams.set(
      'language',
      String(payload['language'] || 'English'),
    );
    httpParams = httpParams.set('pressid', String(payload['pressid'] || ''));

    console.log('getMonthlylabOillossList URL:', url);
    console.log('getMonthlylabOillossList Params:', httpParams.toString());

    return this.http.get<any>(url, { params: httpParams });
  }
}
