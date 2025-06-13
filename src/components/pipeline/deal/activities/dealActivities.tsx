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
import parse, { domToReact } from "html-react-parser";

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
  // Added heading and span tags to allowedTags for better parsing in extractSubjectFromHtml
  const allowedTags = ["b", "i", "u", "strong", "em", "p", "div", "br", "h1", "h2", "h3", "h4", "h5", "h6", "span"];

  const options = {
    replace: (domNode: any) => {
      if (domNode.type === "tag" && !allowedTags.includes(domNode.name)) {
        return <>{domToReact(domNode.children, options)}</>; // Flatten unwanted tags
      }
    },
  };

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
    } catch (error) {
      console.error("Error fetching deal timelines:", error);
    }
  };

  useEffect(() => {
    if (!dealId) return;
    featchDealTimeLines();
    fetchCallHistory();
  }, [dealId]);

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

  /**
   * Helper function to extract a potential subject from raw HTML content.
   * It prioritizes heading tags, then significant text blocks, and finally
   * a plain text line heuristic.
   * @param htmlString The raw HTML content from activityDetail.
   * @returns An object containing the extracted subject and the potentially adjusted body HTML.
   */
  const extractSubjectFromHtml = (htmlString: string): { subject: string; body: string } => {
 const tempDiv = document.createElement('div');
tempDiv.innerHTML = htmlString;

let extractedSubject = "";
let processedBodyHtml = htmlString; 


 const headingElements = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
for (const element of Array.from(headingElements)) {
const textContent = element.textContent?.trim();

if (textContent && textContent.length > 5 && textContent.length < 200 && !textContent.includes('<') && !textContent.includes('>')) {
 extractedSubject = textContent;

 element.remove(); 
 processedBodyHtml = tempDiv.innerHTML; 
 break;
 }
}


 if (!extractedSubject) {
 const potentialSubjectElements = tempDiv.querySelectorAll('p, div, span');
for (const element of Array.from(potentialSubjectElements)) {
 const textContent = element.textContent?.trim();

 if (textContent && textContent.length > 5 && textContent.length < 200 && !textContent.includes('<') && !textContent.includes('>')) {
 extractedSubject = textContent;
 element.remove(); 
processedBodyHtml = tempDiv.innerHTML; 
 break;
}
}
 }


 if (!extractedSubject) {
const plainText = tempDiv.textContent || ""; // Get all text content
        const lines = plainText.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);

        if (lines.length > 0 && lines[0].length > 5 && lines[0].length < 150) {
            extractedSubject = lines[0];
            const subjectEscaped = extractedSubject.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            const regex = new RegExp(`(<p[^>]*>\\s*)?${subjectEscaped}(\\s*<\\/p>)?`, 'i');

            const tempHtmlWithoutSubject = htmlString.replace(regex, '').trim(); 
            processedBodyHtml = tempHtmlWithoutSubject;
        }
 }


 if (!extractedSubject || extractedSubject.toLowerCase() === "email" || extractedSubject.toLowerCase() === "hi" || extractedSubject.toLowerCase() === "hello user") {
extractedSubject = "Email Activity";
 }

 return { subject: extractedSubject, body: processedBodyHtml };
 };

  const renderEmailContent = (item: DealTimeLine) => {
    let subject = "";
    let body = "";
    let toRecipients = "";
    let emailAddress = ""; // Added emailAddress for sender display

    try {
      const outerParsed = JSON.parse(item.activityDetail || "");

      if (outerParsed && typeof outerParsed.message === 'string') {
        const innerMessage = JSON.parse(outerParsed.message);
        subject = innerMessage.subject || "";
        body = innerMessage.body || "";
        toRecipients = innerMessage.toRecipients
          ? JSON.parse(innerMessage.toRecipients).join(', ')
          : '';
        emailAddress = innerMessage.emailAddress || ""; 
      } else {

        const { subject: extractedSubject, body: extractedBody } = extractSubjectFromHtml(item.activityDetail || "");
        subject = extractedSubject;
        body = extractedBody;

      }
    } catch (e) {
      console.warn("Error parsing activityDetail as JSON for email, falling back to HTML heuristic:", e);

      const { subject: extractedSubject, body: extractedBody } = extractSubjectFromHtml(item.activityDetail || "");
      subject = extractedSubject;
      body = extractedBody;

    }

    return (
      <div className="email-structured-content">
        <div className="email-header-line">
          {subject ? (
            <h3>{subject}</h3> // Use h3 for the subject
          ) : (
            <h4></h4> // Generic title if no clear subject
          )}
        </div>
        {/* Display sender information */}
        {emailAddress && (
          <p className="email-from-line">
            <strong>From:</strong> {emailAddress}
          </p>
        )}
        {/* Only show "To" if available and not empty */}
        {toRecipients && toRecipients.length > 0 && (
          <p className="email-to-line">
            <strong>To:</strong> {toRecipients}
          </p>
        )}
        <div className="email-body-content">
          {parse(body, options)} {/* Parse the HTML body */}
        </div>
        <p className="email-attachments-line">No attachments available.</p>
      </div>
    );
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
            // Only re-fetch if the active key is 'activity_sub' as that's where timelines are displayed
            if (e === "activity_sub") {
              featchDealTimeLines();
            }
            setdefaultActiveKey(e);
          }}
          id="noanim-tab-example"
          className="mb-5 activity-subtab"
        >
          <Tab eventKey="activity_sub" title="Activity">
            {defaultActiveKey === "activity_sub" && (
              <AuthProvider>
                {dealTimeLines.map((item, index) => (
                  <div className="appboxdata" key={index}> {/* Added key prop */}
                    <div className="appboxdata-row">
                      <div className="lineroundicon PhoneInTalkOutlinedIcon">
                        {getEventIcon(item.eventTypeId) as any}
                      </div>
                      <div className="appboxdata-rowdata">
                        <div className="appboxdatarow-head">
                          <div className="appboxdatarow-headrow">
                            <h2>
                              {item.eventTypeId === EntitType.Email ? "Email" : item.eventType}
                            </h2>
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
                          </div>
                        </div>

                        <div className="appboxdatarow-foot">
                          <div className="appboxdatafoot-call">
                            <div className="appboxdatafoot-calltext">
                              {item.eventTypeId === EntitType.Email ? (
                                renderEmailContent(item) // Pass the entire item to renderEmailContent
                              ) : (
                                parse(item.activityDetail || "", options)
                              )}
                            </div>
                          </div>
                          <div className="appboxdata-meta appboxdata-footmeta">
                            <div
                              className="appboxdatameta-leadname"
                              hidden={!item.contactNumber}
                            >
                              <PersonOutlineIcon /> {item.contactNumber}
                            </div>
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
            {defaultActiveKey === "notes" && (
              <NotesList dealId={dealItem.dealID} />
            )}
          </Tab>
          <Tab
            eventKey="email"
            title="Email"
          >
            {defaultActiveKey === "email" && (
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
            {defaultActiveKey === "tasks" && (
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