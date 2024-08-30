import { CancelTokenSource } from "axios";
import { User } from "../models/user";
import { IsMockService } from "../others/util";
import { BaseService } from "./BaseService";
import { VisibilityGroup } from "../models/visibilityGroup";
import { Person } from "../models/person";

export class personService extends BaseService<Person> {
  constructor(errorHandler: any) {
    super("Person", "Person", errorHandler);
  }

  getPersons(axiosCancel?: CancelTokenSource) {
    return this.getItems(axiosCancel, 'Person/GetAllPersonDetails');
  }

  getOrganizations(axiosCancel?: CancelTokenSource) {
    return this.getItems(axiosCancel, 'Organization/GetAllOrganizationDetails'); // Adjust the API endpoint as necessary
  }
  getLabels(axiosCancel?: CancelTokenSource) {
    return this.getItems(axiosCancel, 'Label/GetAllLabelDetails');  // Adjust API endpoint as necessary
  }

  getOwners(axiosCancel?: CancelTokenSource) {
    return this.getItems(axiosCancel, 'ManageUser/GetUsers');  // Adjust API endpoint as necessary
  }

  getClinics(axiosCancel?: CancelTokenSource) {
    return this.getItems(axiosCancel, 'Clinic/GetAllClinicDetails');  // Adjust API endpoint as necessary
  }

  getSources(axiosCancel?: CancelTokenSource) {
    return this.getItems(axiosCancel, 'Source/GetAllSourceDetails');  // Adjust API endpoint as necessary
  }

  getVisibilityGroups(axiosCancel?: CancelTokenSource) {
    return this.getItems(axiosCancel, 'VisibilityGroup/GetAllVisibilityGroupDetails');  // Adjust API endpoint as necessary
  }
}

