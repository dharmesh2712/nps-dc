import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { CommonService } from "src/app/services/common.service";
import { NotifyService } from "src/app/services/notify.service";
import { Urls } from "src/app/utils/url";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent {
  profileSettingForm!: FormGroup;
  initialLetter: string = "DC";
  resetpassword!: FormGroup;
  forgotPass = {
    oldPassword: "",
    newPassword: ""
  };
  isClicked: any;
  confirmPassword: any;
  porifleData: any = this._commonService.userProfile;
  isLoading: boolean = false;
  private unsubscribe: Subject<void> = new Subject();
  profileImage: any;

  constructor(
    private _notificationService: NotifyService,
    private _authService: AuthService,
    private _commonService: CommonService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.getUserDetails();
    document.getElementById("module-title")!.innerHTML = "Profile";
  }

  getUserDetails() {
    this.isLoading = true;
    this._authService
      .getUserDetails()
      .then((userProfileData: any) => {
        this.porifleData = userProfileData.data;
        this.setFormValue();
        this.profileImage = this.porifleData.profilePhotoUrl;
        this.isLoading = false;
      })
      .catch((err: any) => {
        this._notificationService.sendNotification("error", err.error?.message ? err.error.message : "Something went wrong!");
        this.isLoading = false;
      });
  }

  setFormValue() {
    this.profileSettingForm = new UntypedFormGroup({
      email: new UntypedFormControl(""), // it will show user email and that field is readonly
      firstName: new UntypedFormControl("", [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z'-]*[a-zA-Z]$/)]),
      lastName: new UntypedFormControl("", [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z'-]*[a-zA-Z]$/)]),
      phoneNumber: new UntypedFormControl("")
    });
    this.resetpassword = new UntypedFormGroup({
      oldPassword: new UntypedFormControl("", [Validators.required]),
      newPassword: new UntypedFormControl("", [Validators.required]),
      confirmPassword: new UntypedFormControl("", [Validators.required])
    });
    this.setProfile();
  }

  setProfile() {
    this.initialLetter = this.porifleData.firstName.charAt(0);
    this.profileSettingForm.setValue({
      email: this.porifleData.email,
      firstName: this.porifleData.firstName,
      lastName: this.porifleData.lastName,
      phoneNumber: this.porifleData.phoneNumber
    });
  }

  imageUpload(event: any) {
    if (event.target && event.target.files.length > 0) {
      const fd = new FormData();
      fd.append("image", event.target.files[0], event.target.files[0].name);
      this.http
        .post(`${Urls.baseUrl}api/User/UploadProfilePicture`, fd)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          async (res: any) => {
            this.profileImage = res.data;
            await this.UpdateProfile(true);
            this.getUserDetails();
          },
          err => {
            if (err.error === "FILE_NOT_SUPPORTED") {
              this._notificationService.sendNotification("error", "File extension not supported!");
            } else {
              this._notificationService.sendNotification("error", err.error?.message ? err.error.message : "Something went wrong!");
            }
          }
        );
    }
  }

  checkMobileNumber(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    } else {
      return event.target.value.length <= 9;
    }
  }

  async UpdateProfile(isFromUploadImage?: boolean) {
    const userData = {
      ...this.profileSettingForm.value,
      id: this.porifleData.id
    };
    if (isFromUploadImage) {
      userData.profilePhotoUrl = this.profileImage;
    }
    try {
      await this._authService.updateProfile(userData);
      this._notificationService.sendNotification("success", "Profile updated successfully");
    } catch (err: any) {
      this._notificationService.sendNotification("error", err.error?.message ? err.error.message : "Something went wrong!");
    }
  }

  forgotPassword() {
    if (
      this.resetpassword.value.oldPassword.trim() &&
      this.resetpassword.value.newPassword.trim() &&
      this.resetpassword.value.confirmPassword.trim()
    ) {
      if (this.resetpassword.value.newPassword === this.resetpassword.value.confirmPassword) {
        this._authService
          .setPassword({ password: this.resetpassword.value.newPassword })
          .then(() => {
            this.resetpassword.reset();
            this._notificationService.sendNotification("success", "Password updated successfully");
          })
          .catch((error: any) => {
            this._notificationService.sendNotification(
              "error",
              "Error: " + error.error && error.error.message ? error.error.message : "Internal Server Error"
            );
          });
      } else {
        this._notificationService.sendNotification("error", "Confirm Password does not matches");
      }
    } else {
      this._notificationService.sendNotification("error", "Please enter proper password");
    }
  }
}
