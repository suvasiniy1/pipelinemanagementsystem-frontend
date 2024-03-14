import React from "react";
import "./header.css";
import { LetterAvatar } from "../other/avatar";
import { SearchBar } from "./searchBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCircleUser, faEnvelope, faBell, faGear} from '@fortawesome/free-solid-svg-icons';
import Dropdown from 'react-bootstrap/Dropdown';


export const HeaderComponent = () => {
    return (
        <header id="header" className="header pt-2 pb-2">
            <div className="container-fluid">
                <div className="headerrow align-items-center">
                    <div className="header-col colheadname">
                        <div className="colheadname-row">
                            <button className="sidemenuicon"><FontAwesomeIcon icon={faBars} /></button>
                            <h1 className="headname">Deals</h1>
                        </div>
                    </div>
                    <div className="header-col colheadsearch">
                        <SearchBar />
                    </div>
                    <div className="header-col colheadprofile">                        
                        <div className="colheadprofilerow">
                            <div className="headicon headbtngear">
                                <button><FontAwesomeIcon icon={faGear} /></button>
                            </div>
                            <div className="headicon headbtnbell">
                                <button><FontAwesomeIcon icon={faBell} /></button>
                            </div>
                            <div className="headicon headbtnenvelope">
                                <button><FontAwesomeIcon icon={faEnvelope} /></button>
                            </div>
                            <LetterAvatar />
                            <Dropdown className="headerprofile">
                                <Dropdown.Toggle className="profiledroupdown" variant="" id="dropdown-profile">
                                    <span className="profiledroupdown-row">
                                        <span className="profileicon"><FontAwesomeIcon icon={faCircleUser} /></span>
                                        <strong className="profilename">
                                            Y1 Capital
                                            <span>info@gmail.com</span>
                                        </strong>
                                    </span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="#/action-1">Profile</Dropdown.Item>
                                    <Dropdown.Item href="#/action-1">My Project</Dropdown.Item>
                                    <Dropdown.Item href="#/action-1">Message</Dropdown.Item>
                                    <Dropdown.Item href="#/action-1">Notification</Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">Settings</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

