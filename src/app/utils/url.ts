import { environment } from "../../environments/environment";

export class Urls {
  static baseUrl = environment.apiURL;
  static login = Urls.baseUrl + "api/Auth/login";
  static logout = Urls.baseUrl + "api/Auth/Logout";
  static resetPasswordByUrl = Urls.baseUrl + "api/Auth/ResetPassword";
  static forgotPasswordUrl = Urls.baseUrl + "api/Auth/ForgotPassword";
  static resetPass = Urls.baseUrl + "api/Auth/StoreNewPassword";
  static survey = Urls.baseUrl + "api/Survey/";
  static surveyOperation = Urls.survey + "Survey";
  static saveSurvey = Urls.survey + "FormJson";
  static surveyForm = Urls.survey + "SurveyFormJson";
  static surveyApiPayloadForDownload = Urls.survey + "SurveyAPIPayloadForDownload";
  static surveyApiPayload = Urls.survey + "SurveyAPIPayload";
  static publishSurvey = Urls.survey + "PublishSurvey";
  static customer = Urls.baseUrl + "api/Customer/";
  static getCustomers = Urls.customer + "Customers";
  static getUserDetails = Urls.baseUrl + "api/User/UserDetails/Id";
  static getCustomerDetails = Urls.customer + "CustomerDetails/Id";
  static category = Urls.baseUrl + "api/Category/Category";
  static updateProfle = Urls.baseUrl + "api/User/UserDetails";
  static analytics = Urls.baseUrl + "api/Dashboard";
}
