export class SurveyHelper {
  createSurveyScreen() {
    return {
      title: "",
      children: [],
      footer: {
        type: "footer",
        label: ""
      }
    };
  }

  createSurveyChildrenyObj(type: string) {
    let childObj: any;
    switch (type) {
      case "TextHeading":
        childObj = {
          type: "TextHeading",
          text: "text",
          value: ""
        };
        break;
      case "TextSubheading":
        childObj = {
          type: "TextSubheading",
          text: "text",
          value: ""
        };
        break;
      case "TextBody":
        childObj = {
          type: "TextBody",
          text: "text",
          value: ""
        };
        break;
      case "TextCaption":
        childObj = {
          type: "TextCaption",
          text: "text",
          value: ""
        };
        break;
      case "TextInput":
        childObj = {
          type: "TextInput",
          label: "Label",
          inputType: "text",
          HelperText: "",
          required: true,
          value: "",
          focusOutFLag: false
        };
        break;
      case "TextArea":
        childObj = {
          type: "TextArea",
          label: "Label",
          HelperText: "",
          required: true,
          value: "",
          focusOutFLag: false
        };
        break;
      case "DatePicker":
        childObj = {
          type: "DatePicker",
          label: "Label",
          HelperText: "",
          required: true,
          value: "",
          focusOutFLag: false
        };
        break;
      case "RadioButtonsGroup":
        childObj = {
          type: "RadioButtonsGroup",
          label: "Label",
          required: true,
          scalingFactor: "",
          dataSource: [
            {
              id: "0",
              title: "Option 1",
              value: false
            },
            {
              id: "1",
              title: "Option 2",
              value: false
            }
          ]
        };
        break;
      case "Dropdown":
        childObj = {
          type: "Dropdown",
          label: "Label",
          required: true,
          focusOutFLag: false,
          scalingFactor: "",
          dataSource: [
            {
              id: "Option 1",
              title: "Option 1",
              value: false
            },
            {
              id: "Option 2",
              title: "Option 2",
              value: false
            }
          ]
        };
        break;
      case "CheckboxGroup":
        childObj = {
          type: "CheckboxGroup",
          label: "Label",
          required: true,
          dataSource: [
            {
              id: "0",
              title: "Option 1",
              value: false
            },
            {
              id: "1",
              title: "Option 2",
              value: false
            }
          ]
        };
        break;
    }
    return childObj;
  }

  lengthValidations: any = {
    TextHeading: {
      limit: 80
    },
    TextSubheading: {
      limit: 80
    },
    TextBody: {
      limit: 4096
    },
    TextCaption: {
      limit: 4096
    },
    TextInput: {
      labelLimit: 20,
      helperTextLimit: 80
    },
    TextArea: {
      labelLimit: 30,
      helperTextLimit: 80
    },
    DatePicker: {
      labelLimit: 20,
      helperTextLimit: 80
    },
    RadioButtonsGroup: {
      labelLimit: 30,
      optionsLimit: 30
    },
    Dropdown: {
      labelLimit: 20,
      optionsLimit: 80
    },
    CheckboxGroup: {
      labelLimit: 30,
      optionsLimit: 30
    }
  };
}
