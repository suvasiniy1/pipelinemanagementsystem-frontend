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
import EmailThread from "./emailThread";
import { EmailThreadObject } from "../../../../../models/emailCompose";

type params = {
  email: any;
  index: number;
  setDialogIsOpen: any;
  setShowDeleteDialog: any;
  selectedIndex: any;
  setSelectedIndex: any;
  setSelectedEmail: any;
  emailsList: Array<any>;
};
const SentEmailsList = (props: params) => {
  ;
  const { index, email, selectedIndex, emailsList, ...others } = props;
  const { subject, sender, toRecipients, sentDateTime, body } = email;
  const divRef = useRef();

  useEffect(() => {
    if (divRef) {
      (divRef.current as any).innerHTML = body?.content;
    }
  }, [props]);

  const generateDynamicThreadObj = (input: any, index: number, threadEmails:Array<any>) => {
    let threadObj = new EmailThreadObject();
    let nestedObj = threadEmails?.find(
      (i) => new Date(i.sentDateTime) < new Date(input.sentDateTime)
    );
    threadObj.id = index;
    threadObj.sender = input.sender.emailAddress.name;
    threadObj.senderEmail = input.sender.emailAddress.address;
    threadObj.timestamp = input.sentDateTime;
    threadObj.content = input.body.content;
    threadObj.replies = nestedObj
      ? generateDynamicThreadObj(nestedObj, threadObj.id + 1, threadEmails)
      : [];
    return [threadObj];
  };

  const getNestedEmails = () => {
    ;
    let threadEmails = emailsList?.filter(
      (i) => new Date(i.sentDateTime) < new Date(email.sentDateTime)
    );
    let threadObj = new EmailThreadObject();
    let emailThread;

    if(threadEmails.length>0){
      let obj = threadEmails[0];
      let nestedObj = threadEmails?.find(
        (i) => new Date(i.sentDateTime) < new Date(obj.sentDateTime)
      );
      threadObj.id = 1;
      threadObj.sender = obj.sender.emailAddress.name;
      threadObj.senderEmail = obj.sender.emailAddress.address;
      threadObj.timestamp = obj.sentDateTime;
      threadObj.content = obj.body.content;
      threadObj.replies = nestedObj
        ? generateDynamicThreadObj(nestedObj, threadObj.id + 1, threadEmails)
        : [];
  
      emailThread = [threadObj];
    }
    return emailThread ?? [];
  };

  return (
    <div className="activityfilter-accrow mb-3">
      <Accordion className="activityfilter-acco">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <span className="accoheader-title">
              <strong>Email - </strong> from {sender?.emailAddress?.name}
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
            <div className="form-group-row d-flex">
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
              </div>
              <div className="editstage-delete" style={{ paddingLeft: "10px" }}>
                <button
                  className="editstage-deletebtn"
                  onClick={(e: any) => {
                    props.setShowDeleteDialog(true);
                    props.setSelectedEmail(email as any);
                  }}
                >
                  <strong>Delete</strong>
                </button>
              </div>
            </div>
            <br />
            <EmailThread emails={getNestedEmails()} isFirstNestedEmail={true} />
          </Accordion.Body>
          <div className="accofooter">
            <FontAwesomeIcon icon={faCircleCheck} /> {subject}
            {/* <span className="accoheader-date" style={{paddingLeft:"100px"}}>
              to{" "}
              {Array.from(
                toRecipients as Array<any>,
                (x: any) => x.emailAddress?.name
              )?.join(",")}
            </span> */}
          </div>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default SentEmailsList;
