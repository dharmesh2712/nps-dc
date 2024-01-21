import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CustomerService } from "src/app/services/customer.service";
import { NotifyService } from "src/app/services/notify.service";

@Component({
  selector: "app-customer-details",
  templateUrl: "./customer-details.component.html",
  styleUrls: ["./customer-details.component.scss"]
})
export class CustomerDetailsComponent {
  isScreenExpansionOpen: boolean = false;
  customerId = "";
  customerDetails: any = {};

  constructor(private router: ActivatedRoute, private _customerService: CustomerService, private _notificationService: NotifyService) {}

  ngOnInit() {
    document.getElementById("module-title")!.innerHTML = "Customer";
    this.router.queryParams.subscribe((params: any) => {
      this.customerId = params.id;
    });
    this.getCustomerDetails();
  }

  getCustomerDetails() {
    this._customerService
      .getCustomerDetails(this.customerId)
      .then((res: any) => {
        this.customerDetails = res;
        console.log(this.customerDetails);
      })
      .catch((err: any) => {
        this._notificationService.sendNotification("error", err.error?.message ? err.error.message : "Something went wrong!");
      });
  }
}
