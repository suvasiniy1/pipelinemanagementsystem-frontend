import React, { useState } from 'react';
import { Sidenav, Nav, Icon, Container, Header, Content } from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import { AppRouter } from '../others/appRouter';
import { useNavigate } from 'react-router-dom';
import { HeaderComponent } from './header/header';

export const SideBar = () => {
    const [activeKey, setActiveKey] = useState('1');
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    const handleSelect = (eventKey: any) => {
        setActiveKey(eventKey);
    };

    const handleToggle = () => {
        setExpanded(!expanded);
    };

    const Drawer = () => {
        return (
            <Container style={{ display: 'flex', flexDirection: 'row' }}>
                <Sidenav
                    expanded={expanded}
                    // onMouseEnter={handleToggle}
                    // onMouseLeave={handleToggle}
                    style={{ width: expanded ? 250 : 56 }}
                >
                    <Sidenav.Header>
                        <i className="fa-solid fa-chevron-right"></i>
                    </Sidenav.Header>
                    <Sidenav.Body>
                        <Nav>
                            <Nav.Item eventKey="1" icon={<Icon icon="dashboard" />} onSelect={(e) => navigate("/dashboard")}>
                                Pipeline
                            </Nav.Item>
                            <Nav.Item eventKey="2" icon={<Icon icon="calendar" />}>
                                Leads
                            </Nav.Item>
                            <Nav.Item eventKey="3" icon={<Icon icon="explore" />}>
                                Deals
                            </Nav.Item>
                            <Nav.Item eventKey="4" icon={<Icon icon="user" />}>
                                Projects
                            </Nav.Item>
                            <Nav.Item eventKey="5" icon={<Icon icon="calendar-o" />}>
                                Campaigns
                            </Nav.Item>
                            <Nav.Item eventKey="6" icon={<Icon icon="briefcase" />}>
                                Sales Inbox
                            </Nav.Item>
                            <Nav.Item eventKey="7" icon={<Icon icon="info" />}>
                                Activi
                            </Nav.Item>
                        </Nav>
                    </Sidenav.Body>
                </Sidenav>

                <Container>
                    <Header>
                    <HeaderComponent />
                    <br/>
                    </Header>
                    <Content>
                        <AppRouter />
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
