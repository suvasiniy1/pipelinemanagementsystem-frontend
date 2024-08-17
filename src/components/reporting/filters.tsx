import { DateRangePicker } from "../../elements/dateRangePicker";
import SelectDropdown from "../../elements/SelectDropdown";

type params = {
  selectedStartDate: any;
  setSelectedStartDate: any;
  selectedEndDate: any;
  setSelectedEndDate: any;
  selectedFrequencey: any;
  setSelectedFrequencey: any;
};
const Filters = (props: params) => {
  const {
    selectedStartDate,
    setSelectedStartDate,
    selectedEndDate,
    setSelectedEndDate,
    selectedFrequencey,
    setSelectedFrequencey,
    ...others
  } = props;
  const frequenceyList = ["Daily", "Weekly", "Monthly", "Yearly"];

  const getfrequenceyList = () => {
    return (
      frequenceyList.map((item: any) => ({ name: item, value: item })) ?? []
    );
  };

  const onDatePeriodSelection = (dates: Array<Date>) => {
    if(dates.length>0){
        setSelectedStartDate(dates[0]);
        setSelectedEndDate(dates[1])
    }
  };

  return (
    <>
      <br />
      <br />
      <div className="row">
        <div className="col-sm-4">
          <div className="row">
            <div className="col-sm-4">
              <label htmlFor="time-period" className="filterTopLabel">
                Time Period:
              </label>
            </div>
            <div className="col-sm-6">
              <DateRangePicker
                startDate={selectedStartDate}
                endDate={selectedEndDate}
                onDatePeriodSelection={onDatePeriodSelection}
              />
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="row">
            <div className="col-sm-4">
              <label htmlFor="time-period" className="filterTopLabel">
                Frequencey:
              </label>
            </div>
            <div className="col-sm-6">
              <SelectDropdown
                value={selectedFrequencey}
                isValidationOptional={true}
                list={getfrequenceyList()}
                onItemChange={setSelectedFrequencey}
              />
            </div>
          </div>
        </div>
      </div>
      <br />
    </>
  );
};

export default Filters;
