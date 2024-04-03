import { AuditItem } from "./base/AuditNamedItem"
import { Organization } from "./organization"
import { Person } from "./person"
import { PipeLineType } from "./pipeLineType"
import { PipeLine } from "./pipeline"
import { Stage } from "./stage"

export class Utility extends AuditItem {
    stages: Stage[] = []
    pipelines: PipeLine[] = []
    organizations: Organization[]=[]
    pipeLineTypes: PipeLineType[] = []
    users: any
    persons: Person[] = []
  }