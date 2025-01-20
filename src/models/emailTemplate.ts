import { AuditItem } from "./base/AuditNamedItem";

export class EmailTemplate extends AuditItem {
  id!: number;
  name!: string;
  header!: EmailItemProps;
  body!: EmailItemProps;
  footer!: EmailItemProps;
  categoryId!: number;

  constructor(
    id: number = null as any,
    name: string = null as any,
    header: EmailItemProps = new EmailItemProps(),
    body: EmailItemProps = new EmailItemProps(),
    footer: EmailItemProps = new EmailItemProps(),
    categoryId: number = null as any
  ) {
    super();
    this.id = id;
    this.name = name;
    this.header = header;
    this.body = body;
    this.footer = footer;
    this.categoryId = categoryId;
  }
}

export class EmailItemProps {
  content: any;
  position: any="center";
  backGroundColor:any;
}
