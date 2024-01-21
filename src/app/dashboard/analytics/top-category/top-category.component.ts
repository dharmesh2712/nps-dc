import { Component, Input } from "@angular/core";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { NpsTopFiveCategories } from "src/app/model/analytics";

@Component({
  selector: "app-top-category",
  templateUrl: "./top-category.component.html",
  styleUrls: ["./top-category.component.scss"]
})
export class TopCategoryComponent {
  @Input() npsTopFiveCategorisAnalyticsData!: NpsTopFiveCategories[];

  public barChartLabels: string[] = [];
  ngOnInit() {
    this.createChart(this.npsTopFiveCategorisAnalyticsData);
  }

  createChart(topFiveCategroyData: NpsTopFiveCategories[]) {
    this.barChartLabels = topFiveCategroyData.map(data => data.categoryName);
    this.barChartData = [
      {
        data: topFiveCategroyData.map(data => data.promotersCount || null),
        label: "Promoters",
        skipNull: true,
        backgroundColor: "#62D188",
        color: "#ffffff"
      },
      {
        data: topFiveCategroyData.map(data => data.passivesCount || null),
        label: "Passives",
        skipNull: true,
        backgroundColor: "#FEC237",
        color: "#ffffff"
      },
      {
        data: topFiveCategroyData.map(data => data.detractorsCount || null),
        label: "Detractors",
        skipNull: true,
        backgroundColor: "#F75858",
        color: "#ffffff"
      }
    ];
  }

  public chartPlugins = [ChartDataLabels];

  public barChartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true,
    barThickness: 55,
    plugins: {
      datalabels: {
        color: "#ffffff"
      },
      legend: {
        position: "left",
        labels: {
          boxWidth: 30,
          padding: 10
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        }
      },
      y: {
        stacked: true,
        grid: {
          display: false
        },
        ticks: {
          display: false
        }
      }
    }
  };

  public barChartType: string = "bar";
  public barChartLegend: boolean = true;

  public barChartData: any[] = [];
}
