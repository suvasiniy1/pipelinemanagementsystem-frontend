import { AuditItem } from "./base/AuditNamedItem"
import { Deal } from "./deal"

export class Stage extends AuditItem {
    stageID!: number
    pipelineID!: number
    stageName!: string
    stageOrder!: number
    probability!: number
    pipelineName!: string
    deals!:Array<Deal>
  }
  