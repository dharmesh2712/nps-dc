import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"]
})
export class PaginationComponent implements OnInit, OnChanges {
  @Output() changePagination = new EventEmitter<any>();
  @Input() pagination: any;
  @Input() paginationConfig: any;

  ngOnInit() {
    this.setConfig(this.paginationConfig);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["paginationConfig"]?.previousValue) {
      this.setConfig(this.paginationConfig);
    }
  }

  changePage(pageValue: any) {
    if (this.pagination.currentPage !== pageValue) {
      this.pagination.currentPage = pageValue;
      this.changePagination.emit({ type: "page", value: pageValue });
    }
  }

  nextPage() {
    if (!this.pagination.disableNext) {
      this.changePage(this.pagination.currentPage + 1);
    }
  }

  prevPage() {
    if (!this.pagination.disablePrev) {
      this.changePage(this.pagination.currentPage - 1);
    }
  }

  setConfig(result: any) {
    this.pagination.currentPage = result.page;
    this.pagination.totalpage = result.pages;
    if (result.page > result.pages) {
      this.changePage(1);
    }
    this.pagination.disablePrev = this.pagination.currentPage === 1;
    this.pagination.disableNext = this.pagination.currentPage === this.pagination.totalpage;
    let count = 0;
    this.pagination.totalPages = [];
    if (this.pagination.totalpage > 5) {
      for (
        let i = this.pagination.currentPage + 5 <= this.pagination.totalpage ? this.pagination.currentPage : this.pagination.totalpage - 4;
        i <= (this.pagination.currentPage + 5 <= result.pages ? this.pagination.currentPage + 5 : this.pagination.totalpage);
        i++
      ) {
        count++;
        if (count > 5 || i > this.pagination.totalpage) {
          break;
        }
        this.pagination.totalPages.push({
          no: i,
          status: i === result["page"]
        });
      }
    } else {
      for (let i = 1; i <= result["pages"]; i++) {
        this.pagination.totalPages.push({
          no: i,
          status: i === result["page"]
        });
      }
    }
  }

  changeLimit(limitChange: any) {
    this.changePagination.emit({ type: "limit", value: limitChange.value });
  }

  showPaginationDetail() {
    let pageTotal =
      this.paginationConfig.page * this.paginationConfig.limit < this.paginationConfig.total
        ? this.paginationConfig.page * this.paginationConfig.limit
        : this.paginationConfig.total;
    return (
      "Showing " +
      (this.paginationConfig.page * this.paginationConfig.limit - this.paginationConfig.limit + 1) +
      " to " +
      pageTotal +
      " of " +
      this.paginationConfig.total
    );
  }
}
