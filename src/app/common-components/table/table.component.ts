import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { Router } from "@angular/router";
import { ITable } from "src/app/model/table";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"]
})
export class TableComponent implements OnInit, OnDestroy, OnChanges {
  @Output() onAction = new EventEmitter<any>();
  @Output() onNavigation = new EventEmitter<any>();
  @Output() openPreviewTemplate = new EventEmitter();
  @Input() data: any;
  @Input() table: any;
  @Input() statusColor: any;
  @Input() isNotFireEditWithNavigatipn: any;
  @Input() tableType: any;
  @Input() templateData: any;
  isAllChecked = false;
  isHideMainTooltip = false;
  checkCount = 0;
  statusColors: any = {
    1: "draft",
    2: "published"
  };

  constructor(public _router: Router) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {}

  ngOnDestroy(): void {}

  performAction(type: any, index: number) {
    this.onAction.emit({ type: type, index: index });
  }
  menuClick(status: number) {
    if (this.table.moduleName == "survey") {
      if (status === 1) {
        this.table.actions = [
          {
            type: "edit",
            name: "Edit",
            icon: "create"
          },
          {
            type: "delete",
            name: "Delete",
            icon: "delete"
          }
        ];
      }
      if (status === 2) {
        this.table.actions = [
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
            type: "view",
            name: "View",
            icon: "visibility"
          }
        ];
      }
    }
  }
  openNavigation(id: number, index: number) {
    if (!this.isNotFireEditWithNavigatipn) {
      this._router.navigate(this.table.navigation, { queryParams: { id: id } });
    }
  }
}
