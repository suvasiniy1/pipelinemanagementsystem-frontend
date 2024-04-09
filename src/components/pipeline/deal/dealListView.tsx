import React from 'react'
import { Deal } from '../../../models/deal'
import LocalStorageUtil from '../../../others/LocalStorageUtil'
import { Utility } from '../../../models/utility'
import Constants from '../../../others/constants'

type params = {
    dealsList: Array<Deal>
}

const DealListView = (props: params) => {

    const { dealsList, ...others } = props;
    const utility: Utility = JSON.parse(LocalStorageUtil.getItemObject(Constants.UTILITY) as any);

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
                                                <div className="tbltitle-data"><a href="#">{d.title}</a></div>
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
                                                <div className="tblcontact-data"><a href="">{getContactPersonName(d.contactPersonID)}</a></div>
                                            </div>
                                        </td>
                                        <td className="pdlist-table-closedate">
                                            <div className="pdlisttable-item">
                                                {/* <div className="tbl-editicon">
                                                    <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                                </div> */}
                                                <div className="tblclosedate-data">{new Date(d.expectedCloseDate ).toLocaleDateString()}</div>
                                            </div>
                                        </td>
                                        <td className="pdlist-table-actdate">
                                            <div className="pdlisttable-item">
                                                <div className="tblactdate-data">{new Date(d.operationDate ).toLocaleDateString()}</div>
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
        </div>
    )
}

export default DealListView