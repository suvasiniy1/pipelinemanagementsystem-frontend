import { AuditItem } from "./base/AuditNamedItem";

export class PipeLineType extends AuditItem {
    pipelineTypeID!: number;
    pipelineTypeName!: string;
}