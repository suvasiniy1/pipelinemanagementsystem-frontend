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
    <div style={{
      background: '#faf5eb',
      border: '1px solid #e4cb9a',
      padding: '20px',
      borderRadius: '4px',
      marginBottom: '20px'
    }}>
      <div className="row" style={{ alignItems: 'center' }}>
        <div className="col-sm-5">
          <div className="row" style={{ alignItems: 'center' }}>
            <div className="col-sm-4">
              <label htmlFor="time-period" style={{
                color: '#3f3f3f',
                fontWeight: '600',
                fontSize: '14px',
                marginBottom: '0'
              }}>
                Time Period:
              </label>
            </div>
            <div className="col-sm-8">
              <DateRangePicker
                startDate={selectedStartDate}
                endDate={selectedEndDate}
                onDatePeriodSelection={onDatePeriodSelection}
              />
            </div>
          </div>
        </div>
        <div className="col-sm-5">
          <div className="row" style={{ alignItems: 'center' }}>
            <div className="col-sm-4">
              <label htmlFor="frequency" style={{
                color: '#3f3f3f',
                fontWeight: '600',
                fontSize: '14px',
                marginBottom: '0'
              }}>
                Frequency:
              </label>
            </div>
            <div className="col-sm-8">
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
    </div>
  );
};

export default Filters;
