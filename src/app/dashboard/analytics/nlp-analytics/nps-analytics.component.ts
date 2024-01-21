import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import * as Chart from 'chart.js';

import { NpsAnalytics } from 'src/app/model/analytics';

interface FirstAnalyticsData {
  doughnutChartLabels: string[];
  doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'];
  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'];
}

@Component({
  selector: 'app-nps-analytics',
  templateUrl: './nps-analytics.component.html',
  styleUrls: ['./nps-analytics.component.scss'],
})
export class NlpAnalyticsComponent implements OnInit {
  @ViewChild('doughnutCanvas') doughnutCanvas!: ElementRef;
  @Input() npsAnalyticsConfig: NpsAnalytics = {} as NpsAnalytics;

  typesAnalytics: { name: string; count: number }[] = [];
  npsScoreAnalytics: FirstAnalyticsData[] = [];

  typesAnalyticsWithNameMapping: { [key: string]: string } = {
    totalResponsesCount: 'Responses',
    promotersCount: 'Promoters',
    passivesCount: 'Passives',
    detractorsCount: 'Detractors',
  };

  analyticsScoreWithNameMapping: { [key: string]: string } = {
    ctiScore: 'CTI',
    tnpsScore: 'NPS',
    tsatScore: 'T-SAT',
  };

  public pieChartPlugins: Chart.Plugin[] = [
    {
      id: 'before',
      beforeInit: function (chart: any, options: any) {
        console.log('chart');
        console.log(chart);
        chart.legend.right = 100;
        // chart.legend.afterFit = function () {
        //   this.paddingLeft += 120;
        // };
      },
    },
  ];

  ngOnInit() {
    Object.keys(this.typesAnalyticsWithNameMapping).forEach((key, index) => {
      this.typesAnalytics.push({
        name: this.typesAnalyticsWithNameMapping[key],
        count: this.npsAnalyticsConfig[key as keyof NpsAnalytics],
      });
    });
    Object.keys(this.analyticsScoreWithNameMapping).forEach((key) => {
      this.createChart(
        this.npsAnalyticsConfig[key as keyof NpsAnalytics],
        this.analyticsScoreWithNameMapping[key]
      );
    });
  }

  createChart(label: number, chartName: string) {
    this.npsScoreAnalytics.push({
      doughnutChartLabels: [`${Number(label).toFixed(2)}%`],
      doughnutChartDatasets: [
        {
          data: [label, 100 - label],
          backgroundColor: ['rgb(245, 145, 91,1)', 'rgb(245, 145, 91,0.1)'],
          label: 'Series A',
        },
      ],
      doughnutChartOptions: {
        cutout: 80,
        responsive: false,
        circumference: 180,
        rotation: 270,
        events: [],
        plugins: {
          title: {
            display: true,
            text: chartName,
            color: '#002f51',
            position: 'bottom',
            align: 'center',
            padding: 8,
            fullSize: true,
            font: {
              size: 30,
              weight: 'bold',
              family: 'Ubuntu, sans-serif',
            },
          },
          legend: {
            position: 'chartArea',
            align: 'center',
            maxWidth: 10,
            labels: {
              font: {
                size: 20,
              },
              boxWidth: 0,
              textAlign: 'center',
            },
          },
        },
      },
    });
  }
}
