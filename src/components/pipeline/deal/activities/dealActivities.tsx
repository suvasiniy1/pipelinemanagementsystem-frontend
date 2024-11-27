import { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Deal } from "../../../../models/deal";
import CallsActivites from "./call/callsActivites";
import DealLogsList from "./dealActivityLogs/dealLogsList";
import { AuthProvider } from "./email/authProvider";
import EmailActivites from "./email/emailActivites";
import NotesList from "./notes/notesList";
import TasksList from "./tasks/tasksList";
import axios from "axios";
import { DealService } from "../../../../services/dealService";
import { ErrorBoundary } from "react-error-boundary";

type params = {
  dealItem: Deal;
  dealId:number;
};
const DealActivities = (props: params) => {
  const { dealItem, dealId, ...others } = props;
  const [callHistory, setCallHistory] = useState<Array<any>>([]);
  const [defaultActiveKey, setdefaultActiveKey] = useState("activity_sub");
  const [error, setError] = useState(null);
  // Initialize DealService
  const dealSvc = new DealService(ErrorBoundary);

  useEffect(() => {
    if (!dealId) return;
  
    const axiosCancelSource = axios.CancelToken.source();
  
    const fetchCallHistory = async () => {
      try {
        const response = await dealSvc.getDealsById(dealId, axiosCancelSource);
        console.log("API Response:", response); // Log full response
        if (response && response.callHistory) {
          setCallHistory(response.callHistory);
          console.log("Updated callHistory in state:", response.callHistory);
        } else {
          console.warn("API Response does not contain expected data.");
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Error fetching call history:", error);
        }
      }
    };
  
    fetchCallHistory();
  
    return () => {
      axiosCancelSource.cancel("Request canceled due to component unmount or dealId change");
    };
  }, [dealId]);
  return (
    <>
        <div className="timeline-tabscontent">
          <Tabs
            defaultActiveKey={defaultActiveKey}
            transition={false}
            onSelect={(e: any) => setdefaultActiveKey(e)}
            id="noanim-tab-example"
            className="mb-5 activity-subtab"
          >
            <Tab eventKey="activity_sub" title="Activity">
              {/* <div className="activityfilter-row pb-3">
              <div className="activityfilter-col1">
                <label>Filter by:</label>
                <select className="">
                  <option>Filter activities (1/19)</option>
                  <option>Filter activities (5/19)</option>
                  <option>Filter activities (8/19)</option>
                  <option>Filter activities (13/19)</option>
                  <option>Filter activities (19/19)</option>
                </select>
                <Dropdown className="dropdown-link dropdown-alluser ml-2">
                  <Dropdown.Toggle id="dropdown-alluser">
                    All users
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-alluserlist">
                    <Dropdown.Item href="#/action-1">User One</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">User Two</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div> */}
              {defaultActiveKey === "activity_sub" && (
                <DealLogsList dealItem={dealItem} dealId={dealId}/>
              )}
            </Tab>
            <Tab eventKey="notes" title="Notes">
              {defaultActiveKey == "notes" && (
                <NotesList dealId={dealItem.dealID} />
              )}
            </Tab>
            <Tab
              eventKey="email"
              title="Email"
              hidden={defaultActiveKey != "email"}
            >
              {defaultActiveKey == "email" && (
                <AuthProvider>
                  <EmailActivites dealId={dealItem.dealID} />
                </AuthProvider>
              )}
            </Tab>
            <Tab eventKey="calls" title="Calls">
          {defaultActiveKey === "calls" && <CallsActivites callHistory={callHistory} />}
           </Tab>
            <Tab eventKey="tasks" title="Tasks">
              {defaultActiveKey == "tasks" && (
                <AuthProvider>
                  <TasksList dealId={dealItem.dealID} />
                </AuthProvider>
              )}
            </Tab>
          </Tabs>
        </div>
    </>
  );
};

export default DealActivities;
