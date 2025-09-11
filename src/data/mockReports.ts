import { ReportDefinition, ReportCondition } from '../models/reportModels';

export const mockReports: ReportDefinition[] = [
  {
    id: 1,
    name: "Deal Performance Report",
    chartType: "bar",
    frequency: "monthly",
    isPreview: false,
    isActive: true,
    isPublic: true,
    createdDate: "2024-01-01T00:00:00.000Z",
    createdBy: 0,
    modifiedBy: 0,
    modifiedDate: "2024-01-01T00:00:00.000Z",
    reportConditions: [
      {
        id: 1,
        reportDefinitionId: 1,
        field: "status",
        operator: "in",
        value: "Open,Won,Lost",
        extraValue: ""
      },
      {
        id: 2,
        reportDefinitionId: 1,
        field: "addTime",
        operator: ">=",
        value: "2024-01-01",
        extraValue: ""
      }
    ]
  },
  {
    id: 2,
    name: "Deal Conversion Analysis",
    chartType: "line",
    frequency: "monthly",
    isPreview: false,
    isActive: true,
    isPublic: true,
    createdDate: "2024-01-01T00:00:00.000Z",
    createdBy: 0,
    modifiedBy: 0,
    modifiedDate: "2024-01-01T00:00:00.000Z",
    reportConditions: [
      {
        id: 3,
        reportDefinitionId: 2,
        field: "status",
        operator: "=",
        value: "Won",
        extraValue: ""
      },
      {
        id: 4,
        reportDefinitionId: 2,
        field: "dealValue",
        operator: ">",
        value: "1000",
        extraValue: ""
      }
    ]
  },
  {
    id: 3,
    name: "Deal Duration Tracking",
    chartType: "bar",
    frequency: "daily",
    isPreview: false,
    isActive: true,
    isPublic: true,
    createdDate: "2024-01-01T00:00:00.000Z",
    createdBy: 0,
    modifiedBy: 0,
    modifiedDate: "2024-01-01T00:00:00.000Z",
    reportConditions: [
      {
        id: 5,
        reportDefinitionId: 3,
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
    isPreview: false,
    isActive: true,
    isPublic: true,
    createdDate: "2024-01-01T00:00:00.000Z",
    createdBy: 0,
    modifiedBy: 0,
    modifiedDate: "2024-01-01T00:00:00.000Z",
    reportConditions: [
      {
        id: 6,
        reportDefinitionId: 4,
        field: "pipeline",
        operator: "=",
        value: "Sales",
        extraValue: ""
      }
    ]
  },
  {
    id: 5,
    name: "Deal Products Analysis",
    chartType: "bar",
    frequency: "monthly",
    isPreview: false,
    isActive: true,
    isPublic: true,
    createdDate: "2024-01-01T00:00:00.000Z",
    createdBy: 0,
    modifiedBy: 0,
    modifiedDate: "2024-01-01T00:00:00.000Z",
    reportConditions: [
      {
        id: 7,
        reportDefinitionId: 5,
        field: "status",
        operator: "!=",
        value: "Deleted",
        extraValue: ""
      },
      {
        id: 8,
        reportDefinitionId: 5,
        field: "dealValue",
        operator: "between",
        value: "5000",
        extraValue: "50000"
      }
    ]
  }
];