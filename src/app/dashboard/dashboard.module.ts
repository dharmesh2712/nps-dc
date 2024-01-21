import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HeaderDropdownComponent } from "../common-components/header-dropdown/header-dropdown.component";
import { TableComponent } from "../common-components/table/table.component";
import { MaterialModule } from "../material.module";
import { ClickOutsideDirective } from "../utils/click-outside-directive.directive";
import { AnalyticsComponent } from "./analytics/analytics.component";
import { DashboardComponent } from "./dashboard.component";
import { dashboardRoutes } from "./dashboard.route";
import { ProfileComponent } from "./profile/profile.component";
import { SurveyComponent } from "./survey/survey.component";
import { SharedModule } from "../utils/shared.module";
import { EditSurveyComponent } from "./survey/edit-survey/edit-survey.component";
import { CdkMenuItemRadio, CdkMenuItemCheckbox, CdkMenuGroup, CdkMenu, CdkMenuTrigger, CdkMenuItem, CdkMenuBar } from "@angular/cdk/menu";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptor } from "../interceptors/token.interceptor";
import { CustomerComponent } from "./customer/customer.component";
import { CustomerDetailsComponent } from "./customer/customer-details/customer-details.component";
import { CategoryComponent } from "./category/category.component";
import { NlpAnalyticsComponent } from "./analytics/nlp-analytics/nps-analytics.component";
import { NpsOvertimeComponent } from "./analytics/nps-overtime/nps-overtime.component";
import { TopCategoryComponent } from "./analytics/top-category/top-category.component";
import { RespondRateComponent } from "./analytics/respond-rate/respond-rate.component";
import { NgChartsModule } from "ng2-charts";
import { GraphHeaderComponent } from "./analytics/graph-header/graph-header.component";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(dashboardRoutes),
    CdkMenuBar,
    CdkMenuItem,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuGroup,
    CdkMenuItemCheckbox,
    CdkMenuItemRadio,
    NgChartsModule
  ],
  declarations: [
    DashboardComponent,
    HeaderDropdownComponent,
    AnalyticsComponent,
    SurveyComponent,
    ProfileComponent,
    TableComponent,
    ClickOutsideDirective,
    EditSurveyComponent,
    CustomerComponent,
    CustomerDetailsComponent,
    CategoryComponent,
    NlpAnalyticsComponent,
    NpsOvertimeComponent,
    TopCategoryComponent,
    RespondRateComponent,
    GraphHeaderComponent
  ],
  exports: [DashboardComponent, HeaderDropdownComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ]
})
export class DashboardModule {}
