import { Component, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { saveAs } from "file-saver";
import { NotifyService } from "src/app/services/notify.service";
import { SurveyService } from "src/app/services/survey.service";
import { DialogComponent } from "../../common-components/dialog/dialog.component";
import { ITable } from "../../model/table";

@Component({
  selector: "app-survey",
  templateUrl: "./survey.component.html",
  styleUrls: ["./survey.component.scss"]
})
export class SurveyComponent {
  table: ITable = {
    rows: [
      {
        width: 35,
        type: "text",
        name: "Name",
        value: "surveyName"
      },
      {
        width: 15,
        type: "date",
        name: "Created Date",
        value: "createdDate"
      },
      {
        width: 15,
        type: "text",
        name: "Category",
        value: "categoryName"
      },
      {
        width: 15,
        type: "statusWithName",
        name: "Status",
        value: "surveyStatus"
      },

      {
        width: 15,
        type: "text",
        name: "Total Response",
        value: "totalResponse"
      }
    ],
    isCheckBox: false,
    moduleName: "survey",
    actions: [
      {
        type: "edit",
        name: "Edit",
        icon: "create"
      },
      {
        type: "flow_payload",
        name: "Flow Payload",
        icon: "device_hub"
      },
      {
        type: "api_payload",
        name: "Api Payload",
        icon: "api"
      },
      {
        type: "delete",
        name: "Delete",
        icon: "delete"
      },
      {
        type: "view",
        name: "View",
        icon: "visibility"
      }
    ]
  };

  surveyList: any = [];
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
  @ViewChild("flowPayload", { static: false })
  flowPayload: TemplateRef<any> | undefined;
  @ViewChild("apiPayload", { static: false })
  apiPayload: TemplateRef<any> | undefined;
  dialogRef: any;
  surveyName: string = "";
  category: string = "";
  surveyCreation: any = {
    Name: "",
    CategoryId: "",
    Questions: []
  };
  selectedSurveyApiPayloadId: string = "";
  searchValue: any = "";
  flowPayloadObj: any;
  apiPayloadObj: any;
  isLoading: boolean = false;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private _notificationService: NotifyService,
    private _surveyService: SurveyService
  ) {}

  ngOnInit() {
    document.getElementById("module-title")!.innerHTML = "Survey";
    this.getSurveyList();
  }

  changePagination(value: any) {
    switch (value.type) {
      case "page":
        this.paginationConfig.page = value.value;
        this.getSurveyList();
        break;
      case "limit":
        this.paginationConfig.page = 1;
        this.paginationConfig.limit = value.value;
        this.getSurveyList();
        break;
    }
  }
  searchEvent(search: any) {
    this.searchValue = search;
    this.paginationConfig.page = 1;
    this.paginationConfig.limit = 10;
    this.getSurveyList();
  }

  createSurvey(surveyCreationTemplate: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: "Create Survey",
        template: surveyCreationTemplate
      },
      width: "700px",
      height: "auto"
    });
  }

  actonPerform(action: any) {
    if (action.type === "edit") {
      this.router.navigate(["edit"], { queryParams: { id: `${this.surveyList[action.index].surveyId}` }, relativeTo: this.route });
    }
    if (action.type === "delete") {
      this.dialogRef = this.dialog.open(DialogComponent, {
        data: {
          title: "Delete",
          template: undefined,
          isDelete: true,
          delete: {
            text: this.surveyList[action.index]?.surveyName ? this.surveyList[action.index]?.surveyName : ""
          }
        },
        width: "700px",
        height: "auto",
        autoFocus: false
      });
      this.dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this._surveyService
            .deleteSurvey(this.surveyList[action.index].surveyId)
            .then((res: any) => {
              this.paginationConfig.page = 1;
              this.paginationConfig.limit = 10;
              this.getSurveyList();
            })
            .catch((error: any) => {
              this._notificationService.sendNotification("error", error.error?.message ? error.error.message : "Something went wrong!");
            });
        }
      });
    }
    if (action.type === "flow_payload") {
      this._surveyService
        .getSurveyFormJSON(this.surveyList[action.index].surveyId)
        .then((res: any) => {
          this.flowPayloadObj = JSON.parse(`${JSON.stringify(this.removeNullValues(res.data))}`);
          this.dialogRef = this.dialog.open(DialogComponent, {
            data: {
              title: "Flow Payload",
              template: this.flowPayload
            },
            width: "900px",
            height: "auto",
            autoFocus: false
          });
        })
        .catch(error => {
          this._notificationService.sendNotification("error", error.error?.message ? error.error.message : "Something went wrong!");
        });
    }
    if (action.type === "api_payload") {
      this.selectedSurveyApiPayloadId = this.surveyList[action.index].surveyId;
      this._surveyService
        .getSurveyApiPayload(this.surveyList[action.index].surveyId)
        .then((res: any) => {
          this.apiPayloadObj = res;
          this.dialogRef = this.dialog.open(DialogComponent, {
            data: {
              title: "Api Payload",
              template: this.apiPayload
            },
            width: "900px",
            height: "auto",
            autoFocus: false
          });
        })
        .catch(error => {
          this._notificationService.sendNotification("error", error.error?.message ? error.error.message : "Something went wrong!");
        });
      this.dialogRef.afterClosed().subscribe((result: any) => {
        this.selectedSurveyApiPayloadId = "";
      });
    }
    if (action.type === "view") {
      this.router.navigate(["view"], { queryParams: { id: `${this.surveyList[action.index].surveyId}` }, relativeTo: this.route });
    }
  }

  async getSurveyList() {
    this.isLoading = true;
    try {
      const response: any = await this._surveyService.getSurveyList(this.paginationConfig, this.searchValue);
      this.surveyList = response.data;
      this.paginationConfig = {
        total: response.totalData,
        limit: response.limit,
        page: response.page,
        pages: response.totalPages
      };
      this.isLoading = false;
    } catch (error: any) {
      this._notificationService.sendNotification("error", error.error?.message ? error.error.message : "Something went wrong!");
      this.isLoading = false;
    }
  }

  removeNullValues(data: any): any {
    if (Array.isArray(data)) {
      return data.map(item => this.removeNullValues(item)).filter(item => item !== null);
    } else if (typeof data === "object" && data !== null) {
      const result: any = {};
      for (const key in data) {
        let convertedKey = key;
        if (key === "dataSource") {
          convertedKey = "data-source";
        } else if (key === "inputType") {
          convertedKey = "input-type";
        } else if (key === "onClickAction") {
          convertedKey = "on-click-action";
        } else if (key === "helperText") {
          convertedKey = "helper-text";
        }
        const value = this.removeNullValues(data[key]);
        if (value !== null) {
          result[convertedKey] = value;
        }
      }
      if (result.scalingFactor !== null) {
        delete result.scalingFactor;
      }
      return result;
    } else {
      return data;
    }
  }

  saveSurveyName() {
    if (!this.surveyCreation.Name.trim() || !this.surveyCreation.CategoryId.trim()) {
      this._notificationService.sendNotification("error", "Please enter survey name and category name.");
      return;
    }
    this._surveyService
      .createSurvey(this.surveyCreation)
      .then((res: any) => {
        this.dialogRef.close();
        this.router.navigate(["create"], {
          queryParams: { id: res.data },
          relativeTo: this.route
        });
        this._notificationService.sendNotification("success", "Survey created successfully.");
        this.surveyCreation.name = "";
        this.surveyCreation.categoryId = "";
      })
      .catch((error: any) => {
        this._notificationService.sendNotification("error", error.error?.message ? error.error.message : "Something went wrong!");
      });
  }

  copyJSONToClip(flowPayloadCopy: any) {
    flowPayloadCopy.select();
    document.execCommand("copy");
    flowPayloadCopy.setSelectionRange(0, 0);
    this._notificationService.sendNotification("success", "JSON copied successfully.");
    this.flowPayloadObj = {};
    this.dialogRef.close();
  }

  downloApiPayload() {
    this._surveyService
      .surveyApiPayloadForDownload(this.selectedSurveyApiPayloadId)
      .then((res: any) => {
        const blob = new Blob([JSON.stringify(res)], { type: "text/json" });
        saveAs(blob, "api.json");
      })
      .catch((error: any) => {
        this._notificationService.sendNotification("error", error.error?.message ? error.error.message : "Something went wrong!");
      });
  }
}
