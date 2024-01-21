import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-respond-rate',
  templateUrl: './respond-rate.component.html',
  styleUrls: ['./respond-rate.component.scss'],
})
export class RespondRateComponent {
  @Input() npsRespondedCompletionRateData: any = {};
  public doughnutChartLabels: string[] = [
    'Promoters',
    'Detractors',
    'Passives',
  ];
  public doughnutChartData: any = [];
  chartOptions: any = {
    responsive: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  ngOnInit() {
    console.log(this.npsRespondedCompletionRateData);
    this.doughnutChartData = [
      {
        data: [
          this.npsRespondedCompletionRateData.promotersPercentage,
          this.npsRespondedCompletionRateData.passivesPercentage,
          this.npsRespondedCompletionRateData.detractorsPercentage,
        ],
        label: 'No of sales',
        backgroundColor: ['#62D188', '#FEC237', '#F75858'],
        hoverOffset: 4,
      },
    ];
  }
}
