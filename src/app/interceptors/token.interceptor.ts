import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Observable, tap } from "rxjs";
import { Urls } from "../utils/url";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private _authService: AuthService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        authorization: `Bearer ${this._authService.getUserToken()}`
      }
    });
    return next.handle(request).pipe(
      tap(
        () => {},
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this._authService.logOut().catch(() => {});
              if (request.url !== Urls.login) {
                localStorage.clear();
                location.href = "";
              }
            }
          }
        }
      )
    );
  }
}
