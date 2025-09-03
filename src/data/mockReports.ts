import { ReportDefinition, Condition } from '../models/reportModels';

export const mockReports: ReportDefinition[] = [
  {
    id: 1,
    name: "Deal Performance Report",
    chartType: "bar",
    frequency: "monthly",
    conditions: [
      {
        id: 1,
        field: "status",
        operator: "in",
        value: "Open,Won,Lost"
      },
      {
        id: 2,
        field: "addTime",
        operator: ">=",
        value: "2024-01-01"
      }
    ]
  },
  {
    id: 2,
    name: "Deal Conversion Analysis",
    chartType: "line",
    frequency: "monthly",
    conditions: [
      {
        id: 3,
        field: "status",
        operator: "=",
        value: "Won"
      },
      {
        id: 4,
        field: "dealValue",
        operator: ">",
        value: 1000
      }
    ]
  },
  {
    id: 3,
    name: "Deal Duration Tracking",
    chartType: "bar",
    frequency: "daily",
    conditions: [
      {
        id: 5,
        field: "addTime",
        operator: "between",
        value: "2024-01-01",
        extraValue: "2024-12-31"
      }
    ]
  },
  {
    id: 4,
    name: "Deal Progress Overview",
    chartType: "pie",
    frequency: "daily",
    conditions: [
      {
        id: 6,
        field: "pipeline",
        operator: "=",
        value: "Sales"
      }
    ]
  },
  {
    id: 5,
    name: "Deal Products Analysis",
    chartType: "bar",
    frequency: "monthly",
    conditions: [
      {
        id: 7,
        field: "status",
        operator: "!=",
        value: "Deleted"
      },
      {
        id: 8,
        field: "dealValue",
        operator: "between",
        value: 5000,
        extraValue: 50000
      }
    ]
  }
];