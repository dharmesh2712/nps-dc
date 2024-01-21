import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Urls } from "../utils/url";

@Injectable({
  providedIn: "root"
})
export class SurveyService {
  constructor(private http: HttpClient) {}

  getSurveyList(pagnationData: any, searchValue: string) {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          `${Urls.surveyOperation}?page=${pagnationData.page}&limit=${pagnationData.limit}&searchText=${
            searchValue?.trim() ? searchValue : ""
          }`
        )
        .subscribe(
          res => {
            resolve(res);
          },
          err => {
            reject(err);
          }
        );
    });
  }

  createSurvey(surveyCreationData: any) {
    return new Promise((resolve, reject) => {
      this.http.post(Urls.surveyOperation, surveyCreationData).subscribe(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  saveSurvey(surveyFormData: any) {
    return new Promise((resolve, reject) => {
      this.http.post(Urls.saveSurvey, surveyFormData).subscribe(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  deleteSurvey(surveyId: string) {
    return new Promise((resolve, reject) => {
      this.http.delete(`${Urls.surveyOperation}/?surveyId=${surveyId}`).subscribe(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  getSurveyFormJSON(surveyId: string) {
    return new Promise((resolve, reject) => {
      this.http.get(`${Urls.surveyForm}?surveyId=${surveyId}`).subscribe(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  getSurveyApiPayload(surveyId: string) {
    return new Promise((resolve, reject) => {
      this.http.get(`${Urls.surveyApiPayload}/?surveyId=${surveyId}`).subscribe(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  publishSurvey(surveyId: string, surveyFormData: any) {
    return new Promise((resolve, reject) => {
      this.http.put(`${Urls.publishSurvey}?surveyId=${surveyId}`, surveyFormData).subscribe(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  surveyApiPayloadForDownload(surveyId: string) {
    return new Promise((resolve, reject) => {
      this.http.get(`${Urls.surveyApiPayloadForDownload}?surveyId=${surveyId}`).subscribe(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }
}
