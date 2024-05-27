import React, { useEffect, useState } from 'react'

import LocalStorageUtil from '../../others/LocalStorageUtil'
import { Utility } from '../../models/utility'
import Constants from '../../others/constants'
import { ErrorBoundary } from 'react-error-boundary'
import Util from '../../others/util'
import { AxiosError } from 'axios'
import { UnAuthorized } from '../../common/unauthorized'
import { useNavigate } from 'react-router-dom'
import {emailTemplate} from '../../models/emailTemplate'

type params = {
    pipeLineId:number;
}

export const EmailTemplate = () => {

    const [templates, setDealsList]=useState<Array<emailTemplate>>([])
    const utility: Utility = JSON.parse(LocalStorageUtil.getItemObject(Constants.UTILITY) as any);
    const [isLoading, setIsLoading]=useState(false);
   // const stagesSvc = new StageService(ErrorBoundary);
    const [pageSize, setPageSize] = useState(10);
    const [error, setError] = useState<AxiosError>();
    const navigator = useNavigate();


   

    const getOrganizationName=(orgId:number)=> utility.organizations.find(o=>o.organizationID==orgId)?.name;

    const getContactPersonName=(personId:number)=> utility.persons.find(p=>p.personID==personId)?.personName;
  
   
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
                                        <div className="pdlisttable-owner">Name</div>
                                    </th>
                                    <th className="pdlist-table-title">
                                        <div className="pdlisttable-title">Catagory</div>
                                    </th>
                                    <th className="pdlist-table-value">
                                        <div className="pdlisttable-value">Created By</div>
                                    </th>
                                    <th className="pdlist-table-org">
                                        <div className="pdlisttable-org ellipsistxt"><span>Created Date</span></div>
                                    </th>                                   
                                    <th className="pdlist-table-cogs">
                                        <div className="pdlisttable-cogs"><i className="rs-icon rs-icon-cogs"></i></div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {templates.map(d => (
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
                                                <div className="tblowner-data"><a href="">{d.TemplateName}</a></div>
                                            </div>
                                        </td>
                                        <td className="pdlist-table-title">
                                            <div className="pdlisttable-item">
                                                {/* <div className="tbl-editicon">
                                                    <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                                </div> */}
                                                <div className="tbltitle-data pdstage-descitem"><a href="#" >Template Body</a></div>
                                            </div>
                                        </td>
                                        <td className="pdlist-table-value">
                                            <div className="pdlisttable-item">
                                                {/* <div className="tbl-editicon">
                                                    <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                                </div> */}
                                                <div className="tblvalue-data">{d.createdBy}</div>
                                            </div>
                                        </td>
                                       
                                       
                                        <td className="pdlist-table-closedate">
                                            <div className="pdlisttable-item">
                                                {/* <div className="tbl-editicon">
                                                    <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                                </div> */}
                                                <div className="tblclosedate-data">{new Date(d.createdDate ).toLocaleDateString()}</div>
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

export default EmailTemplate