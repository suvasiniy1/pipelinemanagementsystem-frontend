import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Accordion } from "react-bootstrap";
import { DealAuditLog } from "../../../../../models/dealAutidLog";
import { UserProfile } from "../../../../../models/userProfile";
import Util from "../../../../../others/util";
import { useAuthContext } from "../../../../../contexts/AuthContext";

type params = {
  log: DealAuditLog;
  index: number;
  selectedIndex: any;
  setSelectedIndex: any;
};
const DealActivityDetails = (props: params) => {
  const { userProfile } = useAuthContext();
  const { index, selectedIndex, log, ...others } = props;
  const divRef = useRef();
  const userObj = userProfile || new UserProfile();

  useEffect(() => {
    if (divRef) {
      (divRef.current as any).innerHTML = log?.eventDescription;
    }
  }, [props]);

  return (
    <div className="activityfilter-accrow  mb-3">
      <Accordion.Item eventKey={"" + index} key={index}>
        <Accordion.Header
          onClick={(e: any) => {
            props.setSelectedIndex((prevIndex: any) =>
              prevIndex === index ? null : index
            );
          }}
        >
          <span className="accoheader-title">
            <strong>{log?.eventType}</strong> by {Util.getUserNameById(log?.createdBy)}
          </span>
          <span className="accoheader-date">
            {moment(log?.createdDate).format("MM-DD-YYYY hh:mm:ss a")}
          </span>
        </Accordion.Header>
        <Accordion.Body>
          <div
            ref={divRef as any}
            style={{ maxHeight: "200px", overflow: "auto" }}
          ></div>
        </Accordion.Body>
        <div className="accofooter" hidden={index == selectedIndex}>
          <FontAwesomeIcon icon={faCircleCheck} style={{ paddingRight: 5 }} />
          {log?.eventDescription?.replace(/<[^>]*>/g, "")}
        </div>
      </Accordion.Item>
    </div>
  );
};

export default DealActivityDetails;
