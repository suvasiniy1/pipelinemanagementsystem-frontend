import { AuditItem } from "./base/AuditNamedItem"

export interface DotdigitalCampagin extends AuditItem{
    id: number
    name: string
    subject: string
    fromName: string
    fromAddress: FromAddress
    replyToAddress: string
    isSplitTest: boolean
    status: string
    customReplyToAddress: string
  }
  
  export interface FromAddress {
    id: string
    email: string
  }
  