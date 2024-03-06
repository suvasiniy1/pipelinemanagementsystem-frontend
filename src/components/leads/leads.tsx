import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScaleBalanced, faBell, faInfoCircle, faTrash } from '@fortawesome/free-solid-svg-icons';

export const Leads = () => {
    return (
        
        <div className="pdstage-area">
            <div className="container-fluid">

                <div className="editstage-row scrollable-stages-container">
                    <div className="editstage-col">
                        <div className="editstagebox">
                            <div className="editstage-head">
                                <div className="editstage-headin">
                                    <div className="editstage-headlead">
                                        <div className="editstage-leadtitle">New Lead</div>
                                        <div className="editstage-leadicons">
                                            <div className="editstage-leadicon"><FontAwesomeIcon icon={faScaleBalanced} /> 100%</div>
                                            <div className="editstage-bellicon"><FontAwesomeIcon icon={faBell} /> 0 days</div>
                                        </div>
                                    </div>
                                    <div className="editstage-dragicon"><i className="rs-icon rs-icon-pause"></i></div>
                                </div>
                                <button className="editstage-plusicon plusiconleft"><i className="rs-icon rs-icon-plus"></i></button>
                                <button className="editstage-plusicon plusiconright"><i className="rs-icon rs-icon-plus"></i></button>
                            </div>
                            <div className="editstage-data">
                                <div className="editstage-innerdata">
                                    <div className="editstage-field">
                                        <div className="editstage-fieldname">Name</div>
                                        <div className="editstage-fieldinput">
                                            <div className="editstage-inputbox">
                                                <input className="form-control" type="text" value="New Lead" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="editstage-field">
                                        <div className="editstage-fieldname">Probability <div className="editstage-infoicon"><FontAwesomeIcon icon={faInfoCircle} /></div></div>
                                        <div className="editstage-fieldinput">
                                            <div className="editstage-inputbox">
                                                <input className="form-control" min="0" type="number" value="100" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="editstage-field">
                                        <div className="editstage-fieldcheck">
                                            <div className="editstage-checkbox">
                                                <label className="checktogglebox"><input type="checkbox" /><div className="checktoggle"></div></label>
                                                <div className="fieldchecklabel">Rotting in (days)</div>
                                                <div className="fieldcheck-infoicon"><FontAwesomeIcon icon={faInfoCircle} /></div>
                                            </div>                                            
                                            <div className="editstage-inputbox">
                                                <input className="form-control" min="0" type="number" value="0" />
                                            </div>
                                        </div>                                        
                                    </div>
                                </div>
                                <div className="editstage-delete">
                                    <div className="editstage-deleteinn">
                                        <button className="editstage-deletebtn"><FontAwesomeIcon icon={faTrash} /> <span>Delete Stage</span></button>
                                    </div>
                                </div>
                            </div>                            
                                                        
                        </div>
                    </div>
                    

                    <div className="editstage-col">
                        <div className="editstagebox">
                            <div className="editstage-head">
                                <div className="editstage-headin">
                                    <div className="editstage-headlead">
                                        <div className="editstage-leadtitle">1st Call</div>
                                        <div className="editstage-leadicons">
                                            <div className="editstage-leadicon"><FontAwesomeIcon icon={faScaleBalanced} /> 100%</div>
                                            <div className="editstage-bellicon"><FontAwesomeIcon icon={faBell} /> 0 days</div>
                                        </div>
                                    </div>
                                    <div className="editstage-dragicon"><i className="rs-icon rs-icon-pause"></i></div>
                                </div>
                                <button className="editstage-plusicon plusiconleft"><i className="rs-icon rs-icon-plus"></i></button>
                                <button className="editstage-plusicon plusiconright"><i className="rs-icon rs-icon-plus"></i></button>
                            </div>
                            <div className="editstage-data">
                                <div className="editstage-innerdata">
                                    <div className="editstage-field">
                                        <div className="editstage-fieldname">Name</div>
                                        <div className="editstage-fieldinput">
                                            <div className="editstage-inputbox">
                                                <input className="form-control" type="text" value="1st Call " />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="editstage-field">
                                        <div className="editstage-fieldname">Probability <div className="editstage-infoicon"><FontAwesomeIcon icon={faInfoCircle} /></div></div>
                                        <div className="editstage-fieldinput">
                                            <div className="editstage-inputbox">
                                                <input className="form-control" min="0" type="number" value="100" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="editstage-field">
                                        <div className="editstage-fieldcheck">
                                            <div className="editstage-checkbox">
                                                <label className="checktogglebox"><input type="checkbox" /><div className="checktoggle"></div></label>
                                                <div className="fieldchecklabel">Rotting in (days)</div>
                                                <div className="fieldcheck-infoicon"><FontAwesomeIcon icon={faInfoCircle} /></div>
                                            </div>                                            
                                            <div className="editstage-inputbox">
                                                <input className="form-control" min="0" type="number" value="0" />
                                            </div>
                                        </div>                                        
                                    </div>
                                </div>
                                <div className="editstage-delete">
                                    <div className="editstage-deleteinn">
                                        <button className="editstage-deletebtn"><FontAwesomeIcon icon={faTrash} /> <span>Delete Stage</span></button>
                                    </div>
                                </div>
                            </div>                            
                                                        
                        </div>
                    </div>

                    <div className="editstage-col">
                        <div className="editstagebox">
                            <div className="editstage-head">
                                <div className="editstage-headin">
                                    <div className="editstage-headlead">
                                        <div className="editstage-leadtitle">2nd Call</div>
                                        <div className="editstage-leadicons">
                                            <div className="editstage-leadicon"><FontAwesomeIcon icon={faScaleBalanced} /> 100%</div>
                                            <div className="editstage-bellicon"><FontAwesomeIcon icon={faBell} /> 0 days</div>
                                        </div>
                                    </div>
                                    <div className="editstage-dragicon"><i className="rs-icon rs-icon-pause"></i></div>
                                </div>
                                <button className="editstage-plusicon plusiconleft"><i className="rs-icon rs-icon-plus"></i></button>
                                <button className="editstage-plusicon plusiconright"><i className="rs-icon rs-icon-plus"></i></button>
                            </div>
                            <div className="editstage-data">
                                <div className="editstage-innerdata">
                                    <div className="editstage-field">
                                        <div className="editstage-fieldname">Name</div>
                                        <div className="editstage-fieldinput">
                                            <div className="editstage-inputbox">
                                                <input className="form-control" type="text" value="2nd Call " />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="editstage-field">
                                        <div className="editstage-fieldname">Probability <div className="editstage-infoicon"><FontAwesomeIcon icon={faInfoCircle} /></div></div>
                                        <div className="editstage-fieldinput">
                                            <div className="editstage-inputbox">
                                                <input className="form-control" min="0" type="number" value="100" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="editstage-field">
                                        <div className="editstage-fieldcheck">
                                            <div className="editstage-checkbox">
                                                <label className="checktogglebox"><input type="checkbox" /><div className="checktoggle"></div></label>
                                                <div className="fieldchecklabel">Rotting in (days)</div>
                                                <div className="fieldcheck-infoicon"><FontAwesomeIcon icon={faInfoCircle} /></div>
                                            </div>                                            
                                            <div className="editstage-inputbox">
                                                <input className="form-control" min="0" type="number" value="0" />
                                            </div>
                                        </div>                                        
                                    </div>
                                </div>
                                <div className="editstage-delete">
                                    <div className="editstage-deleteinn">
                                        <button className="editstage-deletebtn"><FontAwesomeIcon icon={faTrash} /> <span>Delete Stage</span></button>
                                    </div>
                                </div>
                            </div>                            
                                                        
                        </div>
                    </div>

                    <div className="editstage-col">
                        <div className="editstagebox">
                            <div className="editstage-head">
                                <div className="editstage-headin">
                                    <div className="editstage-headlead">
                                        <div className="editstage-leadtitle">3rd Call</div>
                                        <div className="editstage-leadicons">
                                            <div className="editstage-leadicon"><FontAwesomeIcon icon={faScaleBalanced} /> 100%</div>
                                            <div className="editstage-bellicon"><FontAwesomeIcon icon={faBell} /> 0 days</div>
                                        </div>
                                    </div>
                                    <div className="editstage-dragicon"><i className="rs-icon rs-icon-pause"></i></div>
                                </div>
                                <button className="editstage-plusicon plusiconleft"><i className="rs-icon rs-icon-plus"></i></button>
                                <button className="editstage-plusicon plusiconright"><i className="rs-icon rs-icon-plus"></i></button>
                            </div>
                            <div className="editstage-data">
                                <div className="editstage-innerdata">
                                    <div className="editstage-field">
                                        <div className="editstage-fieldname">Name</div>
                                        <div className="editstage-fieldinput">
                                            <div className="editstage-inputbox">
                                                <input className="form-control" type="text" value="3rd Call " />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="editstage-field">
                                        <div className="editstage-fieldname">Probability <div className="editstage-infoicon"><FontAwesomeIcon icon={faInfoCircle} /></div></div>
                                        <div className="editstage-fieldinput">
                                            <div className="editstage-inputbox">
                                                <input className="form-control" min="0" type="number" value="100" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="editstage-field">
                                        <div className="editstage-fieldcheck">
                                            <div className="editstage-checkbox">
                                                <label className="checktogglebox"><input type="checkbox" /><div className="checktoggle"></div></label>
                                                <div className="fieldchecklabel">Rotting in (days)</div>
                                                <div className="fieldcheck-infoicon"><FontAwesomeIcon icon={faInfoCircle} /></div>
                                            </div>                                            
                                            <div className="editstage-inputbox">
                                                <input className="form-control" min="0" type="number" value="0" />
                                            </div>
                                        </div>                                        
                                    </div>
                                </div>
                                <div className="editstage-delete">
                                    <div className="editstage-deleteinn">
                                        <button className="editstage-deletebtn"><FontAwesomeIcon icon={faTrash} /> <span>Delete Stage</span></button>
                                    </div>
                                </div>
                            </div>                            
                                                        
                        </div>
                    </div>
                    
                    <div className="editstage-col">
                        <div className="editstagebox">
                            <div className="editstage-head">
                                <div className="editstage-headin">
                                    <div className="editstage-headlead">
                                        <div className="editstage-leadtitle">4th Call</div>
                                        <div className="editstage-leadicons">
                                            <div className="editstage-leadicon"><FontAwesomeIcon icon={faScaleBalanced} /> 100%</div>
                                            <div className="editstage-bellicon"><FontAwesomeIcon icon={faBell} /> 0 days</div>
                                        </div>
                                    </div>
                                    <div className="editstage-dragicon"><i className="rs-icon rs-icon-pause"></i></div>
                                </div>
                                <button className="editstage-plusicon plusiconleft"><i className="rs-icon rs-icon-plus"></i></button>
                                <button className="editstage-plusicon plusiconright"><i className="rs-icon rs-icon-plus"></i></button>
                            </div>
                            <div className="editstage-data">
                                <div className="editstage-innerdata">
                                    <div className="editstage-field">
                                        <div className="editstage-fieldname">Name</div>
                                        <div className="editstage-fieldinput">
                                            <div className="editstage-inputbox">
                                                <input className="form-control" type="text" value="4th Call " />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="editstage-field">
                                        <div className="editstage-fieldname">Probability <div className="editstage-infoicon"><FontAwesomeIcon icon={faInfoCircle} /></div></div>
                                        <div className="editstage-fieldinput">
                                            <div className="editstage-inputbox">
                                                <input className="form-control" min="0" type="number" value="100" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="editstage-field">
                                        <div className="editstage-fieldcheck">
                                            <div className="editstage-checkbox">
                                                <label className="checktogglebox"><input type="checkbox" /><div className="checktoggle"></div></label>
                                                <div className="fieldchecklabel">Rotting in (days)</div>
                                                <div className="fieldcheck-infoicon"><FontAwesomeIcon icon={faInfoCircle} /></div>
                                            </div>                                            
                                            <div className="editstage-inputbox">
                                                <input className="form-control" min="0" type="number" value="0" />
                                            </div>
                                        </div>                                        
                                    </div>
                                </div>
                                <div className="editstage-delete">
                                    <div className="editstage-deleteinn">
                                        <button className="editstage-deletebtn"><FontAwesomeIcon icon={faTrash} /> <span>Delete Stage</span></button>
                                    </div>
                                </div>
                            </div>                            
                                                        
                        </div>
                    </div>

                    <div className="editstage-col">
                        <div className="editstagebox">
                            <div className="editstage-head">
                                <div className="editstage-headin">
                                    <div className="editstage-headlead">
                                        <div className="editstage-leadtitle">Final Call</div>
                                        <div className="editstage-leadicons">
                                            <div className="editstage-leadicon"><FontAwesomeIcon icon={faScaleBalanced} /> 100%</div>
                                            <div className="editstage-bellicon"><FontAwesomeIcon icon={faBell} /> 0 days</div>
                                        </div>
                                    </div>
                                    <div className="editstage-dragicon"><i className="rs-icon rs-icon-pause"></i></div>
                                </div>
                                <button className="editstage-plusicon plusiconleft"><i className="rs-icon rs-icon-plus"></i></button>
                                <button className="editstage-plusicon plusiconright"><i className="rs-icon rs-icon-plus"></i></button>
                            </div>
                            <div className="editstage-data">
                                <div className="editstage-innerdata">
                                    <div className="editstage-field">
                                        <div className="editstage-fieldname">Name</div>
                                        <div className="editstage-fieldinput">
                                            <div className="editstage-inputbox">
                                                <input className="form-control" type="text" value="Final Call " />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="editstage-field">
                                        <div className="editstage-fieldname">Probability <div className="editstage-infoicon"><FontAwesomeIcon icon={faInfoCircle} /></div></div>
                                        <div className="editstage-fieldinput">
                                            <div className="editstage-inputbox">
                                                <input className="form-control" min="0" type="number" value="100" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="editstage-field">
                                        <div className="editstage-fieldcheck">
                                            <div className="editstage-checkbox">
                                                <label className="checktogglebox"><input type="checkbox" /><div className="checktoggle"></div></label>
                                                <div className="fieldchecklabel">Rotting in (days)</div>
                                                <div className="fieldcheck-infoicon"><FontAwesomeIcon icon={faInfoCircle} /></div>
                                            </div>                                            
                                            <div className="editstage-inputbox">
                                                <input className="form-control" min="0" type="number" value="0" />
                                            </div>
                                        </div>                                        
                                    </div>
                                </div>
                                <div className="editstage-delete">
                                    <div className="editstage-deleteinn">
                                        <button className="editstage-deletebtn"><FontAwesomeIcon icon={faTrash} /> <span>Delete Stage</span></button>
                                    </div>
                                </div>
                            </div>                            
                                                        
                        </div>
                    </div>

                    <div className="editstage-col">
                        <div className="editstagebox">
                            <div className="editstage-head">
                                <div className="editstage-headin">
                                    <div className="editstage-headlead">
                                        <div className="editstage-leadtitle">Appointment Booked</div>
                                        <div className="editstage-leadicons">
                                            <div className="editstage-leadicon"><FontAwesomeIcon icon={faScaleBalanced} /> 100%</div>
                                            <div className="editstage-bellicon"><FontAwesomeIcon icon={faBell} /> 0 days</div>
                                        </div>
                                    </div>
                                    <div className="editstage-dragicon"><i className="rs-icon rs-icon-pause"></i></div>
                                </div>
                                <button className="editstage-plusicon plusiconleft"><i className="rs-icon rs-icon-plus"></i></button>
                                <button className="editstage-plusicon plusiconright"><i className="rs-icon rs-icon-plus"></i></button>
                            </div>
                            <div className="editstage-data">
                                <div className="editstage-innerdata">
                                    <div className="editstage-field">
                                        <div className="editstage-fieldname">Name</div>
                                        <div className="editstage-fieldinput">
                                            <div className="editstage-inputbox">
                                                <input className="form-control" type="text" value="Appointment Booked" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="editstage-field">
                                        <div className="editstage-fieldname">Probability <div className="editstage-infoicon"><FontAwesomeIcon icon={faInfoCircle} /></div></div>
                                        <div className="editstage-fieldinput">
                                            <div className="editstage-inputbox">
                                                <input className="form-control" min="0" type="number" value="100" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="editstage-field">
                                        <div className="editstage-fieldcheck">
                                            <div className="editstage-checkbox">
                                                <label className="checktogglebox"><input type="checkbox" /><div className="checktoggle"></div></label>
                                                <div className="fieldchecklabel">Rotting in (days)</div>
                                                <div className="fieldcheck-infoicon"><FontAwesomeIcon icon={faInfoCircle} /></div>
                                            </div>                                            
                                            <div className="editstage-inputbox">
                                                <input className="form-control" min="0" type="number" value="0" />
                                            </div>
                                        </div>                                        
                                    </div>
                                </div>
                                <div className="editstage-delete">
                                    <div className="editstage-deleteinn">
                                        <button className="editstage-deletebtn"><FontAwesomeIcon icon={faTrash} /> <span>Delete Stage</span></button>
                                    </div>
                                </div>
                            </div>                            
                                                        
                        </div>
                    </div>

                    <div className="editstage-col">
                        <div className="editstagebox">
                            <div className="editstage-head">
                                <div className="editstage-headin">
                                    <div className="editstage-headlead">
                                        <div className="editstage-leadtitle">CLOSED LEADS</div>
                                        <div className="editstage-leadicons">
                                            <div className="editstage-leadicon"><FontAwesomeIcon icon={faScaleBalanced} /> 100%</div>
                                            <div className="editstage-bellicon"><FontAwesomeIcon icon={faBell} /> 0 days</div>
                                        </div>
                                    </div>
                                    <div className="editstage-dragicon"><i className="rs-icon rs-icon-pause"></i></div>
                                </div>
                                <button className="editstage-plusicon plusiconleft"><i className="rs-icon rs-icon-plus"></i></button>
                                <button className="editstage-plusicon plusiconright"><i className="rs-icon rs-icon-plus"></i></button>
                            </div>
                            <div className="editstage-data">
                                <div className="editstage-innerdata">
                                    <div className="editstage-field">
                                        <div className="editstage-fieldname">Name</div>
                                        <div className="editstage-fieldinput">
                                            <div className="editstage-inputbox">
                                                <input className="form-control" type="text" value="CLOSED LEADS" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="editstage-field">
                                        <div className="editstage-fieldname">Probability <div className="editstage-infoicon"><FontAwesomeIcon icon={faInfoCircle} /></div></div>
                                        <div className="editstage-fieldinput">
                                            <div className="editstage-inputbox">
                                                <input className="form-control" min="0" type="number" value="100" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="editstage-field">
                                        <div className="editstage-fieldcheck">
                                            <div className="editstage-checkbox">
                                                <label className="checktogglebox"><input type="checkbox" /><div className="checktoggle"></div></label>
                                                <div className="fieldchecklabel">Rotting in (days)</div>
                                                <div className="fieldcheck-infoicon"><FontAwesomeIcon icon={faInfoCircle} /></div>
                                            </div>                                            
                                            <div className="editstage-inputbox">
                                                <input className="form-control" min="0" type="number" value="0" />
                                            </div>
                                        </div>                                        
                                    </div>
                                </div>
                                <div className="editstage-delete">
                                    <div className="editstage-deleteinn">
                                        <button className="editstage-deletebtn"><FontAwesomeIcon icon={faTrash} /> <span>Delete Stage</span></button>
                                    </div>
                                </div>
                            </div>                            
                                                        
                        </div>
                    </div>




                    <div className="editstage-col editstage-newcol">
                        <div className="addnewstagbox">
                            <div className="addnewstag-innbox">
                                <div className="addnewstagbox-text">
                                    <h3>Add new stage</h3>
                                    <p>Pipeline stages represent the steps in your sales process</p>
                                </div>
                                <button className="addnewstag-btn"><i className="rs-icon rs-icon-plus"></i><span>New stage</span></button>
                            </div>
                        </div>
                    </div>


                </div>


                {/* <div className="pdlist-row">
                    <div className="pdlisttable-scroll">
                        <table className="pdlist-table">
                            <thead>
                                <tr>
                                    <th className="pdlist-table-selectall">
                                        <div  className="pdlisttable-select pdlisttable-select-all">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
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
                                    <th className="pdlist-table-owner">
                                        <div className="pdlisttable-owner">Owner</div>
                                    </th>
                                    <th className="pdlist-table-cogs">
                                        <div className="pdlisttable-cogs"><i className="rs-icon rs-icon-cogs"></i></div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Chat with Julia Ade</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Julia Ade</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Witness Tatenda</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Witness Tatenda</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Fungai Munyaradzi</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Fungai Munyaradzi</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Brian Muchecheti</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Brian Muchecheti</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Mufaro Maggie Mudzingwa</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Mufaro Maggie Mudzingwa</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Chat with Julia Ade</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Julia Ade</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Witness Tatenda</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Witness Tatenda</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Fungai Munyaradzi</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Fungai Munyaradzi</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Brian Muchecheti</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Brian Muchecheti</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Mufaro Maggie Mudzingwa</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Mufaro Maggie Mudzingwa</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Chat with Julia Ade</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Julia Ade</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Witness Tatenda</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Witness Tatenda</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Fungai Munyaradzi</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Fungai Munyaradzi</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Brian Muchecheti</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Brian Muchecheti</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Mufaro Maggie Mudzingwa</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Mufaro Maggie Mudzingwa</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Chat with Julia Ade</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Julia Ade</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Witness Tatenda</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Witness Tatenda</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Fungai Munyaradzi</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Fungai Munyaradzi</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Brian Muchecheti</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Brian Muchecheti</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Mufaro Maggie Mudzingwa</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Mufaro Maggie Mudzingwa</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Chat with Julia Ade</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Julia Ade</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Witness Tatenda</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Witness Tatenda</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Fungai Munyaradzi</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Fungai Munyaradzi</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Brian Muchecheti</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Brian Muchecheti</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Mufaro Maggie Mudzingwa</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Mufaro Maggie Mudzingwa</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Chat with Julia Ade</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Julia Ade</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Witness Tatenda</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Witness Tatenda</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Fungai Munyaradzi</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Fungai Munyaradzi</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Brian Muchecheti</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Brian Muchecheti</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="pdlist-table-selectall">
                                        <div className="pdlisttable-select">
                                            <input type="checkbox" name="check_FenF2XEA" value="" />                                        
                                        </div>
                                    </td>
                                    <td className="pdlist-table-title">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tbltitle-data"><a href="#">Mufaro Maggie Mudzingwa</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-value">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblvalue-data">£0</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-org">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblorg-data"><a href="">Esteem care</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-contact">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblcontact-data"><a href="">Mufaro Maggie Mudzingwa</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-closedate">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblclosedate-data"></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-actdate">
                                        <div className="pdlisttable-item">
                                            <div className="tblactdate-data">22 Aug 2023</div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-owner">
                                        <div className="pdlisttable-item">
                                            <div className="tbl-editicon">
                                                <a href="#"><i className="rs-icon rs-icon-edit2"></i></a>
                                            </div>
                                            <div className="tblowner-data"><a href="">Sayani Sainudeen</a></div>
                                        </div>
                                    </td>
                                    <td className="pdlist-table-cogs">
                                        <div className="pdlisttable-item">
                                        
                                        </div>
                                    </td>
                                </tr>

                            </tbody>
                        </table>`

                    </div>
                </div> */}

            </div>
        </div>
    );
}

