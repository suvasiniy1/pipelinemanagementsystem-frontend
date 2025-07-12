import { AuditItem } from "./base/AuditNamedItem";

export class EmailConfiguration extends AuditItem {
  id!: number;
  emailtemplateId!: number;
  name!: string;
  fromName!: string;
  fromAddress!: string;
  replytoaddress!: string;
  subject!: string;
  campaginId!: number;
  toAddress!: string;
  sendNow!: boolean;
  scheduleTime!: Date;
  status!: EmailStatus;
  scheduleOption!: any;
  optionType: any = "Send Now";

  constructor(
    id: number = null as any,
    emailtemplateId: number = null as any,
    fromName: string = null as any,
    fromAddress: string = null as any,
    replytoaddress: string = null as any,
    subject: string = null as any,
    campaginId: number = null as any,
    toAddress: string = null as any,
    sendNow: boolean = null as any,
    scheduleTime: Date = null as any,
    status: EmailStatus = null as any
  ) {
    super();
    this.id = id;
    this.emailtemplateId = emailtemplateId;
    this.fromName = fromName;
    this.fromAddress = fromAddress;
    this.replytoaddress = replytoaddress;
    this.subject = subject;
    this.campaginId = campaginId;
    this.toAddress = toAddress;
    this.sendNow = sendNow;
    this.scheduleTime = scheduleTime;
    this.status = status;
  }
}

export enum EmailStatus {
  Draft = 1,
  Active = 2,
  Archive = 3,
}
