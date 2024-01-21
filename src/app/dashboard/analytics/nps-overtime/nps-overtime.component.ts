import { DatePipe } from "@angular/common";
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from "@angular/core";
import { ChartConfiguration, ChartOptions } from "chart.js";

@Component({
  selector: "app-nps-overtime",
  templateUrl: "./nps-overtime.component.html",
  styleUrls: ["./nps-overtime.component.scss"]
})
export class NpsOvertimeComponent implements AfterViewInit {
  @ViewChild("myCanvas") ref: ElementRef | undefined;
  @Input() npsOverTimeAnalyticsData: any[] = [];
  @Input() npsOverTimeAnalyticsLabels: any[] = [];
  overTimeDate: any[] = [];
  NPSscore: any[] = [];
  gradient: any;
  public lineChartData: ChartConfiguration<"line">["data"] | undefined;
  public lineChartOptions: ChartOptions<"line"> | undefined;
  public lineChartLegend: boolean | undefined;

  ngAfterViewInit() {
    this.gradient = this.ref?.nativeElement.getContext("2d").createLinearGradient(0, 0, 0, 600);
    this.gradient.addColorStop(0, "#f56d23");
    this.gradient.addColorStop(0.6, "#ffffff");
    this.npsOverTimeAnalyticsData.forEach((element: any) => {
      this.overTimeDate.push(new DatePipe("en-US").transform(element.dayOfStatistics, "dd-MM-YYYY"));
      this.NPSscore.push(element.tnpsScore);
    });
    this.generateChart(this.overTimeDate);
  }

  generateChart(data: any[]) {
    this.lineChartData = {
      labels: data,
      datasets: [
        {
          data: this.NPSscore,
          fill: true,
          borderColor: "#f56d23",
          backgroundColor: this.gradient
        }
      ]
    };
    this.lineChartOptions = {
      responsive: false,
      scales: {
        y: {
          min: "0",
          ticks: {
            callback: function (value, index, values) {
              // Format the y-axis labels as integers
              return Number.isInteger(value) ? value : "";
            }
          }
        }
      }
    };
    this.lineChartLegend = false;
  }
}
