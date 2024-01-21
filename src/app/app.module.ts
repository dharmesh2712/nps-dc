import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import "chartjs-plugin-datalabels";
import { NgChartsModule } from "ng2-charts";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./common-components/login/login.component";
import { DashboardModule } from "./dashboard/dashboard.module";
import { MaterialModule } from "./material.module";
import { SharedModule } from "./utils/shared.module";

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    DashboardModule,
    HttpClientModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
