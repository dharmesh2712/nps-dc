import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-graph-header',
  templateUrl: './graph-header.component.html',
  styleUrls: ['./graph-header.component.scss'],
})
export class GraphHeaderComponent {
  @Input() title: string = '';
  @Input() isCategory: boolean = false;
  @Input() isSurvey: boolean = false;
  @Input() categoryList: any = [];
  @Input() surveyList: any = [];
  @Input() isRegion: boolean = false;
  @Input() isDatePicker: boolean = true;
  @Input() npsAnalyticsData: any = {};
  @Output() dateChangedEmitter = new EventEmitter();
  @Output() surveyChangedEmitter = new EventEmitter();
  @Output() categoryChangedEmitter = new EventEmitter();
  @Output() filterChangedEmitter = new EventEmitter();
  @Output() regionChangedEmitter = new EventEmitter();

  minDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 5,
    new Date().getDate()
  );
  maxDate = new Date();

  range = new FormGroup({
    start: new FormControl({ disabled: true }),
    end: new FormControl({ disabled: true }),
  });
  category: string = '';
  selectedUsecase: string = '';
  endDate: any;
  startDate: any;
  selectedRegion: string = '';
  regionList: any = ['West', 'South', 'North', 'Mumbai'];
  maxrange: number = 2;
  ngOnInit() {
    this.range.controls['start'].setValue(this.npsAnalyticsData.startDate);
    this.range.controls['end'].setValue(this.npsAnalyticsData.endDate);
  }

  regionChanged(region: string) {
    this.regionChangedEmitter.emit(region);
  }

  setStartDate(event: any) {
    this.endDate = undefined;
    if (event.value) {
      this.startDate = event.value;
      let tempdate = new Date(this.startDate);
      tempdate.setDate(tempdate.getDate() + 60);
      if (tempdate > new Date()) {
        tempdate = new Date();
      }
      this.maxDate = new Date(tempdate);
    }
  }
  setEndDate(event: any) {
    if (event.value) {
      this.endDate = event.value;
    }
    if (!this.startDate) {
      this.startDate = moment().subtract(1, 'months').startOf('day');
    }
    if (this.endDate) {
      this.changedDate({ startDate: this.startDate, endDate: this.endDate });
    }
  }
  changedDate(event: any) {
    this.dateChangedEmitter.emit(event);
  }
  surveyChanged(survey: string) {
    this.surveyChangedEmitter.emit(survey);
  }
  categoryChanged(category: string) {
    this.categoryChangedEmitter.emit(category);
  }
}
