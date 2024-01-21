import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Urls } from "../utils/url";

@Injectable({
  providedIn: "root"
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  getCustomersList(pagnationData: any, searchValue: string, filters?: any) {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          `${Urls.getCustomers}?page=${pagnationData.page}&limit=${pagnationData.limit}&searchText=${searchValue}&categoryId=${
            filters?.category ? filters?.category : ""
          }&SurveyId=${filters?.survey ? filters.survey : ""}&customerType=${filters?.status ? filters.status : ""}&timelyResponse=${
            filters?.timelyResponse ? filters.timelyResponse : ""
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

  getCustomerDetails(customerId: string) {
    return new Promise((resolve, reject) => {
      this.http.get(`${Urls.getCustomerDetails}?customerId=${customerId}`).subscribe(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  getSurveyFromCategory(categoryId: string) {
    return new Promise((resolve, reject) => {
      this.http.get(`${Urls.surveyOperation}?page=1&limit=2000&isForDropDown=true&categoryId=${categoryId}`).subscribe(
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
