import { Component, OnInit, TemplateRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "src/app/common-components/dialog/dialog.component";
import { ITable } from "src/app/model/table";
import { CustomerService } from "src/app/services/customer.service";
import { NotifyService } from "src/app/services/notify.service";

@Component({
  selector: "app-customer",
  templateUrl: "./customer.component.html",
  styleUrls: ["./customer.component.scss"]
})
export class CustomerComponent implements OnInit {
  table: ITable = {
    rows: [
      {
        width: 30,
        type: "text",
        name: "Number",
        value: "phoneNumber"
      },
      {
        width: 25,
        type: "text",
        name: "Last Survey",
        value: "lastFilledSurvey"
      },
      {
        width: 10,
        type: "text",
        name: "Total Survey",
        value: "totalSurvey"
      }
    ],
    navigation: ["/", "dashboard", "customerDetails"],
    actions: []
  };
  isLoading: boolean = false;
  searchValue: string = "";
  pagination = {
    currentPage: 1,
    totalpage: null,
    totalPages: [],
    disablePrev: null,
    disableNext: null
  };
  paginationConfig = {
    total: null,
    limit: 10,
    page: 1,
    pages: null
  };
  customerList: any = [];
  dialogRef: any;
  filterObject: any = {
    category: "",
    survey: "",
    status: "",
    timelyResponse: ""
  };
  isFilterApplied: boolean = false;
  surveyList: any = [];

  constructor(private dialog: MatDialog, private _customerService: CustomerService, private _notificationService: NotifyService) {}

  ngOnInit() {
    document.getElementById("module-title")!.innerHTML = "Customer";
    this.getCustomerList();
    this.getSurveyFromCategory();
  }

  searchEvent(search: any) {
    this.searchValue = search;
    this.paginationConfig.page = 1;
    this.paginationConfig.limit = 10;
    this.getCustomerList();
  }

  changePagination(value: any) {
    switch (value.type) {
      case "page":
        this.paginationConfig.page = value.value;
        this.getCustomerList();
        break;
      case "limit":
        this.paginationConfig.page = 1;
        this.paginationConfig.limit = value.value;
        this.getCustomerList();
        break;
    }
  }

  openFilterModel(filtrerModel: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: "Filter",
        template: filtrerModel
      },
      width: "700px",
      height: "auto"
    });
  }

  applyFilter() {
    this.getCustomerList(this.filterObject);
    this.dialogRef.close();
    this.isFilterApplied = true;
  }

  async getSurveyFromCategory() {
    try {
      const response: any = await this._customerService.getSurveyFromCategory(this.filterObject.category);
      this.surveyList = response.data;
    } catch (error: any) {
      console.log(error);
      this._notificationService.sendNotification("error", error.error?.message ? error.error.message : "Something went wrong!");
    }
  }

  getCustomerList(filterObject?: any) {
    this.isLoading = true;
    this._customerService
      .getCustomersList(this.paginationConfig, this.searchValue, filterObject)
      .then((response: any) => {
        this.customerList = response.data;
        this.paginationConfig = {
          total: response.totalData,
          limit: response.limit,
          page: response.page,
          pages: response.totalPages
        };
        this.isLoading = false;
      })
      .catch((err: any) => {
        this.isLoading = false;
        this._notificationService.sendNotification("error", err.error?.message ? err.error.message : "Something went wrong!");
      });
  }

  clearFilter() {
    if (this.isFilterApplied) {
      this.filterObject = {
        category: "",
        survey: "",
        status: "",
        timelyResponse: ""
      };
      this.isFilterApplied = false;
      this.getCustomerList();
      this.dialogRef.close();
    }
  }
}
