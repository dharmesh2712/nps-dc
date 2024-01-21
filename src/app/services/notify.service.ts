import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root"
})
export class NotifyService {
  constructor(private snackBar: MatSnackBar) {}

  sendNotification(type: string, data: string) {
    this.snackBar.dismiss();
    switch (type) {
      case "error":
        this.snackBar.open(data, "", {
          horizontalPosition: "right",
          duration: 3000,
          panelClass: ["snack-error"]
        });
        break;
      case "success":
        this.snackBar.open(data, "", {
          horizontalPosition: "right",
          duration: 3000,
          panelClass: ["snack-success"]
        });
        break;
      case "warning":
        this.snackBar.open(data, "", {
          horizontalPosition: "right",
          duration: 3000,
          panelClass: ["snack-warning"]
        });
        break;
      case "info":
        this.snackBar.open(data, "", {
          horizontalPosition: "right",
          duration: 3000,
          panelClass: ["snack-info"]
        });
        break;
    }
  }
}
