import { Component, OnInit } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { NotifyService } from "src/app/services/notify.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  loginForm!: UntypedFormGroup;
  forgetPassForm!: UntypedFormGroup;
  resetPassForm!: UntypedFormGroup;
  status = "login";
  code: any;
  token: any;
  welcomeImage = null;
  isLoading = false;
  privacyAndPolicy = "";
  termAndCondition = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _notificationService: NotifyService,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeData();
    if (this.router.url === "/forgot") {
      this.status = "forgot";
    }
    if (this.router.url.includes("/reset")) {
      this.status = "reset";
      this.token = this.route.snapshot.queryParams["key"];
    }
  }

  private initializeData() {
    this.loginForm = new UntypedFormGroup({
      userId: new UntypedFormControl("", [Validators.required]),
      password: new UntypedFormControl("", [Validators.required])
    });
    this.forgetPassForm = new UntypedFormGroup({
      email: new UntypedFormControl("", [Validators.required, Validators.email])
    });
    this.resetPassForm = new UntypedFormGroup({
      password: new UntypedFormControl("", [Validators.required]),
      confirmPassword: new UntypedFormControl("", [Validators.required])
    });
  }

  login() {
    if (!this.loginForm.valid) {
      this._notificationService.sendNotification("error", "Please enter all the required details.");
      return;
    }
    const data = {
      email: this.loginForm.value.userId,
      password: this.loginForm.value.password
    };
    this._authService
      .login(data)
      .then(res => {
        this._authService.setUser(res);
        this.router.navigate(["dashboard"]);
      })
      .catch(err => {
        this._notificationService.sendNotification("error", err.error?.message ? err.error.message : "Something went wrong!");
      });
  }
  forgotPassword() {
    if (!this.forgetPassForm.valid) {
      this._notificationService.sendNotification("error", "Please Enter a valid Email.");
      return;
    }
    this._authService
      .forgotPasswordFromUser(this.forgetPassForm.value.email)
      .then(res => {
        this.forgetPassForm.reset();
        this._notificationService.sendNotification("success", "The password reset link will be sent to your registered email address!");
        this.router.navigate([""]);
      })
      .catch(err => {
        this._notificationService.sendNotification("error", err.error?.message ? err.error.message : "Something went wrong!");
      });
  }

  resetPassword() {
    if (!this.resetPassForm.valid) {
      if (!this.resetPassForm.value.password) {
        this._notificationService.sendNotification("error", "Please Enter your Password");
        return;
      }
      if (!this.resetPassForm.value.confirmPassword) {
        this._notificationService.sendNotification("error", "Please Enter your Confirm Password");
        return;
      }
      if (this.resetPassForm.value.confirmPassword !== this.resetPassForm.value.password) {
        this._notificationService.sendNotification("error", "Please Enter valid Confirm Password");
        return;
      }
      if (this.resetPassForm.value.password.trim() === "") {
        this._notificationService.sendNotification("error", "Please Enter valid Password");
        return;
      }
    }
    console.log(this.resetPassForm.value);
    if (this.resetPassForm.value.password !== this.resetPassForm.value.confirmPassword) {
      this._notificationService.sendNotification("error", "Please add valid confirm password");
      return;
    }
    this._authService
      .resetPasswordByEmail({
        password: this.resetPassForm.value.password,
        confirmPassword: this.resetPassForm.value.confirmPassword,
        token: this.token
      })
      .then(() => {
        this.resetPassForm.reset();
        localStorage.clear();
        this._notificationService.sendNotification("success", "The password is reset successfully.");
        this.router.navigate(["/login"]);
      })
      .catch(error => {
        this._notificationService.sendNotification("error", error.error?.message ? error.error.message : "Something went wrong!");
      });
  }
}
