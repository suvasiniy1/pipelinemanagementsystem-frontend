import { faAngleLeft, faPenToSquare, faEnvelope, faPhone, faCalendarDays, faListCheck, faAngleDown, faBarsStaggered, faBuilding, faCircleUser, faEllipsis, faFileLines, faFlagCheckered, faGear, faMoneyBill, faPencil, faPlus, faScaleBalanced, faSortDown, faTag, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import { ErrorBoundary } from 'react-error-boundary';
import { useLocation } from 'react-router-dom';
import { toast } from "react-toastify";
import { UnAuthorized } from '../../../common/unauthorized';
import { Deal } from '../../../models/deal';
import { Stage } from '../../../models/stage';
import Util from '../../../others/util';
import { DealService } from '../../../services/dealService';
import { StageService } from '../../../services/stageService';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

export const DealDetails = () => {

    const [dealId, setDealId] = useState(new URLSearchParams(useLocation().search).get("id") as any);
    const [pipeLineId, setPipeLineId] = useState(new URLSearchParams(useLocation().search).get("pipeLineId") as any);
    const dealSvc = new DealService(ErrorBoundary);
    const [error, setError] = useState<AxiosError>();
    const [dealItem, setDealItem] = useState<Deal>(new Deal());
    const [isLoading, setIsLoading] = useState(true);
    const stagesSvc = new StageService(ErrorBoundary);
    const [stages, setStages] = useState<Array<Stage>>([]);
    const userProfile = Util.UserProfile();

    useEffect(() => {
        Promise.all([dealSvc.getDealsById(dealId), stagesSvc.getStages(pipeLineId)]).then(res => {
            if (res && res.length > 0) {
                setDealItem(res[0]);
                let sortedStages = Util.sortList(res[1].stageDtos, "stageOrder");
                setStages(sortedStages);
            }
            setIsLoading(false);
        }).catch(err => {
            setIsLoading(false);
            setError(err);
        })
    }, [])

    const onDealModified = (stageId:number) => {
        
        dealSvc.putItemBySubURL({
            "newStageId": stageId,
            "modifiedById": userProfile.userId,
            "dealId": +dealItem.dealID
        }, +dealItem.dealID + "/stage").then(res => {
            toast.success("Deal updated successfully.")
        }).catch(err => {
            setError(err);
        })
    }

    return (
        <>
            {error && <UnAuthorized error={error as any} />}
            {isLoading ? <div className="alignCenter"><Spinner /></div> :
                <div className="pdstage-detailarea">
                    <div className="pdstage-detailtop pt-3 pb-4">
                        <div className="container-fluid">
                            <div className="pdsdetailtop-row">
                                <div className="pdsdetail-title">
                                    <h1>{dealItem?.name} <button className='titleeditable-btn'><FontAwesomeIcon icon={faPencil} /></button></h1>
                                </div>
                                <div className="pdsdetail-topright">
                                    <div className="rottingdays"><label className="rottingdays-label bg-danger">Rotting for {dealItem?.probability} days</label></div>
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
                                    <div className="wonlost-btngroup">
                                        <button className="btn btn-success wonbtn"><span className="label">Won</span></button>
                                        <button className="btn btn-danger lostbtn"><span className="label">Lost</span></button>
                                    </div>
                                    <div className="ellipsis-btncol">
                                        <button className="ellipsis-btn"><FontAwesomeIcon icon={faEllipsis} /></button>
                                    </div>
                                </div>
                            </div>
                            <div className='stageday-bar pt-3'>
                                <div className="pipelinestage-selector pipelinestage-active">
                                    {
                                        stages.map((sItem, sIndex) => (
                                            <label key={sIndex} className={'pipelinestage ' + (sItem.stageID == dealItem?.stageID ? 'pipelinestage-current' : '')} aria-label={sItem.stageName} title={sItem.stageName} onClick={(e: any) => {setDealItem({ ...dealItem, "stageID": sItem.stageID }); onDealModified(sItem.stageID)}}>{sItem.stageName}</label>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pdstage-detail">
                        <div className='sidebardetail-col'>
                            <div className='sidebardetailtopbar'>
                                <div className='appdealtopbartitle'><FontAwesomeIcon icon={faAngleLeft} /> Deals</div>
                                <div className='appdealtopbaractions'>
                                    <Dropdown className='dropdown-actionsbox'>
                                        <Dropdown.Toggle id="dropdown-actions">Actions</Dropdown.Toggle>
                                        <Dropdown.Menu className='dropdown-actionslist'>
                                            <Dropdown.Item href="#/action-1">Unfollow</Dropdown.Item>
                                            <Dropdown.Item href="#/action-2">View all properties</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">View property history</Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item href="#/action-4">View association history</Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item href="#/action-5">Merge</Dropdown.Item>
                                            <Dropdown.Item href="#/action-6">Delete</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className='app-dealblock'>
                                <div className='app-dealblock-inner'>
                                    <div className='appdealblock-title'>
                                        <h3>Consulting: Admiral blue</h3>
                                        <div className='appdealblock-titleedit'>
                                            <FontAwesomeIcon icon={faPencil} />
                                        
                                        </div>
                                    </div>
                                    <div className='appdealblock-data'>
                                        <div className='appdealblock-row'>
                                            <div className='appdeal-amount dflex'>Amount: <span className='appdeal-amountnum'>$2,500</span></div>
                                        </div>
                                        <div className='appdealblock-row'>
                                            <div className='appdeal-closedate dflex'>Close Date: <div className='closedateinput'><input type='date' placeholder='MM/DD/YYYY' /></div></div>
                                        </div>
                                        <div className='appdealblock-row'>
                                            <div className='appdeal-closedate dflex'>Stage: 
                                                <div className='stageappointment'>
                                                    <Dropdown className='dropdown-scheduledbox'>
                                                        <Dropdown.Toggle id="dropdown-scheduled">Appointment Scheduled</Dropdown.Toggle>
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
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='appdealblock-row'>
                                            <ul className='appdealblock-iconlist'>
                                                <li>
                                                    <button className='dealicon'><FontAwesomeIcon icon={faPenToSquare} /></button>
                                                    <span className='dealicon-name'>Note</span>
                                                </li>
                                                <li>
                                                    <button className='dealicon'><FontAwesomeIcon icon={faEnvelope} /></button>
                                                    <span className='dealicon-name'>Email</span>
                                                </li>
                                                <li>
                                                    <button className='dealicon'><FontAwesomeIcon icon={faPhone} /></button>
                                                    <span className='dealicon-name'>Call</span>
                                                </li>
                                                <li>
                                                    <button className='dealicon'><FontAwesomeIcon icon={faListCheck} /></button>
                                                    <span className='dealicon-name'>Task</span>
                                                </li>
                                                <li>
                                                    <button className='dealicon'><FontAwesomeIcon icon={faCalendarDays} /></button>
                                                    <span className='dealicon-name'>Metting</span>
                                                </li>
                                                <li>
                                                    <button className='dealicon'><FontAwesomeIcon icon={faEllipsis} /></button>
                                                    <span className='dealicon-name'>More</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='app-dealblock'>
                                <div className='app-dealblock-inner'>
                                    <div className='appdealblock-head'>
                                        <div className='appblock-headcolleft'><button className="appblock-collapse"><span className="appblock-titlelabel"><FontAwesomeIcon icon={faAngleDown} /> About this deal</span></button></div>
                                        <div className='appblock-headcolright'>
                                            <Dropdown className='dropdown-dealactionsbox'>
                                                <Dropdown.Toggle id="dropdown-dealactions">Actions</Dropdown.Toggle>
                                                <Dropdown.Menu className='dropdown-dealactionslist'>
                                                    <Dropdown.Item href="#/action-1">Edit properties</Dropdown.Item>
                                                    <Dropdown.Item href="#/action-2">View all properties</Dropdown.Item>
                                                    <Dropdown.Item href="#/action-3">View property history</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                            <button className="summerysetting-btn"><FontAwesomeIcon icon={faGear} /></button></div>
                                    </div>
                                    <div className='appdealblock-data'>
                                        <div className='appdeal-dtrow'>
                                            <div className='appdeal-dtname'>Deal owner</div>
                                            <div className='appdeal-dtvalue'>
                                                <select className='ownerselect'>
                                                    <option>No Owner</option>
                                                    <option selected>Pankur Patel</option>
                                                </select>
                                            </div>
                                            <div className='appdeal-dtdetail'>
                                                <button className='btn fields-btnedit'><FontAwesomeIcon icon={faPencil} /></button>
                                                <button className='btn fields-detailbtn'>Detail</button>
                                            </div>
                                        </div>
                                        <div className='appdeal-dtrow'>
                                            <div className='appdeal-dtname'>Last contacted</div>
                                            <div className='appdeal-dtvalue'>
                                            -
                                            </div>
                                            <div className='appdeal-dtdetail'>                                                
                                                <button className='btn fields-detailbtn'>Detail</button>
                                            </div>
                                        </div>
                                        <div className='appdeal-dtrow'>
                                            <div className='appdeal-dtname'>Deal Type</div>
                                            <div className='appdeal-dtvalue'>
                                                <select className='ownerselect'>
                                                    <option selected></option>
                                                    <option>New Business</option>
                                                    <option>Existing Business</option>
                                                </select>
                                            </div>
                                            <div className='appdeal-dtdetail'>
                                                <button className='btn fields-btnedit'><FontAwesomeIcon icon={faPencil} /></button>
                                                <button className='btn fields-detailbtn'>Detail</button>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>
                           
                        </div>
                        <div className='timelinecontent-col'>
                            <div className='timelinecontent'>
                                <div className='timeline-block'>
                                    <div className='timeline-blockinner'>
                                        <Tabs
                                            defaultActiveKey="overview"
                                            transition={false}
                                            id="noanim-tab-example"
                                            className="mb-5 timelinetab-block"
                                            >
                                            <Tab eventKey="overview" title="Overview" className='timelinetab overviewtab'>
                                                <div className='timeline-tabscontent'>
                                                    <div className='whiteshadowbox datahighlightsbox'>
                                                        <div className='tabcard-header'>
                                                            <h2>Data Highlights</h2>
                                                            <div className='tabcard-actions'>
                                                                <button className='summerysetting-btn'><FontAwesomeIcon icon={faGear} /></button>
                                                            </div>
                                                        </div>
                                                        <div className='tabcard-content'>
                                                            <div className='datahighlights-list'>
                                                                <div className='datahighlights-item'>
                                                                    <h3>Create Date</h3>
                                                                    <div className='datahighlights-datetxt'>04/15/2024 2:03 PM GMT+5:30</div>
                                                                </div>
                                                                <div className='datahighlights-item'>
                                                                    <h3>DEAL STAGE</h3>
                                                                    <div className='datahighlights-datetxt'>Appointment Scheduled ( Sales Pipeline)</div>
                                                                </div>
                                                                <div className='datahighlights-item'>
                                                                    <h3>LAST ACTIVITY DATE</h3>
                                                                    <div className='datahighlights-datetxt'>--</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='whiteshadowbox datahighlightsbox'>
                                                        <div className='tabcard-header'>
                                                            <h2>Recent activities</h2>
                                                        </div>
                                                        <div className='tabcard-content'>
                                                            
                                                        </div>
                                                    </div>

                                                </div>
                                                
                                            </Tab>
                                            <Tab eventKey="activities" title="Activities" className='timelinetab activitiestab'>
                                                <div className='timeline-tabscontent'>
                                                    <Tabs
                                                        defaultActiveKey="activity_sub"
                                                        transition={false}
                                                        id="noanim-tab-example"
                                                        className="mb-5 activity-subtab"
                                                        >
                                                        <Tab eventKey="activity_sub" title="Activity">
                                                            Tab content for Home
                                                        </Tab>
                                                        <Tab eventKey="notes" title="Notes">
                                                            Tab content for Notes
                                                        </Tab>
                                                        <Tab eventKey="email" title="Email">
                                                            Tab content for Email
                                                        </Tab>
                                                        <Tab eventKey="calls" title="Calls">
                                                            Tab content for Calls
                                                        </Tab>
                                                        <Tab eventKey="tasks" title="Tasks">
                                                            Tab content for Tasks
                                                        </Tab>
                                                    </Tabs>

                                                </div>
                                            </Tab>
                                        </Tabs>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                </div>
            }

        </>
    )
}