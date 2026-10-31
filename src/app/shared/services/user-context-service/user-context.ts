import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserContext {
  constructor() {}

  private get user(): any {
    return JSON.parse(localStorage.getItem('userlist') || '{}');
  }

  get userId(): number {
    return this.user.userId;
  }

  get millCode(): string {
    return this.user.millcode;
  }

  get millName(): string {
    return this.user.millname;
  }

  get departmentId(): number {
    return this.user.dept_id;
  }

  get designId(): number {
    return this.user.desigId;
  }

  get sterilizer_sensor_flag(): number {
    return this.user.sterilizer_sensor_flag;
  }

  //oilloss_notification_flag
  get oilloss_notification_flag(): number {
    return this.user.oilloss_notification_flag;
  }

  //report_url
  get reportUrl(): string {
    return this.user.report_url;
  }

  // mill_lang
  get millLang(): string {
    return this.user.mill_lang;
  }

  // mill_lang
  get millLat(): string {
    return this.user.mill_lat;
  }

  get sterilizerSensorFlag(): number {
    return this.user.sterilizer_sensor_flag;
  }

  get pressSensorFlag(): number {
    return this.user.press_sensor_flag;
  }
}
