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
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import UnfoldMoreOutlinedIcon from '@mui/icons-material/UnfoldMoreOutlined';

// Define the structure of a Call object based on the API response
type Call = {
  id: string;
  callDate: string;
  callTime: string;
  contactName?: string;
  contactNumber?: string;
  justCallNumber?: string;
  agentName?: string;
  callInfo?: {
    direction?: string;
    type?: string;
    disposition?: string;
    notes?: string;
    recording?: string;
    missedCallReason?: string;
  };
  duration?: number;
  campaign?: {
    id?: string;
    name?: string;
    type?: string;
  };
  status?: string;
  recordingUrl?: string;
  missedCallReason?: string;
};
type params = {
  dealItem: Deal;
  dealId:number;
};
const DealActivities = (props: params) => {
  const { dealItem, dealId, ...others } = props;
  const [callHistory, setCallHistory] = useState<Call[]>([]);
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
          // Map and add default values for required fields
          const updatedCallHistory = response.callHistory.map((call: any) => ({
            ...call,
            status: call.status || "Pending", // Default if missing
            callInfo: {
              ...call.callInfo,
              missedCallReason: call.callInfo?.missedCallReason || "Not Provided", // Default if missing
              recording: call.callInfo?.recording || "", // Default to empty string
            }
          }));

          setCallHistory(updatedCallHistory);
          console.log("Updated callHistory in state:", updatedCallHistory);
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
            <Tab eventKey="Newdesign" title="NewDesign">
              {defaultActiveKey == "Newdesign" && (
                <AuthProvider>
                  
                  <div className="appboxdata">

                    <div className="appboxdata-row">
                      <div className="lineroundicon PhoneInTalkOutlinedIcon"><PhoneInTalkOutlinedIcon /></div>                    
                      <div className="appboxdata-rowdata">
                          <div className="appboxdatarow-head">
                            <div className="appboxdatarow-headrow">
                              <h2>Gastric Sleeve</h2>
                              <div className="treedot-div">
                                  <a className="treedot-btn"><PushPinOutlinedIcon /> <MoreHorizOutlinedIcon /> <UnfoldMoreOutlinedIcon /></a>
                              </div>
                            </div>
                            <div className="appboxdata-meta appboxdata-headmeta">
                              <div className="appboxdatameta-date">Aprill 1 at 5:41 PM</div>
                              <div className="appboxdatameta-name"><FiberManualRecordIcon /> Linda Sehni</div>
                              <div className="appboxdatameta-leadname"><PersonOutlineIcon /> Megan Clarke</div>
                              <div className="appboxdatameta-clinic"><CorporateFareIcon /> Transform Weightloss</div>
                              <div className="appboxdatameta-service"><PaidOutlinedIcon /> Gastric Sleeve</div>
                            </div>

                          </div>
                          <div className="appboxdatarow-text">
                            <div className="appboxdatarow-textmsg">                              
                              <p>Hi, Megan Sorry I missed you today. I am responding to your enquiry regarding one of our Gastric Sleeve procedure. I will attempt to call you again soon from t...</p>
                            </div>
                          </div>
                          <div className="appboxdatarow-foot">
                            <div className="appboxdatafoot-call">
                                <div className="appboxdatafoot-calltext">
                                  <span>Call ID: 263716807</span> 
                                  <span>Call Duration: 00h 00m 02s</span> 
                                  <span>Date & Time: 1st Apr 2025, 0541pm</span> 
                                  <span>Called on: Megan Clarke (+447001060539)</span>
                                  <span>Called vis: (+447001060539)</span>
                                </div>
                            </div>
                            <div className="appboxdata-meta appboxdata-footmeta">
                              <div className="appboxdatameta-date">Aprill 1 at 5:41 PM</div>
                              <div className="appboxdatameta-name"><FiberManualRecordIcon /> Linda Sehni</div>
                              <div className="appboxdatameta-leadname"><PersonOutlineIcon /> Megan Clarke</div>
                              <div className="appboxdatameta-clinic"><CorporateFareIcon /> Transform Weightloss</div>
                              <div className="appboxdatameta-service"><PaidOutlinedIcon /> Gastric Sleeve</div>
                            </div>
                          </div>
                      </div>  
                    </div>
                    
                    <div className="appboxdata-row">
                      <div className="lineroundicon EmailOutlinedIcon"><EmailOutlinedIcon /></div>                    
                      <div className="appboxdata-rowdata">
                          <div className="appboxdatarow-head">
                            <div className="appboxdatarow-headrow">
                              <h2>Gastric Sleeve</h2>
                              <div className="treedot-div">
                                  <a className="treedot-btn"><PushPinOutlinedIcon /> <MoreHorizOutlinedIcon /> <UnfoldMoreOutlinedIcon /></a>
                              </div>
                            </div>
                            <div className="appboxdata-meta appboxdata-headmeta">
                              <div className="appboxdatameta-date">Aprill 1 at 5:41 PM</div>
                              <div className="appboxdatameta-name"><FiberManualRecordIcon /> Linda Sehni</div>
                              <div className="appboxdatameta-leadname"><PersonOutlineIcon /> Megan Clarke</div>
                              <div className="appboxdatameta-clinic"><CorporateFareIcon /> Transform Weightloss</div>
                              <div className="appboxdatameta-service"><PaidOutlinedIcon /> Gastric Sleeve</div>
                            </div>

                          </div>
                          <div className="appboxdatarow-text">
                            <div className="appboxdatarow-textmsg">                              
                              <p>Hi, Megan Sorry I missed you today. I am responding to your enquiry regarding one of our Gastric Sleeve procedure. I will attempt to call you again soon from t...</p>
                            </div>
                          </div>
                          <div className="appboxdatarow-foot">
                            <div className="appboxdatafoot-call">
                                <div className="appboxdatafoot-calltext">
                                  <span>Call ID: 263716807</span> 
                                  <span>Call Duration: 00h 00m 02s</span> 
                                  <span>Date & Time: 1st Apr 2025, 0541pm</span> 
                                  <span>Called on: Megan Clarke (+447001060539)</span>
                                  <span>Called vis: (+447001060539)</span>
                                </div>
                            </div>
                            <div className="appboxdata-meta appboxdata-footmeta">
                              <div className="appboxdatameta-date">Aprill 1 at 5:41 PM</div>
                              <div className="appboxdatameta-name"><FiberManualRecordIcon /> Linda Sehni</div>
                              <div className="appboxdatameta-leadname"><PersonOutlineIcon /> Megan Clarke</div>
                              <div className="appboxdatameta-clinic"><CorporateFareIcon /> Transform Weightloss</div>
                              <div className="appboxdatameta-service"><PaidOutlinedIcon /> Gastric Sleeve</div>
                            </div>
                          </div>
                      </div>  
                    </div>

                    <div className="appboxdata-row">
                      <div className="lineroundicon StickyNote2OutlinedIcon"><StickyNote2OutlinedIcon /></div>                      
                      <div className="appboxdata-rowdata">
                          <div className="appboxdatarow-head">
                            <div className="appboxdatarow-headrow">
                              <h2>Gastric Sleeve</h2>
                              <div className="treedot-div">
                                  <a className="treedot-btn"><PushPinOutlinedIcon /> <MoreHorizOutlinedIcon /> <UnfoldMoreOutlinedIcon /></a>
                              </div>
                            </div>
                            <div className="appboxdata-meta appboxdata-headmeta">
                              <div className="appboxdatameta-date">Aprill 1 at 5:41 PM</div>
                              <div className="appboxdatameta-name"><FiberManualRecordIcon /> Linda Sehni</div>
                              <div className="appboxdatameta-leadname"><PersonOutlineIcon /> Megan Clarke</div>
                              <div className="appboxdatameta-clinic"><CorporateFareIcon /> Transform Weightloss</div>
                              <div className="appboxdatameta-service"><PaidOutlinedIcon /> Gastric Sleeve</div>
                            </div>

                          </div>
                          <div className="appboxdatarow-text">
                            <div className="appboxdatarow-textmsg">                              
                              <p>Hi, Megan Sorry I missed you today. I am responding to your enquiry regarding one of our Gastric Sleeve procedure. I will attempt to call you again soon from t...</p>
                            </div>
                          </div>
                          <div className="appboxdatarow-foot">
                            <div className="appboxdatafoot-call">
                                <div className="appboxdatafoot-calltext">
                                  <span>Call ID: 263716807</span> 
                                  <span>Call Duration: 00h 00m 02s</span> 
                                  <span>Date & Time: 1st Apr 2025, 0541pm</span> 
                                  <span>Called on: Megan Clarke (+447001060539)</span>
                                  <span>Called vis: (+447001060539)</span>
                                </div>
                            </div>
                            <div className="appboxdata-meta appboxdata-footmeta">
                              <div className="appboxdatameta-date">Aprill 1 at 5:41 PM</div>
                              <div className="appboxdatameta-name"><FiberManualRecordIcon /> Linda Sehni</div>
                              <div className="appboxdatameta-leadname"><PersonOutlineIcon /> Megan Clarke</div>
                              <div className="appboxdatameta-clinic"><CorporateFareIcon /> Transform Weightloss</div>
                              <div className="appboxdatameta-service"><PaidOutlinedIcon /> Gastric Sleeve</div>
                            </div>
                          </div>
                      </div>  
                    </div>

                  </div>

                </AuthProvider>
              )}
            </Tab>
          </Tabs>
        </div>
    </>
  );
};

export default DealActivities;
