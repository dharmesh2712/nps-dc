import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"]
})
export class NavigationComponent {
  @Output() onNavigation = new EventEmitter<any>();
  @Input() navigation: any;
  @Input() icon: any;
  @Input() current: any;

  ChangeNavigation(index: any) {
    this.onNavigation.emit(index);
  }
}
