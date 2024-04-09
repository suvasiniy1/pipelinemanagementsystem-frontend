import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faPencil, faSortDown, faEllipsis, faAngleDown, faGear, faPlus, faMoneyBill, faTag, faScaleBalanced, faFlagCheckered, faUser, faBuilding, faBarsStaggered, faFileLines } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DealService } from '../../../services/dealService';
import { ErrorBoundary } from 'react-error-boundary';
import { AxiosError } from 'axios';
import { UnAuthorized } from '../../../common/unauthorized';
import { Spinner } from 'react-bootstrap';
import { Deal } from '../../../models/deal';
import { StageService } from '../../../services/stageService';
import { Stage } from '../../../models/stage';
import Util from '../../../others/util';
import { ToastContainer, toast } from "react-toastify";

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
                            <div className='app-dealblock'>
                                <div className='app-dealblock-inner'>
                                    <div className='appdealblock-head'>
                                        <div className='appblock-headcolleft'><button className="appblock-collapse"><span className="appblock-titlelabel"><FontAwesomeIcon icon={faAngleDown} /> Summary</span></button></div>
                                        <div className='appblock-headcolright'><button className="summerysetting-btn"><FontAwesomeIcon icon={faGear} /></button></div>
                                    </div>
                                    <div className='appdealblock-data'>
                                        <div className='dealvalue'>
                                            <div className='dealvalue-col'>
                                                <div className='dealvalueicon'><FontAwesomeIcon icon={faMoneyBill} /></div>
                                                <div className='fields-listrow'>£0
                                                    <button className='btn fields-editbtn'><FontAwesomeIcon icon={faPencil} /></button>
                                                </div>
                                            </div>
                                            <div className='products-addbutton'>
                                                <button className='btn'><FontAwesomeIcon icon={faPlus} /> Products</button>
                                            </div>
                                        </div>
                                        <div className='dealvalue-row'>
                                            <div className='dealvalueicon'><FontAwesomeIcon icon={faTag} /></div>
                                            <div className='dealvalue-rowdata'>
                                                <button className='summery-addlabels'>Add labels</button>
                                            </div>
                                        </div>
                                        <div className='dealvalue-row'>
                                            <div className='dealvalueicon'><FontAwesomeIcon icon={faScaleBalanced} /></div>
                                            <div className='dealvalue-rowdata'>
                                                <div className='summery-addlabels'>Set deal probability <button className='btn fields-editbtn'><FontAwesomeIcon icon={faPencil} /></button></div>
                                            </div>
                                        </div>
                                        <div className='dealvalue-row'>
                                            <div className='dealvalueicon'><FontAwesomeIcon icon={faFlagCheckered} /></div>
                                            <div className='dealvalue-rowdata'>
                                                <div className='summery-addlabels'>Set expected close date <button className='btn fields-editbtn'><FontAwesomeIcon icon={faPencil} /></button></div>
                                            </div>
                                        </div>
                                        <div className='dealvalue-row'>
                                            <div className='dealvalueicon'><FontAwesomeIcon icon={faUser} /></div>
                                            <div className='dealvalue-rowdata'>
                                                <div className='summery-addlabels'><a><strong>Stuart Taylor</strong></a> <button className='btn fields-editbtn'><FontAwesomeIcon icon={faPencil} /></button></div>
                                            </div>
                                        </div>
                                        <div className='dealvalue-row'>
                                            <div className='dealvalueicon'><FontAwesomeIcon icon={faBuilding} /></div>
                                            <div className='dealvalue-rowdata'>
                                                <div className='summery-addlabels'><a><strong>Transform</strong></a> <button className='btn fields-editbtn'><FontAwesomeIcon icon={faPencil} /></button></div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className='app-dealblock'>
                                <div className='app-dealblock-inner'>
                                    <div className='appdealblock-head'>
                                        <div className='appblock-headcolleft'><button className="appblock-collapse"><span className="appblock-titlelabel"><FontAwesomeIcon icon={faAngleDown} /> Details</span></button></div>
                                        <div className='appblock-headcolright'><button className="summerysetting-btn"><FontAwesomeIcon icon={faBarsStaggered} /></button> <button className="summerysetting-btn"><FontAwesomeIcon icon={faPencil} /></button></div>
                                    </div>
                                    <div className='appdealblock-data'>
                                        <div className='appdeal-dtrow'>
                                            <div className='appdeal-dtname'>Clinic</div>
                                            <div className='appdeal-dtvalue'><div className='appdeal-dtvalueedit'>-</div> <button className='btn fields-editbtn'><FontAwesomeIcon icon={faPencil} /></button></div>
                                        </div>
                                        <div className='appdeal-dtrow'>
                                            <div className='appdeal-dtname'>Referral Code</div>
                                            <div className='appdeal-dtvalue'><div className='appdeal-dtvalueedit'>-</div> <button className='btn fields-editbtn'><FontAwesomeIcon icon={faPencil} /></button></div>
                                        </div>
                                        <div className='appdeal-dtrow'>
                                            <div className='appdeal-dtname'>Source</div>
                                            <div className='appdeal-dtvalue'><div className='appdeal-dtvalueedit'>-</div> <button className='btn fields-editbtn'><FontAwesomeIcon icon={faPencil} /></button></div>
                                        </div>
                                        <div className='appdeal-dtrow'>
                                            <div className='appdeal-dtname'>Treatment</div>
                                            <div className='appdeal-dtvalue'><div className='appdeal-dtvalueedit'>-</div> <button className='btn fields-editbtn'><FontAwesomeIcon icon={faPencil} /></button></div>
                                        </div>
                                        <div className='appdeal-dtrow'>
                                            <div className='appdeal-dtname'>Enquiry</div>
                                            <div className='appdeal-dtvalue'><div className='appdeal-dtvalueedit'>-</div> <button className='btn fields-editbtn'><FontAwesomeIcon icon={faPencil} /></button></div>
                                        </div>
                                        <div className='appdeal-dtrow'>
                                            <div className='appdeal-dtname'>Appointment Status</div>
                                            <div className='appdeal-dtvalue'><div className='appdeal-dtvalueedit'>-</div> <button className='btn fields-editbtn'><FontAwesomeIcon icon={faPencil} /></button></div>
                                        </div>
                                        <div className='appdeal-dtrow'>
                                            <div className='appdeal-dtname'>PA First Name</div>
                                            <div className='appdeal-dtvalue'><div className='appdeal-dtvalueedit'>Charlotte</div> <button className='btn fields-editbtn'><FontAwesomeIcon icon={faPencil} /></button></div>
                                        </div>
                                        <div className='appdeal-dtrow'>
                                            <div className='appdeal-dtname'>Operation Date</div>
                                            <div className='appdeal-dtvalue'><div className='appdeal-dtvalueedit'>-</div> <button className='btn fields-editbtn'><FontAwesomeIcon icon={faPencil} /></button></div>
                                        </div>
                                        <div className='appdeal-dtrow'>
                                            <div className='appdeal-dtname'>Pipeline Type</div>
                                            <div className='appdeal-dtvalue'><div className='appdeal-dtvalueedit'>-</div> <button className='btn fields-editbtn'><FontAwesomeIcon icon={faPencil} /></button></div>
                                        </div>


                                    </div>
                                </div>
                            </div>
                            <div className='app-dealblock'>
                                <div className='app-dealblock-inner'>
                                    <div className='appdealblock-head'>
                                        <div className='appblock-headcolleft'><button className="appblock-collapse"><span className="appblock-titlelabel"><FontAwesomeIcon icon={faAngleDown} /> Person</span></button></div>
                                        <div className='appblock-headcolright'><button className="summerysetting-btn"><FontAwesomeIcon icon={faBarsStaggered} /></button> <button className="summerysetting-btn"><FontAwesomeIcon icon={faPencil} /></button> <button className="summerysetting-btn"><FontAwesomeIcon icon={faEllipsis} /></button></div>
                                    </div>
                                    <div className='appdealblock-data'>
                                        <div className='appdeal-dtrow'>
                                            <div className='appdeal-dtname'><FontAwesomeIcon icon={faCircleUser} /></div>
                                            <div className='appdeal-dtvalue'><div className='appdeal-dtvalueedit'><a className='text-primary'><strong>Stuart Taylor</strong></a></div> <button className='btn fields-editbtn'><FontAwesomeIcon icon={faPencil} /></button></div>
                                        </div>
                                        <div className='appdeal-dtrow'>
                                            <div className='appdeal-dtname'>Label</div>
                                            <div className='appdeal-dtvalue'><div className='appdeal-dtvalueedit'>-</div> <button className='btn fields-editbtn'><FontAwesomeIcon icon={faPencil} /></button></div>
                                        </div>
                                        <div className='appdeal-dtrow'>
                                            <div className='appdeal-dtname'>Email</div>
                                            <div className='appdeal-dtvalue'><div className='appdeal-dtvalueedit'><a href='mailto:stuart.taylor001@yahoo.com'>stuart.taylor001@yahoo.com</a> <br></br>(Work)</div> <button className='btn fields-editbtn'><FontAwesomeIcon icon={faPencil} /></button></div>
                                        </div>
                                        <div className='appdeal-dtrow'>
                                            <div className='appdeal-dtname'>First name</div>
                                            <div className='appdeal-dtvalue'><div className='appdeal-dtvalueedit'>Stuart</div> <button className='btn fields-editbtn'><FontAwesomeIcon icon={faPencil} /></button></div>
                                        </div>
                                        <div className='appdeal-dtrow'>
                                            <div className='appdeal-dtname'>Last name</div>
                                            <div className='appdeal-dtvalue'><div className='appdeal-dtvalueedit'>Taylor</div> <button className='btn fields-editbtn'><FontAwesomeIcon icon={faPencil} /></button></div>
                                        </div>
                                        <div className='appdeal-dtrow'>
                                            <div className='appdeal-dtname'>Clinic</div>
                                            <div className='appdeal-dtvalue'><div className='appdeal-dtvalueedit'>-</div> <button className='btn fields-editbtn'><FontAwesomeIcon icon={faPencil} /></button></div>
                                        </div>
                                        <div className='appdeal-dtrow'>
                                            <div className='appdeal-dtname'>First Name</div>
                                            <div className='appdeal-dtvalue'><div className='appdeal-dtvalueedit'>Charlotte</div> <button className='btn fields-editbtn'><FontAwesomeIcon icon={faPencil} /></button></div>
                                        </div>
                                        <div className='appdeal-dtrow'>
                                            <div className='appdeal-dtname'>Last Name</div>
                                            <div className='appdeal-dtvalue'><div className='appdeal-dtvalueedit'>-</div> <button className='btn fields-editbtn'><FontAwesomeIcon icon={faPencil} /></button></div>
                                        </div>
                                        <div className='appdeal-dtrow'>
                                            <div className='appdeal-dtname'>Source</div>
                                            <div className='appdeal-dtvalue'><div className='appdeal-dtvalueedit'>-</div> <button className='btn fields-editbtn'><FontAwesomeIcon icon={faPencil} /></button></div>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='timelinecontent-col'>
                            <div className='timelinecontent'>
                                <div className='timeline-block'>
                                    <div className='timeline-blockinner'>
                                        <div className='timeline-tabs'>
                                            <div className='timeline-tabslist'>
                                                <div className='timeline-tabswrap'>
                                                    <div className='timeline-tabslinks'>
                                                        <button className='tabbtn tabactive'><FontAwesomeIcon icon={faFileLines} /> <span>Notes</span></button>
                                                        <button className='tabbtn'><FontAwesomeIcon icon={faFileLines} /> <span>Activity</span></button>
                                                        <button className='tabbtn'><FontAwesomeIcon icon={faFileLines} /> <span>Meeting scheduler</span></button>
                                                        <button className='tabbtn'><FontAwesomeIcon icon={faFileLines} /> <span>Call</span></button>
                                                        <button className='tabbtn'><FontAwesomeIcon icon={faFileLines} /> <span>Email</span></button>
                                                        <button className='tabbtn'><FontAwesomeIcon icon={faFileLines} /> <span>Files</span></button>
                                                        <button className='tabbtn'><FontAwesomeIcon icon={faFileLines} /> <span>Documents</span></button>
                                                        <button className='tabbtn'><FontAwesomeIcon icon={faFileLines} /> <span>Invoice</span></button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='timeline-tabscontent'>
                                                <div className='notecomposer-tab'>
                                                    <br></br><br></br>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                </div>
            }
            <ToastContainer />
        </>
    )
}