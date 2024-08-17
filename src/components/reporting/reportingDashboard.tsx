import React, { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Filters from "./filters";
import Util from "../../others/util";
import CardContent from "./cardContent";

const ReportingDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("Deals");
  const supportedChartsList = ["Deals", "Notes", "Emails", "Calls"];
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [selectedFrequencey, setSelectedFrequencey] = useState("");

  return (
    <>
      <Filters
        selectedStartDate={selectedStartDate}
        setSelectedStartDate={setSelectedStartDate}
        selectedEndDate={selectedEndDate}
        setSelectedEndDate={setSelectedEndDate}
        selectedFrequencey={selectedFrequencey}
        setSelectedFrequencey={setSelectedFrequencey}
      />
      {!Util.isNullOrUndefinedOrEmpty(selectedStartDate) &&
      !Util.isNullOrUndefinedOrEmpty(selectedEndDate) &&
      !Util.isNullOrUndefinedOrEmpty(selectedFrequencey) ? (
        <div className="timeline-tabscontent">
          <Tabs
            defaultActiveKey={selectedTab}
            transition={false}
            onSelect={(e: any) => setSelectedTab(e)}
            id="noanim-tab-example"
            className="mb-5 activity-subtab"
          >
            {supportedChartsList.map((item, index) => (
              <Tab eventKey={item} key={index} title={item}>
              </Tab>
            ))}
          </Tabs>
          <CardContent selectedTab={selectedTab} 
                startDate={selectedStartDate} 
                endDate={selectedEndDate} 
                frequencey={selectedFrequencey}/>
        </div>
      ) : "Please select date range and frequencey to see the reports"}
    </>
  );
};

export default ReportingDashboard;
