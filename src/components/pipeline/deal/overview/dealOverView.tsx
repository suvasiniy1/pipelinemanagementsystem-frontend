import {
  faEllipsis,
  faGear,
  faPenToSquare,
  faPencil,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios, { AxiosError } from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Dropdown from "react-bootstrap/Dropdown";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { ErrorBoundary } from "react-error-boundary";
import { UnAuthorized } from "../../../../common/unauthorized";
import SelectDropdown from "../../../../elements/SelectDropdown";
import { Deal } from "../../../../models/deal";
import { Notes } from "../../../../models/notes";
import { Stage } from "../../../../models/stage";
import { NotesService } from "../../../../services/notesService";
import DealActivities from "../activities/dealActivities";
import { IsMockService } from "../../../../others/util";
import { DealService } from "../../../../services/dealService";
import { useLocation } from "react-router-dom";

type params = {
  dealItem: Deal;
  dealId:number;
  stages: Array<Stage>;
  setDealItem: any;
  onDealModified: any;
};
const DealOverView = (props: params) => {
  const { dealItem, dealId, stages, setDealItem, onDealModified, ...others } = props;
  const { createdDate, pipelineName, stageName } = dealItem;
  const recentActivitesFilters: Array<any> = ["All Activities"].map(
    (item: any) => ({ name: item, value: item })
  );
  const location = useLocation(); 
  const [pipelineId, setPipelineId] = useState<number | null>(null);
  const [activityFilter, setActivityFilter] = useState("All Activities");
  const notesSvc = new NotesService(ErrorBoundary);
  const dealSvc = new DealService(ErrorBoundary); // Instantiate DealService
  const [notesList, setNotesList] = useState<Array<Notes>>([]);
  const [error, setError] = useState<AxiosError>();
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [callHistory, setCallHistory] = useState<Array<any>>([]);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newDealId = Number(queryParams.get("id"));
    const newPipelineId = Number(queryParams.get("pipeLineId"));

    if (newDealId !== dealId) {
      setDealItem((prevItem: Deal) => ({ ...prevItem, dealId: newDealId }));
    }
    if (newPipelineId !== pipelineId) {
      setPipelineId(newPipelineId);
    }
  }, [location.search]);
  // Fetch notes when dealId changes
  useEffect(() => {
    if (!dealId) return;

    notesSvc.getNotes(dealId)
      .then((res) => {
        setNotesList(
          IsMockService()
            ? (res as Array<Notes>).filter((n) => n.dealID === dealId)
            : res
        );
      })
      .catch((err) => setError(err));
  }, [dealId,notesSvc]);

  useEffect(() => {
    if (!dealId) return;

    const axiosCancelSource = axios.CancelToken.source();

    const fetchCallHistory = async () => {
      try {
        const response = await dealSvc.getDealsById(dealId, axiosCancelSource);
        if (response) {
          setDealItem(response);
          setCallHistory(response.callHistory || []);
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
  }, [dealId, setDealItem, dealSvc]);

// Function to update the deal status

const updateDealStatus = async (status: string) => {
  try {
    const isClosed = status === 'Won' || status === 'Lost';

    const statusIdMap: { [key: string]: number } = {
      "Open": 1,
      "Won": 2,
      "Lost": 3,
      "Closed": 4,
    };

    const updatedDeal = {
      ...dealItem,
      StatusID: statusIdMap[status], 
      isClosed,
      ModifiedDate: new Date(),
    };

    const response = await dealSvc.updateAllDeals([updatedDeal]);

    if (response) {

      setTimeout(() => {
        setDealItem({ ...dealItem, ...updatedDeal });
        alert(`Deal marked as ${status}`);
       // onDealModified(status);
      }, 100); 
    }
  } catch (error) {
    console.error('Failed to update deal status', error);
    alert('Failed to update deal status');
  }
};


const handleWonClick = () => {
  updateDealStatus('Won');
};

const handleLostClick = () => {
  updateDealStatus('Lost');
};

  return (
    <>
      {error && <UnAuthorized error={error as any} />}
      <div className="timelinecontent-col">
        <div className="timelinecontent">
          <div className="timeline-block">
            <div className="pdstage-detailtop pt-3 pb-4">
              <div className="container-fluid">
                <div className="pdsdetailtop-row">
                  <div className="pdsdetail-title">
                    <h1>
                      {dealItem?.name}{" "}
                      <button className="titleeditable-btn">
                        <FontAwesomeIcon icon={faPencil} />
                      </button>
                    </h1>
                  </div>
                  <div className="pdsdetail-topright">
                    {/* <div className="rottingdays"><label className="rottingdays-label bg-danger">Rotting for {dealItem?.probability} days</label></div>
                                                    <div className="pdsdetail-avatar">
                                                        <div className="pdsavatar-row">
                                                            <div className="pdsavatar-img"><FontAwesomeIcon icon={faCircleUser} /></div>
                                                            <div className="pdsavatar-name">
                                                                <div className='pdsavatar-ownername'><a href=''>{dealItem?.personName}</a></div>
                                                                <div className='pdsavatar-owner'>Owner</div>
                                                                <button className='ownerbutton'><FontAwesomeIcon icon={faSortDown} /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button className="follower-button"><span className="followerlabel">1 follower</span><FontAwesomeIcon icon={faSortDown} /></button>
                                                     */}
                    <div className="wonlost-btngroup">
                      <button className="btn btn-success wonbtn" onClick={handleWonClick}>
                        <span className="label">
                          <FontAwesomeIcon icon={faThumbsUp} />
                        </span>
                      </button>
                      <button className="btn btn-danger lostbtn" onClick={handleLostClick}>
                        <span className="label">
                          <FontAwesomeIcon icon={faThumbsDown} />
                        </span>
                      </button>
                    </div>
                    <div className="ellipsis-btncol">
                      <button className="ellipsis-btn">
                        <FontAwesomeIcon icon={faEllipsis} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="stageday-bar pt-4 pb-4">
                  <div className="pipelinestage-selector pipelinestage-active">
                    {stages.map((sItem, sIndex) => (
                      <div
                        key={sIndex}
                        className={
                          "pipelinestage " +
                          (sItem.stageID == dealItem?.stageID
                            ? "pipelinestage-current"
                            : "")
                        }
                        aria-label={sItem.stageName}
                        title={sItem.stageName}
                        onClick={(e: any) => {
                          setDealItem({ ...dealItem, stageID: sItem.stageID });
                          onDealModified(sItem.stageID);
                        }}
                      >
                        <label>{sItem.stageName}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="timeline-blockinner">
              <Tabs
                defaultActiveKey="overview"
                transition={false}
                onSelect={(e: any) => setSelectedTab(e)}
                id="noanim-tab-example"
                className="mb-5 timelinetab-block"
              >
                <Tab
                  eventKey="overview"
                  title="Overview"
                  className="timelinetab overviewtab"
                >
                  <div className="timeline-tabscontent">
                    <div className="whiteshadowbox datahighlightsbox">
                      <div className="tabcard-header">
                        <h2>Data Highlights</h2>
                        <div className="tabcard-actions">
                          <button className="summerysetting-btn">
                            <FontAwesomeIcon icon={faGear} />
                          </button>
                        </div>
                      </div>
                      <div className="tabcard-content">
                        <div className="datahighlights-list">
                          <div className="datahighlights-item">
                            <h3>Create Date</h3>
                            <div className="datahighlights-datetxt">
                              {createdDate as any}
                            </div>
                          </div>
                          <div className="datahighlights-item">
                            <h3>DEAL STAGE</h3>
                            <div className="datahighlights-datetxt">
                              {stageName} ( {pipelineName} Pipeline)
                            </div>
                          </div>
                          <div className="datahighlights-item">
                            <h3>LAST ACTIVITY DATE</h3>
                            <div className="datahighlights-datetxt">--</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="whiteshadowbox datahighlightsbox">
                      <div className="tabcard-header">
                        <h2>Recent activities</h2>
                      </div>
                      <div className="tabcard-content">
                        <div className="activityfilter-row pb-3">
                          <div className="activityfilter-col1">
                            <label>Filter by:</label>
                            <SelectDropdown
                              isValidationOptional={true}
                              list={recentActivitesFilters}
                              value={activityFilter}
                            />
                          </div>
                          <div className="activityfilter-col2">
                            <Dropdown className="dropdown-collapseall">
                              <Dropdown.Toggle id="dropdown-collapseall">
                                Collapse all
                              </Dropdown.Toggle>
                              <Dropdown.Menu className="dropdown-collapsealllist">
                                <Dropdown.Item href="#/action-1">
                                  Collapse all
                                </Dropdown.Item>
                                <Dropdown.Item href="#/action-3">
                                  Expand all
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </div>
                        <div className="activityfilter-accrow">
                          <Accordion className="activityfilter-acco">
                            {notesList.map((note, index) => (
                              <Accordion.Item eventKey={"" + index} key={index}>
                                <Accordion.Header>
                                  <span className="accoheader-title">
                                    <FontAwesomeIcon icon={faPenToSquare} />{" "}
                                    {note.userName} a{" "}
                                    <span className="accocolortext"> note</span>
                                  </span>
                                  <span className="accoheader-date">
                                    {moment(note.createdDate).format(
                                      "MM-DD-YYYY hh:mm:ss a"
                                    )}
                                  </span>
                                </Accordion.Header>
                                <Accordion.Body>
                                  {note.noteDetails}
                                </Accordion.Body>
                              </Accordion.Item>
                            ))}
                          </Accordion>
                        </div>
                      </div>
                    </div>
                      {/* Call History Panel */}
                      <div className="whiteshadowbox datahighlightsbox">
                    <div className="tabcard-header">
                      <h2>History</h2>
                    </div>
                    <div className="tabcard-content">
                    <Accordion className="activityfilter-acco">
                     {callHistory && callHistory.length > 0 ? (
                      callHistory.map((call, index) => (
                      <Accordion.Item eventKey={`call-${index}`} key={index}>
                        <Accordion.Header>
                            <span className="accoheader-title">
                                Call ID: {call.id} - {call.status === 'completed' ? 'Completed' : 'Missed'}
                            </span>
                            <span className="accoheader-date">
                                {moment(`${call.callDate} ${call.callTime}`).format("MM-DD-YYYY hh:mm:ss a")}
                            </span>
                        </Accordion.Header>
                        <Accordion.Body>
                            <p><strong>Call From:</strong> {call.contactName} {call.contactNumber}</p>
                            <p><strong>Received On:</strong> {call.justCallNumber}</p>
                            <p><strong>Assigned To:</strong> {call.agentName}</p>
                            {call.status === 'missed' && (
                                <p><strong>Missed Call Reason:</strong> {call.missedCallReason}</p>
                            )}
                        </Accordion.Body>
                      </Accordion.Item>
                     ))
                   ) : (
                   <p>No call history available.</p>
                 )}
                 </Accordion>
                 </div>
                </div>
                  </div>
                </Tab>
                <Tab
                  eventKey="activities"
                  title="Activities"
                  className="timelinesubtab activitiestab"
                >
                  {selectedTab === "activities" && (
                    <DealActivities dealItem={dealItem} dealId={dealId}/>
                  )}
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DealOverView;
