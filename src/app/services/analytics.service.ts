import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Urls } from "../utils/url";
import { NpsAnalytics, NpsAnalyticsOvertime, NpsTopFiveCategories } from "../model/analytics.d";

interface NpsAnalyticsOvertimeCombined extends NpsAnalytics, NpsAnalyticsOvertime {}

@Injectable({
  providedIn: "root"
})
export class AnalyticsService {
  constructor(private http: HttpClient) {}

  getAnalytics(queryParams: any): Promise<NpsAnalyticsOvertimeCombined> {
    return new Promise((resolve, reject) => {
      this.http.get(`${Urls.analytics}/AnalyticsStatistics`, { params: queryParams }).subscribe(
        (res: any) => {
          resolve(res.data as NpsAnalyticsOvertimeCombined);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  getTopFiveCategorisAnalytics(queryParams: any): Promise<NpsTopFiveCategories[]> {
    return new Promise((resolve, reject) => {
      this.http.get(`${Urls.analytics}/TopCategories`, { params: queryParams }).subscribe(
        (res: any) => {
          resolve(res.data as NpsTopFiveCategories[]);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  getRespondedCompletionRate(queryParams: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${Urls.analytics}/RegionStatistics`, { params: queryParams }).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        err => {
          reject(err);
        }
      );
    });
  }
}
