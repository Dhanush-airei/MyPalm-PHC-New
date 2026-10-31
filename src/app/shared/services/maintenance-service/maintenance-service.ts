/* maintenance.service.ts */
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from 'src/app/shared/constants/api-endpoints';
import { HttpUtils } from 'src/app/shared/utils/http-utlis';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceService {
  private http = inject(HttpClient);

  constructor(
    private router: Router,
    private navCtrl: NavController,
  ) {}

  /**
   * Get Incharge Person List
   */
  getInchargePerson(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const userList = JSON.parse(localStorage.getItem('userlist') || '{}');
    const url = `${userList.report_url}MobileAPI/${API_ENDPOINTS.get_incharge_person_list}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  /**
   * Get Notification List Report
   */
  getNotificationListReport(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.getmaintenancenotificationlistreport}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  /**
   * Get Notification View
   */
  getNotificationView(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.getmaintenancenotificationview}`;

    let httpParams = new HttpParams();
    httpParams = httpParams.set('user_id', String(payload['user_id'] || ''));
    httpParams = httpParams.set('dept_id', String(payload['dept_id'] || ''));
    httpParams = httpParams.set('millcode', String(payload['millcode'] || ''));
    httpParams = httpParams.set('id', String(payload['id'] || ''));
    httpParams = httpParams.set(
      'language',
      String(payload['language'] || 'English'),
    );

    console.log('getNotificationView URL:', url);
    console.log('getNotificationView Params:', httpParams.toString());

    return this.http.get<any>(url, { params: httpParams });
  }

  /**
   * Get Multi Part Defect View List
   * FIX: Ensure pvflag is properly passed in the request
   */
  getMultiPartDefectViewList(
    payload: Record<string, unknown>,
  ): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.getmultipartdefectviewlist}`;

    // FIX: Use HttpParams for consistent GET request
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
    httpParams = httpParams.set('id', String(payload['id'] || ''));
    httpParams = httpParams.set(
      'partdefectid',
      String(payload['partdefectid'] || ''),
    );
    httpParams = httpParams.set(
      'stationid',
      String(payload['stationid'] || ''),
    );
    httpParams = httpParams.set(
      'equipment',
      String(payload['equipment'] || ''),
    );
    // FIX: Ensure pvflag is passed correctly
    httpParams = httpParams.set('pvflag', String(payload['pvflag'] || '0'));
    httpParams = httpParams.set(
      'language',
      String(payload['language'] || 'English'),
    );

    console.log('getMultiPartDefectViewList URL:', url);
    console.log('getMultiPartDefectViewList Params:', httpParams.toString());
    console.log('getMultiPartDefectViewList pvflag:', payload['pvflag']);

    return this.http.get<any>(url, { params: httpParams });
  }

  /**
   * Get Part Task List Flag
   */
  getPartTaskListFlag(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.getparttasklistflag}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  /**
   * Get Part Task List
   */
  getPartTaskList(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.getparttasklist}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  /**
   * Get Predictive Notification List Report
   */
  getPredictiveNotificationListReport(
    payload: Record<string, unknown>,
  ): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.getpredictivereport}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  /**
   * Get Rejected Predictive Notification List Report
   */
  getRejectedPredictiveNotificationListReport(
    payload: Record<string, unknown>,
  ): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.getpredictiverejectreport}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  /**
   * Get Station List
   */
  getStationList(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.stationlist}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  /**
   * Get Machineries Running Hours
   */
  getMachineriesRunningHours(
    payload: Record<string, unknown>,
  ): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.getmachineriesrunninghours}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  /**
   * Get Machine List
   */
  getMachineList(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.machinelist}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  /**
   * Get Parts Running Hours List
   */
  getPartsRunningHoursList(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.machine_runninghours_list}`;

    // FIX: Use HttpParams for consistent GET request
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
    httpParams = httpParams.set(
      'stationid',
      String(payload['stationid'] || ''),
    );
    httpParams = httpParams.set(
      'locationid',
      String(payload['locationid'] || ''),
    );
    httpParams = httpParams.set('millcode', String(payload['millcode'] || ''));
    httpParams = httpParams.set(
      'language',
      String(payload['language'] || 'English'),
    );

    console.log('getMultiPartDefectViewList URL:', url);
    console.log('getMultiPartDefectViewList Params:', httpParams.toString());
    console.log('getMultiPartDefectViewList pvflag:', payload['pvflag']);

    return this.http.get<any>(url, { params: httpParams });
  }

  getStations(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.stationlist}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getProductionStartStopStatus(
    payload: Record<string, unknown>,
  ): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.getproductionstartstopstatus}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getProductionStationNew(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.getproductionstations}`;
    const params = HttpUtils.toHttpParams(payload);

    return this.http.get<any>(url, { params });
  }

  startstopProductionStation(
    payload: Record<string, unknown>,
  ): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.getproductionstartstopstatus}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  saveffbcages(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.saveallffbcages}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  startstopProduction(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.savestartstopproduction}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  saveBreakDownStatus(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.savebreakdownstatus}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }
  getSterilizersValue(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.getsterilizers}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  saveMachineStatus(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.savemachinestatus}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getBreakdownCodingList(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.breakdowncodinglist}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getMaintenanceTypeList(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.maintenancetypelist}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getBreakDownCausesList(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.breakdowncauseslist}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getPartList(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.partslist}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getWorkAssignedToList(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.workassignedtolist}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getSequenceNumber(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.sequencenumber}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getPriorityLevel(payload: Record<string, unknown>): Observable<any> {
    const userList = JSON.parse(localStorage.getItem('userlist') || '{}');
    const url = `${userList.report_url}MobileAPI/${API_ENDPOINTS.getPriorityLevel}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  saveMaintenanceNotification(
    payload: Record<string, unknown>,
  ): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.savemaintenancenotification}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getSummaryPopupFlag(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.getsummarypopupflag}`;
    const params = HttpUtils.toHttpParams(payload);

    return this.http.get<any>(url, { params });
  }

  getsummarypopup(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.getsummarypopup}`;
    const params = HttpUtils.toHttpParams(payload);

    return this.http.get<any>(url, { params });
  }

  updatesummarypopup(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.updatesummary}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getAINotificationList(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.getainotificationlist}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  saveAIAssign(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.saveaiassign}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  rejectAi(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.saveaireject}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getAIView(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.getainotificationview}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getMaintenanceNotificationList(
    payload: Record<string, unknown>,
  ): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.getmaintenancenotificationlist}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  saveManagerAssign(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.savemanagerassign}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getDamageList(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.damagelist}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getAssignedToList(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.assignedtolist}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getActivityList(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.activitylist}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  saveMultiplePartMaintenanceNotification(
    payload: Record<string, unknown>,
  ): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.savemultiplemaintenancenotification}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getMultiPartDefectList(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.getmultipartdefectlist}`;
    const params = HttpUtils.toHttpParams(payload);

    return this.http.get<any>(url, { params });
  }

  getTaskDetails(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.gettaskdetails}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  formanCorrectiveMaintenanceVerify(
    payload: Record<string, unknown>,
  ): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.formancorrectivemaintenanceverify}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }
  denyWithRemarksApi(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.maintenance_notification_engineer_deny}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }
  updateCorrectiveMaintenanceAuthorize(
    payload: Record<string, unknown>,
  ): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.updatecorrectivemaintenanceauthorize}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  uploadNotificationImages(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.uploadnotificationimages}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getMaintenancePendingCount(
    payload: Record<string, unknown>,
  ): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.getmaintenancependingcount}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  getPartsDetails(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}/${API_ENDPOINTS.getpartsdetails}`;

    // FIX: Use HttpParams for consistent GET request
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
      'stationid',
      String(payload['stationid'] || ''),
    );
    httpParams = httpParams.set(
      'equipment',
      String(payload['equipment'] || ''),
    );
    httpParams = httpParams.set('part_id', String(payload['part_id'] || ''));
    httpParams = httpParams.set(
      'language',
      String(payload['language'] || 'English'),
    );

    console.log('getMultiPartDefectViewList URL:', url);
    console.log('getMultiPartDefectViewList Params:', httpParams.toString());
    console.log('getMultiPartDefectViewList pvflag:', payload['pvflag']);

    return this.http.get<any>(url, { params: httpParams });
  }

  /**
   * Get Maintenance Status List
   */
  getMaintenanceStatusList(payload: Record<string, unknown>): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.maintenancestatuslist}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  /**
   * Get Notification History Details
   */
  getNotificationHistoryDetails(
    payload: Record<string, unknown>,
  ): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.getnotificationhistory}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }

  /**
   * Get Notification Timeline Scan Details
   */
  getNotificationTimelineScanDetails(
    payload: Record<string, unknown>,
  ): Observable<any> {
    const endpoint = localStorage.getItem('endpoint');
    const url = `${endpoint}${API_ENDPOINTS.getnotificationtimeline}`;
    const params = HttpUtils.toFormData(payload);

    return this.http.post<any>(url, params);
  }
}
