import { faAddressCard, faBox, faBullhorn, faCalendar, faChartLine, faClipboardCheck, faDollarSign, faDownload, faEnvelope, faFileContract, faLocationCrosshairs, faRobot, faStore } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Content, Dropdown, Nav, Sidenav } from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import jpg from "../../src/resources/images/logo.jpg";
import {AppRouter} from '../others/appRouter';
import { HeaderComponent } from './header/header';

export const SideBar = () => {
    const [activeKey, setActiveKey] = useState();
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    const getRoutes = useMemo(() => {
        return (
            <AppRouter />
        )
    }, [activeKey])

    const Drawer = () => {
        return (
            <Container className='mainlayout' style={{ display: 'flex', flexDirection: 'row'}}>
                <Sidenav className='sidenav'
                    expanded={expanded}
                    // onMouseEnter={handleToggle}
                    // onMouseLeave={handleToggle}
                    style={{ width: expanded ? 65 : 210 }}
                >
                    <Sidenav.Header className='sidenavhead'>
                        {<img src={jpg} />}
                    </Sidenav.Header>
                    <Sidenav.Body>
                        <Nav className='sidemenu'>
                            {/* <Nav.Item className='tnavicon' eventKey="1" icon={<img src={jpg} />} onSelect={(e) => navigate("/pipeline")}>
                                
                            </Nav.Item> */}
                            <Nav.Item eventKey="2" icon={<div className='nacicon'><FontAwesomeIcon icon={faLocationCrosshairs} /></div>} onSelect={(e) => navigate("/leads")}>
                                <span className='nav-text'>Leads</span>
                            </Nav.Item>
                            <Nav.Item eventKey="3" active={true} icon={<div className='nacicon'><FontAwesomeIcon icon={faDollarSign} /></div>} onSelect={(e) => navigate("/pipeline")}>
                                <span className='nav-text'>Deals</span>
                            </Nav.Item>
                            <Nav.Item eventKey="4" icon={<div className='nacicon'><FontAwesomeIcon icon={faClipboardCheck} /></div>} onSelect={(e) => navigate("/projects")}>
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
                            <Dropdown activeKey="1" title="Admin">
                                <Dropdown.Item eventKey="1-1">
                                    Users
                                </Dropdown.Item>
                            </Dropdown>
                        </Nav>
                    </Sidenav.Body>
                </Sidenav>

                <Container className='maincontent'>
                    <HeaderComponent onExpandCollapseClick={(e:any)=>setExpanded(!expanded)}/>
                    <Content className='maincontentinner'>
                            {getRoutes}
                    </Content>
                </Container>
            </Container>
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
