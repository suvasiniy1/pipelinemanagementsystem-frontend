import { AuditItem } from "./base/AuditNamedItem"

export class EnquiryForm extends AuditItem {
    enquiryFormID!: number
    firstName!: string
    lastName!: string
    emailAddress!: string
    mobile!: string
    area!: string
    procedure!: string
    company!: string
    location!: string
    notes!: string
    comments!: string
  }
  