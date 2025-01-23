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
import DealsDialog from "./DealsDialog";


export const DealDetails = () => {
  const [dealId, setDealId] = useState(
    new URLSearchParams(useLocation().search).get("id") as any
  );
  const [pipeLineId, setPipeLineId] = useState(
    new URLSearchParams(useLocation().search).get("pipeLineId") as any
  );
  const [filterId, setFilterId] = useState(
    new URLSearchParams(useLocation().search).get("filterId") as any
  );
  const dealSvc = new DealService(ErrorBoundary);
  const [error, setError] = useState<AxiosError>();
  const [dealItem, setDealItem] = useState<Deal>({ ...new Deal(), openDealsCount: 0 });
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
  const location = useLocation();
  const [isDealsModalOpen, setIsDealsModalOpen] = useState(false);
  const [relatedDeals, setRelatedDeals] = useState([]);

  const [openDealsCount, setOpenDealsCount] = useState(dealItem.openDealsCount || 0);
  const [dealsData, setDealsData] = useState<Deal[]>([]); 
  

  useEffect(() => {}, [dealItem]);

  const convertUTCtoISO = (utcDateString:string) => {
    // Create a Date object from the UTC string
    let utcDate = new Date(utcDateString);

    // Convert to Indian Standard Time (IST), which is UTC +5:30
    // IST is 5 hours 30 minutes ahead of UTC
    let istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds

    // Adjust the UTC date by adding the IST offset
    let istDate = new Date(utcDate.getTime() + istOffset);

    // Convert the IST date to an ISO string in local time
    let istISO = istDate.toISOString();
    return istISO
  };

  const loadDealItem=()=>{
    dealSvc.getDealsById(dealId).then(res=>{
      setDealItem(
        IsMockService()
          ? res.find((d: Deal) => d.dealID == dealId)
          : {...res, operationDate:convertUTCtoISO(res.operationDate)}
      );
    })
  }

  useEffect(() => {
    Promise.all([dealSvc.getDealsById(dealId), stagesSvc.getStages(pipeLineId)])
      .then((res) => {
        if (res && res.length > 0) {
          setDealItem(
            IsMockService()
              ? res[0].find((d: Deal) => d.dealID == dealId)
              : {...res[0], operationDate:convertUTCtoISO(res[0].operationDate)}
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
  const fetchDealData = async (dealId: number, pipelineId: number) => {
    setIsLoading(true);
    try {
      // Fetch the deal data and stages concurrently
      const [dealData, stagesData] = await Promise.all([
        dealSvc.getDealsById(dealId),
        stagesSvc.getStages(pipelineId),
      ]);

      if (dealData && stagesData) {
        setDealItem(
          IsMockService()
            ? dealData.find((d: Deal) => d.dealID == dealId)
            : dealData
        );
        let sortedStages = Util.sortList(stagesData.stageDtos, "stageOrder");
        setStages(sortedStages);
      }
    } catch (err) {
      setError(err as AxiosError);
    } finally {
      setIsLoading(false);
    }
  };
  interface SimplifiedDeal {
    id: number;
    treatmentName: string;
    personName: string;
    ownerName: string;
}
 // Fetch deals data when opening the dialog
 const openMoveDealDialog = async () => {
  try {
      const relatedDealsData: Deal[] = await dealSvc.getDealsByPersonId(dealItem.contactPersonID);

      // Map relatedDealsData to ensure every deal has required fields for DataGrid
      const formattedData: Deal[] = relatedDealsData.map((deal) => ({
          ...deal, // spread all original properties
          id: deal.dealID, // if `dealID` is the unique identifier expected by DataGrid
          treatmentName: deal.treatmentName || 'No Title', // default title if missing
          personName: deal.personName || 'No Contact', // default contact person if missing
          ownerName: deal.ownerName || 'No Owner', // default owner if missing
      }));

      setDealsData(formattedData);
      setIsDealsModalOpen(true);
  } catch (error) {
      console.error("Error fetching related deals:", error);
  }
};
const closeMoveDealDialog = () => setIsDealsModalOpen(false);

  // Use the useLocation hook instead of the global location object
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newDealId = searchParams.get("id");
    const newPipelineId = searchParams.get("pipeLineId");

    if (newDealId && newPipelineId) {
      fetchDealData(Number(newDealId), Number(newPipelineId)); // Fetch new deal data based on new params
    }
  }, [location.search]); // Listen for changes to the URL search params

 

  const onDealModified = () => {
    console.log(new Date(dealItem.operationDate))
    dealSvc
      .putItemBySubURL(
        { ...dealItem, operationDate: new Date(dealItem.operationDate) },
        "" + dealItem.dealID
      )
      .then((res) => {
        toast.success("Deal updated successfully.");
        loadDealItem();
      })
      .catch((err) => {
        setError(err);
      });
  };

  const onStageModified = (stageId: number) => {
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
        loadDealItem();
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
                    navigator(`/pipeline?pipelineID=${pipeLineId}&filterId=${filterId}`)
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
                    <h3>{dealItem?.pipelineName}</h3>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={(e: any) => onDealModified()}
                    >
                      Save
                    </button>
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
                              setDealItem({
                                ...dealItem,
                                operationDate: moment(e).format("MM-DD-YYYY"),
                              })
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
              {/* Scrollable Content Panel */}
              <div className="app-detail-content">
                <div className="app-dealblock">
                  <div className="app-dealblock-inner">
                    <div className="appdealblock-head">
                      <div className="appblock-headcolleft">
                        <button className="appblock-collapse">
                          <span className="appblock-titlelabel">
                            <FontAwesomeIcon icon={faAngleDown} /> Transfer Ownership
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="appdealblock-data">
                      <div className="appdealblock-row mt-1">
                        <div className="appdeal-closedate dflex">
                          Deal Owner:{" "}
                          <div className="closedateinput">
                            <SelectDropdown
                              isValidationOptional={true}
                              onItemChange={(e: any) =>
                                setDealItem({ ...dealItem, assigntoId: e })
                              }
                              value={"" + dealItem.assigntoId}
                              list={
                                utility?.users.filter(u=>u.isActive).map(
                                  ({ name, id }) => ({
                                    name: name,
                                    value: id,
                                  })
                                ) ?? []
                              }
                            />
                            {/* <div className="appdeal-dtdetail">
                            <button className="btn fields-btnedit">
                              <FontAwesomeIcon icon={faPencil} />
                            </button>
                            <button className="btn fields-detailbtn">
                            Detail
                            </button>
                          </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="appdealblock-head">
                      <div className="appblock-headcolleft">
                        <button className="appblock-collapse">
                          <span className="appblock-titlelabel">
                            <FontAwesomeIcon icon={faAngleDown} /> About this deal
                          </span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="details-panel">
                      <div className="details-row">
                        <div className="details-label">Clinic -</div>
                        <div className="details-value">{dealItem.clinicName || "-"}</div>
                      </div>
                      <div className="details-row">
                        <div className="details-label">Source -</div>
                        <div className="details-value">{dealItem.sourceName || "-"}</div>
                      </div>
                      <div className="details-row">
                        <div className="details-label">Treatment -</div>
                        <div className="details-value">{dealItem.treatmentName || "-"}</div>
                      </div>
                    </div>
                    <div className=" appdeal-dtrow">
                      <DealDetailsCustomFields
                        dealItem={dealItem}
                        setDealItem={setDealItem}
                      />
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
                    {/* Content */}
                    <div className="details-panel">
                      <div className="details-row">
                        <div className="details-label">Phone -</div>
                        <div className="details-value">{dealItem.phone || "-"}</div>
                      </div>
                      <div className="details-row">
                        <div className="details-label">Email -</div>
                        <div className="details-value">{dealItem.email || "-"}</div>
                      </div>
                      <div className="details-row">
                        <div className="details-label">Person Name -</div>
                        <div className="details-value" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          {dealItem.personName || "-"}
                          <a
                            href="#"
                            onClick={openMoveDealDialog}
                            style={{ fontSize: "0.9em", color: "#007bff", textDecoration: "underline" }}
                          >
                            View Deals ({dealItem.openDealsCount || 0})
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="details-row">
                      <div className="details-label">Source -</div>
                      <div className="details-value">{dealItem.sourceName || "-"}</div>
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
              {/* Deals Dialog */}
              <DealsDialog
  show={isDealsModalOpen}
  onClose={closeMoveDealDialog}
  dealsData={dealsData.map((deal, index) => ({
    id: deal.dealID || index, // use index if dealID is not available
    treatmentName: deal.treatmentName || 'No Title', // ensure title has a value
    personName: deal.personName || 'No Contact', // default if undefined
    ownerName: deal.ownerName || 'No Owner', // default if undefined
  }))}
  stages={stages} // Pass the stages array
  currentStageId={dealItem.stageID} // Pass the current stage ID of the deal
/>
            <DealOverView
              dealItem={dealItem}
              dealId={dealId}
              stages={stages}
              setDealItem={setDealItem}
              onDealModified={(e: any) => onStageModified(e)}
            />
          </div>
        </div>
      )}
     
    </>
  );
};
