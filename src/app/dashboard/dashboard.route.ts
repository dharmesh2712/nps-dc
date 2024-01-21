import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { AnalyticsComponent } from "./analytics/analytics.component";
import { SurveyComponent } from "./survey/survey.component";
import { ProfileComponent } from "./profile/profile.component";
import { AuthGuard } from "../guards/auth.guard";
import { EditSurveyComponent } from "./survey/edit-survey/edit-survey.component";
import { CustomerComponent } from "./customer/customer.component";
import { CustomerDetailsComponent } from "./customer/customer-details/customer-details.component";
import { CategoryComponent } from "./category/category.component";

export const dashboardRoutes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    children: [
      {
        path: "",
        redirectTo: "survey",
        pathMatch: "full"
      },
      {
        path: "analytics",
        component: AnalyticsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "survey",
        component: SurveyComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "survey/create",
        component: EditSurveyComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "survey/edit",
        component: EditSurveyComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "survey/view",
        component: EditSurveyComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "customer",
        component: CustomerComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "customerDetails",
        component: CustomerDetailsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "profile",
        component: ProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "category",
        component: CategoryComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];
