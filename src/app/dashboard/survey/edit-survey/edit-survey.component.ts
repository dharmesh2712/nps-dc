import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { SelectChangeEventDetail } from "@ionic/angular";
import { NotifyService } from "src/app/services/notify.service";
import { SurveyService } from "src/app/services/survey.service";
import { SurveyHelper } from "../survey.helper";

@Component({
  selector: "app-edit-survey",
  templateUrl: "./edit-survey.component.html",
  styleUrls: ["./edit-survey.component.scss"]
})
export class EditSurveyComponent implements OnInit {
  @ViewChild("createForm", { static: false }) createForm: TemplateRef<any> | undefined;
  surveyId: string = "";
  dialogRef: any;
  screenName: string = "";
  isScreenExpansionOpen: boolean = false;
  isScreenTitleExpandedFOrEditContent: boolean = false;
  isButtonTitleExpandedFOrEditContent: boolean = false;
  surveyScreensOfForms: any = [];
  formEditData: any;
  selectedFormIndex: any;
  surveyHelper = new SurveyHelper();
  listOfTextType = ["TextHeading", "TextSubheading", "TextBody", "TextCaption"];
  lisOfInputType = ["text", "password", "email", "number", "passcode", "phone"];
  helperTextContainType = ["TextInput", "TextArea", "DatePicker"];
  selectionType = ["RadioButtonsGroup", "Dropdown", "CheckboxGroup"];
  labelContainType = [...this.helperTextContainType, ...this.selectionType];
  collectionOfChildrenHover: any = [];
  totalEnterdTextCharacter: number = 0;
  totalLengthOfTextType: number = 0;
  isFocusOnScreenTitle: boolean = false;
  isDroverOpen: boolean = false;
  selectedDate: any;
  sel: any;
  scalingFactor: any = {
    TNPS: false,
    CTI: false,
    TSAT: false
  };
  isDropDownSelect: boolean = false;
  indexOfSlectedDropDown: number = 0;
  dateExample = new Date().toISOString();
  isEdit: boolean = false;
  generateAlphabet: any = {
    0: "a_abc",
    1: "b_def",
    2: "c_ghi",
    3: "d_jkl",
    4: "e_mno",
    5: "f_pqr",
    6: "g_stu",
    7: "h_vwx"
  };
  surveyFormjsonStore: any = {};
  viewSurvey: boolean = false;

  constructor(
    private dialog: MatDialog,
    private _notificationService: NotifyService,
    private router: ActivatedRoute,
    private _surveyService: SurveyService,
    private route: Router
  ) {
    this.selectedDate = new Date().toISOString();
  }

  ngOnInit() {
    document.getElementById("module-title")!.innerHTML = "Survey";

    this.router.queryParams.subscribe((params: any) => {
      this.surveyId = params.id;
    });
    if (this.route.url.includes("/edit")) {
      this.editSurveyForm();
      this.isEdit = true;
    } else if (this.route.url.includes("/view")) {
      this.editSurveyForm();
      this.viewSurvey = true;
    } else {
      this.surveyScreensOfForms.push({
        title: "Your Form",
        children: [],
        footer: {
          type: "Footer",
          label: "Continue",
          isFooterDisable: true
        }
      });
      this.surveyFormChange(0);
    }
  }

  ngAfterViewInit() {
    if (this.createForm != undefined && !this.isEdit && !this.viewSurvey) {
      this.createSurvey(this.createForm);
    }
  }

  async editSurveyForm() {
    try {
      const surveyFormResponse: any = await this._surveyService.getSurveyFormJSON(this.surveyId);
      this.addNecessaryFieldForEdit(surveyFormResponse.data);
    } catch (error: any) {
      this._notificationService.sendNotification("error", error.error?.message ? error.error.message : "Something went wrong!");
      this.route.navigate(["/dashboard/survey"]);
    }
  }

  addNecessaryFieldForEdit(surveyForm: any) {
    surveyForm.screens.forEach((screen: any) => {
      let screenTempObj: any = {};
      screenTempObj["title"] = screen.title;
      screenTempObj["children"] = [];
      screen.layout.children[0].children.forEach((children: any) => {
        if (this.helperTextContainType.includes(children.type)) {
          children["value"] = "";
          children["focusOutFLag"] = true;
        }
        if (this.selectionType.includes(children.type)) {
          children["focusOutFLag"] = true;
          children.dataSource.forEach((dataSource: any) => {
            dataSource["value"] = false;
          });
        }
        if (children.type === "Dropdown" || children.type === "RadioButtonsGroup") {
          this.scalingFactor[children.scalingFactor] = true;
        }
        if (children.type !== "Footer") {
          screenTempObj.children.push(children);
        }
        if (children.type === "Footer") {
          screenTempObj["footer"] = {
            type: "Footer",
            label: children.label,
            isFooterDisable: true
          };
        }
      });
      this.surveyScreensOfForms.push(screenTempObj);
    });
    this.surveyFormChange(0);
    if (this.createForm != undefined) {
      this.createSurvey(this.createForm);
    }
  }

  createSurvey(surveyCreationTemplate: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(surveyCreationTemplate, {
      data: {},
      width: "80vw",
      height: "auto",
      disableClose: true
    });
  }

  addScreeen(screenName: string) {
    if (this.surveyScreensOfForms.length < 8) {
      const surveyFormObj = {
        title: screenName,
        children: [],
        footer: {
          type: "Footer",
          label: "Continue"
        }
      };
      this.surveyScreensOfForms.push(surveyFormObj);
      this.screenName = "";
      this.selectedFormIndex = this.surveyScreensOfForms.length - 1;
      this.formEditData = surveyFormObj;
      this.collectionOfChildrenHover = [];
    }
  }

  selectedMenuItem(item: string) {
    if (this.formEditData.children.length < 8) {
      this.formEditData.children.push(this.surveyHelper.createSurveyChildrenyObj(item));
      this.collectionOfChildrenHover.push({
        isChildrenExpand: false
      });
      if (this.surveyScreensOfForms.length) {
        this.checkRequiredDetailsFill();
      }
    }
  }

  surveyFormChange(formIndex: number) {
    this.collectionOfChildrenHover = [];
    this.selectedFormIndex = formIndex;
    this.formEditData = this.surveyScreensOfForms[formIndex];
    this.isDropDownSelect = false;
    this.formEditData.children.forEach(() => {
      this.collectionOfChildrenHover.push({
        isChildrenExpand: false
      });
    });
  }

  addOptions(formsContentIndex: number) {
    if (this.formEditData.children[formsContentIndex].type === "Dropdown") {
      const tempStoreDataSource = this.formEditData.children[formsContentIndex].dataSource;
      let id = Number(this.formEditData.children[formsContentIndex].dataSource[tempStoreDataSource.length - 1].id);
      this.formEditData.children[formsContentIndex].dataSource.push({
        id: `Option ${tempStoreDataSource.length + 2}`,
        title: `Option ${tempStoreDataSource.length + 1}`
      });
    } else {
      const tempStoreDataSource = this.formEditData.children[formsContentIndex].dataSource;
      let id = Number(this.formEditData.children[formsContentIndex].dataSource[tempStoreDataSource.length - 1].id);
      this.formEditData.children[formsContentIndex].dataSource.push({ id: `${id + 1}`, title: `Option ${id + 2}` });
    }
  }

  async onDraft(isFromPublish?: boolean) {
    try {
      this.surveyFormjsonStore = this.createJsonDataOfForm();
      const response = await this._surveyService.saveSurvey(this.surveyFormjsonStore);
      this._notificationService.sendNotification("success", "Survey saved successfully!");
      if (!isFromPublish) {
        this.route.navigate(["/dashboard/survey"]);
        this.dialogRef.close();
      }
      return response;
    } catch (error: any) {
      this._notificationService.sendNotification("error", error.error?.message ? error.error.message : "Something went wrong!");
      return false;
    }
  }

  createJsonDataOfForm() {
    let surveyFormData: any = {
      surveyId: this.surveyId,
      formEntity: {
        screens: []
      }
    };
    this.restructureObjectOfForm();
    this.surveyScreensOfForms.forEach((screen: any, index: number) => {
      const obj = {
        title: screen.title,
        id: `screen_${this.generateAlphabet[index]}`,
        terminal: this.surveyScreensOfForms.length - 1 === index ? true : false,
        layout: {
          children: [
            {
              children: [...screen.children, this.getFooterData(index)]
            }
          ]
        }
      };
      surveyFormData.formEntity.screens.push(obj);
    });
    return surveyFormData;
  }

  getFooterData(index: number) {
    let footerObj = this.surveyScreensOfForms[index].footer;
    footerObj["onClickAction"] = {
      name: this.surveyScreensOfForms.length - 1 === index ? "complete" : "navigate"
    };
    if (this.surveyScreensOfForms.length - 1 !== index) {
      footerObj.onClickAction["next"] = {
        type: "screen",
        name: `screen_${this.generateAlphabet[index + 1]}`
      };
    }
    return footerObj;
  }

  deleteScreen(formIndex: number) {
    this.surveyScreensOfForms[this.selectedFormIndex].children.forEach((children: any) => {
      if (children.type === "Dropdown" || children.type === "RadioButtonsGroup") {
        this.scalingFactor[children.scalingFactor] = false;
      }
    });
    this.surveyScreensOfForms.splice(formIndex, 1);
    if (this.surveyScreensOfForms.length <= 1) {
      this.selectedFormIndex = 0;
    } else {
      this.selectedFormIndex = formIndex - 1;
    }
    this.formEditData = this.surveyScreensOfForms[this.selectedFormIndex];
  }

  selectionValue(optionIndex: number, dropDownFromFormEdit: any) {
    dropDownFromFormEdit.dataSource.forEach((option: any, index: number) => {
      if (optionIndex === index) {
        option.value = true;
        dropDownFromFormEdit.value = option.title;
      } else {
        option.value = false;
      }
      this.checkRequiredDetailsFill();
    });
  }

  previewOpen() {
    this.isDroverOpen = true;
    this.isDropDownSelect = false;
    this.checkRequiredDetailsFill();
  }

  checkRequiredDetailsFill() {
    this.formEditData.footer.isFooterDisable = false;
    let countOfRequired = 0;
    let countOfRequiredDetailsFill = 0;
    this.formEditData.children.forEach((editDetail: any) => {
      if (editDetail.required) {
        countOfRequired++;
      }
    });
    if (countOfRequired) {
      this.formEditData.children.forEach((editDetail: any) => {
        if (editDetail.required) {
          if (editDetail.type === "RadioButtonsGroup" || editDetail.type === "CheckboxGroup") {
            if (editDetail.dataSource.some((option: any) => option.value)) {
              countOfRequiredDetailsFill++;
            }
          }
          if (editDetail.value?.trim()) {
            countOfRequiredDetailsFill++;
          }
        }
      });
    }
    if (countOfRequired !== countOfRequiredDetailsFill) {
      this.formEditData.footer.isFooterDisable = true;
    }
  }

  nextScreen() {
    if (this.surveyScreensOfForms.length - 1 > this.selectedFormIndex) {
      this.selectedFormIndex++;
      this.formEditData = this.surveyScreensOfForms[this.selectedFormIndex];
    }
  }

  restructureObjectOfForm() {
    this.surveyScreensOfForms.forEach((screen: any) => {
      console.log(screen);
      delete screen.footer.isFooterDisable;
      screen.children.forEach((fields: any) => {
        if (fields.hasOwnProperty("value")) delete fields.value;
        if (fields.hasOwnProperty("focusOutFLag")) delete fields.focusOutFLag;
        if (fields.hasOwnProperty("dataSource")) {
          if (fields.dataSource !== null) {
            fields.dataSource.forEach((dataSource: any) => {
              delete dataSource.value;
            });
          }
        }
      });
    });
  }

  handleScallingFactor(formEditChild: any, event: SelectChangeEventDetail) {
    if (formEditChild?.scalingFactor?.trim()) {
      this.scalingFactor[formEditChild.scalingFactor] = false;
    }
    formEditChild.scalingFactor = event.value;
    this.scalingFactor[event.value] = true;
  }

  async publishSurvey() {
    if (!(await this.onDraft(true))) {
      return;
    }
    if (!this.validateFormData() || !this.othersValdiation()) {
      return;
    }
    this._surveyService
      .publishSurvey(this.surveyId, this.surveyFormjsonStore)
      .then((res: any) => {
        this._notificationService.sendNotification("success", "Survey published successfully!");
        this.route.navigate(["/dashboard/survey"]);
        this.dialogRef.close();
      })
      .catch((err: any) => {
        this._notificationService.sendNotification("error", err.error?.message ? err.error.message : "Something went wrong!");
      });
  }

  validateFormData() {
    const isValid = Object.keys(this.scalingFactor).every((key: any) => {
      if (!this.scalingFactor[key]) {
        this._notificationService.sendNotification("error", `Please add all scalling-factor`);
        return;
      }
      return true;
    });
    if (isValid) {
      return true;
    } else {
      return false;
    }
  }

  othersValdiation() {
    const isValid = this.surveyFormjsonStore.formEntity.screens.every((screen: any, screenIndex: number) => {
      if (!screen.title?.trim()) {
        this._notificationService.sendNotification("error", `Please Enter Screen title for screen-${screenIndex + 1}`);
        return;
      }
      const insidevalid = screen.layout.children[0].children.every((children: any, childIndex: number) => {
        if (this.listOfTextType.includes(children.type) && !children.text?.trim()) {
          this._notificationService.sendNotification(
            "error",
            `Please Enter text for screen-${screenIndex + 1} and content-${childIndex + 1}`
          );
          return;
        }
        if (this.labelContainType.includes(children.type)) {
          if (!children.label?.trim()) {
            this._notificationService.sendNotification(
              "error",
              `Please enter label for screen-${screenIndex + 1} and content-${childIndex + 1}`
            );
            return;
          }
        }
        if (children.type === "Footer") {
          if (!children.label?.trim()) {
            this._notificationService.sendNotification(
              "error",
              `Please enter label of footer for screen-${screenIndex + 1} and content-${childIndex + 1}`
            );
            return;
          }
        }
        return true;
      });
      if (insidevalid) {
        return true;
      } else {
        return false;
      }
    });
    if (isValid) {
      return true;
    } else {
      return false;
    }
  }

  deleteChildren(formsContentIndex: number) {
    if (
      this.formEditData.children[formsContentIndex].type === "Dropdown" ||
      this.formEditData.children[formsContentIndex].type === "RadioButtonsGroup"
    ) {
      this.scalingFactor[this.formEditData.children[formsContentIndex].scalingFactor] = false;
    }
    this.formEditData.children.splice(formsContentIndex, 1);
  }
}
