import React from "react";
import moment from "moment";
import { Accordion } from "react-bootstrap";

type CallsActivitiesProps = {
  callHistory: any[];
};

const CallsActivities: React.FC<CallsActivitiesProps> = ({ callHistory }) => {
  // Log to confirm `callHistory` is received and structured as expected
  console.log("Rendering CallsActivities with callHistory:", callHistory);

  if (!Array.isArray(callHistory) || callHistory.length === 0) {
    return <p>No call history available.</p>;
  }

  return (
    <Accordion className="activityfilter-acco">
  {callHistory.map((call, index) => (
    <Accordion.Item eventKey={`call-${index}`} key={index}>
    <Accordion.Header>
        <span className="accoheader-title">
            Call ID: {call.id || "Unknown"} - {call.callInfo?.type || "Unknown Type"}
        </span>
        <span className="accoheader-date">
            {moment(`${call.callDate || "N/A"} ${call.callTime || "N/A"}`).isValid()
                ? moment(`${call.callDate} ${call.callTime}`).format("MM-DD-YYYY hh:mm:ss a")
                : "Invalid Date"}
        </span>
    </Accordion.Header>
    <Accordion.Body>
        <p>
            <strong>Call From:</strong> {call.contactName || "Unknown"} {call.contactNumber || "Unknown"}
        </p>
        <p>
            <strong>Received On:</strong> {call.justCallNumber || "Unknown"}
        </p>
        <p>
            <strong>Assigned To:</strong> {call.agentName || "Unassigned"}
        </p>
        {call.callInfo?.disposition && (
            <p>
                <strong>Disposition:</strong> {call.callInfo.disposition || "Not Provided"}
            </p>
        )}
        {call.callInfo?.notes && (
            <p>
                <strong>Notes:</strong> {call.callInfo.notes || "No Notes"}
            </p>
        )}
        {call.callInfo?.recording ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <p style={{ margin: 0 }}>
                    <strong>Recording:</strong>
                </p>
                <audio controls>
                    <source src={call.callInfo.recording || ""} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </div>
        ) : (
            <p>
                <strong>Recording:</strong> Not Available
            </p>
        )}
        {call.status && (
            <p>
                <strong>Status:</strong> {call.status || "Pending"}
            </p>
        )}
        {call.status === "missed" && (
            <p>
                <strong>Missed Call Reason:</strong> {call.missedCallReason || "Not Provided"}
            </p>
        )}
    </Accordion.Body>
</Accordion.Item>
  ))}
</Accordion>
  );
};

export default CallsActivities;
