import React, { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Filters from "./filters";
import Util from "../../others/util";
import CardContent from "./cardContent";
import './reportingStyles.css';

const ReportingDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("Deal Conversion");
  const supportedChartsList = ["Deal Conversion", "Sales Performance", "Treatment Analysis", "User Performance", "Lead Source", "Pipeline Health"]; //"Deals", "Notes", "Emails", "Calls"
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [selectedFrequencey, setSelectedFrequencey] = useState("");

  return (
    <div style={{ padding: '20px', marginLeft: '20px' }}>
      <Filters
        selectedStartDate={selectedStartDate}
        setSelectedStartDate={setSelectedStartDate}
        selectedEndDate={selectedEndDate}
        setSelectedEndDate={setSelectedEndDate}
        selectedFrequencey={selectedFrequencey}
        setSelectedFrequencey={setSelectedFrequencey}
      />
      {(["Deal Conversion", "Sales Performance", "Treatment Analysis", "User Performance", "Lead Source", "Pipeline Health"].includes(selectedTab)) || 
       (!Util.isNullOrUndefinedOrEmpty(selectedStartDate) &&
        !Util.isNullOrUndefinedOrEmpty(selectedEndDate) &&
        !Util.isNullOrUndefinedOrEmpty(selectedFrequencey)) ? (
        <div className="timeline-tabscontent" style={{ maxHeight: '80vh', overflowY: 'auto', paddingBottom: '20px' }}>
          <div style={{
            background: 'white',
            borderRadius: '4px',
            border: '1px solid #e4cb9a',
            marginBottom: '20px',
            overflow: 'hidden'
          }}>
            <Tabs
              defaultActiveKey={selectedTab}
              transition={false}
              onSelect={(e: any) => setSelectedTab(e)}
              id="noanim-tab-example"
              className="mb-0"
              style={{
                borderBottom: 'none'
              }}
            >
              {supportedChartsList.map((item, index) => (
                <Tab eventKey={item} key={index} title={item}>
                </Tab>
              ))}
            </Tabs>
          </div>
          <div style={{ paddingRight: '10px' }}>
            <CardContent selectedTab={selectedTab} 
                  startDate={selectedStartDate} 
                  endDate={selectedEndDate} 
                  frequencey={selectedFrequencey}/>
          </div>
        </div>
      ) : "Please select date range and frequency to see the reports"}
    </div>
  );
};

export default ReportingDashboard;
