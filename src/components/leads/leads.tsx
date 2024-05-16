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
            </div>
        </div>
    );
}

