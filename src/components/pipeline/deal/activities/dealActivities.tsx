import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import UnfoldMoreOutlinedIcon from "@mui/icons-material/UnfoldMoreOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import { EntitType } from "../../../../models/deal";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { ErrorBoundary } from "react-error-boundary";
import { Deal, DealTimeLine } from "../../../../models/deal";
import { DealAuditLogService } from "../../../../services/dealAuditLogService";
import { DealService } from "../../../../services/dealService";
import CallsActivites from "./call/callsActivites";
import DealLogsList from "./dealActivityLogs/dealLogsList";
import { AuthProvider } from "./email/authProvider";
import EmailActivites from "./email/emailActivites";
import NotesList from "./notes/notesList";
import TasksList from "./tasks/tasksList";
import { Spinner } from "react-bootstrap";

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
  dealId: number;
};
const DealActivities = (props: params) => {
  const { dealItem, dealId, ...others } = props;
  const [callHistory, setCallHistory] = useState<Call[]>([]);
  const [defaultActiveKey, setdefaultActiveKey] = useState("activity_sub");
  const [error, setError] = useState(null);
  // Initialize DealService
  const dealSvc = new DealService(ErrorBoundary);
  const dealAuditLogSvc = new DealAuditLogService(ErrorBoundary);
  const [dealTimeLines, setDealTimeLines] = useState<Array<DealTimeLine>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCallHistory = async () => {
    try {
      const axiosCancelSource = axios.CancelToken.source();
      setIsLoading(true);
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
          },
        }));

        setCallHistory(updatedCallHistory);
        setIsLoading(false);
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

  const featchDealTimeLines = async () => {
    try {
      setIsLoading(true);
      let res = await dealAuditLogSvc.getDealTimeLine(dealId);
      setDealTimeLines(res as any);
      setIsLoading(false);
    } catch {}
  };

  useEffect(() => {
    if (!dealId) return;
    featchDealTimeLines();
    fetchCallHistory();
    setIsLoading(false);
  }, []);

  const getEventIcon = (eventType: number) => {
    let icon;
    switch (eventType) {
      case EntitType.Task:
        icon = <CorporateFareIcon />;
        break;
      case EntitType.Note:
        icon = <StickyNote2OutlinedIcon />;
        break;
      case EntitType.Email:
        icon = <EmailOutlinedIcon />;
        break;
      case EntitType.Deal:
        icon = <PaidOutlinedIcon />;
        break;
      case EntitType.Comment:
        icon = <FiberManualRecordIcon />;
        break;
      default:
        icon = <PhoneInTalkOutlinedIcon />;
    }
    return icon;
  };

  return (
    <>
      {isLoading ? (
        <div className="alignCenter">
          <Spinner />
        </div>
      ) : null}
      <div className="timeline-tabscontent">
        <Tabs
          defaultActiveKey={defaultActiveKey}
          transition={false}
          onSelect={(e: any) => {
            featchDealTimeLines();
            setdefaultActiveKey(e);
          }}
          id="noanim-tab-example"
          className="mb-5 activity-subtab"
        >
          <Tab eventKey="activity_sub" title="Activity">
            {defaultActiveKey == "activity_sub" && (
              <AuthProvider>
                {dealTimeLines.map((item, index) => (
                  <div className="appboxdata">
                    <div className="appboxdata-row">
                      <div className="lineroundicon PhoneInTalkOutlinedIcon">
                        {getEventIcon(item.eventTypeId) as any}
                      </div>
                      <div className="appboxdata-rowdata">
                        <div className="appboxdatarow-head">
                          <div className="appboxdatarow-headrow">
                            <h2>{item.eventType}</h2>
                            {/* <div className="treedot-div">
                              <a className="treedot-btn">
                                <PushPinOutlinedIcon />{" "}
                                <MoreHorizOutlinedIcon />{" "}
                                <UnfoldMoreOutlinedIcon />
                              </a>
                            </div> */}
                          </div>
                          <div className="appboxdata-meta appboxdata-headmeta">
                            <div className="appboxdatameta-date">
                              {moment(item.eventDate).format(
                                "MM-DD-YYYY hh:mm:ss a"
                              )}
                            </div>
                            <div className="appboxdatameta-service">
                              &nbsp;&nbsp;({item.timeline})
                            </div>
                            

                            {/* <div className="appboxdatameta-name">
                              <FiberManualRecordIcon /> Linda Sehni
                            </div>
                            <div className="appboxdatameta-leadname">
                              <PersonOutlineIcon /> Megan Clarke
                            </div>
                            <div className="appboxdatameta-clinic">
                              <CorporateFareIcon /> Transform Weightloss
                            </div>
                            <div className="appboxdatameta-service">
                              <PaidOutlinedIcon /> Gastric Sleeve
                            </div> */}
                          </div>
                        </div>

                        <div className="appboxdatarow-foot">
                          <div className="appboxdatafoot-call">
                            <div className="appboxdatafoot-calltext">
                              <span>{item.activityDetail}</span>
                            </div>
                          </div>
                          <div className="appboxdata-meta appboxdata-footmeta">
                            {/* <div className="appboxdatameta-date">
                              {moment(item.callDateTime).format(
                                "MM-DD-YYYY hh:mm:ss a"
                              )}
                            </div> */}
                            {/* <div className="appboxdatameta-name">
                              <FiberManualRecordIcon /> Linda Sehni
                            </div> */}
                            <div
                              className="appboxdatameta-leadname"
                              hidden={!item.contactNumber}
                            >
                              <PersonOutlineIcon /> {item.contactNumber}
                            </div>
                            {/* <div className="appboxdatameta-clinic">
                              <CorporateFareIcon /> Transform Weightloss
                            </div>
                            <div className="appboxdatameta-service">
                              <PaidOutlinedIcon /> Gastric Sleeve
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </AuthProvider>
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
            {defaultActiveKey === "calls" && (
              <CallsActivites callHistory={callHistory} />
            )}
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
