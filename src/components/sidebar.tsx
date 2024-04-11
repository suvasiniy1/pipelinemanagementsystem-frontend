import { faBullhorn, faClipboardCheck, faDollarSign, faEnvelope, faLocationCrosshairs, faUserGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Content, Dropdown, Nav, Sidenav } from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import jpg from "../../src/resources/images/logo.jpg";
import svg from "../../src/resources/images/y1.svg";
import LocalStorageUtil from '../others/LocalStorageUtil';
import { AppRouter } from '../others/appRouter';
import Constants from '../others/constants';
import { HeaderComponent } from './header/header';
import HandleIdleTime from '../common/handleIdleTime';

export const SideBar = () => {
    const [expanded, setExpanded] = useState(false);
    const [selectedNavItem, setSelectedNavItem]=useState("Deals");
    const navigate = useNavigate();

    const onExpandCollapseClick = (event: any) => {
        
        var e = document.getElementById("sideNav") as HTMLDivElement;
        if (e && e.classList.contains("sidenavCollapse")) {
            e.classList.remove("sidenavCollapse");
            e.classList.add("sidenavExpand");
            LocalStorageUtil.setItem(Constants.SIDEBAR_CLASS, "sidenavExpand");
        }

        else {
            e.classList.add("sidenavCollapse");
            e.classList.remove("sidenavExpand");
            LocalStorageUtil.setItem(Constants.SIDEBAR_CLASS, "sidenavCollapse");
        }

    }


    const Drawer = () => {
        return (
            <>
            <HandleIdleTime/>
            <Container className='mainlayout' style={{ display: 'flex', flexDirection: 'row'}}>
                <Sidenav id="sideNav" className='sidenav sidenavCollapse'
                    expanded={expanded}
                >
                    <Sidenav.Header className='sidenavhead'>
                        {<img className='sideopenlogo' src={jpg} />}
                        {<img className='sidehidelogo' src={svg} />}
                    </Sidenav.Header>
                    <Sidenav.Body>
                        <Nav className='sidemenu'>
                            {/* <Nav.Item className='tnavicon' eventKey="1" icon={<img src={jpg} />} onSelect={(e) => navigate("/pipeline")}>
                                
                            </Nav.Item> */}
                            <Nav.Item eventKey="2" active={selectedNavItem==="Leads"} icon={<div className='nacicon'><FontAwesomeIcon icon={faLocationCrosshairs} /></div>} onSelect={(e) => {navigate("/leads"); setSelectedNavItem("Leads")}}>
                                <span className='nav-text'>Leads</span>
                            </Nav.Item>
                            <Nav.Item eventKey="3" active={selectedNavItem==="Deals"} icon={<div className='nacicon'><FontAwesomeIcon icon={faDollarSign} /></div>} onSelect={(e) => {navigate("/pipeline"); setSelectedNavItem("Deals")}}>
                                <span className='nav-text'>Deals</span>
                            </Nav.Item>
                            <Nav.Item eventKey="4" active={selectedNavItem==="Projects"} icon={<div className='nacicon'><FontAwesomeIcon icon={faClipboardCheck} /></div>} onSelect={(e) => {navigate("/projects"); setSelectedNavItem("Projects")}}>
                                <span className='nav-text'>Projects</span>
                            </Nav.Item>
                            <Nav.Item eventKey="5" icon={<div className='nacicon'><FontAwesomeIcon icon={faBullhorn} /></div>}>
                                <span className='nav-text'>Campaigns</span>
                            </Nav.Item>
                            <Nav.Item eventKey="6" icon={<div className='nacicon'><FontAwesomeIcon icon={faEnvelope} /></div>}>
                                <span className='nav-text'>Sales Inbox</span>
                            </Nav.Item>
                            {/* <Nav.Item eventKey="7" icon={<div className='nacicon'><FontAwesomeIcon icon={faCalendar} /></div>}>
                                <span className='nav-text'>Activities</span>
                            </Nav.Item>
                            <Nav.Item eventKey="8" icon={<div className='nacicon'><FontAwesomeIcon icon={faAddressCard} /></div>}>
                                <span className='nav-text'>Contacts</span>
                            </Nav.Item>
                            <Nav.Item eventKey="9" icon={<div className='nacicon'><FontAwesomeIcon icon={faChartLine} /></div>}>
                                <span className='nav-text'>Insights</span>
                            </Nav.Item>
                            <Nav.Item eventKey="10" icon={<div className='nacicon'><FontAwesomeIcon icon={faBox} /></div>}>
                                <span className='nav-text'>Products</span>
                            </Nav.Item> */}
                            {/* <Nav.Item eventKey="11" icon={<div className='nacicon'><FontAwesomeIcon icon={faStore} /></div>}>
                                <span className='nav-text'>Marketplace</span>
                            </Nav.Item>
                            <Nav.Item eventKey="11" icon={<div className='nacicon'><FontAwesomeIcon icon={faRobot} /></div>}>
                                <span className='nav-text'>Automations</span>
                            </Nav.Item>
                            <Nav.Item eventKey="11" icon={<div className='nacicon'><FontAwesomeIcon icon={faFileContract} /></div>}>
                                <span className='nav-text'>Documents</span>
                            </Nav.Item>
                            <Nav.Item eventKey="11" icon={<div className='nacicon'><FontAwesomeIcon icon={faDownload} /></div>}>
                                <span className='nav-text'>Import data</span>
                            </Nav.Item> */}
                            <Dropdown activeKey="1" title=" Admin" icon={<div className='nacicon pr-3'><FontAwesomeIcon icon={faUserGear} /></div>}>
                                <Dropdown.Item eventKey="1-1">
                                <span className='nav-text'>User</span>
                                </Dropdown.Item>
                            </Dropdown>
                        </Nav>
                    </Sidenav.Body>
                </Sidenav>

                <Container className='maincontent'>
                    <HeaderComponent onExpandCollapseClick={(e:any)=>onExpandCollapseClick(e)}/>
                    <Content className='maincontentinner'>
                    <AppRouter />
                    </Content>
                </Container>
            </Container>
            </>
        );
    };

    return <Drawer />;
}

const headerStyles = {
    padding: 18,
    fontSize: 16,
    height: 56,
    background: '#34c3ff',
    color: ' #fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
};
