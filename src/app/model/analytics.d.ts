export interface NpsAnalytics {
  ctiScore: number;
  detractorsCount: number;
  passivesCount: number;
  promotersCount: number;
  tnpsScore: number;
  totalResponsesCount: number;
  tsatScore: number;
}

export interface NpsAnalyticsOvertime {
  graphData: [];
}

export interface NpsTopFiveCategories {
  categoryName: string;
  detractorsCount: number;
  passivesCount: number;
  promotersCount: number;
}
