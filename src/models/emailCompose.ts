export class EmailCompose {
  fromAddress!: string;
  toAddress!: string;
  cc!: string;
  bcc!: string;
  subject!: string;
  body!: string;
  isReply!: boolean;
}

export class EmailThreadObject {
  id!: number;
  sender!: string;
  senderEmail!: string;
  timestamp!: string;
  content!: string;
  replies!: Array<EmailThreadObject>;
  constructor(
    id: number = null as any,
    sender: string = null as any,
    senderEmail: string = null as any,
    timestamp: string = null as any,
    content: string = null as any,
    replies: Array<EmailThreadObject> = [] as any
  ) {
    this.id = id;
    this.sender = sender;
    this.senderEmail = senderEmail;
    this.timestamp = timestamp;
    this.content = content;
    this.replies = replies;
  }
}

export class DealEmail {
  dealId!: number;
  conversationId!: number;
  constructor(
    dealId: number = null as any,
    conversationId: number = null as any
  ) {
    this.dealId = dealId;
    this.conversationId = conversationId;
  }
}
