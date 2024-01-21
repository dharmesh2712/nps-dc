import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Urls } from "../utils/url";
import { Router } from "@angular/router";
import { CommonService } from "./common.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  token!: string;

  constructor(private http: HttpClient, private router: Router, private _commonSerivce: CommonService) {}

  setUser(user: any) {
    localStorage.setItem("token", user.data.token);
    localStorage.setItem("user", user.data.userId);
  }

  getUserToken() {
    if (localStorage.getItem("token")?.trim()) {
      return localStorage.getItem("token");
    } else {
      return "";
    }
  }

  getUser() {
    if (localStorage.getItem("user")?.trim()) {
      return localStorage.getItem("user");
    } else {
      this.logOut();
      return "";
    }
  }

  login(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(Urls.login, data).subscribe(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  logOut() {
    const userId = this.getUser();
    return new Promise((resolve, reject) => {
      this.http.post(Urls.logout, JSON.stringify(userId), { headers: new HttpHeaders().set("Content-Type", "application/json") }).subscribe(
        res => {
          resolve(res);
          localStorage.clear();
          this.router.navigate(["login"]);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  forgotPasswordFromUser(userId: string) {
    console.log(typeof userId);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${Urls.forgotPasswordUrl}`, JSON.stringify(userId), { headers: new HttpHeaders().set("Content-Type", "application/json") })
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

  resetPasswordByEmail(resetPasswordData: any) {
    return new Promise((resolve, reject) => {
      this.http.post(Urls.resetPass, resetPasswordData).subscribe(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  setPassword(resetPass: any) {
    return new Promise((resolve, reject) => {
      this.http.post(Urls.resetPasswordByUrl, resetPass).subscribe(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  getUserDetails() {
    return new Promise((resolve, reject) => {
      this.http.get(`${Urls.getUserDetails}?userId=${this.getUser()}`).subscribe(
        (res: any) => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  updateProfile(data: any) {
    return new Promise((resolve, reject) => {
      this.http.put(Urls.updateProfle, data).subscribe(
        (res: any) => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    });
  }
}
