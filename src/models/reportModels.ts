export class Condition {
  id!: number;                 // condition id
  field!: string;              // e.g. "addTime", "status"
  operator!: string;           // e.g. "=", ">", "<", "between", "in"
  value!: string | number;     // single value or first value (for between)
  extraValue?: string | number; // second value (for between, ranges, etc.)
}

export class ReportDefinition {
  id!: number;                         // report id
  name!: string;                       // report name e.g. "Deals by Status"
  chartType!: "bar" | "line" | "pie";  // supported chart type
  frequency!: "daily" | "monthly" | "yearly";  // aggregation interval
  conditions: Condition[] = [];        // multiple conditions (AND)
}