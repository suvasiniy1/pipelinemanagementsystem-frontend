import React, { useEffect, useState } from 'react'
import { Deal } from '../../../models/deal'
import LocalStorageUtil from '../../../others/LocalStorageUtil'
import { Utility } from '../../../models/utility'
import Constants from '../../../others/constants'
import { StageService } from '../../../services/stageService'
import { ErrorBoundary } from 'react-error-boundary'
import Util from '../../../others/util'
import { Stage } from '../../../models/stage'
import { AxiosError } from 'axios'
import { UnAuthorized } from '../../../common/unauthorized'
import { useNavigate } from 'react-router-dom'

type params = {
    pipeLineId:number;
}

const DealListView = (props: params) => {

    const [dealsList, setDealsList]=useState<Array<Deal>>([])
    const utility: Utility = JSON.parse(LocalStorageUtil.getItemObject(Constants.UTILITY) as any);
    const [isLoading, setIsLoading]=useState(false);
    const stagesSvc = new StageService(ErrorBoundary);
    const [pageSize, setPageSize] = useState(10);
    const [pipeLineId, setPipeLineId]=useState(props.pipeLineId)
    const [error, setError] = useState<AxiosError>();
    const navigator = useNavigate();

    const getOrganizationName=(orgId:number)=> utility.organizations.find(o=>o.organizationID==orgId)?.name;

    const getContactPersonName=(personId:number|null)=> utility.persons.find(p=>p.personID==personId)?.personName;

    useEffect(()=>{
        if(!isLoading){
            loadStages(pipeLineId);
        }
    },[pipeLineId])

    const loadStages = (pipeLineId:number, pagesize: number = 40) => {
        setIsLoading(true);
        stagesSvc.getStages(pipeLineId, 1, pagesize ?? pageSize).then(items => {
            let sortedStages = Util.sortList(items.stageDtos, "stageOrder");
            let totalDealsList: Array<Deal> = [];
            sortedStages.forEach((s: Stage) => {
                s.deals.forEach(d => {
                    totalDealsList.push(d);
                })
            });

            setDealsList([...totalDealsList])
            setIsLoading(false);

        }).catch(err => {
            setError(err);
        });
    }

    return (

        <div className="pdstage-area">
            <div className="container-fluid">

                <div className="pdlist-row">
                    <div className="pdlisttable-scroll">
                        <table className="pdlist-table">
                            <thead>
                                <tr>

                                    {/* <th className="pdlist-table-selectall">
                                        <div className="pdlisttable-select pdlisttable-select-all">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />
                                        </div>
                                    </th> */}
                                    <th className="pdlist-table-owner">
                                        <div className="pdlisttable-owner">Stage</div>
                                    </th>
                                    <th className="pdlist-table-title">
                                        <div className="pdlisttable-title">Title</div>
                                    </th>
                                    <th className="pdlist-table-value">
                                        <div className="pdlisttable-value">Value</div>
                                    </th>
                                    <th className="pdlist-table-org">
                                        <div className="pdlisttable-org ellipsistxt"><span>Organisation</span></div>
                                    </th>
                                    <th className="pdlist-table-contact">
                                        <div className="pdlisttable-contact ellipsistxt"><span>Contact Person</span></div>
                                    </th>
                                    <th className="pdlist-table-closedate">
                                        <div className="pdlisttable-closedate ellipsistxt"><span>Expected Close Date</span></div>
                                    </th>
                                    <th className="pdlist-table-actdate">
                                        <div className="pdlisttable-actdate ellipsistxt"><span>Next Activity Date</span></div>
                                    </th>
                                    <th className="pdlist-table-cogs">
                                        <div className="pdlisttable-cogs"><i className="rs-icon rs-icon-cogs"></i></div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {dealsList.map(d => (
                                    <tr>
                                        {/* <td className="pdlist-table-selectall">
                                            <div className="pdlisttable-select">
                                                <input type="checkbox" disabled name="check_FenF2XEA" value="" />
                                            </div>
                                        </td> */}
                                        <td className="pdlist-table-owner">
                                            <div className="pdlisttable-item">
                                                {/* <div className="tbl-editicon">
                                                    <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                                </div> */}
                                                <div className="tblowner-data"><a href="">{d.stageName}</a></div>
                                            </div>
                                        </td>
                                        <td className="pdlist-table-title">
                                            <div className="pdlisttable-item">
                                                {/* <div className="tbl-editicon">
                                                    <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                                </div> */}
                                                <div className="tbltitle-data pdstage-descitem"><a href="" onClick={(e: any) => navigator(`/deal?id=${d?.dealID}&pipeLineId=${d?.pipelineID}`)}>{d?.title}{d.title}</a></div>
                                            </div>
                                        </td>
                                        <td className="pdlist-table-value">
                                            <div className="pdlisttable-item">
                                                {/* <div className="tbl-editicon">
                                                    <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                                </div> */}
                                                <div className="tblvalue-data">£{d.value}</div>
                                            </div>
                                        </td>
                                        <td className="pdlist-table-org">
                                            <div className="pdlisttable-item">
                                                {/* <div className="tbl-editicon">
                                                    <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                                </div> */}
                                                <div className="tblorg-data"><a href="">{getOrganizationName(d.organizationID)}</a></div>
                                            </div>
                                        </td>
                                        <td className="pdlist-table-contact">
                                            <div className="pdlisttable-item">
                                                {/* <div className="tbl-editicon">
                                                    <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                                </div> */}
                                               <div className="tblcontact-data">
    <a href="">
        {d.contactPersonID !== undefined ? getContactPersonName(d.contactPersonID) : "No Contact"}
    </a>
</div>
                                            </div>
                                        </td>
                                        <td className="pdlist-table-closedate">
                                            <div className="pdlisttable-item">
                                                {/* <div className="tbl-editicon">
                                                    <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                                </div> */}
                                                <div className="tblclosedate-data">
    {d.expectedCloseDate 
        ? new Date(d.expectedCloseDate).toLocaleDateString() 
        : "N/A"}
</div>
                                            </div>
                                        </td>
                                        <td className="pdlist-table-actdate">
                                            <div className="pdlisttable-item">
                                            <div className="tblactdate-data">
    {d.operationDate 
        ? new Date(d.operationDate).toLocaleDateString() 
        : "N/A"}
</div>
                                            </div>
                                        </td>

                                        <td className="pdlist-table-cogs">
                                            <div className="pdlisttable-item">

                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>`

                    </div>
                </div>

            </div>
            {error && <UnAuthorized error={error as any} />}
        </div>
    )
}

export default DealListView