import { faAngleLeft, faPenToSquare, faEnvelope, faPhone, faCalendarDays, faListCheck, faAngleDown, faCircleCheck, faCommentDots, faBarsStaggered, faBuilding, faCircleUser, faEllipsis, faFileLines, faFlagCheckered, faGear, faMoneyBill, faPencil, faPlus, faScaleBalanced, faSortDown, faTag, faUser, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import { ErrorBoundary } from 'react-error-boundary';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { UnAuthorized } from '../../../common/unauthorized';
import { Deal } from '../../../models/deal';
import { Stage } from '../../../models/stage';
import Util, { IsMockService } from '../../../others/util';
import { DealService } from '../../../services/dealService';
import { StageService } from '../../../services/stageService';
import DealOverVitew from './overview/dealOverView';
import { DATEPICKER } from '../../../elements/datePicker';
import moment from 'moment';
import SelectDropdown from '../../../elements/SelectDropdown';
import { Utility } from '../../../models/utility';
import Constants from '../../../others/constants';
import LocalStorageUtil from '../../../others/LocalStorageUtil';
import DealOverView from './overview/dealOverView';
import NotesAddEdit from './activities/notes/notesAddEdit';

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
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const utility: Utility = JSON.parse(LocalStorageUtil.getItemObject(Constants.UTILITY) as any);
    const navigator = useNavigate();

    useEffect(() => {
        Promise.all([dealSvc.getDealsById(dealId), stagesSvc.getStages(pipeLineId)]).then(res => {
            
            if (res && res.length > 0) {
                setDealItem(IsMockService() ? res[0].find((d:Deal)=>d.dealID==dealId) : res[0]);
                let sortedStages = Util.sortList(res[1].stageDtos, "stageOrder");
                setStages(sortedStages);
            }
            setIsLoading(false);
        }).catch(err => {
            setIsLoading(false);
            setError(err);
        })
    }, [])

    const onDealModified = (stageId: number) => {

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
                    <div className="pdstage-detail">
                        <div className='sidebardetail-col'>
                            <div className='sidebardetailtopbar'>
                                <div className='appdealtopbartitle' onClick={(e: any) => navigator("/pipeline?pipelineID=" + pipeLineId)} >
                                    <a href="javascript:void(0);"><FontAwesomeIcon icon={faAngleLeft} /> Deals</a> </div>
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
                                        <h3>{dealItem?.title}</h3>
                                        <div className='appdealblock-titleedit'>
                                            <FontAwesomeIcon icon={faPencil} />

                                        </div>
                                    </div>
                                    <div className='appdealblock-data'>
                                        <div className='appdealblock-row'>
                                            <div className='appdeal-amount dflex'>Amount: <span className='appdeal-amountnum'>${dealItem.value}</span></div>
                                        </div>
                                        <div className='appdealblock-row'>
                                            <div className='appdeal-closedate dflex'>Close Date: <div className='closedateinput'>
                                                <DATEPICKER isValidationOptional={true}
                                                    selectedItem={dealItem}
                                                    value={moment(dealItem.operationDate).format("MM-DD-YYYY")} />
                                            </div></div>
                                        </div>
                                        <div className='appdealblock-row'>
                                            <div className='appdeal-closedate dflex'>Stage:
                                                <div className='stageappointment'>
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
                                        <div className='appdealblock-row'>
                                            <ul className='appdealblock-iconlist'>
                                                <li>
                                                    <button className='dealicon'><FontAwesomeIcon icon={faPenToSquare} onClick={(e:any)=>setDialogIsOpen(true)} /></button>
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
                                                <SelectDropdown isValidationOptional={true}
                                                    value={"" + dealItem.contactPersonID}
                                                    list={utility?.persons.map(({ personName, personID }) => ({ "name": personName, "value": personID })) ?? []} />
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
                        {dialogIsOpen && <NotesAddEdit dialogIsOpen={dialogIsOpen}
                            dealId={dealId}
                            setDialogIsOpen={setDialogIsOpen} />
                        }
                        <DealOverView dealItem={dealItem}
                            stages={stages}
                            setDealItem={setDealItem}
                            onDealModified={(e: any) => onDealModified(e)} />

                    </div>
                </div>
            }

        </>
    )
}