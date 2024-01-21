import { Component, ComponentFactoryResolver, ComponentRef, Inject, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

class DialogOverviewExampleDialog {}

@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.scss"]
})
export class DialogComponent implements OnInit {
  @ViewChild("componentTemplate", { read: ViewContainerRef, static: true })
  componentTemplate!: ViewContainerRef;

  componentRef!: ComponentRef<any>;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    private resolver: ComponentFactoryResolver,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data.component !== undefined) {
      this.componentRef = this.componentTemplate.createComponent(this.resolver.resolveComponentFactory(this.data.component));
      this.componentRef.instance.data = this.data.data;
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
