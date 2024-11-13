import { AuditItem } from "./base/AuditNamedItem"

export class DealFilter extends AuditItem {
    id!: number
    name!: string
    filterType!: string
    isEditable: boolean = false
    isFavourite: boolean = false
    isPublic: boolean = false
    conditions: Rule[] = []
  }
  
  export class Rule {
    id!: number
    dealFilterId!: number
    glue!: string
    conditionList!: ConditionCSV[]
  }
  
  export class ConditionCSV {
    id!: number
    conditionsId!: number
    operator!: string
    object!: string
    value!: string
    extraValue!: string
  }
  