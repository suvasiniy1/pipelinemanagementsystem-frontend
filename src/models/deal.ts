import { AuditItem } from "./base/AuditNamedItem";

export class Deal extends AuditItem {
  dealID: number = 0;
  contactPersonID!: number;
  assigntoId!: number;
  organizationID!: number;
  title!: string;
  value: string = "100";
  pipelineID!: number;
  stageID!: number;
  labelID!: number;
  probability: string = "100";
  expectedCloseDate: string | null = null;
  clinicID!: number;
  sourceID!: number;
  treatmentID!: number;
  enquiryID!: number;
  paName: string = "test";
  operationDate: string | null = null;
  lostReviewReason: string = "test";
  pipelineTypeID!: number;
  visibilityGroupID!: number;
  phone: string = "test";
  email: string = "test";
  personName!: string;
  name: string = "test";
  pipelineName!: string;
  stageName!: string;
  labelName!: string;
  clinicName!: string;
  sourceName!: string;
  treatmentName!: string;
  enquiryDetails!: string;
  pipelineTypeName!: string;
  visibilityGroupName!: string;
  status?: string; // Add this if it's not already there
  isClosed!: boolean; // Add this if it's not already there
  openDealsCount?: number;
  ownerName!: string;
  newContact?: {
    personName: string; // This is required
    email?: string; // Required
    phone?: string; // Required
    reason?: string;
    comments?: string;
  };
  // constructor(dealID: number = null as any,
  //     contactPersonID: number = null as any,
  //     organizationID: number = null as any,
  //     title: string = null as any,
  //     value: string = null as any,
  //     pipelineID: number = null as any,
  //     stageID: number = null as any,
  //     labelID: number = null as any,
  //     probability: string = null as any,
  //     expectedCloseDate: string = null as any,
  //     clinicID: number = null as any,
  //     sourceID: number = null as any,
  //     treatmentID: number = null as any,
  //     enquiryID: number = null as any,
  //     paName: string = null as any,
  //     operationDate: string = null as any,
  //     lostReviewReason: string = null as any,
  //     pipelineTypeID: number = null as any,
  //     visibilityGroupID: number = null as any,
  //     phone: string = null as any,
  //     email: string = null as any,
  //     personName: string = null as any,
  //     name: string = null as any,
  //     pipelineName: string = null as any,
  //     stageName: string = null as any,
  //     labelName: string = null as any,
  //     clinicName: string = null as any,
  //     sourceName: string = null as any,
  //     treatmentName: string = null as any,
  //     enquiryDetails: string = null as any,
  //     pipelineTypeName: string = null as any,
  //     visibilityGroupName: string = null as any) {
  //     this.dealID = dealID;
  //     this.contactPersonID = contactPersonID;
  //     this.organizationID = organizationID;
  //     this.title = title;
  //     this.value = value;
  //     this.pipelineID = pipelineID;
  //     this.stageID = stageID;
  //     this.labelID = labelID;
  //     this.probability = probability;
  //     this.expectedCloseDate = expectedCloseDate;
  //     this.clinicID = clinicID;
  //     this.sourceID = sourceID;
  //     this.treatmentID = treatmentID;
  //     this.enquiryID = enquiryID;
  //     this.paName = paName;
  //     this.operationDate = operationDate;
  //     this.lostReviewReason = lostReviewReason;
  //     this.pipelineTypeID = pipelineTypeID;
  //     this.visibilityGroupID = visibilityGroupID;
  //     this.phone = phone;
  //     this.email = email;
  //     this.personName = personName;
  //     this.name = name;
  //     this.pipelineName = pipelineName;
  //     this.stageName = stageName;
  //     this.labelName = labelName;
  //     this.clinicName = clinicName;
  //     this.sourceName = sourceName;
  //     this.treatmentName = treatmentName;
  //     this.enquiryDetails = enquiryDetails;
  //     this.pipelineTypeName = pipelineTypeName;
  //     this.visibilityGroupName = visibilityGroupName;

  // }
  MissedCallReason: string = "Not Provided";
  RecordingUrl: string = "";
  Status: string = "Pending";
  medicalForm: string | undefined;
}

export class DealMove {
  newStageId!: number;
  modifiedById!: number;
  dealId!: number;
  pipelineId!: number;
}

export class DealCustomFields extends AuditItem {
  customFieldId!: number;
  dealID!: number;
  customField!: string;
  customFieldType!: string;
  customFieldValue!: string;
  customSelectValues!: string;
  pipelineId!: string;
}

export interface DealTimeLine {
  dealId: number;
  eventType: string;
  eventDescription: string;
  eventDate: string;
  timeline:string;
  activityDetail: string;
  callDateTime: string;
  contactNumber: string;
  duration: number;
  eventTypeId:number;
}

export enum EntitType {
  Deal = 1,
  Note = 2,
  Email = 3,
  Task = 4,
  Comment = 8
}

export class DealExport {
  minAmount!: any
  assignedToId!: any
  pipelineIDs!: string
  startDate!: any
  endDate!: any
  stageId!: any
}

