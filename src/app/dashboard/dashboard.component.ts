import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { CommonService } from "../services/common.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _authService: AuthService,
    private _commonSerivce: CommonService
  ) {}
  currentTab = "Analytics";
  isLoading: boolean = false;
  isMenuToggle: boolean = false;
  initialLetter: string = "";
  profileData: any = {};
  settings: Array<any> = [
    {
      icon: "insert_chart",
      name: "dashboard",
      isEnabled: true,
      routerLink: ["analytics"]
    },
    {
      icon: "assignment",
      name: "Survey",
      isEnabled: true,
      routerLink: ["survey"]
    },
    {
      icon: "widgets",
      name: "Category",
      isEnabled: true,
      routerLink: ["category"]
    },
    {
      icon: "groups",
      name: "Customers",
      isEnabled: true,
      routerLink: ["customer"]
    }
  ];

  ngOnInit() {
    this.getUserProfile();
  }

  toggleMenu() {
    this.isMenuToggle = !this.isMenuToggle;
    console.log(this.isMenuToggle);
  }

  handleMenuClick(event: any) {
    if (event === "profile") {
      this.isMenuToggle = false;
      this.router.navigate(["profile"], { relativeTo: this.route });
    }
    if (event === "logout") {
      this.isMenuToggle = false;
      this._authService.logOut();
    } else {
      this.isMenuToggle = false;
    }
  }

  getUserProfile() {
    this._authService
      .getUserDetails()
      .then((res: any) => {
        this.initialLetter = res.data.firstName.charAt(0) + res.data.lastName.charAt(0);
      })
      .catch((err: any) => {});
  }
}
