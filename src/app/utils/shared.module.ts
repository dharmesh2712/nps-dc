import { NgModule } from "@angular/core";
import { MaterialModule } from "../material.module";
import { PaginationComponent } from "../common-components/pagination/pagination.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SearchComponent } from "../common-components/search/search.component";
import { DialogComponent } from "../common-components/dialog/dialog.component";
import { NavigationComponent } from "../common-components/navigation/navigation.component";
import { RouterModule } from "@angular/router";
import { CounterCharactersPipe } from "./pipe/counter.pipe";
import { LoaderComponent } from "../common-components/loader/loader.component";

@NgModule({
  declarations: [PaginationComponent, SearchComponent, DialogComponent, NavigationComponent, CounterCharactersPipe, LoaderComponent],
  imports: [MaterialModule, FormsModule, CommonModule, RouterModule],
  exports: [PaginationComponent, SearchComponent, CounterCharactersPipe, LoaderComponent]
})
export class SharedModule {}
