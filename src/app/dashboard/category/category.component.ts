import { Component, TemplateRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "src/app/common-components/dialog/dialog.component";
import { ITable } from "src/app/model/table";
import { CategoryService } from "src/app/services/category.service";
import { NotifyService } from "src/app/services/notify.service";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"]
})
export class CategoryComponent {
  searchValue: any = "";
  table: ITable = {
    rows: [
      {
        width: 45,
        type: "text",
        name: "Name",
        value: "categoryName"
      },
      {
        width: 25,
        type: "date",
        name: "Created Date",
        value: "createdDate"
      },
      {
        width: 25,
        type: "text",
        name: "No of Survey",
        value: "totalSurvey"
      }
    ],
    isCheckBox: false,
    moduleName: "category",
    actions: [
      {
        type: "edit",
        name: "Edit",
        icon: "create"
      }
    ]
  };
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
  isLoading: boolean = false;
  categoryList: any = [];
  dialogRef: any;
  categoryName: string = "";
  isUpdateCategory: boolean = false;

  constructor(private dialog: MatDialog, private categoryService: CategoryService, private _notificationService: NotifyService) {}

  ngOnInit() {
    document.getElementById("module-title")!.innerHTML = "Category";
    this.getCategoryList();
  }

  searchEvent(search: any) {
    this.searchValue = search;
    this.paginationConfig.page = 1;
    this.paginationConfig.limit = 10;
    this.getCategoryList();
  }

  actonPerform(action: any, categoryEditTemplate: TemplateRef<any>) {
    if (action.type === "edit") {
      this.isUpdateCategory = true;
      console.log(this.isUpdateCategory);
      this.categoryName = this.categoryList[0].categoryName;
      this.dialogRef = this.dialog.open(DialogComponent, {
        data: {
          title: "Edit Category",
          template: categoryEditTemplate
        },
        width: "700px",
        height: "auto"
      });
      this.dialogRef.afterClosed().subscribe(() => {
        this.isUpdateCategory = false;
        this.categoryName = "";
      });
    }
  }

  changePagination(value: any) {
    switch (value.type) {
      case "page":
        this.paginationConfig.page = value.value;
        this.getCategoryList();
        break;
      case "limit":
        this.paginationConfig.page = 1;
        this.paginationConfig.limit = value.value;
        this.getCategoryList();
        break;
    }
  }
  getCategoryList() {
    this.isLoading = true;
    this.categoryService
      .getCategoryList(this.paginationConfig, this.searchValue)
      .then((res: any) => {
        this.categoryList = res.data;
        this.paginationConfig = {
          total: res.totalData,
          limit: res.limit,
          page: res.page,
          pages: res.totalPages
        };
        this.isLoading = false;
      })
      .catch((error: any) => {
        console.log(error);
        this.isLoading = false;
        this._notificationService.sendNotification("error", error.error?.message ? error.error.message : "Something went wrong!");
      });
  }

  createCategoryTemplateOpen(categoryCreationTemplate: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: "Create Category",
        template: categoryCreationTemplate
      },
      width: "700px",
      height: "auto"
    });
  }

  createCategory() {
    if (this.isUpdateCategory) {
      this.categoryService
        .updateCategory(this.categoryName, this.categoryList[0].categoryId)
        .then((res: any) => {
          this.dialogRef.close();
          this.isUpdateCategory = false;
          this.getCategoryList();
        })
        .catch((error: any) => {
          this._notificationService.sendNotification("error", error.error?.message ? error.error.message : "Something went wrong!");
        });
    } else {
      this.categoryService
        .createCategory(this.categoryName)
        .then((res: any) => {
          this.categoryName = "";
          this.dialogRef.close();
          this.getCategoryList();
        })
        .catch((error: any) => {
          this._notificationService.sendNotification("error", error.error?.message ? error.error.message : "Something went wrong!");
        });
    }
  }
}
