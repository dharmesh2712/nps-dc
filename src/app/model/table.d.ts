export interface ITable {
  rows: Array<{
    width: number;
    type: string;
    name: string;
    value: string;
    icon?: string;
    sortIcon?: string;
  }>;
  navigation?: Array<string>;
  isCampaignAction?: boolean;
  isCheckBox?: boolean;
  moduleName?: string;
  isSwitch?: boolean;
  isGray?: boolean;
  actions?: Array<{
    type: string;
    name: string;
    icon: string;
  }>;
  queryParams?: any;
  showCheckedCount?: boolean;
  tooltip?: string;
}
