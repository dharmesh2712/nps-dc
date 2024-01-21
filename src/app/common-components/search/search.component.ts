import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent {
  @Output() searchEvent = new EventEmitter<any>();
  @Output() filter = new EventEmitter<any>();
  @Input() isFilter: boolean = false;
  @Input() searchText: string = "";
  @Input() isAccent: boolean = false;

  search(value: any, event?: any) {
    if (event) {
      if (!event.srcElement.value.trim() && event.keyCode === 8) {
        this.searchEvent.emit("");
        return;
      }
    }
    if (!value.trim()) {
      return;
    }
    if (event) {
      if (event.keyCode === 8 || event.keyCode === 46) {
        if (value.length === 0) {
          this.searchEvent.emit("");
        }
      }
      if (event.keyCode === 13) {
        this.searchEvent.emit(value);
      }
    } else {
      if (value.trim()) {
        this.searchEvent.emit(value);
      } else if (!value.length) {
        this.searchEvent.emit("");
      }
    }
  }
  ngOnDestroy(): void {}

  emitFilter() {
    this.filter.emit("");
  }
}
