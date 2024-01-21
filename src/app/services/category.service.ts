import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Urls } from "../utils/url";

@Injectable({
  providedIn: "root"
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategoryList(pagnationData: any, searchValue: string) {
    return new Promise((resolve, reject) => {
      this.http.get(`${Urls.category}?page=${pagnationData.page}&limit=${pagnationData.limit}&searchText=${searchValue}`).subscribe(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  createCategory(categoryName: string) {
    return new Promise((resolve, reject) => {
      this.http.post(`${Urls.category}`, { categoryName }).subscribe(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  updateCategory(categoryName: string, categoryId: string) {
    return new Promise((resolve, reject) => {
      this.http.put(`${Urls.category}`, { categoryName, categoryId }).subscribe(
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
