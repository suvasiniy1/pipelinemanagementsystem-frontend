import moment from "moment-timezone";
import { DateRangePicker as DateRange } from "rsuite";

type params = {
  onDatePeriodSelection?: any;
  disabled?: boolean;
  startDate?: any;
  endDate?: any;
};

export const DateRangePicker = (props: params) => {

  const { onDatePeriodSelection, disabled, startDate, endDate, ...others } =
    props;

  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const predefinedRanges = [
    {
      label: "Today",
      value: [
        new Date(moment.tz(timeZone).startOf("day").format("YYYY-MM-DD")),
        new Date(moment.tz(timeZone).endOf("day").format("YYYY-MM-DD")),
      ],
      placement: "left",
    },
    {
      label: "Current Month",
      value: [
        new Date(moment.tz(timeZone).startOf("month").format("YYYY-MM-DD")),
        new Date(moment.tz(timeZone).endOf("month").format("YYYY-MM-DD")),
      ],
      placement: "left",
    },
    {
      label: "Current Quarter",
      value: [
        new Date(moment.tz(timeZone).startOf("quarter").format("YYYY-MM-DD")),
        new Date(moment.tz(timeZone).endOf("quarter").format("YYYY-MM-DD")),
      ],
      placement: "left",
    },
    {
      label: "Current Year",
      value: [
        new Date(moment.tz(timeZone).startOf("year").format("YYYY-MM-DD")),
        new Date(moment.tz(timeZone).endOf("year").format("YYYY-MM-DD")),
      ],
      placement: "left",
    },
  ];

  return (
      <DateRange
        ranges={predefinedRanges as any}
        placeholder="Select Time Period"
        placement="auto"
        disabled={disabled}
        defaultValue={[new Date(), new Date()]}
        onChange={(e) => onDatePeriodSelection(e)}
        style={{ width: "100%" }}
      />
  );
};
