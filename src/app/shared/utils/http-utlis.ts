import { HttpParams } from '@angular/common/http';

export class HttpUtils {
  /**
   * Convert object to HttpParams
   */
  static toHttpParams(params: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();

    Object.keys(params).forEach((key) => {
      const value = params[key];

      if (value !== null && value !== undefined) {
        httpParams = httpParams.set(key, value);
      }
    });

    return httpParams;
  }

  /**
   * Convert object to FormData
   */
  static toFormData(data: Record<string, any>): FormData {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      const value = data[key];

      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    return formData;
  }
}
