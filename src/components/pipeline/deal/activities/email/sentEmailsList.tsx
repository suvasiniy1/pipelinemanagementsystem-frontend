import {
  faCircleCheck,
  faEdit,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { Accordion } from "react-bootstrap";
import Comments from "../common/comment";
import { useEffect, useRef } from "react";

type params = {
  email: any;
  index: number;
  setDialogIsOpen: any;
  setShowDeleteDialog: any;
  selectedIndex: any;
  setSelectedIndex: any;
  setSelectedEmail:any;
  
};
const SentEmailsList = (props: params) => {
  const { index, email, selectedIndex, ...others } = props;
  const {subject, sender, sentDateTime, body}=email;
  const divRef = useRef();

  useEffect(() => {
    if (divRef) {
        (divRef.current as any).innerHTML = body?.content;
    }
}, [props])

  return (
    <Accordion.Item eventKey={"" + index} key={index}>
      <Accordion.Header
        onClick={(e: any) => {
          props.setSelectedIndex((prevIndex: any) =>
            prevIndex === index ? null : index
          );
        }}
      >
        <span className="accoheader-title">
          <strong>Email - {subject}</strong> from {sender?.emailAddress?.name}
        </span>
        <span className="accoheader-date">
          {moment(sentDateTime).format("MM-DD-YYYY hh:mm:ss a")}
        </span>
      </Accordion.Header>
      <Accordion.Body>
        <div
          ref={divRef as any}
          style={{ maxHeight: "200px", overflow: "auto" }}
        ></div>
        <div className="editstage-delete">
          <button
            className="editstage-deletebtn"
            onClick={(e: any) => {
                
              props.setDialogIsOpen(true);
              props.setSelectedEmail(email as any);
            }}
          >
            <strong>Reply</strong>
          </button>
          {/* <button
            className="editstage-deletebtn"
            onClick={(e: any) => {
              props.setShowDeleteDialog(true);
              props.setSelectedEmail(email as any);
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button> */}
        </div>
      </Accordion.Body>
      <div className="accofooter" hidden={index == selectedIndex}>
        <FontAwesomeIcon icon={faCircleCheck} style={{ paddingRight: 5 }} />
        {subject}
      </div>
    </Accordion.Item>
  );
};

export default SentEmailsList;
