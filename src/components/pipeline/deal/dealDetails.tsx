import { useMsal } from "@azure/msal-react";
import {
  faAngleDown,
  faAngleLeft,
  faEnvelope,
  faListCheck,
  faPencil,
  faPenToSquare,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import { ErrorBoundary } from "react-error-boundary";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UnAuthorized } from "../../../common/unauthorized";
import { DATEPICKER } from "../../../elements/datePicker";
import SelectDropdown from "../../../elements/SelectDropdown";
import { Deal } from "../../../models/deal";
import { EmailCompose } from "../../../models/emailCompose";
import { Stage } from "../../../models/stage";
import { Tasks } from "../../../models/task";
import { Utility } from "../../../models/utility";
import Constants from "../../../others/constants";
import LocalStorageUtil from "../../../others/LocalStorageUtil";
import Util, { IsMockService } from "../../../others/util";
import { DealService } from "../../../services/dealService";
import { StageService } from "../../../services/stageService";
import { loginRequest } from "./activities/email/authConfig";
import { prepareEmailBody } from "./activities/email/emailActivites";
import EmailComposeDialog from "./activities/email/emailComposeDialog";
import { sendEmail } from "./activities/email/emailService";
import NotesAddEdit from "./activities/notes/notesAddEdit";
import { TaskAddEdit } from "./activities/tasks/taskAddEdit";
import DealOverView from "./overview/dealOverView";
import DealDetailsCustomFields from "./dealDetailsCustomFields";

export const DealDetails = () => {
  const [dealId, setDealId] = useState(
    new URLSearchParams(useLocation().search).get("id") as any
  );
  const [pipeLineId, setPipeLineId] = useState(
    new URLSearchParams(useLocation().search).get("pipeLineId") as any
  );
  const dealSvc = new DealService(ErrorBoundary);
  const [error, setError] = useState<AxiosError>();
  const [dealItem, setDealItem] = useState<Deal>(new Deal());
  const [isLoading, setIsLoading] = useState(true);
  const stagesSvc = new StageService(ErrorBoundary);
  const [stages, setStages] = useState<Array<Stage>>([]);
  const userProfile = Util.UserProfile();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [selectedTaskItem, setSelectedTaskItem] = useState<Tasks>();
  const [selectedEmail, setSelectedEmail] = useState<any>();
  const [dialogToOpen, setDialogToOpen] = useState<string>("");
  const utility: Utility = JSON.parse(
    LocalStorageUtil.getItemObject(Constants.UTILITY) as any
  );
  const navigator = useNavigate();
  const { instance, accounts } = useMsal();


  useEffect(() => {}, [dealItem]);

  useEffect(() => {
    Promise.all([dealSvc.getDealsById(dealId), stagesSvc.getStages(pipeLineId)])
      .then((res) => {
        if (res && res.length > 0) {
          setDealItem(
            IsMockService()
              ? res[0].find((d: Deal) => d.dealID == dealId)
              : res[0]
          );
          let sortedStages = Util.sortList(res[1].stageDtos, "stageOrder");
          setStages(sortedStages);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err);
      });
  }, []);

  const onDealModified = (stageId: number) => {
    dealSvc
      .putItemBySubURL(
        {
          newStageId: stageId,
          modifiedById: userProfile.userId,
          dealId: +dealItem.dealID,
        },
        +dealItem.dealID + "/stage"
      )
      .then((res) => {
        toast.success("Deal updated successfully.");
      })
      .catch((err) => {
        setError(err);
      });
  };

  const handleSendEmail = async (emailObj: any) => {
    try {
      const accessTokenResponse = await instance.acquireTokenSilent({
        scopes: ["Mail.Send"],
        account: accounts[0],
      });
      // Send email logic here
      let response: any = await sendEmail(
        accessTokenResponse.accessToken,
        prepareEmailBody(emailObj, dealId),
        null
      );

      setDialogIsOpen(false);
      toast.success("Email sent successfully");
    } catch (error) {
      console.error("Email sending failed", error);
      setDialogIsOpen(false);
      toast.success("Unable to sent email please re try after sometime");
    }
  };

  const onLoginConfirm = async () => {
    try {
      let res = await instance.loginPopup(loginRequest);
      setDialogIsOpen(true);
      console.log("Login successful", res);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <>
      {error && <UnAuthorized error={error as any} />}
      {isLoading ? (
        <div className="alignCenter">
          <Spinner />
        </div>
      ) : (
        <div className="pdstage-detailarea">
          <div className="pdstage-detail">
            <div className="sidebardetail-col">
              <div className="sidebardetailtopbar">
                <div
                  className="appdealtopbartitle"
                  onClick={(e: any) =>
                    navigator("/pipeline?pipelineID=" + pipeLineId)
                  }
                >
                  <a href="javascript:void(0);">
                    <FontAwesomeIcon icon={faAngleLeft} /> Deals
                  </a>{" "}
                </div>
                <div className="appdealtopbaractions">
                  <Dropdown className="dropdown-actionsbox">
                    <Dropdown.Toggle id="dropdown-actions">
                      Actions
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-actionslist">
                      <Dropdown.Item href="#/action-6">Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>

              <div className="app-dealblock">
                <div className="app-dealblock-inner">
                  <div className="appdealblock-title">
                    <h3>{dealItem?.treatmentName}</h3>
                    <div className="appdealblock-titleedit">
                      <FontAwesomeIcon icon={faPencil} />
                    </div>
                  </div>
                  <div className="appdealblock-data">
                    <div className="appdealblock-row">
                      <div className="appdeal-amount dflex">
                        Deal:{" "}
                        <span className="appdeal-amountnum">
                          ${dealItem.title}
                        </span>
                      </div>
                    </div>
                    <div className="appdealblock-row mt-1">
                      <div className="appdeal-amount dflex">
                        Amount:{" "}
                        <span className="appdeal-amountnum">
                          ${dealItem.value}
                        </span>
                      </div>
                    </div>
                    <div className="appdealblock-row mt-1">
                      <div className="appdeal-closedate dflex">
                        Close Date:{" "}
                        <div className="closedateinput">
                          <DATEPICKER
                            onChange={(e: any) =>
                              setDealItem({ ...dealItem, operationDate: e })
                            }
                            isValidationOptional={true}
                            selectedItem={dealItem}
                            value={moment(dealItem.operationDate).format(
                              "MM-DD-YYYY"
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="appdealblock-row mt-1">
                      <div className="appdeal-closedate dflex">
                        Stage:
                        <div className="stageappointment">
                          {dealItem.stageName}
                          {/* <Dropdown className='dropdown-scheduledbox'>
                                                        <Dropdown.Toggle id="dropdown-scheduled">{dealItem.stageName}</Dropdown.Toggle>
                                                        <Dropdown.Menu className='dropdown-scheduledlist'>
                                                            <Dropdown.Item href="#/action-1">Unfollow</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-2">View all properties</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-3">View property history</Dropdown.Item>
                                                            <Dropdown.Divider />
                                                            <Dropdown.Item href="#/action-4">View association history</Dropdown.Item>
                                                            <Dropdown.Divider />
                                                            <Dropdown.Item href="#/action-5">Merge</Dropdown.Item>
                                                            <Dropdown.Item href="#/action-6">Delete</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown> */}
                        </div>
                      </div>
                    </div>
                    <div className="appdealblock-row mt-2">
                      <ul className="appdealblock-iconlist">
                        <li>
                          <button className="dealicon">
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              onClick={(e: any) => {
                                setDialogToOpen("NotesAddEdit" as any);
                                setDialogIsOpen(true);
                              }}
                            />
                          </button>
                          <span className="dealicon-name">Note</span>
                        </li>
                        <li>
                          <button className="dealicon">
                            <FontAwesomeIcon
                              icon={faEnvelope}
                              onClick={(e: any) => {
                                setSelectedEmail(new EmailCompose());
                                setDialogToOpen("EmailComposeDialog" as any);
                                accounts.length == 0
                                  ? onLoginConfirm()
                                  : setDialogIsOpen(true);
                              }}
                            />
                          </button>
                          <span className="dealicon-name">Email</span>
                        </li>
                        <li>
                          <button className="dealicon">
                            <FontAwesomeIcon icon={faPhone} />
                          </button>
                          <span className="dealicon-name">Call</span>
                        </li>
                        <li>
                          <button className="dealicon">
                            <FontAwesomeIcon
                              icon={faListCheck}
                              onClick={(e: any) => {
                                setDialogToOpen("TaskAddEdit" as any);
                                accounts.length == 0
                                  ? onLoginConfirm()
                                  : setDialogIsOpen(true);
                              }}
                            />
                          </button>
                          <span className="dealicon-name">Task</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="app-dealblock">
                <div className="app-dealblock-inner">
                  <div className="appdealblock-head">
                    <div className="appblock-headcolleft">
                      <button className="appblock-collapse">
                        <span className="appblock-titlelabel">
                          <FontAwesomeIcon icon={faAngleDown} /> About this deal
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="appdealblock-data">
                    <div className="appdeal-dtrow">
                      <div className="appdeal-dtname">Deal owner</div>
                      <div className="appdeal-dtvalue">
                        <SelectDropdown
                          isValidationOptional={true}
                          onItemChange={(e: any) =>
                            setDealItem({ ...dealItem, contactPersonID: e })
                          }
                          value={"" + dealItem.contactPersonID}
                          list={
                            utility?.persons.map(
                              ({ personName, personID }) => ({
                                name: personName,
                                value: personID,
                              })
                            ) ?? []
                          }
                        />
                        <div className="appdeal-dtdetail">
                          <button className="btn fields-btnedit">
                            <FontAwesomeIcon icon={faPencil} />
                          </button>
                          <button className="btn fields-detailbtn">
                            Detail
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className=" appdeal-dtrow">
                         <DealDetailsCustomFields dealItem={dealItem} setDealItem={setDealItem}/>  
                  </div>

                  <div className="appdealblock-head">
                    <div className="appblock-headcolleft">
                      <button className="appblock-collapse">
                        <span className="appblock-titlelabel">
                          <FontAwesomeIcon icon={faAngleDown} /> About Person
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="appdealblock-row mt-1">
                    <div className="appdeal-amount dflex">
                      Phone:{" "}
                      <span className="appdeal-amountnum">
                        {dealItem.phone}
                      </span>
                    </div>
                  </div>

                  <div className="appdealblock-row mt-1">
                    <div className="appdeal-amount dflex">
                      Email:{" "}
                      <span className="appdeal-amountnum">
                        {dealItem.email}
                      </span>
                    </div>
                  </div>

                  <div className="appdealblock-row mt-1">
                    <div className="appdeal-amount dflex">
                      Person Name:{" "}
                      <span className="appdeal-amountnum">
                        {dealItem.personName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {dialogIsOpen &&
              (dialogToOpen === "NotesAddEdit" ? (
                <NotesAddEdit
                  dialogIsOpen={dialogIsOpen}
                  dealId={dealId}
                  setDialogIsOpen={setDialogIsOpen}
                />
              ) : dialogToOpen === "EmailComposeDialog" ? (
                <EmailComposeDialog
                  fromAddress={accounts[0]}
                  dialogIsOpen={dialogIsOpen}
                  onCloseDialog={(e: any) => setSelectedEmail(null as any)}
                  selectedItem={selectedEmail ?? new EmailCompose()}
                  setSelectedItem={setSelectedEmail}
                  setDialogIsOpen={setDialogIsOpen}
                  onSave={(e: any) => {
                    handleSendEmail(e);
                  }}
                />
              ) : dialogToOpen === "TaskAddEdit" ? (
                <TaskAddEdit
                  dialogIsOpen={dialogIsOpen}
                  dealId={dealId}
                  taskItem={selectedTaskItem}
                  setDialogIsOpen={setDialogIsOpen}
                />
              ) : null)}
            <DealOverView
              dealItem={dealItem}
              dealId={dealId}
              stages={stages}
              setDealItem={setDealItem}
              onDealModified={(e: any) => onDealModified(e)}
            />
          </div>
        </div>
      )}
    </>
  );
};
