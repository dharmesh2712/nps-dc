import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-header-dropdown",
  templateUrl: "./header-dropdown.component.html",
  styleUrls: ["./header-dropdown.component.scss"]
})
export class HeaderDropdownComponent {
  @Output() closeModal = new EventEmitter();
  @Output() menuClick = new EventEmitter();
  @Input() width!: number;
  ngOnInit() {
    this.width = this.width + 15;
  }

  close() {
    this.closeModal.emit(true);
  }

  btnClick(type: any) {
    this.menuClick.emit(type);
  }
}
