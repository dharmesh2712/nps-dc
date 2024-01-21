import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { CategoryService } from 'src/app/services/category.service';
import { CustomerService } from 'src/app/services/customer.service';
import { NpsAnalytics, NpsTopFiveCategories } from '../../model/analytics.d';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {
  npsAnalytics!: NpsAnalytics;
  selectedTypeOfAnalytics: string = 'all';
  surveyList: any[] = [];
  npsOverTimeAnalyticsData: any[] = [];
  npsMainAnalytics: any = {
    category: '',
    survey: '',
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(),
    categoryList: [],
    surveyList: [],
  };
  npsOverTimeAnalytics: any = {
    category: '',
    survey: '',
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(),
    categoryList: [],
    surveyList: [],
  };
  npsTopFiveCategorisAnalytics: any = {
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(),
  };
  npsTopFiveCategorisAnalyticsData: NpsTopFiveCategories[] = [];
  npsRespondedCompletionRate: any = {
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(),
    region: '',
  };
  npsRespondedCompletionRateData: any = {};
  isnpsAanalytics: boolean = false;
  isNpsOverTimeAnalytics: boolean = false;
  isTopFiveCategorisAnalytics: boolean = false;
  isRespondedCompletionRate: boolean = false;
  constructor(
    private analyticsService: AnalyticsService,
    private customerService: CustomerService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    document.getElementById('module-title')!.innerHTML = 'Analytics';
    this.getAnalytics(
      'all',
      new Date(new Date().setMonth(new Date().getMonth() - 1)),
      new Date()
    );
    this.getCategoryList();
    this.getSurveyList();
    this.getRespondedCompletionRate();
    this.getTopFiveCategorisAnalytics();
  }

  getAnalytics(
    analyticsType: string,
    startDate?: any,
    endDate?: any,
    surveyId?: any,
    categoryId?: any,
    regionId?: any
  ) {
    let sDate: any = moment(startDate).format('YYYY-MM-DD');
    sDate = moment(sDate).hours(0);
    sDate = moment(sDate).minutes(0);
    sDate = moment(sDate).seconds(0);
    sDate = moment(sDate).milliseconds(0);
    let eDate: any = moment(endDate).format('YYYY-MM-DD');
    eDate = moment(eDate).add('23', 'hours');
    eDate = moment(eDate).add('59', 'minutes');
    eDate = moment(eDate).add('59', 'seconds');
    console.log('444', this.selectedTypeOfAnalytics);
    if (
      this.selectedTypeOfAnalytics === 'all' ||
      this.selectedTypeOfAnalytics === 'npsAnalytics'
    ) {
      console.log('******');
      this.isnpsAanalytics = true;
    }
    if (
      this.selectedTypeOfAnalytics === 'all' ||
      this.selectedTypeOfAnalytics === 'npsOverTime'
    ) {
      console.log('%%%%%');
      this.isNpsOverTimeAnalytics = true;
    }

    this.analyticsService
      .getAnalytics({
        startDate: new Date(sDate).toISOString() || '',
        endDate: new Date(eDate).toISOString() || '',
        surveyId: surveyId || '',
        categoryId: categoryId || '',
      })
      .then(
        (res) => {
          if (
            this.selectedTypeOfAnalytics === 'all' ||
            this.selectedTypeOfAnalytics === 'npsAnalytics'
          ) {
            console.log('^^^^^^^');
            this.npsAnalytics = {
              ctiScore: res.ctiScore,
              detractorsCount: res.detractorsCount,
              passivesCount: res.passivesCount,
              promotersCount: res.promotersCount,
              tnpsScore: res.tnpsScore,
              totalResponsesCount: res.totalResponsesCount,
              tsatScore: res.tsatScore,
            };
            this.isnpsAanalytics = false;
          }
          if (
            this.selectedTypeOfAnalytics === 'all' ||
            this.selectedTypeOfAnalytics === 'npsOverTime'
          ) {
            console.log('{{{{');
            this.npsOverTimeAnalyticsData = res.graphData;
            this.isNpsOverTimeAnalytics = false;
          }
        },
        (err) => {
          console.log(err);
          this.isnpsAanalytics = false;
          this.isNpsOverTimeAnalytics = false;
        }
      );
  }

  getSurveyList(selectedCategory?: string) {
    if (this.selectedTypeOfAnalytics === 'npsAnalytics') {
      this.npsMainAnalytics.surveyList = [];
    }
    if (this.selectedTypeOfAnalytics === 'npsOverTimeAnalytics') {
      this.npsOverTimeAnalytics.surveyList = [];
    }
    this.customerService.getSurveyFromCategory(selectedCategory ?? '').then(
      (res: any) => {
        const responseSurveyList: any = [];
        res.data.forEach((element: any) => {
          responseSurveyList.push({
            surveyId: element.surveyId,
            surveyName: element.surveyName,
          });
        });
        if (this.selectedTypeOfAnalytics === 'all') {
          this.npsMainAnalytics.surveyList = [...responseSurveyList];
          this.npsOverTimeAnalytics.surveyList = [...responseSurveyList];
        }
        if (this.selectedTypeOfAnalytics === 'npsAnalytics') {
          this.npsMainAnalytics.surveyList = [...responseSurveyList];
        }
        if (this.selectedTypeOfAnalytics === 'npsOverTimeAnalytics') {
          this.npsOverTimeAnalytics.surveyList = [...responseSurveyList];
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getCategoryList() {
    this.categoryService
      .getCategoryList(
        {
          page: 1,
          limit: 2000,
        },
        ''
      )
      .then((res: any) => {
        res.data.forEach((element: any) => {
          this.npsMainAnalytics.categoryList.push({
            categoryId: element.categoryId,
            categoryName: element.categoryName,
          });
          this.npsOverTimeAnalytics.categoryList.push({
            categoryId: element.categoryId,
            categoryName: element.categoryName,
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getTopFiveCategorisAnalytics(startDate?: any, endDate?: any) {
    let sDate: any = moment(startDate).format('YYYY-MM-DD');
    sDate = moment(sDate).hours(0);
    sDate = moment(sDate).minutes(0);
    sDate = moment(sDate).seconds(0);
    sDate = moment(sDate).milliseconds(0);
    let eDate: any = moment(endDate).format('YYYY-MM-DD');
    eDate = moment(eDate).add('23', 'hours');
    eDate = moment(eDate).add('59', 'minutes');
    eDate = moment(eDate).add('59', 'seconds');
    this.isTopFiveCategorisAnalytics = true;
    this.analyticsService
      .getTopFiveCategorisAnalytics({
        startDate: new Date(sDate).toISOString() || '',
        endDate: new Date(eDate).toISOString() || '',
      })
      .then(
        (res) => {
          this.npsTopFiveCategorisAnalyticsData = res;
          this.isTopFiveCategorisAnalytics = false;
        },
        (err) => {
          console.log(err);
          this.isTopFiveCategorisAnalytics = false;
        }
      );
  }

  dateChange(event: any, type: string) {
    this.selectedTypeOfAnalytics = type;
    if (
      this.selectedTypeOfAnalytics === 'npsAnalytics' ||
      this.selectedTypeOfAnalytics === 'npsOverTime'
    ) {
      this.getAnalytics(
        type,
        event.startDate,
        event.endDate,
        event.survey || '',
        event.category || '',
        event.region || ''
      );
    }
    if (this.selectedTypeOfAnalytics === 'topCategory') {
      this.getTopFiveCategorisAnalytics(event.startDate, event.endDate);
    }
    if (this.selectedTypeOfAnalytics === 'respondRate') {
      this.getRespondedCompletionRate(event.startDate, event.endDate);
    }
  }

  categoryChange(event: any, type: string) {
    this.selectedTypeOfAnalytics = type;
    this.getSurveyList(event || '');
    this.getAnalytics(type, undefined, undefined, undefined, event || '');
  }

  surveyChange(event: any, type: string) {
    this.selectedTypeOfAnalytics = type;
    this.getAnalytics(type, undefined, undefined, event || '');
  }

  getRespondedCompletionRate(startDate?: any, endDate?: any, regionId?: any) {
    let sDate: any = moment(startDate).format('YYYY-MM-DD');
    sDate = moment(sDate).hours(0);
    sDate = moment(sDate).minutes(0);
    sDate = moment(sDate).seconds(0);
    sDate = moment(sDate).milliseconds(0);
    let eDate: any = moment(endDate).format('YYYY-MM-DD');
    eDate = moment(eDate).add('23', 'hours');
    eDate = moment(eDate).add('59', 'minutes');
    eDate = moment(eDate).add('59', 'seconds');
    this.isRespondedCompletionRate = true;
    this.analyticsService
      .getRespondedCompletionRate({
        startDate: new Date(sDate).toISOString() || '',
        endDate: new Date(eDate).toISOString() || '',
        regionId: regionId || '',
      })
      .then(
        (res) => {
          this.npsRespondedCompletionRateData = res;
          this.isRespondedCompletionRate = false;
        },
        (err) => {
          this.isRespondedCompletionRate = false;
          console.log(err);
        }
      );
  }

  regionChanged(event: any, type: string) {
    this.getRespondedCompletionRate(undefined, undefined, event);
  }
}
