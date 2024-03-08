import { AuditItem } from "./base/AuditNamedItem";
import { Stage } from "./stage";

export class PipeLine extends AuditItem {
    pipelineID!: number;
    pipelineName!: string;
    description!: string;
    stages!:Array<Stage>;
    canEdit?:boolean;

}